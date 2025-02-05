require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// ✅ Automatically create the `users` table if it doesn't exist
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL
  );
`;

pool
  .query(createTableQuery)
  .then(() => console.log("✅ Users table is ready"))
  .catch((err) => console.error("❌ Error creating table:", err));

// ✅ API: Get 20 Users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id LIMIT 20");

    // Process data: Convert date_of_birth to IST & calculate age
    const usersWithIST = result.rows.map((user) => {
      const dobUTC = new Date(user.date_of_birth); // Date from DB (UTC)

      // ✅ Convert UTC → IST
      const dobIST = new Intl.DateTimeFormat("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Kolkata",
      }).format(dobUTC);

      // ✅ Calculate age from IST date
      const todayIST = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );
      let age = todayIST.getFullYear() - dobUTC.getFullYear();

      // ✅ Adjust age if birthday hasn't occurred yet this year
      if (
        todayIST.getMonth() < dobUTC.getMonth() ||
        (todayIST.getMonth() === dobUTC.getMonth() &&
          todayIST.getDate() < dobUTC.getDate())
      ) {
        age--;
      }

      return {
        ...user,
        age, // ✅ Correctly calculated age
        date_of_birth: dobIST, // ✅ Converted to IST (e.g., "28 July 2003")
      };
    });

    res.json(usersWithIST);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ API: Insert a New User
app.post("/users", async (req, res) => {
  const { name, date_of_birth } = req.body;
  if (!name || !date_of_birth) {
    return res
      .status(400)
      .json({ error: "Name and Date of Birth are required" });
  }

  try {
    await pool.query(
      "INSERT INTO users (name, date_of_birth) VALUES ($1, $2)",
      [name, date_of_birth]
    );
    res.status(201).json({ message: "User added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ API: Delete a User (Fixed)
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Check if user exists
    const userCheck = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete user
    await pool.query("DELETE FROM users WHERE id = $1", [id]);

    // Reorder IDs sequentially
    const users = await pool.query("SELECT id FROM users ORDER BY id ASC");
    for (let i = 0; i < users.rows.length; i++) {
      await pool.query("UPDATE users SET id = $1 WHERE id = $2", [
        i + 1,
        users.rows[i].id,
      ]);
    }

    // Reset the auto-increment sequence
    await pool.query(
      "SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1), false);"
    );

    return res.json({ message: "User deleted and IDs reordered!" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () =>
  console.log(`🚀 Dashboard backend running on port ${PORT}`)
);
