const API = "http://localhost:3000/tasks";

// Load theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

// Toggle theme
function toggleTheme() {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme",
        document.body.classList.contains("dark") ? "dark" : "light"
    );
}

// Fetch tasks (API + backup)
async function fetchTasks() {
    try {
        const res = await fetch(API);
        const tasks = await res.json();
        localStorage.setItem("tasks_backup", JSON.stringify(tasks));
        renderTasks(tasks);
    } catch {
        const backup = JSON.parse(localStorage.getItem("tasks_backup")) || [];
        renderTasks(backup);
    }
}

// Render UI
function renderTasks(tasks) {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");

        if (task.completed) li.classList.add("completed");

        li.innerHTML = `
            <div>
                <input type="checkbox" ${task.completed ? "checked" : ""}
                onchange="toggleComplete(${task.id})">
                <span>${task.text}</span>
            </div>

            <div class="actions">
                <button class="edit-btn" onclick="editTask(${task.id}, '${task.text}')">Edit</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;

        list.appendChild(li);
    });
}

// Add
async function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();

    if (!text) return;

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, completed: false })
    });

    input.value = "";
    fetchTasks();
}

// Delete
async function deleteTask(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchTasks();
}

// Edit
async function editTask(id, oldText) {
    const newText = prompt("Edit:", oldText);
    if (!newText) return;

    await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText })
    });

    fetchTasks();
}

// Toggle complete
async function toggleComplete(id) {
    const res = await fetch(API);
    const tasks = await res.json();

    const task = tasks.find(t => t.id === id);

    await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            text: task.text,
            completed: !task.completed
        })
    });

    fetchTasks();
}

// Init
fetchTasks();