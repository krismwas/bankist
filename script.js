'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-11-21T17:01:17.194Z',
    '2023-11-27T23:36:17.929Z',
    '2023-11-28T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-24T18:49:59.371Z',
    '2020-07-23T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

const formatDate = function (date, locale) {
  const calDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calDaysPassed(new Date(), date);
  console.log('----------------');
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, '0');
  // const month = `${date.getMonth() + 1}`.padStart(2, '0');
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return Intl.DateTimeFormat(locale).format(date);
};

const formatCurr = function (acc, mov) {
  const formattedMov = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(mov);
  return formattedMov;
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movt = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  // console.log(acc);
  movt.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatDate(date);

    formatCurr(acc, mov);

    // const formattedMov = new Intl.NumberFormat(acc.locale, {
    //   style: 'currency',
    //   currency: acc.currency,
    // }).format(mov);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatCurr(acc, mov)}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (accum, el) {
    return accum + el;
  }, 0);

  // formatCurr(acc, acc.balance);

  labelBalance.textContent = formatCurr(acc, acc.balance);
};

const calcDisplaySummary = function (acc) {
  const deposits = acc.movements
    .filter(el => el > 0)
    .reduce((acc, depo) => acc + depo, 0);
  // labelSumIn.textContent = deposits.toFixed(2);
  labelSumIn.textContent = formatCurr(acc, deposits);

  const withdrawal = acc.movements
    .filter(wdl => wdl < 0)
    .reduce((acc, el) => Math.abs(acc) + el, 0);
  // labelSumOut.textContent = withdrawal.toFixed(2);
  labelSumOut.textContent = formatCurr(acc, withdrawal);

  const interest = acc.movements
    .filter(el => el > 0)

    .map(el => el * (acc.interestRate / 100))
    .reduce((acc, el) => acc + el, 0);

  // labelSumInterest.textContent = interest.toFixed(2);
  labelSumInterest.textContent = formatCurr(acc, interest);
};

const user = 'Steven Thomas Williams';

const createUserNames = function (arr) {
  arr.forEach(function (acct) {
    acct.username = acct.owner
      .toLowerCase()
      .split(' ')
      .map(function (el) {
        return el[0];
      })
      .join('');
  });
};

createUserNames(accounts);

// Event handler
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });
  // console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('login');

    labelWelcome.textContent = `Welome ${currentAccount.owner
      .split(' ')
      .at(0)}`;
    containerApp.style.opacity = 100;

    const now = new Date();

    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    inputLoginUsername.value = inputLoginPin.value = '';

    updateUI(currentAccount);
  }

  // console.log(currentAccount);
});

const updateUI = function (acct) {
  displayMovements(acct);

  calcDisplayBalance(acct);

  calcDisplaySummary(acct);
};

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receivingAcct = accounts.find(function (acct) {
    return acct.username === inputTransferTo.value;
  });

  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receivingAcct &&
    currentAccount.balance >= amount &&
    receivingAcct?.username !== currentAccount.username
  ) {
    // money transfer
    currentAccount.movements.push(-amount);
    receivingAcct.movements.push(amount);

    // add transfer date
    currentAccount.movementsDates.push(new Date().toDateString());
    receivingAcct.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    console.log('close');

    const index = accounts.findIndex(function (el) {
      return el.username === currentAccount.username;
    });
    accounts.splice(index, 1);
    inputCloseUsername.value = inputClosePin.value = '';
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (currentAccount.movements.some(el => el >= amount * 0.1)) {
    currentAccount.movements.push(amount);
  }
  inputLoanAmount.value = '';

  // add a loan date
  currentAccount.movementsDates.push(new Date().toISOString());

  updateUI(currentAccount);
});

btnSort.addEventListener('click', function () {});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

labelBalance.addEventListener('click', function () {
  const rows = [...document.querySelectorAll('.movements__row')];
  rows.forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'grey';
  });
});
