// Get the display element, as we'll be working with it constantly
let display = document.querySelector('.display span');

// Get the font set in the CSS file since we'll need to modify it
display.style.font = window.getComputedStyle(display).getPropertyValue('font');

// Create a boolean variable to check if a dot can be placed
// Create it here so that it is not created every time a click event occurs
let enableDot = true;

// Add a click event handler to any element in the rows
document.querySelector('.rows').addEventListener("click", function (event) {

  // If the previous calculation resulted in division by zero or only operations were entered
  if (display.innerText == 'NaN') display.innerText = '0';

  // If a digit or a dot is clicked
  if (event.target.classList == 'button number') {

    // If the dot is clicked and it can be placed after a digit
    if (event.target.innerText == '.') {
      if (enableDot && LastIsDigit(display.innerText)) {
        display.innerText += '.';
        enableDot = false;
      }
    }

    // If a number is clicked and the display shows the default value
    else if (display.innerText == '0') display.innerText = event.target.innerText;

    // In other cases, if '%' is not at the end of the string
    else if (!display.innerText.endsWith('%')) display.innerText += event.target.innerText;
  }

  else if (event.target.classList == 'button operation') {

    // After clicking an operation element, a dot can be placed in a number again, except when deleting one element
    if (event.target.innerText != '<') enableDot = true;

    // Clearing the content
    if (event.target.innerText == 'C') {
      display.innerText = '0';
    }

    // Deleting the last element
    else if (event.target.innerText == '<') {
      if (display.innerText.length == 1) display.innerText = '0';
      else {
        if (display.innerText.endsWith('.')) enableDot = true;
        display.innerText = display.innerText.slice(0, -1);
      }
    }

    // Adding the '%' sign
    else if (event.target.innerText == '%' && LastIsDigit(display.innerText)) {
      display.innerText += '%';
    }

    // Adding the subtraction operation or the sign of a negative number
    else if (event.target.innerText == '-') {
      if (display.innerText == '0') display.innerText = '-';
      else if (LastIsDigit(display.innerText) || LastIsOperation(display.innerText)) {
        if (display.innerText.endsWith('(-'));
        else if (LastIsNegativNumber(display.innerText)) display.innerText += ')-';
        else if (LastIsOperation(display.innerText)) display.innerText += '(-';
        else display.innerText += '-';
      }
    }

    // Adding the operation: addition, division, or multiplication
    else if (event.target.innerText == '+' || event.target.innerText == 'x' || event.target.innerText == '/') {
      if (LastIsDigit(display.innerText)) {
        if (LastIsNegativNumber(display.innerText)) display.innerText += `)${event.target.innerText}`;
        else display.innerText += event.target.innerText
      }
      else if (display.innerText.endsWith('%')) display.innerText += event.target.innerText
    }

    // Adding the '√' sign
    else if (event.target.innerText == '√') {
      if (display.innerText == '0') display.innerText = '√';
      else if (LastIsNegativNumber(display.innerText)) display.innerText += ')√';
      else if (!display.innerText.endsWith('√') && !display.innerText.endsWith('.')) display.innerText += '√';
    }

    // Calculating the result
    else if (event.target.innerText == '=') {
      display.innerText = getResault(display.innerText);
    }

  }
  // Adjust font size and text length to fit the display dimensions
  resizeFont(display);

});

function LastIsDigit(str) // Function to check if a string ends with a digit
{
  let digitRegex = /\d$/;
  return digitRegex.test(str);
}

function LastIsOperation(str) // Function to check if a string ends with an operation sign
{
  let operationRegex = /(\+|\-|\x|\/)$/;
  return operationRegex.test(str);
}

function LastIsNegativNumber(str) // Function to check if a string ends with a negative number
{
  let negativNumber = /(\(\-\d+\.?\d*)$/;
  return negativNumber.test(str);
}

function resizeFont(di) { // Function to adjust the font size of the text to fit the display

  if (di.style.fontSize == '50px' && di.offsetHeight > di.parentElement.clientHeight) di.style.fontSize = '25px';

  else if (di.style.fontSize == '25px' && di.offsetWidth < di.parentElement.clientWidth / 2) di.style.fontSize = '50px';

  else if (di.offsetHeight > di.parentElement.clientHeight) di.innerText = di.innerText.slice(0, -1);

}

function getResault(str) {
  // Remove parentheses from the string if they exist
  // Remove unnecessary signs from the string
  // Replace subtraction with addition of a negative number to avoid running another loop

  str = str.replace(/\(|\)/g, '').replace(/\-\-/g, '+').replace(/\+\-/g, '-');

  let reg;

  // Write a regular expression for percentage multiplication, perform the multiplication, and write the result to the string
  reg = /(\-?\d+\.?\d*)\x(\-?\d+\.?\d*)\%/;

  while ((value = reg.exec(str)) !== null) {

    let newText = parseFloat(value[1]) * (parseFloat(value[2]) / 100);
    str = str.replace(value[0], newText);
  }

  // Same for division
  reg = /(\-?\d+\.?\d*)\/(\-?\d+\.?\d*)\%/;

  while ((value = reg.exec(str)) !== null) {
    if (parseFloat(value[1]) == 0 || parseFloat(value[2]) == 0) {
      str = NaN;
      return str;
    }
    let newText = parseFloat(value[1]) / (parseFloat(value[2]) / 100);
    str = str.replace(value[0], newText);
  }

  // Same for square root
  reg = /(\-?\d+\.?\d*)?\√(\-?\d+\.?\d*)/

  while ((value = reg.exec(str)) !== null) {

    let newText;

    if (value[1] !== undefined) newText = parseFloat(value[1]) * Math.sqrt(parseFloat(value[2]));
    else newText = Math.sqrt(parseFloat(value[2]));

    str = str.replace(value[0], newText);
  }

  // Same for regular multiplication
  reg = /(\-?\d+\.?\d*)\x(\-?\d+\.?\d*)/;

  while ((value = reg.exec(str)) !== null) {

    let newText = parseFloat(value[1]) * parseFloat(value[2]);
    str = str.replace(value[0], newText);
  }

  // Some for regular division
  reg = /(\-?\d+\.?\d*)\/(\-?\d+\.?\d*)/;

  while ((value = reg.exec(str)) !== null) {
    if (parseFloat(value[1]) == 0 || parseFloat(value[2]) == 0) {
      str = NaN;
      return str;
    }
    let newText = parseFloat(value[1]) / parseFloat(value[2]);
    str = str.replace(value[0], newText);
  }

  // Since executing all addition operations first, and then all subtraction operations, might lead to incorrect results
  // Replace subtraction with addition of a negative number and perform all operations as they are written in the string
  str = str.replace(/\-/g, '+-').replace(/^\+/, '');

  reg = /^(\-?\d+\.?\d*)\%/;

  if ((value = reg.exec(str)) !== null) {
    let newText = parseFloat(value[1]) / 100;
    str = str.replace(value[0], newText);
  }

  reg = /(\-?\d+\.?\d*)\+((\-?\d+\.?\d*)\%|(\-?\d+\.?\d*))/;

  while ((value = reg.exec(str)) !== null) {
    let newText;
    // Check if addition with a percentage of the previous number is being performed
    if (value[2].endsWith('%')) newText = parseFloat(value[1]) + (parseFloat(value[1]) * parseFloat(value[3]) / 100);
    else newText = parseFloat(value[1]) + parseFloat(value[2]);
    str = str.replace(value[0], newText);
  }

  return parseFloat(str);
}

