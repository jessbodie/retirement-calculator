
// Set rate of inflation and rate of return based on decades-long averages
const rateReturn = .073;
const rateInflation = .033;

function eventListeners() {
     document.addEventListener('DOMContentLoaded', testData);
     document.getElementById('calculate').addEventListener('click', captureData);
     document.getElementById('calculate').addEventListener('click', secondaryListeners);
     document.getElementById('calculate').addEventListener('click', addErrorDiv);
     // TODO Add Enter key to mimic Calculate button

}

// After initial calc, listen for changes to data and auto-update
function secondaryListeners() {
     var questionList = document.querySelectorAll('.entry-box');
     for (var i = 0; i < questionList.length; i++) {
          questionList[i].addEventListener('change', captureData);
     }
}



function captureData() {
     // Capture data user entered and error handling
     let age = document.getElementById('age').value;
     if (!isValidAge(age)) {
          alert("Please enter your age.");
     }
     
     let ageRetire = document.getElementById('age-retire').value;
     if (!isValidAge(ageRetire)) {
          document.getElementById('age-retire').value = 65;
     }
          
     let ageDeath = document.getElementById('age-death').value;
     if (!isValidAge(ageDeath)) {
          document.getElementById('age-death').value = 85;
     }
          
     let saved = document.getElementById('saved').value;
     // ASK IAN ABOUT THESE IF STATEMENTS
     if (!isValidAmount(saved)) {
          document.getElementById('saved').value = '$0';
     }
          
     let expenses = document.getElementById('expenses').value;
     if (!isValidAmount(expenses)) {
          alert("Please add your approximate annual expenses.");
     }
     
     var newDiv = document.createElement("div");
     
     switch (true) {
          case (age > ageRetire):
               var testoo = document.querySelector('.question-text').appendChild('<div class="error"><b>butt</b></div>');
               newDiv.appendChild(document.createTextNode("So much testing"));
               console.log("Uh oh, looks like there's something funny about your current and retirement ages. Please take a look.");
          case (ageRetire > ageDeath):
               // alert("Doah! Please check your retirement age or life expectancy.");
               document.getElementById('age-retire').innerHTML = '</input><div class="error">ageretire</div>';

          case (saved < 0):
               alert("Hmmm, something's not right with how much you currently have saved. Please take a look.");

          case (expenses < 0):
               alert("Yikes... something's not rightwith your approximate expenses. Please check.");
          default:
               {
               console.log(`Your age is ${age}. You will retire at ${ageRetire}. You will die at ${ageDeath}. You have ${saved} saved for retirement. You have ${expenses} in expenses.`);
               calculate(age, ageRetire, ageDeath, saved, expenses);
          }
     }

     // TODO More error checking?: return str.replace (/^\s+|\s+$/g, '');

}


function addErrorDiv () {
     clearError();
     
     // Create new div with error text
     var errorDiv = document.createElement('div');
     errorDiv.className = ('error');
     var errorMessage = document.createTextNode('WORK WORK');
     errorDiv.appendChild(errorMessage); //add the text node to the newly created div.

     // Place new error div under corresponding field
     var errorDivCurrent = document.getElementById('saved').parentNode.parentNode;
     var errorDivNext = document.getElementById('saved').parentNode.nextElementSibling;
     errorDivCurrent.insertBefore(errorDiv, errorDivNext);
}

// Clear previously shown errors
function clearError () {
     var errorList = document.querySelectorAll('.error');
     for (var i = 0; i < errorList.length; i++) {
          errorList[i].remove();
     }
}


function calculate (age, ageRetire, ageDeath, saved, expenses) {
     // Calc time periods in preparation for the PV and FV calcs
     let yearsUntilRetirement = ageRetire - age;
     let yearsWithdrawing = ageDeath - ageRetire;

     // Interim calcs of rate over periods to simplify PV and PMT formulas
     let x = Math.pow(1 + rateReturn, yearsUntilRetirement);
     const nper = 1;
     let z = Math.pow(1 + rateReturn, -nper);
     let y = Math.pow(1 + rateReturn, nper);
     
     // Iniviate key calc variables
     let retirementExpenses = saved;
     let pv;
     let fv = 0;
     
     // Calc expenses during retirement years
     for (var i = ageDeath-1; i >= ageRetire; i--) {
          // Calc FV of costs each year
          // Formula for fv = pv * (1 + (rate / freq))^periods
          fv = expenses * Math.pow((1 + (rateInflation / 1)),(i - age));
          
          // Calculate PV needed to cover future costs
          // Thanks for the PV formula: http://www.mohaniyer.com/old/pvcode.htm
          pv = - ( z * (-1 * retirementExpenses * rateReturn - fv + y * fv )) / rateReturn;
          
          retirementExpenses = pv;
          //console.log(`counter is: ${i-age} and fv is: ${fv} and pv is ${pv}`);
     }
     
     
     // Calculate annual PMT amount to save to cover future expenses
     let saveAnnual = -1 * Math.round(((rateReturn * (retirementExpenses + x * saved))/(-1 + x)));

     // On click show amount needed to save
     document.querySelector('.results').innerHTML = (`You should be saving about <strong><font color="#21BFE1">${saveAnnual.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 4 })}</font></strong> per year.`);
     console.log(`And you should save ${saveAnnual} each year.`);
     
}

// Validate age inputs
function isValidAge (a) {
     if (!a) {
          return false;
     } else {
          parseFloat(a);
          return a;
     }
}

// Validate dollar amounts inputs
function isValidAmount (amt) {
     if (!amt) {
          return false;
     } else if (amt.includes('$') || amt.includes(',')) {
          amt = amt.replace('$', '');
          amt = amt.replace(',', '');
     }
     parseFloat(amt);
     return amt;
}

function reset() {
     document.getElementById('age').value = "";
     document.getElementById('age-retire').value = "";
     document.getElementById('age-death').value="";
     document.getElementById('saved').value="$";
     document.getElementById('expenses').value="$";
}


function test () {
     console.log("test");
}

function testData () {
     document.getElementById('age').value = 30;
     document.getElementById('age-retire').value = 65;
     document.getElementById('age-death').value = 85;
     document.getElementById('saved').value = 0;
     document.getElementById('expenses').value = 10000;
}


eventListeners();



///////////////////////////////////////////////////////////////
// Key Formulas to port from 2013 JAVA and Excel versions:
// Excel FV: interest_rate, number_payments, payment, PV, Type
// double fv = FV(0.033, i - age, 0.0, annual_expenses, 0);
// Excel PV: PV (rate, nper, pmt, [fv], [type])
// double pv = PV(0.073, 1, fv, -net, 0);
// net = pv;
