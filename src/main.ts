import './style.css'; //これを忘れるとviteは読み込まない

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
    return result.toExponential(7); // 小数点以下7桁の指数表記
  }
  return resultStr.slice(0, 8);
}

function calculate() {
  const num1 = parseFloat(previousInput);
  const num2 = parseFloat(currentInput);

  if (operator === '/' && num2 === 0) {
    updateDisplay('エラー');
    console.error('0除算エラー: ', `${num1} / ${num2}`);
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
      updateDisplay('0');
      return;
    }

    // イコール押下
    if (value === 'equal') {
      if (currentInput && previousInput && operator) {
        calculate();
      }
      return;
    }

    // 演算子 (+ - * /)
    if (['+', '-', '*', '/'].includes(value)) {
      // 入力直後に演算子だけ連打された場合は上書き
      if (!currentInput && previousInput) {
        operator = value;
        return;
      }

      // マイナス記号を符号として許可
      if (value === '-' && !currentInput && !previousInput) {
        currentInput = '-';
        updateDisplay(currentInput);
        return;
      }

      if (currentInput) {
        operator = value;
        previousInput = currentInput;
        currentInput = '';
      }
      return;
    }

    // 小数点入力
    if (value === '.') {
      if (!currentInput || currentInput.includes('.') || justCleared) return;
    }

    // justCleared直後に演算子や小数点は無効
    if (justCleared) {
      if (value !== '-' && isNaN(Number(value))) return;
      justCleared = false;
    }

    // 入力が8桁を超える場合は無視
    const noDotLength = (currentInput + value).replace('.', '').length;
    if (noDotLength > 8) return;

    currentInput += value;
    updateDisplay(currentInput);
  });
});
