import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import useTravelLogs from "./useTravelLogs";
import useJourneyPlans from "./useJourneyPlans";

const useProfile = () => {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showLogs, setShowLogs] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);

  const { logs, editLog, setEditLog, saveLog, deleteLog } = useTravelLogs();
  const {
    plans,
    editedPlan,
    setEditedPlan,
    startEditing,
    cancelEditing,
    saveEdit,
    deletePlan,
    handleEditChange,
  } = useJourneyPlans();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            ...docSnap.data(),
          });
        } else {
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
          });
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setFilteredLogs(logs);
    setFilteredPlans(plans);
  }, [logs, plans]);

  useEffect(() => {
    let logsFiltered = [...logs];
    let plansFiltered = [...plans];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      logsFiltered = logsFiltered.filter(
        (log) =>
          log.title?.toLowerCase().includes(term) ||
          log.tags?.toLowerCase().includes(term)
      );
      plansFiltered = plansFiltered.filter((plan) =>
        plan.name.toLowerCase().includes(term)
      );
    }

    if (sortBy === "title" || sortBy === "name") {
      logsFiltered.sort((a, b) => a.title.localeCompare(b.title));
      plansFiltered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "startDate") {
      logsFiltered.sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
      );
      plansFiltered.sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
      );
    }

    setFilteredLogs(logsFiltered);
    setFilteredPlans(plansFiltered);
  }, [searchTerm, sortBy, logs, plans]);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  const openLogModal = (log) => {
    setEditLog({
      ...log,
      startDate: log.startDate?.split("T")[0],
      endDate: log.endDate?.split("T")[0],
    });
    setSelectedLog(log);
  };

  const openPlanModal = (plan) => {
    startEditing(plan);
    setSelectedPlan(plan);
  };

  return {
    user,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    showLogs,
    setShowLogs,
    selectedLog,
    setSelectedLog,
    selectedPlan,
    setSelectedPlan,
    logs,
    editLog,
    setEditLog,
    saveLog,
    deleteLog,
    plans,
    editedPlan,
    setEditedPlan,
    startEditing,
    cancelEditing,
    saveEdit,
    deletePlan,
    handleEditChange,
    filteredLogs,
    filteredPlans,
    handleLogout,
    openLogModal,
    openPlanModal,
  };
};

export default useProfile;
