import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useTravelLogs from "../hooks-firebase/useTravelLogs";
import TravelLogDetailLayout from "../hooks/TravelLogDetailLayout";

export default function TravelLogDetailFirebase() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { log, handleChange, saveLog, deleteLog, fetchLogs } =
    useTravelLogs(id);

  useEffect(() => {
    fetchLogs();
  }, [id]);

  const handleSave = () => saveLog(id, () => navigate("/travel-log"));
  const handleDelete = () => deleteLog(id, () => navigate("/travel-log"));
  const goBack = () => navigate("/travel-log");

  return (
    <TravelLogDetailLayout
      log={log}
      handleChange={handleChange}
      saveLog={handleSave}
      deleteLog={handleDelete}
      goBack={goBack}
    />
  );
}
