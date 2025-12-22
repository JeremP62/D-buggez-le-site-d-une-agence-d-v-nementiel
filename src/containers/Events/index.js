// src/containers/Events/index.js
import React, { useMemo, useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";
import { parseDate, getMonth } from "../../helpers/Date";

import "./style.css";

const EventList = () => {
  const { data, error } = useData();
  const [selectedType, setSelectedType] = useState(null);

  // Supprime les doublons par image et regroupe types/titres
  const uniqueEvents = useMemo(() => {
    if (!data?.events) return [];

    const map = new Map();

    data.events.forEach(ev => {
      const key = ev.cover; // clé unique uniquement sur l'image
      const dateObj = parseDate(ev.date);

      if (!map.has(key)) {
        map.set(key, {
          ...ev,
          types: [ev.type],
          titles: [ev.title],
          date: dateObj || ev.date,
          periode: dateObj
            ? `${dateObj.getDate()} ${getMonth(dateObj)} ${dateObj.getFullYear()}`
            : ev.date
        });
      } else {
        const existing = map.get(key);
        if (!existing.types.includes(ev.type)) existing.types.push(ev.type);
        if (!existing.titles.includes(ev.title)) existing.titles.push(ev.title);
      }
    });

    return Array.from(map.values());
  }, [data?.events]);

  // Liste unique de toutes les catégories
  const typeList = useMemo(() =>
    Array.from(new Set(uniqueEvents.flatMap(ev => ev.types)))
  , [uniqueEvents]);

  // Filtrage par type
  const eventsByType = useMemo(() => {
    // Si rien n'est sélectionné (ou "Toutes"), on retourne tout
    if (!selectedType) return uniqueEvents;

    return uniqueEvents.filter((ev) =>
      // On utilise .some() car ev.types est un tableau
      // On force les deux côtés en minuscule pour ignorer la casse
      ev.types.some(
        (type) => type.toLowerCase() === selectedType.toLowerCase()
      )
    );
  }, [uniqueEvents, selectedType]);

  if (error) return <div>An error occurred</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      {/* Filtre centré avec titre au-dessus */}
      <div className="FilterWrapper">
        <h3 className="SelectTitle">Catégories</h3>
        <Select
          selection={typeList}
          value={selectedType}
          onChange={value => setSelectedType(value || null)}
        />
      </div>

      {/* Grille des événements */}
      <div id="events" className="ListContainer">
        {eventsByType.map(ev => (
          <Modal key={ev.cover} Content={<ModalEvent event={ev} />}>
            {({ setIsOpened }) => (
              <div style={{ width: "100%" }}>
                <EventCard
                  onClick={() => setIsOpened(true)}
                  imageSrc={ev.cover}
                  title={ev.titles.join(" / ")} // concatène tous les titres associés
                  date={ev.date}
                  label={ev.types.join(", ")}   // concatène tous les types associés
                  prestations={ev.prestations}
                />
              </div>
            )}
          </Modal>
        ))}
      </div>
    </div>
  );
};

export default EventList;
