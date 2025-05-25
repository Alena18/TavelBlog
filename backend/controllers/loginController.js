const db = require("../models/db");
const bcrypt = require("bcryptjs");

// LOGIN FUNCTION
exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        address: user.address,
      },
    });
  });
};

// SIGNUP FUNCTION
exports.signupUser = (req, res) => {
  const { username, password, email, address } = req.body;

  if (!username || !password || !email || !address) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters" });
  }

  const checkSql = "SELECT * FROM users WHERE username = ?";
  db.query(checkSql, [username], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length > 0) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertSql =
      "INSERT INTO users (username, password, email, address) VALUES (?, ?, ?, ?)";
    db.query(
      insertSql,
      [username, hashedPassword, email, address],
      (insertErr, insertResult) => {
        if (insertErr)
          return res.status(500).json({ error: "Error creating user" });

        return res.status(201).json({
          message: "User created successfully",
          user: { username, email, address },
        });
      }
    );
  });
};
