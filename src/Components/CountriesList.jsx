import CountryItem from "./CountryItem";
import styles from "./CountriesList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../Context/CitiesContext";

function CountriesList() {
  const { cities, isLOading } = useCities();

  if (isLOading) return <Spinner />;

  if (!cities?.length)
    return (
      <Message message="Add your first city by clicking on the city on the map" />
    );
  const countries = cities.reduce((acc, city) => {
    if (!acc.map((el) => el.country).includes(city.country))
      return [...acc, { country: city.country, emoji: city.emoji }];
    else return acc;
  }, []);

  return (
    <ul className={styles.countriesList}>
      {countries?.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountriesList;
