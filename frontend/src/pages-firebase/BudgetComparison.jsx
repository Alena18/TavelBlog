import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF"];

function BudgetComparison({ planAId }) {
  const [newReceipt, setNewReceipt] = useState({ amount: "", category: "" });
  const [receipts, setReceipts] = useState([]);
  const [totals, setTotals] = useState({});
  const [showPie, setShowPie] = useState(false);

  useEffect(() => {
    fetchReceipts();
  }, [planAId]);

  const fetchReceipts = async () => {
    const q = query(collection(db, "receipts"), where("planId", "==", planAId));
    const snapshot = await getDocs(q);
    const allReceipts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setReceipts(allReceipts);

    const summed = {};
    allReceipts.forEach((r) => {
      summed[r.category] = (summed[r.category] || 0) + r.amount;
    });
    setTotals(summed);
  };

  const handleAddReceipt = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "receipts"), {
        planId: planAId,
        category: newReceipt.category,
        amount: parseFloat(newReceipt.amount),
        date: new Date().toISOString(),
      });
      setNewReceipt({ amount: "", category: "" });
      fetchReceipts();
    } catch (err) {
      console.error("Error adding receipt:", err);
    }
  };

  const totalAmount = Object.values(totals).reduce((sum, val) => sum + val, 0);

  return (
    <div>
      <form onSubmit={handleAddReceipt} style={{ marginBottom: "20px" }}>
        <input
          type="number"
          placeholder="Amount"
          value={newReceipt.amount}
          onChange={(e) =>
            setNewReceipt({ ...newReceipt, amount: e.target.value })
          }
          required
          style={{ marginRight: "10px" }}
        />
        <select
          value={newReceipt.category}
          onChange={(e) =>
            setNewReceipt({ ...newReceipt, category: e.target.value })
          }
          required
          style={{ marginRight: "10px" }}
        >
          <option value="">Select Category</option>
          <option value="food">Food</option>
          <option value="drink">Drink</option>
          <option value="shopping">Shopping</option>
          <option value="attractions">Attractions</option>
          <option value="transport">Transport</option>
        </select>
        <button type="submit" className="btn-save">
          Add Receipt
        </button>
        <button
          type="button"
          className="btn-save"
          onClick={() => setShowModal(true)}
        >
          Upload / Scan Receipt
        </button>
      </form>

      <h4>Category Summary</h4>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount (€)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(totals).map(([category, amount], idx) => (
            <tr key={idx}>
              <td data-label="Category">{category}</td>
              <td data-label="Amount (€)">€{amount}</td>
            </tr>
          ))}
          <tr>
            <td data-label="Category">
              <strong>Total</strong>
            </td>
            <td data-label="Amount (€)">
              <strong>€{totalAmount}</strong>
            </td>
          </tr>
        </tbody>
      </table>

      <button
        onClick={() => setShowPie(!showPie)}
        style={{ marginTop: "20px" }}
      >
        {showPie ? "Hide Pie Chart" : "Show Pie Chart"}
      </button>

      {showPie && (
        <PieChart width={400} height={400} style={{ marginTop: "20px" }}>
          <Pie
            data={Object.entries(totals).map(([key, value]) => ({
              name: key,
              value,
            }))}
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {Object.keys(totals).map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      )}
    </div>
  );
}

export default BudgetComparison;
