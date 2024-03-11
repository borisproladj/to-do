const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static("public"));

app.use(express.json()); // Middleware to parse JSON requests

// Store tasks in memory
let tasks = [];

// Routes
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const { text } = req.body;
  const newTask = { id: generateId(), text, completed: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter((task) => task.id !== id);
  res.json({ message: "Task deleted" });
});

// Generate unique ID for tasks
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
