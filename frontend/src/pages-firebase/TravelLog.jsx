import React from "react";
import useTravelLogs from "../hooks-firebase/useTravelLogs";
import TravelLogsLayout from "../hooks/TravelLogsLayout";

export default function TravelLogs() {
  const {
    logs,
    newLog,
    setNewLog,
    handleNewChange,
    addLog,
    isLoading,
    userId,
  } = useTravelLogs();

  if (isLoading) return <p>Loading your travel logs...</p>;
  if (!userId) return <p>Please log in to see your travel logs.</p>;

  return (
    <TravelLogsLayout
      logs={logs}
      newLog={newLog}
      setNewLog={setNewLog}
      handleNewChange={handleNewChange}
      addLog={addLog}
    />
  );
}
