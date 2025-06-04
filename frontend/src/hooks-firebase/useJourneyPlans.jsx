import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig"; // make sure your Firebase setup is correct

const capitalizeWords = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const useJourneyPlans = () => {
  const [plans, setPlans] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newPlan, setNewPlan] = useState({
    name: "",
    locations: "",
    startDate: "",
    endDate: "",
    activities: [],
    description: "",
  });
  const [editedPlan, setEditedPlan] = useState({});

  const activityOptions = [
    { value: "Hiking", label: "\ud83c\udfdc Hiking" },
    { value: "Beach", label: "\ud83c\udfd6 Beach" },
    { value: "Food Tour", label: "\ud83c\udf72 Food Tour" },
    { value: "Shopping", label: "\ud83c\udfe6 Shopping" },
    { value: "Culture", label: "\ud83c\udfdb Culture" },
    { value: "Photography", label: "\ud83d\udcf8 Photography" },
    { value: "Biking", label: "\ud83d\udeb4 Biking" },
    { value: "Fishing", label: "\ud83c\udfa3 Fishing" },
    { value: "Climbing", label: "\ud83e\uddf7 Climbing" },
    { value: "Nightlife", label: "\ud83c\udf89 Nightlife" },
  ];

  const fetchPlans = async () => {
    try {
      const snapshot = await getDocs(collection(db, "journeyPlans"));
      const plansData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlans(
        plansData.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      );
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewPlan((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedPlan((prev) => ({ ...prev, [name]: value }));
  };

  const addPlan = async (e) => {
    e.preventDefault();
    try {
      const formatted = {
        ...newPlan,
        name: capitalizeWords(newPlan.name),
        description: capitalizeWords(newPlan.description),
        locations: newPlan.locations
          .split(",")
          .map((l) => capitalizeWords(l.trim()))
          .filter(Boolean),
      };

      const docRef = await addDoc(collection(db, "journeyPlans"), formatted);
      fetchPlans(); // Reload the list
      setNewPlan({
        name: "",
        locations: "",
        startDate: "",
        endDate: "",
        activities: [],
        description: "",
      });
    } catch (err) {
      console.error("Add failed:", err);
    }
  };

  const startEditing = (plan) => {
    setEditingId(plan.id);
    setEditedPlan({
      ...plan,
      locations: Array.isArray(plan.locations) ? plan.locations.join(", ") : "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedPlan({});
  };

  const saveEdit = async (id) => {
    try {
      const updatedPlan = {
        ...editedPlan,
        name: capitalizeWords(editedPlan.name),
        description: capitalizeWords(editedPlan.description),
        locations: editedPlan.locations
          .split(",")
          .map((l) => capitalizeWords(l.trim()))
          .filter(Boolean),
      };

      await updateDoc(doc(db, "journeyPlans", id), updatedPlan);
      fetchPlans();
      cancelEditing();
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const deletePlan = async (id) => {
    try {
      await deleteDoc(doc(db, "journeyPlans", id));
      fetchPlans();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return {
    plans,
    newPlan,
    setNewPlan,
    editedPlan,
    setEditedPlan,
    editingId,
    handleNewChange,
    handleEditChange,
    addPlan,
    startEditing,
    cancelEditing,
    saveEdit,
    deletePlan,
    activityOptions,
  };
};

export default useJourneyPlans;
