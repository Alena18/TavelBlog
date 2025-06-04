import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiEdit3 } from "react-icons/fi";
import { FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import ReceiptUploadModal from "./ReceiptUploadModal";
import useJourneyPlanDetails from "../hooks-firebase/useJourneyPlanDetails";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../App.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF"];

export default function TravelPlanDetails() {
  const { planId } = useParams();
  const {
    plan,
    receipts,
    addReceipt,
    deleteReceipt,
    updateReceipt,
    newReceipt,
    handleNewReceiptChange,
    fetchReceipts,
  } = useJourneyPlanDetails(planId);

  const [showModal, setShowModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingAmount, setEditingAmount] = useState(0);
  const [comparePlanId, setComparePlanId] = useState("");
  const [compareTotals, setCompareTotals] = useState({});
  const [allPlans, setAllPlans] = useState([]);
  const [comparePlanName, setComparePlanName] = useState("");

  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  useEffect(() => {
    const fetchPlans = async () => {
      const snapshot = await getDocs(collection(db, "journeyPlans"));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAllPlans(list);
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    if (comparePlanId) {
      fetchCompareData(comparePlanId);
    }
  }, [comparePlanId]);

  const fetchCompareData = async (id) => {
    const q = query(collection(db, "receipts"), where("planId", "==", id));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => doc.data());

    const totals = {};
    data.forEach((r) => {
      const cat = capitalizeFirst(r.category);
      totals[cat] = (totals[cat] || 0) + r.amount;
    });

    setCompareTotals(totals);
    const found = allPlans.find((p) => p.id === id);
    setComparePlanName(found?.name || "Other Holiday");
  };

  const categoryTotals = receipts.reduce((acc, r) => {
    const cap = capitalizeFirst(r.category);
    acc[cap] = (acc[cap] || 0) + r.amount;
    return acc;
  }, {});

  const totalBudget = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
  const compareTotal = Object.values(compareTotals).reduce((a, b) => a + b, 0);
  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  const allCategories = Array.from(
    new Set([...Object.keys(categoryTotals), ...Object.keys(compareTotals)])
  );

  const openEditModal = (category, totalAmount) => {
    setEditingCategory(category);
    setEditingAmount(totalAmount);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (newAmount) => {
    const oldTotal = categoryTotals[editingCategory];
    const factor = newAmount / oldTotal;

    receipts
      .filter((r) => capitalizeFirst(r.category) === editingCategory)
      .forEach((r) => {
        const updated = parseFloat((r.amount * factor).toFixed(2));
        updateReceipt(r.id, { ...r, amount: updated });
      });
  };

  const handleDeleteCategory = () => {
    receipts
      .filter((r) => capitalizeFirst(r.category) === editingCategory)
      .forEach((r) => {
        deleteReceipt(r.id);
      });
  };

  const handleCapitalizedReceipt = (e) => {
    const { name, value } = e.target;
    const transformed = name === "category" ? capitalizeFirst(value) : value;
    handleNewReceiptChange({ target: { name, value: transformed } });
  };

  if (!plan) return <p>Loading plan details...</p>;

  return (
    <div className="dashboard container py-4">
      <h2>{plan.name} — Budget Details</h2>

      <div
        style={{
          background: "#f5f0ff",
          borderRadius: "12px",
          padding: "15px",
          marginBottom: "15px",
          maxWidth: "450px",
          margin: "0 auto 20px auto",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <p>
          <strong>Locations:</strong>{" "}
          {Array.isArray(plan.locations)
            ? plan.locations.join(", ")
            : plan.locations}
        </p>
        <p>
          <strong>Start Date:</strong> {plan.startDate}
        </p>
        <p>
          <strong>End Date:</strong> {plan.endDate}
        </p>
        <p>
          <strong>Activities:</strong>{" "}
          {Array.isArray(plan.activities)
            ? plan.activities.join(", ")
            : plan.activities}
        </p>
        <p>
          <strong>Description:</strong> {plan.description}
        </p>
      </div>

      <div
        className="add-form"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "800px",
          margin: "0 auto 20px auto",
          padding: "20px",
          background: "white",
          borderRadius: "12px",
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addReceipt();
          }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr auto",
            gap: "10px",
            width: "100%",
          }}
        >
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={newReceipt.amount}
            onChange={handleCapitalizedReceipt}
            required
          />
          <select
            name="category"
            value={newReceipt.category}
            onChange={handleCapitalizedReceipt}
            required
          >
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Drink">Drink</option>
            <option value="Shopping">Shopping</option>
            <option value="Attractions">Attractions</option>
            <option value="Transport">Transport</option>
          </select>
          <button type="submit" className="btn-save">
            Add Receipt
          </button>
        </form>
        <br />
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <button
            type="button"
            className="btn-save"
            onClick={() => setShowModal(true)}
          >
            Upload / Scan Receipt
          </button>
        </div>
      </div>

      <table className="form-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount (€)</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(categoryTotals).map(([category, total]) => (
            <tr key={category}>
              <td>{category}</td>
              <td>{total.toFixed(2)}</td>
              <td className="action-buttons">
                <button onClick={() => openEditModal(category, total)}>
                  <FiEdit3 />
                </button>
                <button
                  onClick={() => {
                    setEditingCategory(category);
                    handleDeleteCategory();
                  }}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td style={{ fontWeight: "bold" }}>Total</td>
            <td style={{ fontWeight: "bold" }}>{totalBudget.toFixed(2)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>

      {/* Pie chart & Comparison table */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "stretch", // ensures both blocks match height
          gap: "20px",
          marginTop: "40px",
        }}
      >
        <div
          style={{
            flex: "1 1 45%",
            maxWidth: "45%",
            minWidth: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          <h3 className="text-center">Category Breakdown</h3>
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <PieChart width={300} height={400}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="55%"
                outerRadius="65%"
                label
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="horizontal"
                align="center"
                wrapperStyle={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              />
            </PieChart>
          </div>
        </div>

        <div
          style={{
            flex: "1 1 45%",
            maxWidth: "45%",
            minWidth: "300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            boxSizing: "border-box",
          }}
        >
          <h3>Compare with Another Holiday</h3>
          <select
            className="form-select mb-3"
            style={{
              width: "90%",
              boxSizing: "border-box",
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "1rem",
            }}
            value={comparePlanId}
            onChange={(e) => setComparePlanId(e.target.value)}
          >
            <option value="">Select Holiday</option>
            {allPlans
              .filter((p) => p.id !== planId)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
          </select>

          <div
            style={{
              overflowX: "auto",
              width: "90%",
              boxSizing: "border-box",
              flex: "1",
              marginTop: "20px",
            }}
          >
            {comparePlanId ? (
              <table
                className="form-table"
                style={{
                  fontSize: "0.85rem",
                  width: "100%",
                  tableLayout: "fixed",
                  wordWrap: "break-word",
                }}
              >
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>{comparePlanName} (€)</th>
                    <th>{plan.name} (€)</th>
                  </tr>
                </thead>
                <tbody>
                  {allCategories.map((cat) => (
                    <tr key={cat}>
                      <td>{cat}</td>
                      <td>{compareTotals[cat]?.toFixed(2) || "0.00"}</td>
                      <td>{categoryTotals[cat]?.toFixed(2) || "0.00"}</td>
                    </tr>
                  ))}
                  <tr style={{ fontWeight: "bold" }}>
                    <td>Total</td>
                    <td>{compareTotal.toFixed(2)}</td>
                    <td>{totalBudget.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div style={{ flex: "1" }}></div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <ReceiptUploadModal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          planId={planId}
          refreshReceipts={() => fetchReceipts(planId)}
        />
      )}

      {editModalOpen && (
        <div className="modal-overlay">
          <form
            className="add-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveEdit(parseFloat(editingAmount));
              setEditModalOpen(false);
            }}
          >
            <h3>Edit Category: {editingCategory}</h3>
            <input
              type="number"
              value={editingAmount}
              onChange={(e) => setEditingAmount(e.target.value)}
              placeholder="New total amount"
              required
            />
            <div className="modal-actions">
              <button type="submit">
                <FaCheck />
              </button>
              <button type="button" onClick={() => setEditModalOpen(false)}>
                <FaTimes />
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDeleteCategory();
                  setEditModalOpen(false);
                }}
              >
                <FaTrash />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
