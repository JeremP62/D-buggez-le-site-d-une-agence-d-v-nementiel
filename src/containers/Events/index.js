import { useMemo, useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";
import { parseDate, getMonth } from "../../helpers/Date";

import "./style.css";

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState(null);

  const events = useMemo(() => {
    const arr = [...(data?.events ?? [])].map(ev => {
      const dateObj = parseDate(ev.date);
      if (!dateObj) return ev;

      const day = dateObj.getDate();
      const month = getMonth(dateObj);
      const year = dateObj.getFullYear();

      return {
        ...ev,
        date: dateObj,                     // pour EventCard
        periode: `${day} ${month} ${year}` // pour ModalEvent
      };
    });

    if (arr.length >= 2) [arr[0], arr[1]] = [arr[1], arr[0]];
    return arr;
  }, [data?.events]);

  const typeList = useMemo(() => Array.from(new Set(events.map(ev => ev.type))), [events]);
  const eventsByType = useMemo(() => (type ? events.filter(ev => ev.type === type) : events), [events, type]);

  return (
    <>
      {error && <div>An error occurred</div>}

      {data == null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={typeList}
            value={type}
            onChange={(value) => setType(value || null)}
          />

          <div id="events" className="ListContainer">
            {eventsByType.map((ev) => (
              <Modal key={ev.id} Content={<ModalEvent event={ev} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={ev.cover}
                    title={ev.title}
                    date={ev.date}   // objet Date normalisé
                    label={ev.type}
                    prestations={ev.prestations}
                  />
                )}
              </Modal>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;

