import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [filter, setFilter] = useState("month");

  const navigate = useNavigate();

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add expense
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    await API.post("/expenses", { title, amount });
    setTitle("");
    setAmount("");
    fetchExpenses();
  };

  // Delete expense
  const handleDelete = async (id) => {
    await API.delete(`/expenses/${id}`);
    fetchExpenses();
  };



  const total = expenses.reduce(
    (acc, curr) => acc + Number(curr.amount),
    0
  );

  // FILTER
  const filterExpenses = () => {
    const now = new Date();

    return expenses.filter((exp) => {
      if (!exp.created_at) return true;

      const expenseDate = new Date(exp.created_at);

      if (filter === "week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return expenseDate >= oneWeekAgo;
      }

      if (filter === "month") {
        return (
          expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear()
        );
      }

      if (filter === "year") {
        return expenseDate.getFullYear() === now.getFullYear();
      }

      return true;
    });
  };

  const filteredTotal = filterExpenses().reduce(
    (acc, curr) => acc + Number(curr.amount),
    0
  );

  const chartData = () => {
    const filtered = filterExpenses();
    const grouped = {};

    filtered.forEach((exp) => {
      const date = new Date(exp.created_at);
      const key =
        filter === "year"
          ? date.toLocaleString("default", { month: "short" })
          : date.toLocaleDateString();

      if (!grouped[key]) grouped[key] = 0;
      grouped[key] += Number(exp.amount);
    });

    return Object.keys(grouped).map((key) => ({
      name: key,
      amount: grouped[key],
    }));
  };

  // Download CSV
  const downloadCSV = () => {
    const header = "Title,Amount\n";
    const rows = expenses
      .map((exp) => `${exp.title},${exp.amount}`)
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();
  };

  return (
    <div className="dashboard-container">
      {/* LEFT PANEL */}
      <div className="left-panel">
        <h2>Dashboard</h2>
        <h3>Total: ₹ {total}</h3>

        <form onSubmit={handleAdd} className="expense-form">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button type="submit" className="add-btn">
            Add Expense
          </button>
        </form>

        <ul className="expense-list">
          {expenses.map((exp) => (
            <li key={exp.id}>
              <span>
                {exp.title} - ₹ {exp.amount}
              </span>
              <button
                className="delete-btn"
                onClick={() => handleDelete(exp.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        <div className="bottom-buttons">
          <button className="download-btn" onClick={downloadCSV}>
            Download Expenses
          </button>

         <button className="logout-btn"
          onClick={() => {
          localStorage.removeItem("token");
         navigate("/home");
  }}
>
   Log Out
</button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <h3>Expense Analysis</h3>
        <h4>Filtered Total: ₹ {filteredTotal}</h4>

        <div className="filter-buttons">
          <button
            className="filter-btn"
            onClick={() => setFilter("week")}
          >
            Week
          </button>
          <button
            className="filter-btn"
            onClick={() => setFilter("month")}
          >
            Month
          </button>
          <button
            className="filter-btn"
            onClick={() => setFilter("year")}
          >
            Year
          </button>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#476a50" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;