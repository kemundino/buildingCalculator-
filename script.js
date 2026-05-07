const display = document.getElementById("display");
const memoryDisplay = document.getElementById("memory-display");
let memory = 0;

// Function to append input to the display
function appendToDisplay(value) {
  display.value += value;
}

// Function to clear the display
function clearDisplay() {
  display.value = "";
}

// Function to clear current entry
function clearEntry() {
  const expression = display.value;
  const lastOperatorIndex = Math.max(
    expression.lastIndexOf('+'),
    expression.lastIndexOf('-'),
    expression.lastIndexOf('*'),
    expression.lastIndexOf('/'),
    expression.lastIndexOf('**'),
    expression.lastIndexOf('%')
  );
  
  if (lastOperatorIndex === -1) {
    display.value = "";
  } else {
    display.value = expression.substring(0, lastOperatorIndex + 1);
  }
}

// Function to delete the last character
function deleteLast() {
  display.value = display.value.slice(0, -1);
}

// Function to toggle sign
function toggleSign() {
  if (display.value && !isNaN(display.value)) {
    display.value = (parseFloat(display.value) * -1).toString();
  }
}

// Function to calculate factorial
function factorial() {
  try {
    const num = parseFloat(eval(display.value));
    if (num < 0 || !Number.isInteger(num)) {
      throw new Error("Invalid input for factorial");
    }
    
    let result = 1;
    for (let i = 2; i <= num; i++) {
      result *= i;
    }
    display.value = result.toString();
  } catch (error) {
    display.value = "Error";
  }
}

// Memory functions
function memoryClear() {
  memory = 0;
  updateMemoryDisplay();
}

function memoryRecall() {
  display.value += memory.toString();
}

function memoryAdd() {
  try {
    const currentValue = eval(display.value) || 0;
    memory += currentValue;
    updateMemoryDisplay();
  } catch (error) {
    display.value = "Error";
  }
}

function memorySubtract() {
  try {
    const currentValue = eval(display.value) || 0;
    memory -= currentValue;
    updateMemoryDisplay();
  } catch (error) {
    display.value = "Error";
  }
}

function updateMemoryDisplay() {
  memoryDisplay.value = memory !== 0 ? `M: ${memory}` : "";
}

// Function to calculate the result with improved error handling
function calculateResult() {
  try {
    // Replace mathematical constants and functions for better evaluation
    let expression = display.value;
    
    // Validate expression
    if (!expression.trim()) {
      display.value = "0";
      return;
    }
    
    // Check for balanced parentheses
    let openParens = 0;
    for (let char of expression) {
      if (char === '(') openParens++;
      if (char === ')') openParens--;
    }
    if (openParens !== 0) {
      throw new Error("Unbalanced parentheses");
    }
    
    // Evaluate the expression
    const result = eval(expression);
    
    // Handle different result types
    if (typeof result === 'number') {
      if (isNaN(result)) {
        throw new Error("Invalid operation");
      }
      if (!isFinite(result)) {
        throw new Error("Infinity");
      }
      // Format large numbers in scientific notation
      if (Math.abs(result) > 1e10) {
        display.value = result.toExponential(6);
      } else {
        display.value = result.toString();
      }
    } else {
      display.value = result.toString();
    }
  } catch (error) {
    display.value = "Error";
    setTimeout(() => {
      if (display.value === "Error") {
        display.value = "";
      }
    }, 2000);
  }
}

// Enhanced keyboard input with scientific shortcuts
document.addEventListener("keydown", (event) => {
  const key = event.key;
  
  // Prevent default for calculator keys
  if (["Enter", "Escape", "Backspace"].includes(key) || 
      /[0-9+\-*/.()]/.test(key)) {
    event.preventDefault();
  }

  // Handle number and operator keys
  if (/[0-9+\-*/.()]/.test(key)) {
    appendToDisplay(key);
  }

  // Scientific function shortcuts
  if (event.ctrlKey || event.metaKey) {
    switch(key.toLowerCase()) {
      case 's':
        appendToDisplay('Math.sin(');
        break;
      case 'c':
        appendToDisplay('Math.cos(');
        break;
      case 't':
        appendToDisplay('Math.tan(');
        break;
      case 'l':
        appendToDisplay('Math.log(');
        break;
      case 'r':
        appendToDisplay('Math.sqrt(');
        break;
    }
  }

  // Handle special keys
  switch(key) {
    case "Enter":
      calculateResult();
      break;
    case "Backspace":
      deleteLast();
      break;
    case "Escape":
      clearDisplay();
      break;
    case "Delete":
      clearEntry();
      break;
    case "%":
      appendToDisplay('%');
      break;
    case "^":
      appendToDisplay('**');
      break;
  }
});

// Initialize display
updateMemoryDisplay();