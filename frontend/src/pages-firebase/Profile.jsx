import React from "react";
import { useNavigate } from "react-router-dom";
import "../pages/Profile.css";
import "../App.css";
import { FiSearch, FiEdit3 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { formatDateDMY } from "../hooks/formatDate";
import useProfile from "../hooks-firebase/useProfile";
import {
  TravelLogModal,
  JourneyPlanModal,
} from "../hooks-firebase/useProfileModal";
import activityOptions from "../hooks-firebase/activityOptions";

function Profile() {
  const navigate = useNavigate();
  const {
    user,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    showLogs,
    setShowLogs,
    selectedLog,
    setSelectedLog,
    selectedPlan,
    setSelectedPlan,
    editLog,
    setEditLog,
    saveLog,
    deleteLog,
    editedPlan,
    setEditedPlan,
    handleEditChange,
    saveEdit,
    deletePlan,
    filteredLogs,
    filteredPlans,
    handleLogout,
    openLogModal,
    openPlanModal,
  } = useProfile();

  const handlePlanRowClick = (planId) => {
    navigate(`/plans/${planId}`);
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-wrapper">
      <h2 className="profile-welcome">Welcome, {user.username}!</h2>
      <p className="subtext">Email: {user.email}</p>
      <p className="subtext">Address: {user.address}</p>

      <div className="search-container">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search by title, name, tag"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <FiSearch className="search-icon" />
        </div>
        <div className="sort-controls">
          <label>Sort by: </label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name / Title</option>
            <option value="startDate">Start Date</option>
          </select>
        </div>
      </div>

      <div className="toggle-switch">
        <label className="switch">
          <input
            type="checkbox"
            checked={!showLogs}
            onChange={() => setShowLogs((prev) => !prev)}
          />
          <span className="slider"></span>
        </label>
        <span className="toggle-label">
          {showLogs ? "Journey Plans" : "Travel Logs"}
        </span>
      </div>

      <div className="profile-tables">
        <table className="form-table">
          <thead>
            {showLogs ? (
              <tr>
                <th>Name</th>
                <th>Locations</th>
                <th>Start</th>
                <th>End</th>
                <th>Activities</th>
                <th>Description</th>
                <th>Budget Total</th>
                <th>Manage</th>
              </tr>
            ) : (
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Start</th>
                <th>End</th>
                <th>Tags</th>
                <th>Posted</th>
                <th>Manage</th>
              </tr>
            )}
          </thead>
          <tbody>
            {showLogs
              ? filteredPlans.map((plan) => (
                  <tr
                    key={plan.id}
                    className="clickable-row"
                    onClick={() => handlePlanRowClick(plan.id)}
                  >
                    <td data-label="Name">{plan.name}</td>
                    <td data-label="Locations">
                      {Array.isArray(plan.locations)
                        ? plan.locations.join(", ")
                        : plan.locations}
                    </td>
                    <td data-label="Start">{formatDateDMY(plan.startDate)}</td>
                    <td data-label="End">{formatDateDMY(plan.endDate)}</td>
                    <td data-label="Activities">
                      {Array.isArray(plan.activities) &&
                        plan.activities
                          .map((activity) => {
                            const option = activityOptions.find(
                              (opt) => opt.value === activity
                            );
                            return option ? option.label.split(" ")[0] : "";
                          })
                          .join(" ")}
                    </td>
                    <td data-label="Description">{plan.description}</td>
                    <td data-label="Budget Total">
                      €{plan.totalBudget ? plan.totalBudget.toFixed(2) : "0.00"}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openPlanModal(plan);
                          }}
                        >
                          <FiEdit3 />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePlan(plan.id);
                          }}
                        >
                          <FaTrash color="white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              : filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td data-label="Title" onClick={() => openLogModal(log)}>
                      {log.title}
                    </td>
                    <td
                      data-label="Description"
                      onClick={() => openLogModal(log)}
                    >
                      {log.description}
                    </td>
                    <td data-label="Start" onClick={() => openLogModal(log)}>
                      {formatDateDMY(log.startDate)}
                    </td>
                    <td data-label="End" onClick={() => openLogModal(log)}>
                      {formatDateDMY(log.endDate)}
                    </td>
                    <td data-label="Tags" onClick={() => openLogModal(log)}>
                      {log.tags}
                    </td>
                    <td data-label="Posted" onClick={() => openLogModal(log)}>
                      {formatDateDMY(log.postDate)}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openLogModal(log);
                          }}
                        >
                          <FiEdit3 />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteLog(log.id);
                          }}
                        >
                          <FaTrash color="white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <div className="center-signout">
        <button className="logout-btn" onClick={handleLogout}>
          Sign out <span className="button-palm">🏝️</span>
        </button>
      </div>

      {selectedLog && (
        <TravelLogModal
          editLog={editLog}
          setEditLog={setEditLog}
          saveLog={saveLog}
          deleteLog={deleteLog}
          setSelectedLog={setSelectedLog}
        />
      )}

      {selectedPlan && (
        <JourneyPlanModal
          editedPlan={editedPlan}
          setEditedPlan={setEditedPlan}
          handleEditChange={handleEditChange}
          saveEdit={saveEdit}
          deletePlan={deletePlan}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
        />
      )}
    </div>
  );
}

export default Profile;
