import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import { useMap, useMapEvents } from "react-leaflet/hooks";
import { useEffect, useState } from "react";
import { useCities } from "../Context/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

function Map() {
  // const [currentState,setCurrentState ] = useSearchParams()
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 25]);
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();

  const [lat, lng] = useUrlPosition();

  useEffect(
    function () {
      if (lat && lng) setMapPosition([lat, lng]);
    },
    [lat, lng]
  );

  useEffect(
    function () {
      if (geolocationPosition)
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    },
    [geolocationPosition]
  );

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "USe your position."}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={5}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities?.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.notes}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCentarMapComponent position={mapPosition} />
        <MapHandleClick />
      </MapContainer>
    </div>
  );
}

function ChangeCentarMapComponent({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function MapHandleClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
