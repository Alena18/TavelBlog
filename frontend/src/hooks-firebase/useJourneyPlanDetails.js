import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { updateDoc } from "firebase/firestore";

const useJourneyPlanDetails = (planId) => {
  const [plan, setPlan] = useState(null);
  const [receipts, setReceipts] = useState([]);
  const [newReceipt, setNewReceipt] = useState({ category: "", amount: "" });
  const [totalBudget, setTotalBudget] = useState(0);

  useEffect(() => {
    if (planId) {
      fetchPlan(planId);
      fetchReceipts(planId);
    }
  }, [planId]);

  const fetchPlan = async (id) => {
    try {
      const docRef = doc(db, "journeyPlans", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPlan({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (err) {
      console.error("Failed to fetch plan:", err);
    }
  };

  const fetchReceipts = async (id) => {
    try {
      const receiptsQuery = query(
        collection(db, "receipts"),
        where("planId", "==", id)
      );
      const snapshot = await getDocs(receiptsQuery);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReceipts(data);

      // Calculate total budget
      const total = data.reduce((sum, item) => sum + (item.amount || 0), 0);
      setTotalBudget(total);

      // Update the journeyPlans document with the total budget
      await updateDoc(doc(db, "journeyPlans", id), {
        totalBudget: total,
      });
    } catch (err) {
      console.error("Failed to fetch receipts:", err);
    }
  };

  const addReceipt = async () => {
    try {
      const newEntry = {
        ...newReceipt,
        amount: parseFloat(newReceipt.amount),
        planId,
        date: new Date().toISOString(),
      };
      await addDoc(collection(db, "receipts"), newEntry);
      fetchReceipts(planId);
      setNewReceipt({ category: "", amount: "" });
    } catch (err) {
      console.error("Add receipt failed:", err);
    }
  };

  const updateReceipt = async (receiptId, updatedData) => {
    try {
      await updateDoc(doc(db, "receipts", receiptId), updatedData);
      fetchReceipts(planId); // refresh local data after update
    } catch (err) {
      console.error("Update receipt failed:", err);
    }
  };

  const deleteReceipt = async (receiptId) => {
    try {
      await deleteDoc(doc(db, "receipts", receiptId));
      fetchReceipts(planId);
    } catch (err) {
      console.error("Delete receipt failed:", err);
    }
  };

  const handleNewReceiptChange = (e) => {
    const { name, value } = e.target;
    setNewReceipt((prev) => ({ ...prev, [name]: value }));
  };

  return {
    plan,
    receipts,
    totalBudget,
    newReceipt,
    setNewReceipt,
    handleNewReceiptChange,
    addReceipt,
    deleteReceipt,
    updateReceipt,
    fetchReceipts,
  };
};

export default useJourneyPlanDetails;
