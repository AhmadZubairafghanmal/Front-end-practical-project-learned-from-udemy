'use strict';
// bankist Application
// Data
const account1 = {
  owner: 'Ahmad Zubair',
  movements: [220, 340, -4000, 5000, -890, 1200, -1350, 7890],
  interestRate: 1.2,
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-06-27T17:01:17.194Z',
    '2023-05-19T23:36:17.929Z',
    '2023-05-20T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US', // de-DE
};

const account2 = {
  owner: 'Ahmad Ullah',
  movements: [3000, 900, -450, 120, -3450, 800, -900, 600],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2023-11-30T09:48:16.867Z',
    '2022-12-25T06:04:23.907Z',
    '2021-01-25T14:18:46.235Z',
    '2023-02-20T16:33:06.386Z',
    '2022-04-10T14:43:26.374Z',
    '2023-06-25T18:49:59.371Z',
    '2023-07-26T12:01:20.894Z',
  ],
  currency: 'AFG',
  locale: 'en-US',
};

const account3 = {
  owner: 'Noor Mohammad',
  movements: [-240, 5000, 700, -9000, 670, -230, -789],
  interestRate: 0.8,
  pin: 3333,
};

const account4 = {
  owner: 'Nazar Khan',
  movements: [450, 890, 800, 1290],
  interestRate: 0.5,
  pin: 4444,
};

// accounts array
const accounts = [account1, account2, account3, account4];

// elements
const welcomeLabel = document.querySelector('.welcome');
const dateLabel = document.querySelector('.date');
const balanceLabel = document.querySelector('.balance_value');
const sumInLabel = document.querySelector('.summary_value-in');
const sumOutLabel = document.querySelector('.summary_value-out');
const sumInterestLabel = document.querySelector('.summary_value-interest');
const timerLabel = document.querySelector('.timer');

const appContainer = document.querySelector('.app');
const movementsContainer = document.querySelector('.movements');

const loginBtn = document.querySelector('.login_btn');
const transferBtn = document.querySelector('.form_btn-transfer');
const loanBtn = document.querySelector('.form_btn-loan');
const closeBtn = document.querySelector('.form_btn-close');
const sortBtn = document.querySelector('.btn-sort');

const inputLoginUsername = document.querySelector('.login_input-user');
const inputLoginPin = document.querySelector('.login_input-pin');
const inputTransferTo = document.querySelector('.form_input-to');
const inputTransferAmount = document.querySelector('.form_input-amount');
const inputLoanAmoun = document.querySelector('.from_input-loan-amount');
const inputCloseUsername = document.querySelector('.form_input-user');
const inputClosePin = document.querySelector('.form_input-pin');

// Format to movments date
// functions
function formatMovementsDate(date, locale) {
  function calcDisplayDate(date1, date2) {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  }
  const passedDays = calcDisplayDate(new Date(), date);
  console.log(passedDays);
  if (passedDays === 0) return 'Today';
  if (passedDays === 1) return 'Yesterday';
  if (passedDays <= 7) return `${passedDays} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
}

// format to currency
function formatCurrency(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}

// Dom function --> display function
function displayMovements(acc, sort = false) {
  movementsContainer.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((mov1, mov2) => mov1 - mov2)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawl';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDate(date, acc.locale);
    const formatedMov = formatCurrency(mov, acc.locale, acc.currency);
    const html = `
    <div class="movements_row">
      <div class="movements_type movements_type-${type}">${i + 1} ${type}</div>
      <div class="movements_date">${displayDate}</div>
      <div class="movements_value">${formatedMov}</div>
    </div>
  `;
    movementsContainer.insertAdjacentHTML('afterbegin', html);
  });
}

// display balance function
function displayBalance(acc) {
  acc.balance = acc.movements.reduce((acu, mov) => acu + mov, 0);
  const formatedMov = formatCurrency(acc.balance, acc.locale, acc.currency);
  balanceLabel.textContent = formatedMov;
}

// display summary function
function calcDisplaySummary(acc) {
  const depositAmount = acc.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  sumInLabel.textContent = formatCurrency(
    depositAmount,
    acc.locale,
    acc.currency
  );

  const withdrewAmount = acc.movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  sumOutLabel.textContent = formatCurrency(
    withdrewAmount,
    acc.locale,
    acc.currency
  );

  const interest = acc.movements
    .filter(function (mov) {
      return mov < 0;
    })
    .map(function (deposit) {
      return (deposit * acc.interestRate) / 100;
    })
    .filter(function (int, i, arr) {
      console.log(arr);
      return int <= 1;
    })
    .reduce(function (acc, int) {
      return acc + int;
    }, 0);
  sumInterestLabel.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
}

// create user function
function createUserName(accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (user) {
        return user[0];
      })
      .join('');
  });
}
createUserName(accounts);

// updateUI function
function updateUI(acc) {
  displayMovements(acc);
  // Display Balance
  displayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
}

function startLogoutTimer() {
  function tick() {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // in each call print the remainging time to UI
    timerLabel.textContent = `${min}:${sec}`;

    // when 0 seconds, stop the timer and logout the user
    if (time === 0) {
      clearInterval(timer);
      welcomeLabel.textContent = `Login to get start`;
      appContainer.style.opacity = 0;
    }

    // Decrease the time by 1sec
    time--;
  }

  // Set time to 5 minutes
  let time = 300;

  // Call the timer every Second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
}

let currentAccount, timer;

// Event handlers occur
// login event
loginBtn.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    welcomeLabel.textContent = `Welcome back, ${currentAccount.owner}`;
    appContainer.style.opacity = 100;
    // create current date
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      weekday: 'long',
    };

    const locale = navigator.language;
    console.log(locale);
    dateLabel.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // clearing input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Call the timer function
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // updateUI method
    updateUI(currentAccount);
  }
});

// transfer amount of money
transferBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );

  // Cleaning transfer input fields
  inputTransferTo.value = inputTransferAmount.value = '';
  // transferBtn.blur();

  // console.log(amount, reciverAcc);
  if (
    amount > 0 &&
    reciverAcc &&
    currentAccount.balance >= amount &&
    reciverAcc?.userName !== currentAccount.userName
  ) {
    // Doing transfer
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);

    // addd transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    reciverAcc.movementsDates.push(new Date().toISOString());

    // updateUI method
    updateUI(currentAccount);

    // reset time
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

// requesting loan
loanBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmoun.value);
  if (amount > 0 && currentAccount.movements.some(acc => acc >= acc * 0.1))
    setTimeout(function () {
      // add movemnets
      currentAccount.movements.push(amount);
      // add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // update UI
      updateUI(currentAccount);

      // reset time
      clearInterval(timer);
      timer = startLogoutTimer();
    }, 2500);

  inputLoanAmoun.value = '';
});

// close account of customer
closeBtn.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(function (acc) {
      return acc.userName === currentAccount.userName;
    });
    // setting all inputs to empty
    inputCloseUsername.value = inputClosePin.value = '';

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    appContainer.style.opacity = 0;
  }
});

let sorted = false;
sortBtn.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('clicked btn');
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// lectures
const currencies = new Map([
  ['AFM', 'Afghan Money'],
  ['USD', 'United States Dollar'],
  ['EUR', 'Euro'],
]);
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
