class Calculator {

    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperandTextElement.innerText = '';
        this.previousOperandTextElement.innerText = '';
        this.previousOperand = '';
        this.currentOperand = '';
        this.operation = '';
    }

    delete() {
        // If the current operand is a result of a calculation we can't change it!
        if( typeof(this.currentOperand) !== 'string') return;
        // In other cases let's try to delete the last character of current operand 
        this.currentOperand = this.currentOperand.slice(0,-1);
    }

    appendNumber(number) {
        // If the current operand is a result of a calculation we can't change it!
        if(typeof(this.currentOperand) !== 'string') return;
        // If we get a comma but we already have got it - leave it!
        if( number === '.' && this.currentOperand.includes('.') ) return;
        // Otherwise add number to the current operand
        this.currentOperand =  this.currentOperand.toString() + number.toString();
    }

    
    computeUnoOperation(operation) {
        let result;
        const curr = parseFloat(this.currentOperand);

        if( isNaN(curr) ) return;

        switch(operation) {
            case '1/x': 
                result = 1 / curr;
                break;
            case '±':
                result = - curr;
                break;
            default: 
                return;
        }
        this.currentOperand = result;
    }

    chooseDuoOperation(operation) {
        if(this.currentOperand === '' || this.currentOperand === '.') return;

        if(this.previousOperand !== '') this.compute(); 

        switch(operation){
            case 'n√x':
                this.operation = 'yroot';
                break;
            case 'xn':
                this.operation = '^';
                break;
            case 'lgn':
                this.operation = 'log';
                break;
            default:
                this.operation = operation;        
        }
        //this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let result;
        const prev = parseFloat(this.previousOperand),
              curr = parseFloat(this.currentOperand);

        if( isNaN(prev) || isNaN(curr) ) return;

        switch(this.operation) {
            case '+': 
                if( isNaN(prev) ) return;
                result = prev + curr;
                break;
            case '-':
                if( isNaN(prev) ) return;
                result = prev - curr;
                break;
            case '*':
                result = prev * curr;
                break;
            case '÷':
                result = prev / curr;
                break;
            case 'yroot':
                result = prev ** (1 / curr);
                break;
            case '^':
                result = prev ** curr;
                break;
            case 'log':
                result = Math.log(prev) / Math.log(curr);
                break;
            default: 
                return;
        }

        this.currentOperand = result;
        this.previousOperand = '';
        this.operation = '';
    }

    getDisplayNumber(number) {

        if(number !== number || typeof(number) === 'string' ) return number;
        else return parseFloat(number.toPrecision(10));

        // const stringNumber = number.toString(),
        //       integerPart = parseFloat(stringNumber.split('.')[0]),
        //       decimalPart = stringNumber.split('.')[1];
        // let display = number;

        // if(isNaN(integerPart)) display = '';
        // else display = integerPart.toLocaleString('en', { maximumFractionDigits:0} );

        // if( decimalPart != null ) return `${display}.${decimalPart}`;
        // else return display;
    }

    updateDisplay(updateAllValues = true) {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);

        if(!updateAllValues) return;

        if( this.operation != '' ) {
            this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

const numberButtons = document.querySelectorAll('[data-number]');
const duoOperationButtons = document.querySelectorAll('[data-duo-operation]');
const unoOperationButtons = document.querySelectorAll('[data-uno-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => { 
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay(); // update display both for current and previous values
    });
});

unoOperationButtons.forEach(button => { 
    button.addEventListener('click', () => {
        calculator.computeUnoOperation(button.innerText);
        calculator.updateDisplay(false); // update display only current value!
    });
});

duoOperationButtons.forEach(button => { 
    button.addEventListener('click', () => {
        calculator.chooseDuoOperation(button.innerText);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
});

allClearButton.addEventListener('click', button => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', button => {
    calculator.delete();
    calculator.updateDisplay();
});


