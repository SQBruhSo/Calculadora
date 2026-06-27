const display = document.getElementById('display');
let currentInput = '0';
let shouldResetDisplay = false;

// Actualiza la interfaz visual
function updateDisplay() {
    display.innerText = currentInput;
}

// Añade un número a la pantalla
function appendNumber(number) {
    if (currentInput === '0' || shouldResetDisplay) {
        currentInput = number;
        shouldResetDisplay = false;
    } else {
        // Evita poner múltiples puntos decimales en un mismo número
        if (number === '.' && currentInput.split(/[\+\-\*\/]/).pop().includes('.')) return;
        currentInput += number;
    }
    updateDisplay();
}

// Añade un operador (+, -, *, /)
function appendOperator(operator) {
    if (shouldResetDisplay) shouldResetDisplay = false;
    
    const lastChar = currentInput.slice(-1);
    
    // Si el último carácter ya es un operador, lo reemplaza por el nuevo
    if (['+', '-', '*', '/'].includes(lastChar)) {
        currentInput = currentInput.slice(0, -1) + operator;
    } else {
        currentInput += operator;
    }
    updateDisplay();
}

// Limpia toda la pantalla
function clearDisplay() {
    currentInput = '0';
    updateDisplay();
}

// Elimina el último carácter ingresado (Backspace)
function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// Realiza el cálculo matemático de la expresión de forma segura
function calculate() {
    try {
        // Reemplaza cualquier operador pendiente al final antes de evaluar
        const lastChar = currentInput.slice(-1);
        if (['+', '-', 'x', '/'].includes(lastChar)) {
            currentInput = currentInput.slice(0, -1);
        }

        // Evalúa la cadena matemática. Usamos Function en lugar de eval por buenas prácticas
        let result = new Function(`return ${currentInput}`)();
        
        // Manejo de divisiones por cero o resultados no válidos
        if (result === Infinity || isNaN(result)) {
            currentInput = 'Error';
        } else {
            // Redondea a 4 decimales máximo para evitar problemas de coma flotante de JS
            currentInput = Number(result.toFixed(4)).toString();
        }
        
        shouldResetDisplay = true;
    } catch (error) {
        currentInput = 'Error';
        shouldResetDisplay = true;
    }
    updateDisplay();
}
