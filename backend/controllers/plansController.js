// controllers/plansController.js
const db = require("../models/db");

// Get all plans for a specific user
exports.getAllPlans = (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: "Missing user_id in query" });
  }

  const query = "SELECT * FROM journey_plans WHERE user_id = ?";
  db.query(query, [user_id], (err, rows) => {
    if (err) {
      console.error("Error fetching plans:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    const parsed = rows.map((plan) => ({
      ...plan,
      locations: JSON.parse(plan.locations || "[]"),
      activities: JSON.parse(plan.activities || "[]"),
    }));

    res.json(parsed);
  });
};

// Create new plan
exports.createPlan = (req, res) => {
  const {
    name,
    locations,
    startDate,
    endDate,
    activities,
    description,
    user_id,
  } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: "Missing required field: user_id" });
  }

  db.query(
    `INSERT INTO journey_plans 
     (name, locations, startDate, endDate, activities, description, user_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      JSON.stringify(locations),
      startDate,
      endDate,
      JSON.stringify(activities),
      description,
      user_id,
    ],
    (err, result) => {
      if (err) {
        console.error("Error creating plan:", err);
        return res
          .status(500)
          .json({ message: "Internal server error", error: err.message });
      }

      const newPlan = {
        id: result.insertId,
        name,
        locations,
        startDate,
        endDate,
        activities,
        description,
        user_id,
      };

      res.status(201).json(newPlan);
    }
  );
};

// Update existing plan
exports.updatePlan = (req, res) => {
  const { id } = req.params;
  const { name, locations, startDate, endDate, activities, description } =
    req.body;

  const start = startDate?.slice(0, 10);
  const end = endDate?.slice(0, 10);

  db.query(
    `UPDATE journey_plans SET 
      name = ?, 
      locations = ?, 
      startDate = ?, 
      endDate = ?, 
      activities = ?, 
      description = ?
     WHERE id = ?`,
    [
      name,
      JSON.stringify(locations),
      start,
      end,
      JSON.stringify(activities),
      description,
      id,
    ],
    (err) => {
      if (err) {
        console.error("Error updating plan:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      res.json({
        message: "Plan updated successfully",
        updatedPlan: {
          id: Number(id),
          name,
          locations,
          startDate: start,
          endDate: end,
          activities,
          description,
        },
      });
    }
  );
};

// Delete plan
exports.deletePlan = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM journey_plans WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("Error deleting plan:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    res.json({ message: "Plan deleted successfully", id });
  });
};
