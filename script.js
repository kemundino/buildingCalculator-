const display = document.getElementById("display");

// Function to append input to the display
function appendToDisplay(value) {
  display.value += value;
}

// Function to clear the display
function clearDisplay() {
  display.value = "";
}

// Function to delete the last character
function deleteLast() {
  display.value = display.value.slice(0, -1);
}

// Function to calculate the result
function calculateResult() {
  try {
    display.value = eval(display.value);
  } catch (error) {
    display.value = "Error";
  }
}

// Add event listener for keyboard input
document.addEventListener("keydown", (event) => {
  const key = event.key;

  // Handle number and operator keys
  if (/[0-9+\-*/.]/.test(key)) {
    appendToDisplay(key);
  }

  // Handle Enter key for calculation
  if (key === "Enter") {
    calculateResult();
  }

  // Handle Backspace key for deletion
  if (key === "Backspace") {
    deleteLast();
  }

  // Handle Escape key for clearing the display
  if (key === "Escape") {
    clearDisplay();
  }
});