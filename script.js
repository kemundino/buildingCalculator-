const display = document.getElementById("display");
const memoryDisplay = document.getElementById("memory-display");
const historyPanel = document.getElementById("history-panel");
const historyList = document.getElementById("history-list");
let memory = 0;
let angleMode = 'deg'; // 'deg' or 'rad'
let calculationHistory = [];
let soundEnabled = true;
let currentTheme = 'dark';

// Function to append input to the display
function appendToDisplay(value) {
  display.value += value;
  playSound('click');
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
    playSound('calculate');
  } catch (error) {
    display.value = "Error";
  }
}

// Function to generate random number
function randomNumber() {
  const randomVal = Math.random();
  display.value += randomVal.toString();
  playSound('click');
}

// Trigonometric dropdown toggle
function toggleTrigDropdown() {
  const dropdown = document.getElementById('trig-dropdown');
  dropdown.classList.toggle('hidden');
  playSound('click');
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function closeDropdown(e) {
    if (!e.target.closest('.dropdown-container')) {
      dropdown.classList.add('hidden');
      document.removeEventListener('click', closeDropdown);
    }
  });
}

// Theme toggle
function toggleTheme() {
  const body = document.body;
  const themeBtn = document.getElementById('theme-toggle');
  
  if (currentTheme === 'dark') {
    body.classList.add('light-theme');
    themeBtn.textContent = '☀️';
    currentTheme = 'light';
  } else {
    body.classList.remove('light-theme');
    themeBtn.textContent = '🌙';
    currentTheme = 'dark';
  }
  playSound('click');
}

// History functions
function toggleHistory() {
  historyPanel.classList.toggle('hidden');
  playSound('click');
}

function addToHistory(expression, result) {
  const historyItem = {
    expression: expression,
    result: result,
    timestamp: new Date().toLocaleTimeString()
  };
  
  calculationHistory.unshift(historyItem);
  if (calculationHistory.length > 10) {
    calculationHistory.pop();
  }
  
  updateHistoryDisplay();
}

function updateHistoryDisplay() {
  historyList.innerHTML = '';
  
  calculationHistory.forEach(item => {
    const historyElement = document.createElement('div');
    historyElement.className = 'history-item';
    historyElement.innerHTML = `
      <div class="history-expression">${item.expression}</div>
      <div class="history-result">= ${item.result}</div>
      <div class="history-time">${item.timestamp}</div>
    `;
    historyElement.onclick = () => {
      display.value = item.expression;
      playSound('click');
    };
    historyList.appendChild(historyElement);
  });
}

function clearHistory() {
  calculationHistory = [];
  updateHistoryDisplay();
  playSound('click');
}

// Angle mode functions
function setAngleMode(mode) {
  angleMode = mode;
  const degBtn = document.getElementById('deg-mode');
  const radBtn = document.getElementById('rad-mode');
  
  if (mode === 'deg') {
    degBtn.classList.add('active');
    radBtn.classList.remove('active');
  } else {
    radBtn.classList.add('active');
    degBtn.classList.remove('active');
  }
  playSound('click');
}

// Copy/Paste functions
function copyResult() {
  navigator.clipboard.writeText(display.value).then(() => {
    display.value = 'Copied!';
    setTimeout(() => {
      display.value = '';
    }, 1000);
    playSound('success');
  });
}

function pasteToDisplay() {
  navigator.clipboard.readText().then(text => {
    display.value += text;
    playSound('click');
  }).catch(() => {
    display.value = 'Paste failed';
    setTimeout(() => {
      display.value = '';
    }, 1000);
  });
}

// Sound functions
function toggleSound() {
  soundEnabled = !soundEnabled;
  const soundBtn = document.getElementById('sound-btn');
  soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
  if (soundEnabled) playSound('click');
}

function playSound(type) {
  if (!soundEnabled) return;
  
  // Create audio context for sound effects
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillatorator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillatorator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  switch(type) {
    case 'click':
      oscillatorator.frequency.value = 800;
      gainNode.gain.value = 0.1;
      oscillatorator.start();
      oscillatorator.stop(audioContext.currentTime + 0.05);
      break;
    case 'calculate':
      oscillatorator.frequency.value = 600;
      gainNode.gain.value = 0.1;
      oscillatorator.start();
      oscillatorator.stop(audioContext.currentTime + 0.1);
      break;
    case 'success':
      oscillatorator.frequency.value = 1000;
      gainNode.gain.value = 0.1;
      oscillatorator.start();
      oscillatorator.stop(audioContext.currentTime + 0.15);
      break;
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
    
    // Handle degree/radian conversion for trig functions
    if (angleMode === 'deg') {
      expression = expression.replace(/Math\.sin\(/g, 'Math.sin(' + (Math.PI/180) + ' * ');
      expression = expression.replace(/Math\.cos\(/g, 'Math.cos(' + (Math.PI/180) + ' * ');
      expression = expression.replace(/Math\.tan\(/g, 'Math.tan(' + (Math.PI/180) + ' * ');
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
      let resultStr;
      if (Math.abs(result) > 1e10) {
        resultStr = result.toExponential(6);
      } else {
        resultStr = result.toString();
      }
      
      // Add to history
      addToHistory(display.value, resultStr);
      display.value = resultStr;
    } else {
      display.value = result.toString();
    }
    
    playSound('calculate');
  } catch (error) {
    display.value = "Error";
    display.classList.add('error');
    playSound('error');
    setTimeout(() => {
      if (display.value === "Error") {
        display.value = "";
      }
      display.classList.remove('error');
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
updateHistoryDisplay();