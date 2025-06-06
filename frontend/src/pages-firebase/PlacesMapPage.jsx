import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { usePlaces } from "../hooks-firebase/usePlaces";
import bgImage from "../assets/images/img.png";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";

import SearchBarMap from "./SearchBarMap";
import NewPlacePopup from "./NewPlacePopup";
import {
  ZoomWatcher,
  MapClickHandler,
  createIcon,
} from "../hooks-firebase/useMapHelpers";

// Handles flying to a place on search select
const FlyToSearchResult = ({ place }) => {
  const map = useMap();

  useEffect(() => {
    if (place) {
      map.flyTo([place.latitude, place.longitude], 13, { duration: 1.5 });
    }
  }, [place, map]);

  return null;
};

function PlacesMapPage() {
  const {
    places,
    deletePlace,
    newMarker,
    setNewMarker,
    newPlace,
    setNewPlace,
    handleAddPlace,
    resetNewPlace,
    editPlace,
    setEditPlace,
    handleEditSubmit,
    cancelEdit,
    journeyPlans,
  } = usePlaces();

  const [zoomLevel, setZoomLevel] = useState(4);
  const [search, setSearch] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);

  const mapRef = useRef();
  const popupRefs = useRef({});

  // Makes map available for debugging
  useEffect(() => {
    const checkMapReady = setInterval(() => {
      if (mapRef.current) {
        window._mapRef = mapRef.current;
        clearInterval(checkMapReady);
      }
    }, 100);
  }, []);

  const handleMapClick = (latlng) => setNewMarker(latlng);

  const handleFlyToPlace = (place) => {
    if (!place) return;
    setSelectedPlace(place);
  };

  return (
    <div className="map-page-wrapper" style={{ position: "relative" }}>
      <div
        className="map-background"
        style={{ backgroundImage: `url("${bgImage}")` }}
      ></div>

      {/* Search Bar */}
      <SearchBarMap
        search={search}
        setSearch={setSearch}
        places={places}
        onPlaceSelect={handleFlyToPlace}
      />

      <div
        className="map-page"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div className="map-container">
          <div className="inner-content">
            <MapContainer
              center={[48.8566, 2.3522]}
              zoom={4}
              style={{ width: "100%", height: "100%" }}
              whenCreated={(mapInstance) => {
                mapRef.current = mapInstance;
                window._mapRef = mapInstance;
              }}
            >
              <ZoomWatcher onZoomChange={setZoomLevel} />
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapClickHandler onMapClick={handleMapClick} />

              {/* Fly to selected place on search */}
              {selectedPlace && <FlyToSearchResult place={selectedPlace} />}

              {/* Existing Places */}
              {zoomLevel >= 7 &&
                places.map((place) => (
                  <Marker
                    key={place.id}
                    position={[place.latitude, place.longitude]}
                    icon={createIcon(place.placename)}
                  >
                    <Popup
                      eventHandlers={{
                        add: () => setEditPlace({ ...place }),
                      }}
                      ref={(ref) => {
                        // Wait until Leaflet attaches the popup to the source
                        setTimeout(() => {
                          if (ref && ref._source && ref._source._popup) {
                            popupRefs.current[place.id] = ref._source._popup;
                            console.log("Popup ref set for:", place.placename);
                          } else {
                            console.warn(
                              "Popup ref NOT set yet for:",
                              place.placename
                            );
                          }
                        }, 0);
                      }}
                    >
                      {editPlace?.id === place.id ? (
                        <form
                          onSubmit={(e) => handleEditSubmit(e, popupRefs)}
                          className="popup-marker-form"
                        >
                          <input
                            type="text"
                            value={editPlace.placename}
                            onChange={(e) =>
                              setEditPlace((prev) => ({
                                ...prev,
                                placename: e.target.value,
                              }))
                            }
                            required
                          />

                          <input
                            type="text"
                            value={editPlace.description}
                            onChange={(e) =>
                              setEditPlace((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            required
                          />

                          <input
                            list="edit-journey-options"
                            name="journeyname"
                            placeholder="Journey"
                            value={editPlace.journeyname}
                            onChange={(e) =>
                              setEditPlace((prev) => ({
                                ...prev,
                                journeyname: e.target.value,
                              }))
                            }
                            required
                          />
                          <datalist id="edit-journey-options">
                            {journeyPlans.map((plan, idx) => (
                              <option key={idx} value={plan} />
                            ))}
                          </datalist>

                          <p
                            style={{
                              fontSize: "24px",
                              cursor: "pointer",
                              textAlign: "center",
                            }}
                            onClick={() => {
                              const next =
                                editPlace.review === "visited"
                                  ? "ok"
                                  : editPlace.review === "ok"
                                  ? "loved"
                                  : "visited";
                              setEditPlace((prev) => ({
                                ...prev,
                                review: next,
                              }));
                            }}
                          >
                            {editPlace.review === "loved"
                              ? "❤️"
                              : editPlace.review === "ok"
                              ? "⭐"
                              : "📌"}
                          </p>

                          <div className="inline-buttons">
                            <button type="submit" className="btn-save">
                              <FaCheck />
                            </button>
                            <button
                              type="button"
                              className="btn-cancel"
                              onClick={cancelEdit}
                            >
                              <FaTimes />
                            </button>
                            <button
                              type="button"
                              className="btn-delete"
                              onClick={() => deletePlace(place.id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </form>
                      ) : null}
                    </Popup>
                  </Marker>
                ))}

              {/* New Marker */}
              <NewPlacePopup
                newMarker={newMarker}
                newPlace={newPlace}
                setNewPlace={setNewPlace}
                handleAddPlace={handleAddPlace}
                cancelAdd={resetNewPlace}
                journeyPlans={journeyPlans}
              />
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlacesMapPage;
