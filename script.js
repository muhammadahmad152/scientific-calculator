
// DOM Elements Initialization

const display = document.getElementById('result');
const buttons = document.querySelectorAll('.buttons button');

// Mouse Click Event Listeners

buttons.forEach(button => {
    button.addEventListener('click', () => {
        // Extract button properties and attributes
        const text = button.textContent;
        const action = button.getAttribute('data-action');
        const value = button.getAttribute('data-value');

        // Handle numeric button clicks
        if (button.classList.contains('number')) {
            if (display.value === '0') {
                display.value = text;
            } else {
                display.value += text;
            }
        }

        // Handle decimal point logic to prevent multiple decimals in a single number
        else if (button.classList.contains('decimal')) {
            const parts = display.value.split(/[\+\-\*\/\(\)]/);
            const lastPart = parts[parts.length - 1];
            if (!lastPart.includes('.')) {
                display.value += '.';
            }
        }
        // Handle mathematical operators and special actions (e.g., delete, power)
        else if (button.classList.contains('operator')) {
            if (action === 'delete') {
                // Reset to '0' if deleting the last character or clearing an error state
                if (display.value.length === 1 || display.value === 'Error') {
                    display.value = '0';
                } else {
                    display.value = display.value.slice(0, -1);
                }
            } else if (action === 'pow') {
                display.value += '**';
            } else {
                // Prevent invalid starting operators, except for negative signs or open brackets
                if (display.value === '0' && (text === '-' || text === '(')) {
                    display.value = text;
                } else if (display.value !== '0' || text === '(') {
                    display.value += text;
                }
            }
        }
        // Handle mathematical constants (e.g., Pi, Euler's number)
        else if (button.classList.contains('constant')) {
            if (display.value === '0') {
                display.value = value;
            } else {
                display.value += value;
            }
        }
        // Handle All Clear (AC) functionality
        else if (action === 'clear') {
            display.value = '0';
        }
        // Handle scientific functions (sin, cos, tan, log, etc.)
        else if (button.classList.contains('func')) {
            try {
                let val = parseFloat(display.value);
                if (isNaN(val)) val = 0;

                // Execute the specific scientific function
                switch (action) {
                    case 'sin':
                        display.value = Math.sin(val * Math.PI / 180); // Convert degrees to radians
                        break;
                    case 'cos':
                        display.value = Math.cos(val * Math.PI / 180);
                        break;
                    case 'tan':
                        display.value = Math.tan(val * Math.PI / 180);
                        break;
                    case 'log':
                        display.value = Math.log10(val);
                        break;
                    case 'ln':
                        display.value = Math.log(val);
                        break;
                    case 'sqrt':
                        display.value = Math.sqrt(val);
                        break;
                    case 'square':
                        display.value = Math.pow(val, 2);
                        break;
                }
            } catch (e) {
                display.value = 'Error';
            }
        }
        // Evaluate the final mathematical expression
        else if (button.classList.contains('equal')) {
            try {
                // Standardize operator symbols for JavaScript evaluation
                let expression = display.value
                    .replace(/×/g, '*')
                    .replace(/÷/g, '/');

                // Safely evaluate the expression
                let result = Function('"use strict"; return (' + expression + ')')();
                display.value = result;
            } catch (e) {
                display.value = 'Error'; // Catch syntax or calculation errors
            }
        }
    });
});


// Keyboard Event Listeners
document.addEventListener('keydown', (event) => {
    const key = event.key;

    // Define valid simple keys (numbers, basic operators, decimal, brackets)
    const simpleKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '.', '(', ')'];

    // Map simple keys to their corresponding DOM buttons
    if (simpleKeys.includes(key)) {
        event.preventDefault(); // Prevent default browser actions (e.g., Quick Find on '/')

        // Find the button with matching text and trigger a click event
        const btn = Array.from(buttons).find(b => b.textContent === key);
        if (btn) btn.click();
    }
    // Map 'Enter' or '=' to the Equal button
    else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        const btn = document.querySelector('.equal');
        if (btn) btn.click();
    }
    // Map 'Backspace' to the Delete (DEL) button
    else if (key === 'Backspace') {
        event.preventDefault();
        const btn = document.querySelector('[data-action="delete"]');
        if (btn) btn.click();
    }
    // Map 'Escape' to the All Clear (AC) button
    else if (key === 'Escape') {
        event.preventDefault();
        const btn = document.querySelector('[data-action="clear"]');
        if (btn) btn.click();
    }
    // Map 'e' to Euler's Number (e) constant
    else if (key === 'e') {
        event.preventDefault();
        const btn = document.querySelector('.constant[data-value="2.71828182846"]');
        if (btn) btn.click();
    }
    // Map 'p' or 'P' to the Pi (π) constant
    else if (key === 'p' || key === 'P') {
        event.preventDefault();
        const btn = document.querySelector('.constant[data-value="3.14159265359"]');
        if (btn) btn.click();
    }
});