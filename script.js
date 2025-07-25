let taskList = JSON.parse(localStorage.getItem("tasklist")) || [];

const inputs = document.querySelectorAll("input");
const taskPriority = document.querySelector("select");
const addTaskBtn = document.getElementById("add_item");
const futureTodos = document.getElementById("FutureList");
const todaysTodo = document.getElementById("TodayList");
const completeTodos = document.getElementById("completedList");
const completeBtn = document.querySelector(".complete");

addTaskBtn.addEventListener("click", addTask);
futureTodos.addEventListener("click", handleCompletedTask);
todaysTodo.addEventListener("click", handleCompletedTask);
futureTodos.addEventListener("click", deleteTask);
todaysTodo.addEventListener("click", deleteTask);
completeTodos.addEventListener("click", deleteTask);

const deadlineInput = document.getElementById("date_field");

deadlineInput.addEventListener("focus", () => {
  deadlineInput.type = "date";
});

document.addEventListener("click", (e) => {
  const isInput = e.target === deadlineInput;
  const isBody = e.target === document.body;

  if (!isInput && isBody) {
    if (deadlineInput.type === "date") {
      deadlineInput.type = "text";
      deadlineInput.placeholder = "Deadline";
    }
  }
});

function addTask() {
  if (!inputs[0].value || !inputs[1].value || !taskPriority.value) {
    return;
  }
  let task = inputs[0].value;
  let inputDate = new Date(inputs[1].value);
  let Priority = taskPriority.value;

  let todayDate = new Date();
  inputDate.setHours(0, 0, 0, 0);
  todayDate.setHours(0, 0, 0, 0);

  let newTask = {
    id: taskList.length + 1,
    name: task,
    date: inputDate.toISOString(),
    priority: Priority,
    complete: false,
  };

  if (inputDate.getTime() === todayDate.getTime()) {
    taskList.push(newTask);
    localStorage.setItem("tasklist", JSON.stringify(taskList));
    renderTodayList(filterTodayTasks(taskList));
  } else if (inputDate.getTime() > todayDate.getTime()) {
    taskList.push(newTask);
    localStorage.setItem("tasklist", JSON.stringify(taskList));
    renderFutureList(filterFutureTasks(taskList));
  } else {
    alert("Date must be today or future");
  }
}

function handleCompletedTask(e) {
  if (!e.target.classList.contains("complete")) return;

  const taskId = Number(e.target.getAttribute("data-id"));
  const completedTask = taskList[taskId - 1];

  if (completedTask) {
    completedTask.complete = true;
    localStorage.setItem("tasklist", JSON.stringify(taskList));

    renderCompletedList(filterCompletedTasks(taskList));
    renderTodayList(filterTodayTasks(taskList));
    renderFutureList(filterFutureTasks(taskList));
  }
}
function deleteTask(e) {
  if (!e.target.classList.contains("delete")) return;

  let id = Number(e.target.getAttribute("data-id"));
  taskList = taskList.filter((task) => task.id !== id);
  localStorage.setItem("tasklist", JSON.stringify(taskList));
  renderCompletedList(filterCompletedTasks(taskList));
  renderFutureList(filterFutureTasks(taskList));
  renderTodayList(filterTodayTasks(taskList));
}

function filterTodayTasks(tasks) {
  const filteredTasks = tasks.filter((task) => {
    let todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    let taskDate = new Date(task.date);
    taskDate.setHours(0, 0, 0, 0);
    return (
      todayDate.getTime() === taskDate.getTime() && task.complete === false
    );
  });
  return filteredTasks;
}

function filterFutureTasks(tasks) {
  const filteredTasks = tasks.filter((task) => {
    let todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    let taskDate = new Date(task.date);
    taskDate.setHours(0, 0, 0, 0);
    return (
      task.complete === false &&
      (taskDate.getTime() > todayDate.getTime() ||
        taskDate.getTime() < todayDate.getTime())
    );
  });

  return filteredTasks;
}

function filterCompletedTasks(tasks) {
  const filteredTasks = tasks.filter((task) => task.complete === true);
  return filteredTasks;
}

function renderTodayList(tasks) {
  todaysTodo.innerHTML = "<h2>Today's TodoList</h2>";
  tasks.forEach((task, index) => {
    const displayDate = new Date(task.date).toLocaleDateString("en-GB");
    todaysTodo.innerHTML += `<div>
    <p>${index + 1}. ${task.name}</p>
    <p>${displayDate}</p>
    <p>Priority: ${task.priority}</p>
    <div id="icons">
         <img
        src="https://surjeet-todo-list.netlify.app/img/check-circle%201.png" class="complete" data-id=${
          task.id
        }
      />   
      <img
        src="https://surjeet-todo-list.netlify.app/img/trash%201.png" class="delete" data-id=${
          task.id
        }
      />
    </div>
    </div>`;
  });
}

function renderFutureList(tasks) {
  futureTodos.innerHTML = "<h2>Future TodoList</h2>";
  tasks.forEach((task, index) => {
    const displayDate = new Date(task.date).toLocaleDateString("en-GB");
    futureTodos.innerHTML += `<div>
    <p>${index + 1}. ${task.name}</p>
    <p>${displayDate}</p>
    <p>Priority: ${task.priority}</p>
    <div id="icons">
     <img
        src="https://surjeet-todo-list.netlify.app/img/check-circle%201.png" class="complete" data-id=${
          task.id
        }
      />
      <img
        src="https://surjeet-todo-list.netlify.app/img/trash%201.png" class="delete" data-id=${
          task.id
        }
      />
    </div>
    </div>`;
  });
}

function renderCompletedList(tasks) {
  completeTodos.innerHTML = " <h2>Completed TodoList</h2>";
  tasks.forEach((task, index) => {
    const displayDate = new Date(task.date).toLocaleDateString("en-GB");
    completeTodos.innerHTML += `<div id="finished">
    <p>${index + 1}. ${task.name}</p>
    <p>${displayDate}</p>
    <p>Priority: ${task.priority}</p>
    <div id="icons">
      <img
        src="https://surjeet-todo-list.netlify.app/img/2.png" class="delete" data-id=${
          task.id
        }
      />
    </div>
    </div>
    `;
  });
}

window.onload = () => {
  const tasks = JSON.parse(localStorage.getItem("tasklist"));
  renderTodayList(filterTodayTasks(tasks));
  renderFutureList(filterFutureTasks(tasks));
  renderCompletedList(filterCompletedTasks(tasks));
};
