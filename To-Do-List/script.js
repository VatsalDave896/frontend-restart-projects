let inputBox = document.querySelector(".user-task");
let addTaskBtn = document.querySelector(".add-btn");
let deleteAllTaskBtn = document.querySelector(".delete-all-btn");
let tasksContainer = document.querySelector(".tasks-container");

window.addEventListener("DOMContentLoaded", () => {
  tasksContainer.innerHTML = localStorage.getItem("tasks") || "";
  addDeleteListeners();
});

addTaskBtn.addEventListener("click", () => {
  if (inputBox.value.trim() === "") {
    alert("Enter task first !!");
    return;
  }

  let userTask = document.createElement("li");

  userTask.innerHTML = `
    ${inputBox.value}
    <button class="doneBtn">Done</button>
    <button class="deleteBtn">Delete task</button>
  `;

  tasksContainer.appendChild(userTask);
  inputBox.value = "";

  saveTasks();
  addDeleteListeners();
});

deleteAllTaskBtn.addEventListener("click", () => {
  if (tasksContainer.children.length > 0) {
    let confirmClear = confirm("Delete ALL tasks? This cannot be undone!");

    if (confirmClear) {
      tasksContainer.innerHTML = "";
      saveTasks();
    }
  } else {
    alert("No tasks here!!");
  }
});

function saveTasks() {
  localStorage.setItem("tasks", tasksContainer.innerHTML);
}

function addDeleteListeners() {
  let deleteButtons = document.querySelectorAll(".deleteBtn");
  let doneButtons = document.querySelectorAll(".doneBtn");

  deleteButtons.forEach((btn) => {
    btn.onclick = function () {
      let confirmDelete = confirm("Are you sure you want to delete this task?");

      if (confirmDelete) {
        btn.parentElement.remove();
        saveTasks();
      }
    };
  });

  doneButtons.forEach((btn) => {
    let task = btn.parentElement;

    if (task.classList.contains("completed")) {
      btn.disabled = true;
      task.querySelector(".deleteBtn").disabled = true;
    }

    btn.onclick = function () {
      task.classList.add("completed");

      btn.disabled = true;
      task.querySelector(".deleteBtn").disabled = true;

      saveTasks();
    };
  });;
}
