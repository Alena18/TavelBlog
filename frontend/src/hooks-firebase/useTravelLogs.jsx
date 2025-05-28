import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const useTravelLogs = (logId = null) => {
  const [logs, setLogs] = useState([]);
  const [log, setLog] = useState(null);
  const [newLog, setNewLog] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    tags: "",
  });
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setLogs([]);
        setLog(null);
      }
    });

    return unsubscribe;
  }, []);

  // Fetch logs once userId is set
  useEffect(() => {
    if (userId) {
      fetchLogs(userId);
    } else {
      setIsLoading(false);
    }
  }, [userId, logId]);

  const fetchLogs = async (uid) => {
    if (!uid) return;
    setIsLoading(true);

    try {
      const q = query(
        collection(db, "travelLogs"),
        where("user_id", "==", uid),
        orderBy("startDate")
      );

      const snapshot = await getDocs(q);
      const allLogs = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      setLogs(allLogs);

      if (logId) {
        const docRef = doc(db, "travelLogs", logId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const found = docSnap.data();
          let rawTags = found.tags || "";

          if (typeof rawTags === "string" && rawTags.startsWith("[")) {
            try {
              const parsed = JSON.parse(rawTags);
              rawTags = Array.isArray(parsed) ? parsed.join(", ") : rawTags;
            } catch {
              // fallback to raw string
            }
          }

          setLog({
            ...found,
            startDate: found.startDate,
            endDate: found.endDate,
            tags: rawTags,
            id: docSnap.id,
          });
        } else {
          setLog(null);
        }
      } else {
        setLog(null);
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setIsLoading(false);
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

      await updateDoc(doc(db, "travelLogs", id), {
        ...log,
        tags: cleanedTags.join(", "),
      });

      await fetchLogs(userId);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const deleteLog = async (id, onSuccess) => {
    try {
      await deleteDoc(doc(db, "travelLogs", id));
      await fetchLogs(userId);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const addLog = async (e) => {
    e.preventDefault();
    if (!userId) {
      console.warn("No authenticated user. Cannot add log.");
      return;
    }

    try {
      const cleanedTags = newLog.tags
        .split(",")
        .map((tag) => tag.replace(/^#/, "").trim())
        .filter(Boolean);

      const logData = {
        ...newLog,
        tags: cleanedTags.join(", "),
        user_id: userId,
        postDate: new Date().toISOString(),
      };

      await addDoc(collection(db, "travelLogs"), logData);
      await fetchLogs(userId);

      setNewLog({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        tags: "",
      });
    } catch (error) {
      console.error("Add log failed:", error);
    }
  };

  return {
    logs,
    log,
    newLog,
    userId,
    isLoading,
    setLog,
    setNewLog,
    handleNewChange,
    handleChange,
    fetchLogs,
    saveLog,
    deleteLog,
    addLog,
  };
};

export default useTravelLogs;
