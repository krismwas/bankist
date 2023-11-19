'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const displayMovements = function (acc) {
  containerMovements.innerHTML = '';
  console.log(acc);
  acc.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// const calcDisplayBalance = function (movements) {
//   const balance = movements.reduce((acc, el) => acc + el, 0);
//   labelBalance.textContent = `${balance} eur`;
// };

const calcDisplayBalance = function (acc) {
  acc.balance = acc.reduce(function (accum, el) {
    return accum + el;
  }, 0);
  labelBalance.textContent = `${acc.balance} eur`;
};

const calcDisplaySummary = function (acc) {
  const deposits = acc.movements
    .filter(el => el > 0)
    .reduce((acc, depo) => acc + depo, 0);
  labelSumIn.textContent = deposits;

  const withdrawal = acc.movements
    .filter(wdl => wdl < 0)
    .reduce((acc, el) => Math.abs(acc) + el, 0);
  labelSumOut.textContent = withdrawal;

  const interest = acc.movements
    .filter(el => el > 0)

    .map(el => el * (acc.interestRate / 100))
    .reduce((acc, el) => acc + el, 0);

  labelSumInterest.textContent = interest;
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
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('login');

    labelWelcome.textContent = `Welome ${currentAccount.owner
      .split(' ')
      .at(0)}`;
    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';

    displayMovements(currentAccount.movements);

    calcDisplayBalance(currentAccount.movements);

    calcDisplaySummary(currentAccount);
  }

  // console.log(currentAccount);
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('------------------');
  const amount = Number(inputTransferAmount.value);
  const receivingAcct = accounts.find(function (acct) {
    return acct.username === inputTransferTo.value;
  });
  // if (
  //   amount > 0 &&
  //   amount <=  &&
  //   receivingAcct.username !== inputTransferTo.username
  // ) {
  // }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
