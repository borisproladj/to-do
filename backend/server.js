const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv").config( {path: '../public/.env'});

const app = express();
const PORT = process.env.PORT || 8080;
const uri = process.env.MONGODB_URI; // Replace with your MongoDB URI

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

let db; // Global variable to hold the database connection
const dbName = "to-do"; // Replace with your database name
const collectionName = "tasks"; // Replace with your collection name

// Connect to MongoDB
MongoClient.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    console.log("Connected to MongoDB");
    db = client.db(dbName); // Save database connection
  })
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Routes
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await db.collection(collectionName).find({}).toArray();
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/tasks", async (req, res) => {
  const { text } = req.body;
  const newTask = { text, completed: false };

  try {
    const result = await db.collection(collectionName).insertOne(newTask);
    newTask._id = result.insertedId; // Assign MongoDB generated _id
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/api/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  const { completed } = req.body;

  try {
    const result = await db.collection(collectionName).updateOne(
      { _id: new ObjectId(taskId) }, // Fix here
      { $set: { completed: completed } }
    );
    if (result.modifiedCount === 1) {
      res.json({ message: "Task updated" });
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  const taskId = req.params.id;

  try {
    const result = await db
      .collection(collectionName)
      .deleteOne({ _id: new ObjectId(taskId) }); // Fix here
    if (result.deletedCount === 1) {
      res.json({ message: "Task deleted" });
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
