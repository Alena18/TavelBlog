import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { usePlaces } from "../hooks-firebase/usePlaces";
import flagImage from "../assets/images/flag.png";
import bgImage from "../assets/images/img.png";
import { FiSearch, FiEdit3 } from "react-icons/fi";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import "../App.css";

const flagIcon = L.icon({
  iconUrl: flagImage,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const createIcon = () => {
  return flagIcon;
};

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

function PlacesMapPage() {
  const { places, addPlace, updatePlace, deletePlace, searchPlaces } =
    usePlaces();
  const [newMarker, setNewMarker] = useState(null);
  const [newPlace, setNewPlace] = useState({
    journeyname: "",
    placename: "",
    description: "",
    review: "visited",
  });
  const [search, setSearch] = useState("");

  const handleMapClick = (latlng) => {
    setNewMarker(latlng);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlace((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPlace = async (e) => {
    e.preventDefault();
    const data = {
      ...newPlace,
      latitude: newMarker.lat,
      longitude: newMarker.lng,
    };
    await addPlace(data);
    setNewMarker(null);
    setNewPlace({
      journeyname: "",
      placename: "",
      description: "",
      review: "visited",
    });
  };

  return (
    <div className="map-page-wrapper" style={{ position: "relative" }}>
      <div
        className="map-background"
        style={{
          backgroundImage: `url("${bgImage}")`,
        }}
      ></div>

      <div
        className="map-page"
        style={{ display: "flex", justifyContent: "center", padding: "20px" }}
      >
        <div className="map-container">
          <div className="inner-content">
            <div
              className="controls"
              style={{ margin: "10px", padding: "10px" }}
            >
              <input
                type="text"
                placeholder="Search places"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  searchPlaces(e.target.value);
                }}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>

            <MapContainer
              center={[48.8566, 2.3522]}
              zoom={4}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapClickHandler onMapClick={handleMapClick} />

              {places.map((place) => (
                <Marker
                  key={place.id}
                  position={[place.latitude, place.longitude]}
                  icon={createIcon(place.review)}
                >
                  <Popup>
                    <h3>{place.placename}</h3>
                    <h3>{place.journeyname}</h3>
                    <p>
                      <strong>Description:</strong> {place.description}
                    </p>
                    <p
                      style={{ cursor: "pointer", fontSize: "24px" }}
                      onClick={() => {
                        const next =
                          place.review === "visited"
                            ? "ok"
                            : place.review === "ok"
                            ? "loved"
                            : "visited";
                        updatePlace(place.id, { ...place, review: next });
                      }}
                    >
                      {place.review === "loved"
                        ? "❤️"
                        : place.review === "ok"
                        ? "⭐"
                        : "☂️"}
                    </p>
                    <button onClick={() => deletePlace(place.id)}>🗑</button>{" "}
                    <button
                      onClick={() =>
                        updatePlace(place.id, { ...place, review: "loved" })
                      }
                    >
                      ❤️
                    </button>{" "}
                    <button
                      onClick={() =>
                        updatePlace(place.id, { ...place, review: "ok" })
                      }
                    >
                      ⭐
                    </button>{" "}
                    <button
                      onClick={() =>
                        updatePlace(place.id, { ...place, review: "visited" })
                      }
                    >
                      {" "}
                      ☂️
                    </button>
                  </Popup>
                </Marker>
              ))}

              {newMarker && (
                <Marker position={newMarker} icon={flagIcon}>
                  <Popup>
                    <div className="popup-marker-overlay">
                      <form
                        className="popup-marker-form"
                        onSubmit={handleAddPlace}
                      >
                        <input
                          type="text"
                          name="name" // this enables native autocomplete
                          placeholder="Name of the Journey"
                          autoComplete="on"
                          value={newPlace.journeyname} // still bind to journeyname
                          onChange={(e) =>
                            setNewPlace((prev) => ({
                              ...prev,
                              journeyname: e.target.value, // update journeyname manually
                            }))
                          }
                          required
                        />

                        <input
                          type="text"
                          name="placename"
                          placeholder="Name"
                          value={newPlace.placename}
                          onChange={handleInputChange}
                          required
                        />
                        <input
                          type="text"
                          name="description"
                          placeholder="Description"
                          value={newPlace.description}
                          onChange={handleInputChange}
                          required
                        />
                        <select
                          name="review"
                          value={newPlace.review}
                          onChange={handleInputChange}
                        >
                          <option value="visited">☂️</option>
                          <option value="ok">⭐</option>
                          <option value="loved">❤️</option>
                        </select>
                        <div className="inline-buttons">
                          <button className="btn-save" type="submit">
                            <FaCheck />
                          </button>
                          <button
                            className="btn-cancel"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation(); // stop it from triggering map click
                              setNewMarker(null);
                            }}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </form>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlacesMapPage;
