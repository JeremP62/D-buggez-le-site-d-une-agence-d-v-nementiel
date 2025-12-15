// src/contexts/DataContext/index.js
import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// Création du contexte
const DataContext = createContext({});

// API pour charger le JSON
export const api = {
  loadData: async () => {
    const response = await fetch("/events.json");
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des données");
    }
    return response.json();
  },
};

// Provider du contexte
export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les données
  const getData = useCallback(async () => {
    try {
      const json = await api.loadData();
      setData(json);
    } catch (err) {
      console.error("Erreur API :", err);
      setError(err);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  // Calcul du dernier événement
const value = useMemo(() => ({
  data,
  error,
  last: data?.events?.length
    ? data.events.reduce((latest, current) => {
        const latestTime = latest.date ? new Date(latest.date).getTime() : 0;
        const currentTime = current.date ? new Date(current.date).getTime() : 0;
        return currentTime > latestTime ? current : latest;
      }, data.events[0])
    : null
}), [data, error]);



  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook pour utiliser le contexte
export const useData = () => useContext(DataContext);

export default DataContext;
