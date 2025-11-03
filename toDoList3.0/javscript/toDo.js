// ================= USER HEADING =================
document.getElementById("userid").textContent = JSON.parse(
  localStorage.getItem("loginUser")
);

// ================= GLOBAL VARIABLES =================
let taskList = [];
let index = 1;
let editId = null;
let rowsPerPage = 5;
let currentPage = 1;                            

// ================= LOAD EXISTING DATA =================
let storedUser = JSON.parse(localStorage.getItem("user")) || [];
taskList = storedUser;
if (taskList.length > 0) {
  index = taskList[taskList.length - 1].id + 1;
}
renderList();

// ================= LOGOUT =================
document.getElementById("logoutbtn").addEventListener("click", () => {
  let userResponse = confirm("Are you sure you want to Logout? ")
  if (userResponse) {
    window.location.href = "/html/login.html";
  }
});

// ================= ADD TASK BUTTON =================
document.getElementById("addTaskBtn").addEventListener("click", () => {
  let inputtask = document.getElementById("inputtaskid");
  let dateTime = document.getElementById("taskDateTime");
  if (inputtask.value === "" || dateTime.value === "") {
    alert("please fill the data");
    clearInpute();

  } else {
    addTask();

  }



});

// ================= DATE & STATUS HANDLING =================
let dateTime = document.getElementById("taskDateTime");
let statusbtn = document.getElementById("addStatus");

dateTime.addEventListener("change", () => {
  let curentDate = new Date().toISOString().split("T")[0];
  let prevData = dateTime.value;

  if (prevData < curentDate) {
    statusbtn.value = "done";
    console.log("done");
  } else {
    statusbtn.value = "pending";
    console.log("pending");
  }
});

// ================= ADD / UPDATE TASK =================
function addTask() {
  let inputtask = document.getElementById("inputtaskid");
  let dateTime = document.getElementById("taskDateTime");
  let statusbtn = document.getElementById("addStatus");
  if (editId >= 0 && editId != null) {
    // update existing task
    let editObj = taskList.find((obj) => obj.id - 1 === editId);
    editObj.taskName = inputtask.value;
    editObj.status = statusbtn.value;
    editObj.dateTime = dateTime.value;
    editId = null;
    saveTask();
    renderList();
    clearInpute();
    document.getElementById("addTaskBtn").textContent = "Add Task";
  } else {
    // create new task
    let taskObj = {
      id: index++,
      taskName: inputtask.value,
      dateTime: dateTime.value,
      status: statusbtn.value,
    };

    taskList.push(taskObj);
    saveTask();
    renderList();
    clearInpute();

    setTimeout(() => {
      // Use Bootstrap 5 modal hide method
      let filterModal = bootstrap.Modal.getInstance(document.getElementById("addTaskModal"));
      filterModal.hide();
    }, 500);


  }
}


// ================= CLEAR INPUT =================
function clearInpute() {
  document.getElementById("inputtaskid").value = "";
  document.getElementById("taskDateTime").value = "";
  document.getElementById("addStatus").value = "pending";
}

// ================= RENDER TABLE =================
function renderList(list = taskList) {
  const tableBody = document.getElementById("taskbody");
  tableBody.innerHTML = "";

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedTask = list.slice(startIndex, endIndex);

  paginatedTask.forEach((pgobj, index) => {
    let newtr = tableBody.insertRow();

    let id = newtr.insertCell(0);
    let task = newtr.insertCell(1);
    let dateTime = newtr.insertCell(2);
    let status = newtr.insertCell(3);
    let actions = newtr.insertCell(4);

    id.textContent = pgobj.id;
    task.textContent = pgobj.taskName;
    dateTime.textContent = pgobj.dateTime;
    status.textContent = pgobj.status;

    let editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.style.backgroundColor = "yellow";
    editBtn.style.margin = "5px";
    editBtn.style.border = "none";
    editBtn.style.borderRadius = "5px";
    editBtn.style.cursor = "pointer";
    editBtn.classList.add("btn", "btn-light  ")
    editBtn.setAttribute("data-bs-toggle", "modal")
    editBtn.setAttribute("data-bs-target", "#addTaskModal")
    editBtn.addEventListener("click", () => {
      edittask(index);
    });

    let deletBtn = document.createElement("button");
    deletBtn.textContent = "Delete";
    deletBtn.style.backgroundColor = "red";
    deletBtn.style.color = "white";
    deletBtn.style.border = "none";
    deletBtn.style.borderRadius = "5px";
    deletBtn.style.cursor = "pointer";
    deletBtn.addEventListener("click", () => {
      deleteArr(pgobj.id, index);
    });

    actions.appendChild(editBtn);
    actions.appendChild(deletBtn);
  });

  renderpagination(list);
}

// ================= RENDER PAGINATION =================
function renderpagination(list = taskList) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";
  const totalPages = Math.ceil(list.length / rowsPerPage);

  if (totalPages === 0) return;

  for (let i = 1; i <= totalPages; i++) {
    const btnPage = document.createElement("button");
    btnPage.textContent = i;
    btnPage.style.margin = "5px";
    btnPage.style.padding = "5px 10px";
    btnPage.style.border = "1px solid #ccc";
    btnPage.style.borderRadius = "4px";
    btnPage.style.cursor = "pointer";
    btnPage.style.marginBlockEnd = "20px";

    if (i === currentPage) {
      btnPage.style.backgroundColor = "#1F2937";
      btnPage.style.color = "#E5E7EB";
    } else {
      btnPage.style.backgroundColor = "#E5E7EB";
      btnPage.style.color = "#1F2937";
    }

    btnPage.addEventListener("click", () => {
      currentPage = i;
      renderList(list);
    });

    paginationContainer.appendChild(btnPage);
  }
}

// ================= EDIT TASK =================
function edittask(id) {
  const task = taskList.find((t) => t.id - 1 === id);
  if (task) {
    document.getElementById("inputtaskid").value = task.taskName;
    document.getElementById("taskDateTime").value = task.dateTime;
    document.getElementById("addStatus").value = task.status;
    editId = id;
    document.getElementById("addTaskBtn").textContent = "Update Task";
  }
}

// ================= DELETE TASK =================
function deleteArr(taskId) {
  let msg = confirm("Are you sure you want to delete this task?");
  if (msg) {
    taskList = taskList.filter((obj) => obj.id !== taskId);
    resetId();
    saveTask();
    renderList();
  } else {
    alert("Cancelled");
  }
}

// ================= SAVE & RESET ID =================
function saveTask() {
  localStorage.setItem("user", JSON.stringify(taskList));
}

function resetId() {
  taskList.forEach((obj, index) => {
    obj.id = index + 1;
  });
  index = taskList.length + 1;
}

function searchTask() {
  const filterFrom = dayjs(document.getElementById("filterFrom").value);
  const filterTo = dayjs(document.getElementById("filterTo").value);
  const filterStatus = document.getElementById("filterStatus").value;

  let filterArray = [];
  taskList.forEach((obj) => {
    let taskTime = dayjs(obj.dateTime);
    if (taskTime >= filterFrom && taskTime <= filterTo && obj.status === filterStatus) {
      filterArray.push(obj);
    } else
    if (obj.status === filterStatus) {
      filterArray.push(obj);

    }

    renderList(filterArray);
  })




}             