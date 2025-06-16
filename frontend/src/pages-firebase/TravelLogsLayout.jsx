import React from "react";
import { formatDateDMY } from "../hooks/formatDate";
import { FiSearch } from "react-icons/fi";
import { TravelLogModal } from "../hooks-firebase/useProfileModal";
import PlaceModal from "../hooks-firebase/PlaceModal";

import "./style-firebase.css";

export default function TravelLogsLayout({
  logs,
  newLog,
  setNewLog,
  handleNewChange,
  addLog,
  editLog,
  setEditLog,
  handleEditLogChange,
  saveLog,
  deleteLog,
  places,
  editPlace,
  setEditPlace,
  handleEditSubmit,
  deletePlace,
  cancelEdit,
  popupRefs,
  journeyPlans,
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption,
}) {
  const q = searchQuery.toLowerCase();

  const filteredLogs = logs.filter(
    (log) =>
      log.title.toLowerCase().includes(q) ||
      log.description.toLowerCase().includes(q) ||
      (log.tags || "").toLowerCase().includes(q)
  );

  const filteredPlaces = places.filter(
    (place) =>
      place.placename?.toLowerCase().includes(q) ||
      place.description?.toLowerCase().includes(q) ||
      place.journeyname?.toLowerCase().includes(q)
  );

  return (
    <div className="dashboard">
      <h2>Travel Log</h2>

      <div className="form-wrapper-logs">
        <form className="add-form" onSubmit={addLog}>
          <input
            name="title"
            value={newLog.title}
            onChange={handleNewChange}
            placeholder="Title"
            required
            className="grid-span-full"
          />

          <textarea
            name="description"
            value={newLog.description}
            onChange={handleNewChange}
            placeholder="Description"
            required
            className="grid-span-full"
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
            className="grid-span-full"
          />

          <div className="button-group center-button">
            <button type="submit">
              Add Log
              <span className="palm-icon">🧳</span>
            </button>
          </div>
        </form>
      </div>

      <div className="search-container">
        <div className="search-wrapper">
          <input
            className="search-input"
            type="text"
            placeholder="Search logs or places"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FiSearch className="search-icon" />
        </div>
      </div>

      <div className="cards-container">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="card travel-card"
            onClick={() =>
              setEditLog({
                ...log,
                startDate: log.startDate?.split("T")[0],
                endDate: log.endDate?.split("T")[0],
              })
            }
          >
            <h3 className="card-title">{log.title}</h3>
            <div className="card-dates">
              <span className="calendar-icon">📅</span>
              <div className="date-stack">
                <span>{formatDateDMY(log.startDate)}</span>
                <span>{formatDateDMY(log.endDate)}</span>
                <span className="post-date">
                  Posted: {formatDateDMY(log.postDate)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredPlaces.map((place) => (
          <div
            key={place.id}
            className="card travel-card"
            onClick={() => setEditPlace(place)}
          >
            <h3 className="card-title">{place.placename}</h3>
            <div className="card-dates">
              <p>
                <strong>Journey:</strong> {place.journeyname}
              </p>
              <p>
                {place.review === "loved"
                  ? "❤️"
                  : place.review === "ok"
                  ? "⭐"
                  : "📌"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {editLog && (
        <TravelLogModal
          editLog={editLog}
          setEditLog={setEditLog}
          saveLog={saveLog}
          deleteLog={deleteLog}
          setSelectedLog={() => setEditLog(null)}
        />
      )}

      {editPlace && (
        <PlaceModal
          editPlace={editPlace}
          setEditPlace={setEditPlace}
          handleEditSubmit={(e) => handleEditSubmit(e, popupRefs)}
          deletePlace={deletePlace}
          cancelEdit={cancelEdit}
          journeyPlans={journeyPlans}
        />
      )}
    </div>
  );
}
