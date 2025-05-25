// controllers/travelLogController.js
const db = require("../models/db");

// Get all logs for a specific user
exports.getAllLogs = (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: "Missing user_id in query" });
  }

  db.query(
    "SELECT * FROM travel_logs WHERE user_id = ?",
    [user_id],
    (err, rows) => {
      if (err) {
        console.error("Error fetching travel logs:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.json(rows);
    }
  );
};

// Create new log
exports.createLog = (req, res) => {
  const { user_id, title, description, startDate, endDate, tags } = req.body;
  const postDate = new Date();
  const tagsString = Array.isArray(tags) ? tags.join(", ") : tags;

  if (!user_id) {
    return res.status(400).json({ message: "Missing user_id" });
  }

  const query =
    "INSERT INTO travel_logs (user_id, title, description, startDate, endDate, post_date, tags) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [
    user_id,
    title,
    description,
    startDate,
    endDate,
    postDate,
    tagsString,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error creating travel log:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(201).json({
      id: result.insertId,
      message: "Travel log created successfully",
    });
  });
};

// Update existing log
exports.updateLog = (req, res) => {
  const { id } = req.params;
  const { title, description, startDate, endDate, tags } = req.body;
  const postDate = new Date();

  const query =
    "UPDATE travel_logs SET title = ?, description = ?, startDate = ?, endDate = ?, post_date = ?, tags = ? WHERE id = ?";
  const values = [title, description, startDate, endDate, postDate, tags, id];

  db.query(query, values, (err) => {
    if (err) {
      console.error("Error updating travel log:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json({ message: "Travel log updated successfully", id });
  });
};

// Delete log
exports.deleteLog = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM travel_logs WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("Error deleting travel log:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    res.json({ message: "Travel log deleted successfully", id });
  });
};
