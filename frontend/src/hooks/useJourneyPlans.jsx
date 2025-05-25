// src/hooks/useJourneyPlans.js
import { useEffect, useState } from "react";
import axios from "axios";

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

  // Move activity options here
  const activityOptions = [
    { value: "Hiking", label: "🏞 Hiking" },
    { value: "Beach", label: "🏖 Beach" },
    { value: "Food Tour", label: "🍲 Food Tour" },
    { value: "Shopping", label: "🛍 Shopping" },
    { value: "Culture", label: "🕌 Culture" },
    { value: "Photography", label: "📸 Photography" },
    { value: "Biking", label: "🚴 Biking" },
    { value: "Fishing", label: "🎣 Fishing" },
    { value: "Climbing", label: "🧗 Climbing" },
    { value: "Nightlife", label: "🎉 Nightlife" },
  ];

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      const userId = user?.id;
      if (!userId) return;

      const res = await axios.get(
        `http://localhost:5000/api/plans?user_id=${userId}`
      );
      setPlans(res.data);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

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
      const user = JSON.parse(localStorage.getItem("userInfo"));
      const userId = user?.id;
      if (!userId) return;

      const formatted = {
        ...newPlan,
        locations: newPlan.locations
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean),
        activities: newPlan.activities,
        user_id: userId,
      };

      const res = await axios.post(
        "http://localhost:5000/api/plans",
        formatted
      );
      setPlans((prev) =>
        [...prev, res.data].sort(
          (a, b) => new Date(a.startDate) - new Date(b.startDate)
        )
      );
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
      id: plan.id,
      name: plan.name,
      locations: Array.isArray(plan.locations) ? plan.locations.join(", ") : "",
      startDate: plan.startDate?.split("T")[0] || "",
      endDate: plan.endDate?.split("T")[0] || "",
      activities: Array.isArray(plan.activities) ? plan.activities : [],
      description: plan.description,
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
        locations: editedPlan.locations
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean),
        activities: editedPlan.activities,
      };

      await axios.put(`http://localhost:5000/api/plans/${id}`, updatedPlan);
      setPlans((prev) =>
        prev
          .map((plan) => (plan.id === id ? { ...updatedPlan, id } : plan))
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      );
      cancelEditing();
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const deletePlan = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/plans/${id}`);
      setPlans((prev) => prev.filter((plan) => plan.id !== id));
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
