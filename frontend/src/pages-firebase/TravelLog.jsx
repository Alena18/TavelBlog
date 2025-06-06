import React from "react";
import useTravelLogs from "../hooks-firebase/useTravelLogs";
import { usePlaces } from "../hooks-firebase/usePlaces";
import TravelLogsLayout from "../pages-firebase/TravelLogsLayout";

export default function TravelLogs() {
  const {
    logs,
    editLog,
    setEditLog,
    newLog,
    setNewLog,
    handleNewChange,
    handleChange,
    addLog,
    saveLog,
    deleteLog,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    isLoading,
    userId,
  } = useTravelLogs();

  const {
    editPlace,
    setEditPlace,
    handleEditSubmit,
    deletePlace,
    cancelEdit,
    popupRefs,
    journeyPlans,
    places,
  } = usePlaces();

  if (isLoading) return <p>Loading your travel logs...</p>;
  if (!userId) return <p>Please log in to see your travel logs.</p>;

  return (
    <TravelLogsLayout
      logs={logs}
      newLog={newLog}
      setNewLog={setNewLog}
      handleNewChange={handleNewChange}
      addLog={addLog}
      editLog={editLog}
      setEditLog={setEditLog}
      handleEditLogChange={handleChange}
      saveLog={() => saveLog(editLog?.id, () => setEditLog(null))}
      deleteLog={() => deleteLog(editLog?.id, () => setEditLog(null))}
      places={places}
      editPlace={editPlace}
      setEditPlace={setEditPlace}
      handleEditSubmit={handleEditSubmit}
      deletePlace={deletePlace}
      cancelEdit={cancelEdit}
      popupRefs={popupRefs}
      journeyPlans={journeyPlans}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      sortOption={sortBy}
      setSortOption={setSortBy}
    />
  );
}
