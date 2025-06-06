import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

const capitalizeWords = (str) =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const processTags = (tagString) =>
  tagString
    .split(/[ ,]+/)
    .map((tag) => tag.replace(/^#/, "").trim())
    .filter(Boolean)
    .map((tag) => `#${tag}`);

export default function useTravelLogs() {
  const [logs, setLogs] = useState([]);
  const [newLog, setNewLog] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    tags: "",
  });
  const [editLog, setEditLog] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("startDate");
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
      fetchLogs();
      fetchPlaces();
    }
  }, []);

  const fetchLogs = async () => {
    const snapshot = await getDocs(collection(db, "travelLogs"));
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setLogs(list);
    setIsLoading(false);
  };

  const fetchPlaces = async () => {
    const snapshot = await getDocs(collection(db, "visitedPlaces"));
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPlaces(list);
  };

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewLog((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditLog((prev) => ({ ...prev, [name]: value }));
  };

  const addLog = async (e) => {
    e.preventDefault();
    const logData = {
      ...newLog,
      title: capitalizeWords(newLog.title.trim()),
      tags: processTags(newLog.tags).join(" "),
      postDate: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, "travelLogs"), logData);
    setLogs((prev) => [...prev, { ...logData, id: docRef.id }]);
    setNewLog({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      tags: "",
    });
  };

  const saveLog = async (id, callback) => {
    const logData = {
      ...editLog,
      title: capitalizeWords(editLog.title.trim()),
      tags: processTags(editLog.tags).join(" "),
    };
    const docRef = doc(db, "travelLogs", id);
    await updateDoc(docRef, logData);
    setLogs((prev) =>
      prev.map((log) => (log.id === id ? { ...log, ...logData } : log))
    );
    if (callback) callback();
  };

  const deleteLog = async (id, callback) => {
    const docRef = doc(db, "travelLogs", id);
    await deleteDoc(docRef);
    setLogs((prev) => prev.filter((log) => log.id !== id));
    if (callback) callback();
  };

  return {
    logs,
    newLog,
    setNewLog,
    handleNewChange,
    handleChange,
    addLog,
    editLog,
    setEditLog,
    saveLog,
    deleteLog,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    isLoading,
    userId,
    places,
  };
}
