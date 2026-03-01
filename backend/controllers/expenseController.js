import pool from "../config/db.js";

export const addExpense = async (req, res) => {
  const { title, amount } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO expenses (title, amount, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, amount, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM expenses WHERE user_id=$1 ORDER BY created_at DESC",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM expenses WHERE id=$1 AND user_id=$2",
      [req.params.id, req.user.id]
    );

    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};