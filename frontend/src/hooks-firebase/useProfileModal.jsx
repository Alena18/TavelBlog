import React from "react";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import Select from "react-select";
import activityOptions from "./activityOptions";

export const TravelLogModal = ({
  editLog,
  setEditLog,
  saveLog,
  deleteLog,
  setSelectedLog,
}) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <form className="popup-marker-form">
        {/* <h3>Edit Travel Log</h3> */}
        <input
          name="title"
          value={editLog?.title || ""}
          onChange={(e) => setEditLog({ ...editLog, title: e.target.value })}
        />
        <textarea
          name="description"
          value={editLog?.description || ""}
          onChange={(e) =>
            setEditLog({ ...editLog, description: e.target.value })
          }
        />
        <input
          type="date"
          name="startDate"
          value={editLog?.startDate || ""}
          onChange={(e) =>
            setEditLog({ ...editLog, startDate: e.target.value })
          }
        />
        <input
          type="date"
          name="endDate"
          value={editLog?.endDate || ""}
          onChange={(e) => setEditLog({ ...editLog, endDate: e.target.value })}
        />
        <input
          name="tags"
          value={editLog?.tags || ""}
          onChange={(e) => setEditLog({ ...editLog, tags: e.target.value })}
        />
        <div className="modal-actions">
          <button
            type="button"
            className="btn-save"
            onClick={() => {
              saveLog(editLog.id, () => {
                setEditLog(null);
                setSelectedLog(null);
              });
            }}
          >
            <FaCheck />
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => {
              setEditLog(null);
              setSelectedLog(null);
            }}
          >
            <FaTimes />
          </button>
          <button
            type="button"
            className="btn-delete"
            onClick={() => {
              deleteLog(editLog.id, () => {
                setEditLog(null);
                setSelectedLog(null);
              });
            }}
          >
            <FaTrash />
          </button>
        </div>
      </form>
    </div>
  </div>
);

export const JourneyPlanModal = ({
  editedPlan,
  setEditedPlan,
  handleEditChange,
  saveEdit,
  deletePlan,
  selectedPlan,
  setSelectedPlan,
}) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <form className="popup-marker-form">
        {/* <h3>Edit Journey Plan</h3> */}
        <input
          name="name"
          value={editedPlan.name || ""}
          onChange={handleEditChange}
        />
        <input
          name="locations"
          value={editedPlan.locations || ""}
          onChange={handleEditChange}
        />
        <input
          type="date"
          name="startDate"
          value={editedPlan.startDate || ""}
          onChange={handleEditChange}
        />
        <input
          type="date"
          name="endDate"
          value={editedPlan.endDate || ""}
          onChange={handleEditChange}
        />
        <Select
          options={activityOptions}
          isMulti
          onChange={(selectedOptions) => {
            const values = selectedOptions.map((opt) => opt.value);
            setEditedPlan((prev) => ({
              ...prev,
              activities: values,
            }));
          }}
          value={activityOptions.filter((opt) =>
            editedPlan.activities?.includes(opt.value)
          )}
        />
        <textarea
          name="description"
          value={editedPlan.description || ""}
          onChange={handleEditChange}
        />
        <div className="modal-actions">
          <button
            type="button"
            className="btn-save"
            onClick={() => {
              saveEdit(selectedPlan.id);
              setSelectedPlan(null);
            }}
          >
            <FaCheck />
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => setSelectedPlan(null)}
          >
            <FaTimes />
          </button>
          <button
            type="button"
            className="btn-delete"
            onClick={() => {
              deletePlan(selectedPlan.id);
              setSelectedPlan(null);
            }}
          >
            <FaTrash />
          </button>
        </div>
      </form>
    </div>
  </div>
);
