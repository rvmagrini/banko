"use strict";

// Accounts
const account1 = {
  owner: "JJ. Cale",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  movementsData: [],
  locale: "en-US",
  currency: "USD",
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "BB. King",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  movementsData: [],
  locale: "en-GB",
  currency: "GBP",
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Willie Dixon",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  movementsData: [],
  locale: "de-DE",
  currency: "EUR",
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "John Mayall",
  movements: [430, 1000, 700, 50, 90],
  movementsData: [],
  locale: "pt-BR",
  currency: "BRL",
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements

const status = document.querySelector(".status");
const intro = document.querySelector(".intro");
const loginNav = document.querySelector(".login-nav");
const logoutNav = document.querySelector(".logout-nav");
const arrow = document.querySelector(".arrow");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");
const containerBalance = document.querySelector(".balance");

const labelBalance = document.querySelector(".balance-value");
const labelBalanceDate = document.querySelector(".date");
const labelSummaryIn = document.querySelector(".summary-value-in");
const labelSummaryOut = document.querySelector(".summary-value-out");
const labelSummaryInterest = document.querySelector(".summary-value-interest");
const labelTimer = document.querySelector(".timer-label");

const inputLoginUsername = document.querySelector(".login-input-user");
const inputLoginPin = document.querySelector(".login-input-pin");
const inputTransferTo = document.querySelector(".form-input-to");
const inputTransferAmount = document.querySelector(
  ".form-input-transfer-amount"
);
const inputLoanAmount = document.querySelector(".form-input-loan-amount");
const inputClosePin = document.querySelector(".form-input-close-pin");

const btnLogin = document.querySelector(".login-btn");
const btnLogout = document.querySelector(".logout-btn");
const btnTransfer = document.querySelector(".form-btn-transfer");
const btnSort = document.querySelector(".sort");
const btnClose = document.querySelector(".form-btn-close");
const btnLoan = document.querySelector(".form-btn-loan");

// Inital Conditions
const initial = () => {
  containerApp.classList.add("hidden");
  logoutNav.classList.add("hidden");
};
initial();

// Creating usernames: crete a new key 'username' in each object.
const createUsernames = (accs) => {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word[0] + word[1])
      .join("");
  });
};
createUsernames(accounts);

// Formatting Currency
const formatCur = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

// Date
const currentDate = () => {
  const date = new Date().toLocaleDateString().replaceAll("/", ".");
  labelBalanceDate.textContent = `${date}`;
};
currentDate();

// Create Movs Date
console.log(new Date().toISOString());

// Display Movements
const displayMovements = (acc, sort = false) => {
  // Empty the container
  containerMovements.innerHTML = "";

  //Sort
  const movements = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  // Adding new mov elements
  movements.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const sign = mov > 0 ? "+" : "-";

    const formatMov = formatCur(Math.abs(mov), acc.locale, acc.currency);

    const html = `<div class="movements-row">
        <div class="movements-type movements-type-${type}">${sign}</div>
        <div class="movements-value">${formatMov}</div>
      </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// Sort Handler
let sorted = false;
btnSort.addEventListener("click", function () {
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// Display Balance
const displayBalance = (acc) => {
  // Calculating balance
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  // Format
  const formatBalance = formatCur(acc.balance, acc.locale, acc.currency);

  // Editing html
  labelBalance.textContent = `${formatBalance}`;
};

// Display Summary
const displaySummary = (acc) => {
  acc.incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  acc.outcomes = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  acc.interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => deposit * (acc.interestRate / 100))
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSummaryIn.textContent = formatCur(acc.incomes, acc.locale, acc.currency);
  labelSummaryOut.textContent = formatCur(
    Math.abs(acc.outcomes),
    acc.locale,
    acc.currency
  );
  labelSummaryInterest.textContent = formatCur(
    acc.interest,
    acc.locale,
    acc.currency
  );
};

// Event Handlers

let currentAccount, timer;

// Login
btnLogin.addEventListener("click", function () {
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    loggedUI(currentAccount);
  } else {
    alert(`Current Users:
    -> jjca - pin: 1111
    -> bbki - pin: 2222
    -> widi - pin: 3333
    -> joma - pin: 4444
    `);
  }
});

// Logout
btnLogout.addEventListener("click", function () {
  introUI();
});

// Logout Timer
const logoutTimer = () => {
  const tick = () => {
    // Convert secs to mins
    const min = String(Math.floor(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    // Logout
    if (time === 0) {
      clearInterval(timer);
      introUI();
    }

    time--;
  };

  // Set time
  let time = 120;

  // Call timer
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// Logged UI
const loggedUI = (acc) => {
  status.textContent = `welcome back, ${acc.owner}`;
  intro.classList.add("hidden");
  loginNav.classList.add("hidden");
  logoutNav.classList.remove("hidden");
  containerApp.classList.remove("hidden");
  updateUI(acc);
  // Timer
  if (timer) clearInterval(timer);
  timer = logoutTimer();
};

// Intro UI
const introUI = () => {
  status.textContent = "log in";
  intro.classList.remove("hidden");
  loginNav.classList.remove("hidden");
  logoutNav.classList.add("hidden");
  containerApp.classList.add("hidden");
  inputLoginUsername.value = "";
  inputLoginPin.value = "";
  inputLoginUsername.focus();
};

// Update UI
const updateUI = (acc) => {
  displayMovements(currentAccount);
  displayBalance(currentAccount);
  displaySummary(currentAccount);
};

// Transfers
btnTransfer.addEventListener("click", function () {
  const transferTo = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  const amount = Math.floor(inputTransferAmount.value);

  if (
    transferTo &&
    inputTransferAmount &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    transferTo.username !== currentAccount.username
  ) {
    transferTo.movements.push(amount);
    currentAccount.movements.push(-amount);
    updateUI(currentAccount);
  }
  inputTransferTo.value = "";
  inputTransferAmount.value = "";
  inputTransferTo.focus();

  // Reset Timer
  clearInterval(timer);
  timer = logoutTimer();
});

// Loan: it works only if the amount requested is not larger than 10% of the largest deposit
btnLoan.addEventListener("click", function () {
  const loanAmount = Math.floor(inputLoanAmount.value);

  const loanPermission = currentAccount.movements.some(
    (mov) => mov >= loanAmount * 0.1
  );

  if (loanAmount && loanAmount > 0 && loanPermission) {
    // Time the bank takes to process the loan
    setTimeout(() => {
      currentAccount.movements.push(loanAmount);
      updateUI();
    }, 4000);
  }
  inputLoanAmount.value = "";
  inputLoanAmount.focus();

  // Reset Timer
  clearInterval(timer);
  timer = logoutTimer();
});

// Close account
btnClose.addEventListener("click", function () {
  const inputPin = +inputClosePin.value;

  // Check if the pin inserted matches the logged username and pin
  const matchUserPin = accounts.find(
    (acc) =>
      currentAccount.username === acc.username &&
      currentAccount.pin === inputPin
  );

  // Find the index of the object if it has matched
  const findCurrentAccount = accounts.findIndex((acc) => matchUserPin);

  if (matchUserPin) {
    // Delete account
    accounts.splice(findCurrentAccount, 1);
    introUI();
  }

  inputClosePin.value = "";
  inputClosePin.focus();
});
