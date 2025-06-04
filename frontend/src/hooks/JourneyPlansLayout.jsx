import React, { useState } from "react";
import { FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import Select from "react-select";
import { formatDateDMY } from "./formatDate";
import "../App.css";

export default function JourneyPlansLayout({
  plans,
  newPlan,
  setNewPlan,
  editedPlan,
  setEditedPlan,
  handleNewChange,
  handleEditChange,
  addPlan,
  startEditing,
  saveEdit,
  deletePlan,
  activityOptions,
}) {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const openEditModal = (plan) => {
    startEditing(plan);
    setSelectedPlan(plan);
  };

  return (
    <div className="dashboard">
      <h2 className="home-title">Journey Plans Dashboard</h2>

      {/* Add New Plan Form */}
      <form className="add-form" onSubmit={addPlan}>
        <input
          name="name"
          placeholder="Name"
          value={newPlan.name}
          onChange={handleNewChange}
          required
        />
        <input
          name="locations"
          placeholder="Locations (comma separated)"
          value={newPlan.locations}
          onChange={handleNewChange}
          required
        />
        <input
          type="date"
          name="startDate"
          value={newPlan.startDate}
          onChange={handleNewChange}
          required
        />
        <input
          type="date"
          name="endDate"
          value={newPlan.endDate}
          onChange={handleNewChange}
          required
        />
        <Select
          options={activityOptions}
          isMulti
          placeholder="Select activities..."
          onChange={(selectedOptions) => {
            const values = selectedOptions.map((opt) => opt.value);
            setNewPlan((prev) => ({ ...prev, activities: values }));
          }}
          value={activityOptions.filter((opt) =>
            newPlan.activities.includes(opt.value)
          )}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newPlan.description}
          onChange={handleNewChange}
          required
        />
        <div
          className="button-group"
          style={{
            gridColumn: "1 / -1",
            justifySelf: "center",
            width: "200px",
          }}
        >
          <button type="submit">
            Add Plan <span className="button-palm">🏝️</span>
          </button>
        </div>
      </form>

      {/* Table Displaying Plans */}
      <table className="form-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Locations</th>
            <th>Start</th>
            <th>End</th>
            <th>Activities</th>
            <th>Description</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.id}>
              <td>{plan.name}</td>
              <td>
                {Array.isArray(plan.locations)
                  ? plan.locations.join(", ")
                  : plan.locations}
              </td>
              <td>{formatDateDMY(plan.startDate)}</td>
              <td>{formatDateDMY(plan.endDate)}</td>
              <td>
                {Array.isArray(plan.activities)
                  ? plan.activities.join(", ")
                  : plan.activities}
              </td>
              <td>{plan.description}</td>
              <td>
                <div className="action-buttons">
                  <button onClick={() => openEditModal(plan)}>
                    <FiEdit3 />
                  </button>
                  <button onClick={() => deletePlan(plan.id)}>
                    <FaTrash color="white" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {selectedPlan && (
        <div className="modal-overlay">
          <form className="add-form">
            <h3>Edit Journey Plan</h3>
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
                onClick={() => {
                  saveEdit(selectedPlan.id);
                  setSelectedPlan(null);
                }}
              >
                <FaCheck />
              </button>
              <button type="button" onClick={() => setSelectedPlan(null)}>
                <FaTimes />
              </button>
              <button
                type="button"
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
      )}
    </div>
  );
}
