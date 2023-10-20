const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-length]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMessage]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
let symbols = "~`!@#$%^&*()_-+={}[]|;'<,>.?/:";

let password = "";
let passwordLength = 12;
let checkCount = 0;
handleSlider();
//set strength circle colour to gray initially.
setIndicator("#ccc");

//setting the length of the password
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  const percentage = ((passwordLength - min) * 100) / (max - min);
  inputSlider.style.background = `linear-gradient(to right, #03125b 0%, #03125b ${percentage}%, #ccc ${percentage}%, #ccc 100%)`;
}

function updateSlider(e) {
  passwordLength = e.target.value;
  handleSlider();
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRandomInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbols() {
  const randomNum = getRandomInteger(0, symbols.length);
  return symbols.charAt(randomNum);
}

function calculateStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSymbols = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNumber = true;
  if (symbolsCheck.checked) hasSymbols = true;

  if (
    hasUpper &&
    hasLower &&
    (hasNumber || hasSymbols) &&
    passwordLength >= 8
  ) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNumber || hasSymbols) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyToClipboard() {
  copyMsg.innerText = "";
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Failed!";
  }
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

//adding event listeners.
inputSlider.addEventListener("input", updateSlider);
copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyToClipboard();
});

function shufflePasswords(array) {
  //fisher yates method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => {
    str += el;
  });

  return str;
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });
  return checkCount;
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

generateBtn.addEventListener("click", () => {
  if (checkCount == 0) return;
  password = "";

  let functionArray = [];
  if (uppercaseCheck.checked) {
    functionArray.push(generateUpperCase);
  }
  if (lowercaseCheck.checked) {
    functionArray.push(generateLowerCase);
  }
  if (numbersCheck.checked) {
    functionArray.push(generateRandomNumber);
  }
  if (symbolsCheck.checked) {
    functionArray.push(generateSymbols);
  }

  for (let i = 0; i < functionArray.length; i++) {
    password += functionArray[i]();
  }

  for (let i = 0; i < passwordLength - functionArray.length; i++) {
    let randomIndex = getRandomInteger(0, functionArray.length);
    password += functionArray[randomIndex]();
  }

  //shuffling passwords
  password = shufflePasswords(Array.from(password));
  passwordDisplay.value = password;
  calculateStrength();
});
