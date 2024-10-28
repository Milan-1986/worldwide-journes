import { createContext, useCallback, useContext, useReducer } from "react";
import { useEffect } from "react";

const BASE_URL = "http://localhost:8000"; // add this to readme file

const CitiesContext = createContext();

const initialState = {
  cities: [],
  currentCity: {},
  isLoading: false,
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      throw new Error("Unknown action type.");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, currentCity, isLoading, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    const fetchedCitiesData = async function () {
      dispatch({
        type: "loading",
      });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const citeisData = await res.json();
        dispatch({ type: "cities/loaded", payload: citeisData });
      } catch {
        dispatch({
          type: "rejected",
          payload: alert("Something went wrong with fatching the data"),
        });
      }
    };
    fetchedCitiesData();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (currentCity.id === id) return;

      dispatch({
        type: "loading",
      });
      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const citiesData = await res.json();
        dispatch({
          type: "city/loaded",
          payload: citiesData,
        });
      } catch {
        dispatch({
          type: "rejected",
          payload: alert(
            "Something went wrong with fatching the data from getCity()"
          ),
        });
      }
    },
    [currentCity.id]
  );
  async function createCity(newCity) {
    dispatch({
      type: "loading",
    });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({
        type: "city/created",
        payload: data,
      });
    } catch {
      dispatch({
        type: "rejected",
        payload: alert("Something went wrong with creating the city data"),
      });
    }
  }
  async function deleteCity(id) {
    dispatch({
      type: "loading",
    });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({
        type: "city/deleted",
        payload: id,
      });
    } catch {
      dispatch({
        type: "rejected",
        payload: alert("Something went wrong with deleting the city"),
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
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
