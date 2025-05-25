// src/hooks/useTravelLogs.js
import { useEffect, useState } from "react";
import axios from "axios";

const useTravelLogs = (logId = null) => {
  const [logs, setLogs] = useState([]);
  const [log, setLog] = useState(null); // for details view
  const [newLog, setNewLog] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    tags: "",
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      const userId = user?.id;
      if (!userId) return;

      const res = await axios.get(
        `http://localhost:5000/api/travel-log?user_id=${userId}`
      );
      const sorted = res.data.sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
      );
      setLogs(sorted);

      if (logId) {
        const found = sorted.find((l) => l.id === parseInt(logId));
        if (found) {
          // Clean up tags string: remove brackets/quotes if JSON string came through
          let rawTags = found.tags || "";
          if (typeof rawTags === "string" && rawTags.startsWith("[")) {
            try {
              const parsed = JSON.parse(rawTags);
              rawTags = Array.isArray(parsed) ? parsed.join(", ") : rawTags;
            } catch {
              // not JSON, keep raw
            }
          }

          setLog({
            ...found,
            startDate: found.startDate?.split("T")[0] || "",
            endDate: found.endDate?.split("T")[0] || "",
            tags: rawTags,
          });
        }
      }
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLog((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewLog((prev) => ({ ...prev, [name]: value }));
  };

  const saveLog = async (id, onSuccess) => {
    try {
      const cleanedTags = log.tags
        .split(",")
        .map((tag) => tag.replace(/^#/, "").trim())
        .filter(Boolean);

      const updated = {
        ...log,
        tags: cleanedTags.join(", "),
      };

      await axios.put(`http://localhost:5000/api/travel-log/${id}`, updated);
      await fetchLogs();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const deleteLog = async (id, onSuccess) => {
    try {
      await axios.delete(`http://localhost:5000/api/travel-log/${id}`);
      await fetchLogs();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return {
    logs,
    log,
    setLog,
    newLog,
    setNewLog,
    handleNewChange,
    handleChange,
    fetchLogs,
    saveLog,
    deleteLog,
  };
};

export default useTravelLogs;
