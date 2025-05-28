import React from "react";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import "../App.css";

export default function TravelLogDetailLayout({
  log,
  handleChange,
  saveLog,
  deleteLog,
  goBack,
}) {
  if (!log) return <p>Loading log...</p>;

  return (
    <div className="dashboard">
      <h2>Edit Travel Log</h2>

      <form className="add-form" onSubmit={(e) => e.preventDefault()}>
        <div style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            value={log.title}
            onChange={handleChange}
            placeholder="Title"
            required
          />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={log.description}
            onChange={handleChange}
            placeholder="Description"
            required
          />
        </div>

        <div>
          <label htmlFor="startDate">Start Date</label>
          <input
            id="startDate"
            type="date"
            name="startDate"
            value={log.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="endDate">End Date</label>
          <input
            id="endDate"
            type="date"
            name="endDate"
            value={log.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            name="tags"
            value={log.tags}
            onChange={handleChange}
            placeholder="Tags (comma separated)"
          />
        </div>

        <div
          className="button-group"
          style={{
            gridColumn: "1 / -1",
            justifySelf: "center",
            display: "flex",
            gap: "10px",
          }}
        >
          <button onClick={saveLog} className="btn-save" type="submit">
            <FaCheck />
          </button>
          <button onClick={goBack} className="btn-cancel" type="button">
            <FaTimes />
          </button>
          <button onClick={deleteLog} className="btn-delete" type="button">
            <FaTrash />
          </button>
        </div>
      </form>
    </div>
  );
}
