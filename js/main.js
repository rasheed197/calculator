let expArr = [];
let exp = "0";
let oldExp = "0";
let result = "0";
let isEvaluated = false;
let keys = document.querySelectorAll(".keypad");

const operators = ["+", "-", "÷", "x"];

let myResult = document.querySelector(".result");
let expression = document.querySelector(".expression");

myResult.innerHTML = "0";
expression.innerHTML = "0";

const clearScreen = () => {
  expArr = [];
  exp = "0";
  myResult.innerHTML = "0";
  expression.innerHTML = "0";
};

const handleEvaluate = () => {
  if (isEvaluated === true) {
    // once the user pressed the = button we don't want it to work again until isEvaluted is set to false.
    // DO NOTHING
  } else if (operators.includes(expArr[expArr.length - 1])) {
    // if the last element of expArr is an operator e.g ['1', '2', '+']
    expArr.pop(); // remove the operator e.g "+" to prevent error during evaluation
    exp = expArr.join(""); // join the array elements into a string
    oldExp = exp; // Store exp in oldExp because we are going to clear exp
    exp = exp.replaceAll("÷", "/"); // replace ÷ with standard javascript division
    exp = exp.replaceAll("x", "*"); // replace x with standard javascript multiplication
    result = eval(exp); // Evaluate the string expression
    expArr = [result]; // this way when the user press an operator it uses the currenly evaluated value e.g "500+" instead of "0+"
    myResult.innerHTML = result;
    expression.innerHTML = oldExp;
    isEvaluated = true;
  } else {
    // if the last element of expArr is a number e.g ['1', '2', '+', '5']
    exp = expArr.join(""); // join the array elements into a string
    oldExp = exp; // Store exp in oldExp because we are going to clear exp
    exp = exp.replaceAll("÷", "/"); // replace ÷ with standard javascript division
    exp = exp.replaceAll("x", "*"); // replace x with standard javascript multiplication
    result = eval(exp); // Evaluate the string expression
    if (result === Infinity || result === -Infinity || isNaN(result)) {
      // Zero division error
      result = "Div/0 Error";
    }
    expArr = [result]; // this way when the user press an operator it uses the currenly evaluated value e.g "500+" instead of "0+"
    myResult.innerHTML = result;
    expression.innerHTML = oldExp;
    isEvaluated = true; // once the user pressed the = button we don't want it to work again until isEvaluted is set to false.
  }
};

const handleBackspace = () => {
  expArr.pop(); // remove the last element in expArr
  if (expArr.length === 0) {
    exp = 0;
    myResult.innerHTML = exp;
  } else {
    exp = expArr.join(""); // join the elements of expArr to form string
    myResult.innerHTML = exp;
  }
};

const handleDecimal = () => {
  if (isEvaluated === true) isEvaluated = false; // Set isEvaluated to false

  if (expArr.length === 0) {
    expArr = ["0"]; // This way we get values like ["0", ".", "5"] instead of [".", "5"]
  }

  exp = expArr.join(""); // i.e ['3', '+', '5', '0', '-', '4', '0'] -> "3+50-40"
  // console.log(exp);
  const pattern = /\d+\.?\d*$/g; // to extract 40 or 40. or 40.12
  let lastNumber;

  try {
    // if exp ends with an operator e.g "3+50-40+", lastNumber regex returns a TypeError
    lastNumber = exp.match(pattern)[0]; // extract the last digit(s) 40 in exp and store it in lastNumber
  } catch (err) {
    if (err instanceof TypeError) {
      lastNumber = exp.at(-1); // lastNumber is undefined so we set it to exp last element, else we get a TypeError in the condition below.
    }
  }

  if (lastNumber.includes(".")) {
    // if the last number is already a decimal e.g 2. or 2.3
    // DO NOTHING. We don't want 2.5.4 or 2..6
  } else {
    // if the last number is an integer
    expArr.push("▪"); // add "▪" to to expArr
    exp = expArr.join(""); // join the array elements into a string
    exp = exp.replaceAll("▪", "."); // replace "▪" with a decimal point
    expArr = exp.split("");
    myResult.innerHTML = exp;
  }
};

const handleNumbers = (key) => {
  // isEvaluated = false;
  if (isEvaluated === true) {
    expArr = []; // we want to start with a new number instead of the currently evaluated number
    expArr.push(key.innerHTML); // add the number to expArr.
    exp = expArr.join(""); // join array elements to form a string
    myResult.innerHTML = exp;
    isEvaluated = false; // so we don't enter this if condition again as it will set expArr to [] again.
  } else {
    if (expArr[0] === "0" && expArr.length === 1) {
      // if expArr = ["0"]
      expArr.splice(0, 1); // Remove the first zero
    }
    expArr.push(key.innerHTML); // add the number to the end of the list.
    exp = expArr.join(""); // join array elements to form a string
    myResult.innerHTML = exp;
  }
};

const handleOperators = (key) => {
  if (isEvaluated === true) {
    isEvaluated = false;
  }
  // console.log(isEvaluated);
  if (operators.includes(expArr[expArr.length - 1])) {
    // If the the last element of exp is an operator e.g ["40", "+", "10", "+"]
    // replace the operator with the new operator
    expArr.pop(); // remove the old operator
    expArr.push(key.innerHTML); // add the operator to the end of the list.
    exp = expArr.join("");
    myResult.innerHTML = exp;
  } else if (expArr.length === 0) {
    expArr = ["0"];
    expArr.push(key.innerHTML); // add the number to the end of the list.
    exp = expArr.join("");
    myResult.innerHTML = exp;
  } else {
    // If the the last element of exp is a number e.g ["40", "+", "10", "+", "25"]
    expArr.push(key.innerHTML); // add the number to the end of the list.
    exp = expArr.join("");
    myResult.innerHTML = exp;
  }
};

const handlePercentage = () => {
  if (operators.includes(expArr[expArr.length - 1])) {
    // if the last character of exp is an operator e.g "+"
    // DO NOTHING
  } else {
    // if it is a number, e.g ['3', '+', '5', '0', '-', '4', '0']
    exp = expArr.join(""); // i.e ['3', '+', '5', '0', '-', '4', '0'] -> "3+50-40"
    const pattern = /\d+$/g; // to extract 40

    const lastNumber = exp.match(pattern)[0]; // extract the last digit 40 in exp and store it in lastNumber

    // console.log(lastNumber)
    expArr.splice(-lastNumber.length, lastNumber.length); // remove the last element in the array
    const percentage = +lastNumber / 100; // calculate the percentage of the last number
    // console.log(lastNumber)
    expArr.push(String(percentage)); // push percentage to the end of the array
    exp = expArr.join("");
    myResult.innerHTML = exp;
  }
};

keys.forEach((key) => {
  key.addEventListener("click", () => {
    if (operators.includes(key.innerHTML)) {
      // If the user press an operator e.g +, -, x, or ÷. Here we are trying to avoid somethig like this "50 +- 10"
      handleOperators(key);
    } else if (key.innerHTML === "C") {
      clearScreen();
    } else if (key.className.includes("backspace")) {
      // if the backspace key is pressed
      handleBackspace();
    } else if (key.innerHTML === "%") {
      handlePercentage();
    } else if (key.innerHTML === "=") {
      handleEvaluate();
    } else if (key.innerHTML === "▪") {
      handleDecimal();
    } else {
      // If the user press a number and not special character
      handleNumbers(key);
    }
  });
});
