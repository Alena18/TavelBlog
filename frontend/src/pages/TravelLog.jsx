import React from "react";
import { useNavigate } from "react-router-dom";
import useTravelLogs from "../hooks/useTravelLogs";
import "../App.css";
import { formatDateDMY } from "../hooks/formatDate";

const TravelLogs = () => {
  const navigate = useNavigate();
  const { logs, fetchLogs, newLog, setNewLog, handleNewChange } =
    useTravelLogs();

  const addLog = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      if (!user?.id) {
        alert("You must log in first.");
        return;
      }

      const formattedLog = {
        ...newLog,
        tags: newLog.tags
          .split(",")
          .map((tag) => tag.replace(/^#/, "").trim()) // remove leading '#' and trim
          .filter(Boolean) // remove empty entries
          .join(", "), // convert array to string
        user_id: user.id,
      };

      const res = await fetch("http://localhost:5000/api/travel-log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedLog),
      });

      if (!res.ok) throw new Error("Failed to add log");

      // Refresh sorted list
      await fetchLogs();

      // Reset form
      setNewLog({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        tags: "",
      });
    } catch (err) {
      console.error("Error adding log:", err);
    }
  };

  return (
    <div className="dashboard">
      <h2>Travel Logs</h2>

      <form className="add-form" onSubmit={addLog}>
        <input
          name="title"
          value={newLog.title}
          onChange={handleNewChange}
          placeholder="Title"
          required
          style={{ gridColumn: "1 / -1" }}
        />

        <textarea
          name="description"
          value={newLog.description}
          onChange={handleNewChange}
          placeholder="Description"
          required
          style={{ gridColumn: "1 / -1" }}
        />

        <input
          type="date"
          name="startDate"
          value={newLog.startDate}
          onChange={handleNewChange}
          required
        />
        <input
          type="date"
          name="endDate"
          value={newLog.endDate}
          onChange={handleNewChange}
          required
        />

        <input
          name="tags"
          value={newLog.tags}
          onChange={handleNewChange}
          placeholder="Tags (comma separated)"
          style={{ gridColumn: "1 / -1" }}
        />

        <div
          className="button-group"
          style={{
            gridColumn: "1 / -1",
            justifySelf: "center",
            width: "200px",
          }}
        >
          <button type="submit">Add Travel Log 🗺️</button>
        </div>
      </form>

      <div className="cards-container">
        {logs.map((log) => (
          <div
            key={log.id}
            className="card travel-card"
            onClick={() => navigate(`/travel-log/${log.id}`)}
          >
            <h3 className="card-title">{log.title}</h3>
            <div className="card-dates">
              <span className="calendar-icon">📅</span>
              <div className="date-stack">
                <span>{formatDateDMY(log.startDate)}</span>
                <span>{formatDateDMY(log.endDate)}</span>
                <span
                  style={{
                    fontStyle: "italic",
                    fontSize: "0.85rem",
                    color: "#555",
                  }}
                >
                  Posted: {formatDateDMY(log.postDate)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelLogs;
