import React from "react";
import useJourneyPlans from "../hooks-firebase/useJourneyPlans";
import { formatDateDMY } from "../hooks/formatDate";
import JourneyPlansLayout from "../hooks/JourneyPlansLayout";

export default function JourneyPlans() {
  const {
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
  } = useJourneyPlans();

  return (
    <JourneyPlansLayout
      plans={plans}
      newPlan={newPlan}
      setNewPlan={setNewPlan}
      editedPlan={editedPlan}
      setEditedPlan={setEditedPlan}
      editingId={editingId}
      handleNewChange={handleNewChange}
      handleEditChange={handleEditChange}
      addPlan={addPlan}
      startEditing={startEditing}
      cancelEditing={cancelEditing}
      saveEdit={saveEdit}
      deletePlan={deletePlan}
      activityOptions={activityOptions}
      formatDate={formatDateDMY}
    />
  );
}
