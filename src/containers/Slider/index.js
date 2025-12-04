import { useEffect, useMemo, useState, useId } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const id = useId(); 

  // 🔥 On déplace la 1ère image en 3ème position
  const slides = useMemo(() => {
    const arr = [...(data?.focus ?? [])];
    if (arr.length >= 3) {
      const first = arr.shift(); // retire la première
      arr.splice(2, 0, first);   // l’insère en 3ème position
    }
    return arr;
  }, [data?.focus]);

  // Auto-slide toutes les 5 secondes
  useEffect(() => {
    if (!slides.length) return () => {};

    const interval = setInterval(() => {
      setIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Ajuste l'index si la longueur change
  useEffect(() => {
    if (index > slides.length - 1) {
      setIndex(Math.max(0, slides.length - 1));
    }
  }, [slides.length, index]);

  if (!slides.length) return null;

  return (
    <div className="SlideCardList">
      {slides.map((event, idx) => (
        <div
          key={event.id ?? event.title ?? idx}
          className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}
        >
          {event.cover && <img src={event.cover} alt={event.title || "cover"} />}
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              {event.date && <div>{getMonth(new Date(event.date))}</div>}
            </div>
          </div>
        </div>
      ))}

      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination" role="tablist" aria-label="Slider pagination">
          {slides.map((ev, radioIdx) => {
            const radioName = `slider-radio-${id}`;
            return (
              <input
                key={ev.id ?? radioIdx}
                type="radio"
                name={radioName}
                value={radioIdx}
                checked={index === radioIdx}
                onChange={() => setIndex(radioIdx)}
                aria-label={`Aller à la diapositive ${radioIdx + 1}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Slider;
