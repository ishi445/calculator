import './style.css'; // これを忘れると Vite は読み込まない

const formula = document.getElementById('formula') as HTMLDivElement;
const display = document.getElementById('display') as HTMLDivElement;
const buttons = document.querySelectorAll('.btn');

function updateDisplay(main: string, expression: string = '') {
  display.textContent = main;
  formula.textContent = expression;
}

let currentInput = '';
let previousInput = '';
let operator = '';
let justCleared = false;

function formatResult(result: number): string {
  const resultStr = result.toString();
  if (
    resultStr.replace('.', '').length > 8 ||
    Math.abs(result) >= 1e8 ||
    (Math.abs(result) < 1e-8 && result !== 0)
  ) {
    return result.toExponential(7);
  }
  return resultStr.slice(0, 8);
}

function calculateStep(): string | null {
  const num1 = parseFloat(previousInput);
  const num2 = parseFloat(currentInput);

  if (operator === '/' && num2 === 0) {
    updateDisplay('エラー', `${previousInput} / ${currentInput}`);
    currentInput = '';
    previousInput = '';
    operator = '';
    return null;
  }

  let result: number;

  switch (operator) {
    case '+': result = num1 + num2; break;
    case '-': result = num1 - num2; break;
    case '*': result = num1 * num2; break;
    case '/': result = num1 / num2; break;
    default: return null;
  }

  const formatted = formatResult(result);
  return formatted;
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.getAttribute('data-value');
    if (!value) return;

    // クリア
    if (value === 'C') {
      currentInput = '';
      previousInput = '';
      operator = '';
      justCleared = true;
      updateDisplay('0', '');
      return;
    }

    // イコール
    if (value === 'equal') {
      if (currentInput && previousInput && operator) {
        const result = calculateStep();
        if (result !== null) {
          updateDisplay(result, `${previousInput} ${operator} ${currentInput} =`);
          currentInput = result;
          previousInput = '';
          operator = '';
        }
      }
      return;
    }

    // 演算子
    if (['+', '-', '*', '/'].includes(value)) {
      if (!currentInput && previousInput) {
        operator = value;
        updateDisplay(previousInput, `${previousInput} ${operator}`);
        return;
      }

      if (value === '-' && !currentInput && !previousInput) {
        currentInput = '-';
        updateDisplay(currentInput);
        return;
      }

      if (currentInput) {
        if (previousInput && operator) {
          const result = calculateStep();
          if (result === null) return;
          previousInput = result;
        } else {
          previousInput = currentInput;
        }

        operator = value;
        currentInput = '';
        updateDisplay('0', `${previousInput} ${operator}`);
      }
      return;
    }

    // justCleared直後に演算子・小数点は無効
    if (justCleared) {
      if (value !== '-' && isNaN(Number(value))) return;
      justCleared = false;
    }

    // 小数点
    if (value === '.') {
      if (currentInput.includes('.') || justCleared) return;
      if (!currentInput) currentInput = '0';
      currentInput += '.';
      updateDisplay(currentInput, previousInput && operator ? `${previousInput} ${operator}` : '');
      return;
    }

    // 8桁制限（小数点は含めない）
    const noDotLength = (currentInput + value).replace('.', '').length;
    if (noDotLength > 8) return;

    currentInput += value;
    updateDisplay(currentInput, previousInput && operator ? `${previousInput} ${operator}` : '');
  });
});
