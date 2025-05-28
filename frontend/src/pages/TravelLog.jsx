import React from "react";
import useTravelLogs from "../hooks/useTravelLogs";
import TravelLogsLayout from "../hooks/TravelLogsLayout";

export default function TravelLogs() {
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
          .map((tag) => tag.replace(/^#/, "").trim())
          .filter(Boolean)
          .join(", "),
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

      await fetchLogs();
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
    <TravelLogsLayout
      logs={logs}
      newLog={newLog}
      setNewLog={setNewLog}
      handleNewChange={handleNewChange}
      addLog={addLog}
    />
  );
}
