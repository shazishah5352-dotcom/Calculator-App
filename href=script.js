// Get display element
const display = document.getElementById('display');

// Variables
let currentInput = '';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

// Update display function
function updateDisplay(value) {
    display.value = value || '0';
}

// Add to display
function appendNumber(number) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    // Prevent multiple decimals
    if (number === '.' && currentInput.includes('.')) return;
    
    // Prevent leading zeros
    if (number === '0' && currentInput === '0') return;
    
    currentInput += number;
    updateDisplay(currentInput);
}

// Choose operator
function chooseOperator(op) {
    if (currentInput === '') return;
    
    if (previousInput !== '') {
        calculate();
    }
    
    operator = op;
    previousInput = currentInput;
    currentInput = '';
    shouldResetDisplay = false;
}

// Calculate result
function calculate() {
    if (previousInput === '' || currentInput === '' || operator === null) return;
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                updateDisplay('Error');
                clearAll();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Round to avoid floating point issues
    result = Math.round(result * 1000000) / 1000000;
    
    currentInput = result.toString();
    operator = null;
    previousInput = '';
    shouldResetDisplay = true;
    updateDisplay(currentInput);
}

// Clear everything
function clearAll() {
    currentInput = '';
    previousInput = '';
    operator = null;
    shouldResetDisplay = false;
    updateDisplay('0');
}

// Delete last character
function deleteLast() {
    if (shouldResetDisplay) {
        clearAll();
        return;
    }
    
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput || '0');
}

// Handle keyboard support (Bonus feature)
function handleKeyboard(e) {
    const key = e.key;
    
    // Numbers
    if (/[0-9]/.test(key)) {
        e.preventDefault();
        appendNumber(key);
    }
    // Decimal
    else if (key === '.') {
        e.preventDefault();
        appendNumber('.');
    }
    // Operators
    else if (key === '+') {
        e.preventDefault();
        chooseOperator('+');
    }
    else if (key === '-') {
        e.preventDefault();
        chooseOperator('-');
    }
    else if (key === '*') {
        e.preventDefault();
        chooseOperator('*');
    }
    else if (key === '/') {
        e.preventDefault();
        chooseOperator('/');
    }
    // Equals
    else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
    }
    // Clear
    else if (key === 'Escape') {
        e.preventDefault();
        clearAll();
    }
    // Delete
    else if (key === 'Backspace') {
        e.preventDefault();
        deleteLast();
    }
}

// Add event listeners to all buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        const text = button.textContent;
        
        if (button.classList.contains('number')) {
            appendNumber(text);
        }
        else if (button.classList.contains('operator')) {
            chooseOperator(text);
        }
        else if (button.classList.contains('equals')) {
            calculate();
        }
        else if (button.classList.contains('clear')) {
            clearAll();
        }
        else if (button.classList.contains('delete')) {
            deleteLast();
        }
    });
});

// Keyboard event listener (Bonus feature)
document.addEventListener('keydown', handleKeyboard);

// Add keyboard hint
const hint = document.createElement('div');
hint.className = 'keyboard-hint';
hint.textContent = '💡 Tip: Use keyboard! (0-9, +, -, *, /, Enter, Escape, Backspace)';
document.querySelector('.calculator').appendChild(hint);

// Initial display
updateDisplay('0');
