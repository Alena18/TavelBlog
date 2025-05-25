// TravelLogDetail.jsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import useTravelLogs from "../hooks/useTravelLogs";
import "../App.css";
import { formatDateDMY } from "../hooks/formatDate";

const TravelLogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { log, setLog, handleChange, saveLog, deleteLog, fetchLogs } =
    useTravelLogs(id); // pass id to load specific log

  useEffect(() => {
    fetchLogs(); // load all logs and extract one by id
  }, [id]);

  if (!log) return <p>Loading log...</p>; // fallback

  return (
    <div className="dashboard">
      <h2>Edit Travel Log</h2>

      <form className="add-form" onSubmit={(e) => e.preventDefault()}>
        {/* Title */}
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

        {/* Description */}
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

        {/* Dates */}
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

        {/* Tags */}
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

        {/* Buttons */}
        <div
          className="button-group"
          style={{
            gridColumn: "1 / -1",
            justifySelf: "center",
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={() => saveLog(id, () => navigate("/travel-log"))}
            className="btn-save"
            type="submit"
          >
            <FaCheck />
          </button>
          <button
            onClick={() => navigate("/travel-log")}
            className="btn-cancel"
            type="button"
          >
            <FaTimes />
          </button>
          <button
            onClick={() => deleteLog(id, () => navigate("/travel-log"))}
            className="btn-delete"
            type="button"
          >
            <FaTrash />
          </button>
        </div>
      </form>
    </div>
  );
};

export default TravelLogDetail;
