export const MONTHS = {
  1: "janvier",
  2: "février",
  3: "mars",
  4: "avril",
  5: "mai",
  6: "juin",
  7: "juillet",
  8: "août",
  9: "septembre",
  10: "octobre",
  11: "novembre",
  12: "décembre",
};

// Retourne le mois en français à partir d'un Date
export const getMonth = (value) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return MONTHS[value.getMonth() + 1];
  }
  return "";
};

// Convertit string ou Date en objet Date standard
export const parseDate = (value) => {
  if (!value) return null;

  // Format DD/MM/YYYY
  if (typeof value === "string" && value.includes("/") && value.split("/").length === 3) {
    const [day, month, year] = value.split("/").map(Number);
    return new Date(year, month - 1, day);
  }

  // Format ISO YYYY-MM-DD
  if (typeof value === "string") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, year, month, day] = match.map(Number);
      return new Date(year, month - 1, day);
    }
  }

  // Si c’est déjà un Date valide
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  return null;
};
