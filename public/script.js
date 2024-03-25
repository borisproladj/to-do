document.addEventListener("DOMContentLoaded", function () {
  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const todoList = document.getElementById("todo-list");

  // Fetch tasks from backend
  fetchTasks();

  todoForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const todoText = todoInput.value.trim();
    if (todoText !== "") {
      addTask(todoText);
      todoInput.value = "";
    }
  });

  async function fetchTasks() {
    const response = await fetch("http://localhost:8080/api/tasks"); // Use the correct URL for your local server
    const tasks = await response.json();
    tasks.forEach((task) => addTaskToList(task));
  }

  async function addTask(text) {
    const response = await fetch("http://localhost:8080/api/tasks", {
      // Use the correct URL for your local server
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    const task = await response.json();
    addTaskToList(task);
  }

  async function deleteTask(id) {
    await fetch(`http://localhost:8080/api/tasks/${id}`, { method: "DELETE" }); // Use the correct URL for your local server
    document.getElementById(id).remove();
  }

  function addTaskToList(task) {
    const taskItem = document.createElement("li");
    taskItem.id = task._id;
    taskItem.innerText = task.text;
    taskItem.classList.toggle("completed", task.completed);
    taskItem.addEventListener("click", function () {
      taskItem.classList.toggle("completed");
      updateTaskStatus(task._id, !task.completed);
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.classList.add("delete-btn");
    deleteButton.addEventListener("click", function (event) {
      event.stopPropagation(); // Prevent task item click event from firing
      deleteTask(task._id);
    });

    taskItem.appendChild(deleteButton);
    todoList.appendChild(taskItem);
  }

  async function updateTaskStatus(id, completed) {
    await fetch(`http://localhost:8080/api/tasks/${id}`, {
      // Use the correct URL for your local server
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed }),
    });
  }
});
