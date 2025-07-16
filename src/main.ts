import './style.css'; // ← これを忘れると Vite は読み込まない


const display = document.getElementById('display') as HTMLDivElement;
const buttons = document.querySelectorAll('.btn');

let currentInput = '';
let previousInput = '';
let operator = '';

function updateDisplay(value: string) {
display.textContent = value;
}

function formatResult(result: number): string {
    const resultStr = result.toString();
    if (resultStr.replace('.', '').length > 8 || Math.abs(result) >= 1e8 || Math.abs(result) < 1e-8 && result !== 0) {
    return result.toExponential(7); // 指数表記（小数点以下7桁）
    }
  return resultStr.slice(0, 8); // 通常表記で8桁まで表示
}

function calculate() {
const num1 = parseFloat(previousInput);
const num2 = parseFloat(currentInput);

if (operator === '/' && num2 === 0) {
updateDisplay('エラー');
currentInput = '';
previousInput = '';
operator = '';
return;
}

let result: number;

switch (operator) {
case '+':
result = num1 + num2;
break;
case '-':
result = num1 - num2;
break;
case '*':
result = num1 * num2;
break;
case '/':
result = num1 / num2;
break;
default:
return;
}

const formatted = formatResult(result);
updateDisplay(formatted);
currentInput = formatted;
previousInput = '';
operator = '';
}

buttons.forEach(button => {
button.addEventListener('click', () => {
  const value = button.getAttribute('data-value');

    if (!value) return;

    if (value === 'C') {
    currentInput = '';
    previousInput = '';
    operator = '';
    updateDisplay('0');
    return;
    }

    if (value === 'equal') {
    if (currentInput && previousInput && operator) {
        calculate();
    }
    return;
    }

    if (['+', '-', '*', '/'].includes(value)) {
    if (currentInput) {
        operator = value;
        previousInput = currentInput;
        currentInput = '';
    }
    return;
    }

    // 数字または小数点入力
    if (value !== '.' && currentInput.replace('.', '').length >= 8) return;
    if (currentInput.length >= 8) return;

    currentInput += value;
    updateDisplay(currentInput);
});
});