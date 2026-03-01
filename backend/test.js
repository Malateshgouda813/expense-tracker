import dotenv from "dotenv";
import pkg from "pg";
dotenv.config();
// Create connection pool
const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URI,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

async function testDatabase() {
  try {
    console.log("Connecting to Supabase...");

    // Test connection
    await pool.query("SELECT NOW()");
    console.log("Connected successfully ✅");

    // Insert test user
    const userResult = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      ["Test User", "testuser@gmail.com", "123456"]
    );

    console.log("User Inserted:", userResult.rows[0]);

    const userId = userResult.rows[0].id;

    // Insert test expense
    const expenseResult = await pool.query(
      "INSERT INTO expenses (title, amount, user_id) VALUES ($1, $2, $3) RETURNING *",
      ["Test Expense", 500, userId]
    );

    console.log("Expense Inserted:", expenseResult.rows[0]);

    // Fetch users
    const users = await pool.query("SELECT * FROM users");
    console.log("All Users:", users.rows);

    // Fetch expenses
    const expenses = await pool.query("SELECT * FROM expenses");
    console.log("All Expenses:", expenses.rows);

    console.log("Database test completed 🎉");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await pool.end();
  }
}

testDatabase();