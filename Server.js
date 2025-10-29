const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const path = require("path");


const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));


// Serve the index.html file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"index.html"));
});


// PostgreSQL connection
const pool = new Pool({
  user: "postgres",         
  host: "localhost",
  database: "User",         
  password: "IMSOSAD",  
  port: 5432,
});

// ✅ Root route to verify server
app.get("/", (req, res) => {
  res.send("✅ Server is running and connected to PostgreSQL!");
});

// ✅ Auto-create users table
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255)
      );
    `);
    console.log("✅ Users table is ready");
  } catch (err) {
    console.error("❌ Table creation error:", err.message);
    throw err;
  }
}

// Signup route
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );
    res.status(201).json({ message: "✅ User registered successfully", user: result.rows[0] });
  } catch (err) {
    console.error("❌ Signup error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: "❌ Invalid email or password" });

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: "❌ Invalid email or password" });

    res.json({ message: "✅ Login successful" });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ Start server after DB connection
(async () => {
  try {
    console.log("🔄 Connecting to PostgreSQL...");
    await pool.connect();
    console.log("✅ Connected to PostgreSQL");
    await initDB();
    app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
  } catch (err) {
    console.error("❌ Fatal DB connection error:", err.message);
    process.exit(1);
  }
})();