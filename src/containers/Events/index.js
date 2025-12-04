import { useMemo, useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  // Clone des events et échange 1ère <-> 2ème (si présentes)
  const events = useMemo(() => {
    const arr = [...(data?.events ?? [])];
    if (arr.length >= 2) [arr[0], arr[1]] = [arr[1], arr[0]];
    return arr;
  }, [data?.events]);

  // Liste des types pour le Select
  const typeList = useMemo(() => Array.from(new Set((data?.events ?? []).map((ev) => ev.type))), [data?.events]);

  // Liste filtrée selon le type choisi
  const eventsByType = useMemo(
    () => (type ? events.filter((e) => e.type === type) : events),
    [events, type]
  );

  // Pagination
  const totalItems = eventsByType.length;
  const pageCount = Math.max(1, Math.ceil(totalItems / PER_PAGE));

  const pagedEvents = useMemo(
    () => eventsByType.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE),
    [eventsByType, currentPage]
  );

  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };

  return (
    <>
      {error && <div>An error occured</div>}

      {data == null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select selection={typeList} onChange={(value) => changeType(value || null)} />

          <div id="events" className="ListContainer">
            {pagedEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={event.date ? new Date(event.date) : null}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>

          <div className="Pagination">
            {Array.from({ length: pageCount }).map((_, i) => (
              <a
                key={`page-${i + 1}`}
                href="#events"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(i + 1);
                }}
                aria-current={currentPage === i + 1 ? "page" : undefined}
              >
                {i + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
