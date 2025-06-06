import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import activityOptions from "./activityOptions";

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
