import React from "react";
import { Marker, Popup } from "react-leaflet";
import { FaCheck, FaTimes } from "react-icons/fa";
import L from "leaflet";
import flagImage from "../assets/images/flag.png";

// Icon used for new marker
const flagIcon = L.icon({
  iconUrl: flagImage,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

export default function NewPlacePopup({
  newMarker,
  newPlace,
  setNewPlace,
  handleAddPlace,
  cancelAdd,
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlace((prev) => ({ ...prev, [name]: value }));
  };

  if (!newMarker) return null;

  return (
    <Marker position={newMarker} icon={flagIcon}>
      <Popup>
        <form className="popup-marker-form" onSubmit={handleAddPlace}>
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
          <input
            name="name" // so browser search/auto-fill triggers
            placeholder="Journey"
            value={newPlace.journeyname}
            onChange={(e) =>
              setNewPlace((prev) => ({ ...prev, journeyname: e.target.value }))
            }
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
            <button type="submit" className="btn-save">
              <FaCheck />
            </button>
            <button type="button" className="btn-cancel" onClick={cancelAdd}>
              <FaTimes />
            </button>
          </div>
        </form>
      </Popup>
    </Marker>
  );
}
