import React, { useState } from "react";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";

export default function BudgetRowModal({
  isOpen,
  onRequestClose,
  category,
  currentAmount,
  onSave,
  onDelete,
}) {
  const [newAmount, setNewAmount] = useState(currentAmount || "");

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <form
        className="add-form"
        onSubmit={(e) => {
          e.preventDefault();
          onSave(newAmount);
          onRequestClose();
        }}
      >
        <h3>Edit Category: {category}</h3>
        <input
          type="number"
          value={newAmount}
          onChange={(e) => setNewAmount(e.target.value)}
          placeholder="New total amount"
          required
        />
        <div className="modal-actions">
          <button type="submit">
            <FaCheck />
          </button>
          <button type="button" onClick={onRequestClose}>
            <FaTimes />
          </button>
          <button
            type="button"
            onClick={() => {
              onDelete();
              onRequestClose();
            }}
          >
            <FaTrash />
          </button>
        </div>
      </form>
    </div>
  );
}
