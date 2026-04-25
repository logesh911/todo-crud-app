const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const filePath = "./tasks.json";

// Helper function
const readTasks = () => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

const writeTasks = (tasks) => {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};

// GET all tasks
app.get("/tasks", (req, res) => {
    res.json(readTasks());
});

// ADD task
app.post("/tasks", (req, res) => {
    const tasks = readTasks();

    const newTask = {
        id: Date.now(),
        text: req.body.text,
        completed: req.body.completed || false
    };

    tasks.push(newTask);
    writeTasks(tasks);

    res.json(newTask);
});
// UPDATE task
app.put("/tasks/:id", (req, res) => {
    let tasks = readTasks();

    tasks = tasks.map(task =>
        task.id == req.params.id
            ? {
                ...task,
                text: req.body.text ?? task.text,
                completed: req.body.completed ?? task.completed
              }
            : task
    );

    writeTasks(tasks);
    res.json({ message: "Updated" });
});
// DELETE task
app.delete("/tasks/:id", (req, res) => {
    let tasks = readTasks();
    tasks = tasks.filter(task => task.id != req.params.id);
    writeTasks(tasks);
    res.json({ message: "Deleted" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});