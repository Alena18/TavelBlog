import React from "react";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";

export default function PlaceModal({
  editPlace,
  setEditPlace,
  handleEditSubmit,
  deletePlace,
  cancelEdit,
  journeyPlans,
}) {
  if (!editPlace) return null;

  const handleReviewToggle = () => {
    const next =
      editPlace.review === "visited"
        ? "ok"
        : editPlace.review === "ok"
        ? "loved"
        : "visited";
    setEditPlace((prev) => ({ ...prev, review: next }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form
          onSubmit={(e) => handleEditSubmit(e)}
          className="popup-marker-form"
        >
          <input
            type="text"
            value={editPlace.placename}
            onChange={(e) =>
              setEditPlace((prev) => ({ ...prev, placename: e.target.value }))
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
            list="journey-options"
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
          <datalist id="journey-options">
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
            onClick={handleReviewToggle}
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
            <button type="button" className="btn-cancel" onClick={cancelEdit}>
              <FaTimes />
            </button>
            <button
              type="button"
              className="btn-delete"
              onClick={() => deletePlace(editPlace.id)}
            >
              <FaTrash />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
