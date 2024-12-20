import { createContext, useCallback, useContext, useReducer } from "react";
import { useEffect } from "react";

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
        const res = JSON.parse(localStorage.getItem("cities"))
          ? JSON.parse(localStorage.getItem("cities"))
          : [];
        const citeisData = await res;
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
    function getCity(id) {
      if (currentCity.id === id) return;

      dispatch({
        type: "loading",
      });
      try {
        const citiesData = cities.filter((city) => city.id === id);
        dispatch({
          type: "city/loaded",
          payload: citiesData[0],
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
    [currentCity.id, cities]
  );
  async function createCity(newCity) {
    dispatch({
      type: "loading",
    });
    try {
      dispatch({
        type: "city/created",
        payload: newCity,
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
  useEffect(
    function () {
      localStorage.setItem("cities", JSON.stringify(cities));
    },
    [cities]
  );
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
