// Select elements
const form = document.querySelector("#itemForm");
const itemInput = document.querySelector("#itemInput");
const dateInput = document.querySelector("#targetDateInput");
const itemList = document.querySelector(".item-list");
const feedback = document.querySelector(".feedback");
const addBtn = document.querySelector("#add-item");
const clearButton = document.querySelector("#clear-list");

let todoItems = [];

// Handle item actions (complete, edit, delete)
const handleItem = function (itemName, itemDate) {
  const items = itemList.querySelectorAll(".item");

  items.forEach((item) => {
    if (
      item.querySelector(".item-name").textContent.trim().toLowerCase() ===
      itemName.trim().toLowerCase()
    ) {
      // Complete item
      item
        .querySelector(".complete-item")
        .addEventListener("click", function () {
          const itemText = item.querySelector(".item-name");
          itemText.classList.toggle("completed");

          sendFeedback("Item marked as completed!", "green");
        });

      // Edit item
      item.querySelector(".edit-item").addEventListener("click", function () {
        addBtn.textContent = "Edit Item";
        itemInput.value = itemName;
        dateInput.value = itemDate;
        itemList.removeChild(item);

        todoItems = todoItems.filter((i) => i.name !== itemName);
        setLocalStorage(todoItems);
      });

      // Delete item
      item.querySelector(".delete-item").addEventListener("click", function () {
        itemList.removeChild(item);
        todoItems = todoItems.filter((i) => i.name !== itemName);
        setLocalStorage(todoItems);
        sendFeedback("Item deleted successfully", "red");
      });
    }
  });
};

// Display list
const getList = function (todoItems) {
  itemList.innerHTML = "";
  todoItems.forEach(({ name, date }, index) => {
    itemList.insertAdjacentHTML(
      "beforeend",
      `<div class="item">
        <div class="item-info">
          <h6 class="item-index">${index + 1}</h6>
          <p class="item-name">${name}</p>
          <p class="item-date">Due: ${date}</p>
        </div>
        <div class="item-icons">
          <i class="far fa-check-circle complete-item"></i>
          <i class="far fa-edit edit-item"></i>
          <i class="far fa-times-circle delete-item"></i>
        </div>
      </div>`
    );
    handleItem(name, date);
  });
};

// Local storage functions
const getLocalStorage = function () {
  const todoStorage = localStorage.getItem("todoItems");
  todoItems = todoStorage ? JSON.parse(todoStorage) : [];
  getList(todoItems);
};

const setLocalStorage = function (todoItems) {
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
};

// Feedback function
const sendFeedback = function (message, color) {
  feedback.textContent = message;
  feedback.classList.add(`feedback-${color}`);
  setTimeout(() => {
    feedback.textContent = "";
    feedback.classList.remove(`feedback-${color}`);
  }, 3000);
};

// Form submission
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const itemName = itemInput.value.trim();
  const itemDate = dateInput.value;

  if (!itemName || !itemDate) {
    sendFeedback("Please enter a valid name and date.", "red");
    return;
  }

  addBtn.textContent = "Add Item";
  todoItems.push({ name: itemName, date: itemDate });
  setLocalStorage(todoItems);
  getList(todoItems);

  itemInput.value = "";
  dateInput.value = "";
  sendFeedback("Item added successfully!", "green");
});

// Clear list
clearButton.addEventListener("click", function () {
  if (confirm("Are you sure you want to clear all items?")) {
    todoItems = [];
    localStorage.clear();
    getList(todoItems);
  }
});

// Load items on page load
getLocalStorage();
