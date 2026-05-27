const todayDate = document.querySelector("#todayDate");
const weekDay = document.querySelector("#weekDay");
const totalBalance = document.querySelector("#balanceNumber");
const currentIncome = document.querySelector("#incomeNumber");
const currentExpense = document.querySelector("#expenseNumber");
const transactionTitleInput = document.querySelector(".title-input-box");
const transactionAmountInput = document.querySelector(".transaction-amount-input");
const categoryDropdown = document.querySelector(".dropdown-parent");
const addTransactionBtn = document.querySelector(".submit-transaction");
const transactionsParent = document.querySelector(".transactions-parent");
const projectSubheading = document.querySelector(".project-subheading");
const emptyState = document.querySelector("#emptyState");

const desktopHeading = "Track your spending Smarter and stay in Control";
const mobileHeading = "Track spending smartly and stay in control";

function updateResponsiveHeading() {
  if (!projectSubheading) return;
  const isSmallDevice = window.matchMedia("(max-width: 600px)").matches;
  projectSubheading.textContent = isSmallDevice ? mobileHeading : desktopHeading;
}

updateResponsiveHeading();
window.addEventListener("resize", updateResponsiveHeading);

const now = new Date();

const formatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  weekday: "long",
});

const parts = formatter.formatToParts(now);

const day = parts.find((p) => p.type === "day").value;
const month = parts.find((p) => p.type === "month").value;
const year = parts.find((p) => p.type === "year").value;
const weekday = parts.find((p) => p.type === "weekday").value;

todayDate.textContent = `${day} ${month}`;
weekDay.textContent = `${year}, ${weekday}`;

let balanceVal = 10000;
let incomeVal = 10000;
let expenseVal = 0;

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateCards() {
  totalBalance.textContent = `₹ ${balanceVal.toLocaleString("en-IN")}`;
  currentIncome.textContent = `₹ ${incomeVal.toLocaleString("en-IN")}`;
  currentExpense.textContent = `₹ ${expenseVal.toLocaleString("en-IN")}`;
}

function updateEmptyState() {
  if (!emptyState) return;
  const hasTransactions = transactions.length > 0;
  emptyState.classList.toggle("is-visible", !hasTransactions);
}

function renderTransaction(transaction) {
  const sign = transaction.type === "expense" ? "-" : "+";
  const newListItem = document.createElement("li");
  newListItem.classList.add("transaction-details");
  newListItem.innerHTML = `
  
    <div class="transaction-details-parent">
      <p class="transaction-title">
        ${transaction.title}
      </p>
      <h3 class="transaction-amount ${transaction.type === "expense" ? "is-expense" : "is-income"}">
        ${sign} ₹ ${transaction.amount.toLocaleString("en-IN")}
      </h3>
    </div>
    <div class="transaction-meta">
      <span class="transaction-type ${transaction.type === "expense" ? "is-expense" : "is-income"}">
        ${transaction.category}
      </span>
      <span class="transaction-day">
        • ${transaction.date}
      </span>
    </div>
  `;

  transactionsParent.prepend(newListItem);
}

transactions.forEach((transaction) => {
  renderTransaction(transaction);

  if (transaction.type === "expense") {
    balanceVal -= transaction.amount;
    expenseVal += transaction.amount;
  } else {
    balanceVal += transaction.amount;
    incomeVal += transaction.amount;
  }
});

updateCards();
updateEmptyState();

addTransactionBtn.addEventListener("click", () => {
  const currentDate = new Date();

  const transactionDate = currentDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  const transactionDay = currentDate.toLocaleDateString("en-US", {
    weekday: "short",
  });

  const fullDate = `${transactionDay} • ${transactionDate}`;

  const selectedRadio = document.querySelector(
    'input[name="transactionType"]:checked',
  );

  const selectedCategory = categoryDropdown.value;

  if (transactionTitleInput.value.trim() === "") {
    alert("Please enter transaction title");
    return;
  }

  if (transactionAmountInput.value.trim() === "") {
    alert("Please enter transaction amount");
    return;
  }

  if (!selectedRadio) {
    alert("Select Transaction type");
    return;
  }

  if (!selectedCategory) {
    alert("Select Transaction Category");
    return;
  }

  const amount = Number(transactionAmountInput.value);

  if (amount > balanceVal && selectedRadio.value === "expense") {
    alert("Expense Amount exceeded!!");
    return;
  }

  const transaction = {
    title: transactionTitleInput.value,
    amount: amount,
    type: selectedRadio.value,
    category: selectedCategory,
    date: fullDate,
  };

  transactions.push(transaction);

  localStorage.setItem("transactions", JSON.stringify(transactions));

  renderTransaction(transaction);

  if (transaction.type === "expense") {
    balanceVal -= amount;
    expenseVal += amount;
  } else {
    balanceVal += amount;
    incomeVal += amount;
  }
  updateCards();
  updateEmptyState();

  transactionTitleInput.value = "";
  transactionAmountInput.value = "";
  categoryDropdown.value = "";
  selectedRadio.checked = false;
});
