import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const response = await fetch("/events.json");
    return response.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

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

  // Memoize the context value so it doesn't change identity on every render
  const value = useMemo(() => ({ data, error }), [data, error]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataContext;
