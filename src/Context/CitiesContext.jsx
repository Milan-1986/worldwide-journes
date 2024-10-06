import { createContext, useContext } from "react";
import { useEffect, useState } from "react";

const BASE_URL = "http://localhost:8000"; // add this to readme file

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [currentCity, setCurrentCity] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(function () {
    const fetchedCitiesData = async function () {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const citeisData = await res.json();
        setCities(citeisData);
      } catch (err) {
        alert("Something went wrong with fatching the data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchedCitiesData();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const citiesData = await res.json();
      setCurrentCity(citiesData);
    } catch (err) {
      alert("Something went wrong with fatching the data from getCity()");
    } finally {
      setIsLoading(false);
    }
  }
  async function createCity(newCity) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setCities((cities) => [...cities, data]);
      console.log(data);
    } catch (err) {
      alert("Something went wrong with creating the city data");
    } finally {
      setIsLoading(false);
    }
  }
  async function deleteCity(id) {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      setCities((cities) => cities.filter((city) => city.id !== id));
    } catch (err) {
      alert("Something went wrong with deleting the city");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("You used context outside of the Provider");
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { CitiesProvider, useCities };
