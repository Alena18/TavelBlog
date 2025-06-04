import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/Profile.css";
import "../App.css";
import { FiSearch, FiEdit3 } from "react-icons/fi";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import useTravelLogs from "../hooks/useTravelLogs";
import useJourneyPlans from "../hooks/useJourneyPlans";
import { formatDateDMY } from "../hooks/formatDate";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showLogs, setShowLogs] = useState(true);

  const [selectedLog, setSelectedLog] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const { logs, log, setLog, saveLog, deleteLog } = useTravelLogs();
  const {
    plans,
    editedPlan,
    setEditedPlan,
    startEditing,
    cancelEditing,
    saveEdit,
    deletePlan,
    handleEditChange,
  } = useJourneyPlans();

  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            ...docSnap.data(),
          });
        } else {
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
          });
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setFilteredLogs(logs);
    setFilteredPlans(plans);
  }, [logs, plans]);

  useEffect(() => {
    let logsFiltered = [...logs];
    let plansFiltered = [...plans];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      logsFiltered = logsFiltered.filter(
        (log) =>
          log.title?.toLowerCase().includes(term) ||
          log.tags?.toLowerCase().includes(term)
      );
      plansFiltered = plansFiltered.filter((plan) =>
        plan.name.toLowerCase().includes(term)
      );
    }

    if (sortBy === "title" || sortBy === "name") {
      logsFiltered.sort((a, b) => a.title.localeCompare(b.title));
      plansFiltered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "startDate") {
      logsFiltered.sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
      );
      plansFiltered.sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
      );
    }

    setFilteredLogs(logsFiltered);
    setFilteredPlans(plansFiltered);
  }, [searchTerm, sortBy, logs, plans]);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  const handlePlanRowClick = (planId) => {
    navigate(`/travelplandetails/${planId}`);
  };

  const openLogModal = (log) => {
    setLog({
      ...log,
      startDate: log.startDate?.split("T")[0],
      endDate: log.endDate?.split("T")[0],
    });
    setSelectedLog(log);
  };

  const openPlanModal = (plan) => {
    startEditing(plan);
    setSelectedPlan(plan);
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
                  <tr key={plan.id}>
                    <td onClick={() => handlePlanRowClick(plan.id)}>
                      {plan.name}
                    </td>
                    <td onClick={() => handlePlanRowClick(plan.id)}>
                      {Array.isArray(plan.locations)
                        ? plan.locations.join(", ")
                        : plan.locations}
                    </td>
                    <td onClick={() => handlePlanRowClick(plan.id)}>
                      {formatDateDMY(plan.startDate)}
                    </td>
                    <td onClick={() => handlePlanRowClick(plan.id)}>
                      {formatDateDMY(plan.endDate)}
                    </td>
                    <td onClick={() => handlePlanRowClick(plan.id)}>
                      {Array.isArray(plan.activities)
                        ? plan.activities.join(", ")
                        : plan.activities}
                    </td>
                    <td onClick={() => handlePlanRowClick(plan.id)}>
                      {plan.description}
                    </td>
                    <td onClick={() => handlePlanRowClick(plan.id)}>€0.00</td>
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
                    <td onClick={() => openLogModal(log)}>{log.title}</td>
                    <td onClick={() => openLogModal(log)}>{log.description}</td>
                    <td onClick={() => openLogModal(log)}>
                      {formatDateDMY(log.startDate)}
                    </td>
                    <td onClick={() => openLogModal(log)}>
                      {formatDateDMY(log.endDate)}
                    </td>
                    <td onClick={() => openLogModal(log)}>{log.tags}</td>
                    <td onClick={() => openLogModal(log)}>
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

      {/* Travel Log Modal */}
      {selectedLog && (
        <div className="modal-overlay">
          <form className="add-form">
            <h3>Edit Travel Log</h3>
            <input
              name="title"
              value={log.title}
              onChange={(e) => setLog({ ...log, title: e.target.value })}
            />
            <textarea
              name="description"
              value={log.description}
              onChange={(e) => setLog({ ...log, description: e.target.value })}
            />
            <input
              type="date"
              name="startDate"
              value={log.startDate}
              onChange={(e) => setLog({ ...log, startDate: e.target.value })}
            />
            <input
              type="date"
              name="endDate"
              value={log.endDate}
              onChange={(e) => setLog({ ...log, endDate: e.target.value })}
            />
            <input
              name="tags"
              value={log.tags}
              onChange={(e) => setLog({ ...log, tags: e.target.value })}
            />
            <div className="modal-actions">
              <button
                type="button"
                onClick={() => {
                  saveLog(log.id, () => setSelectedLog(null));
                }}
              >
                <FaCheck />
              </button>
              <button type="button" onClick={() => setSelectedLog(null)}>
                <FaTimes />
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteLog(log.id, () => setSelectedLog(null));
                }}
              >
                <FaTrash />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Journey Plan Modal */}
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
            <textarea
              name="activities"
              value={
                Array.isArray(editedPlan.activities)
                  ? editedPlan.activities.join(", ")
                  : editedPlan.activities || ""
              }
              onChange={(e) =>
                handleEditChange({
                  target: {
                    name: "activities",
                    value: e.target.value.split(",").map((a) => a.trim()),
                  },
                })
              }
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

export default Profile;
