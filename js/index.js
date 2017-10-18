// TODO show $ and , in form field


// Set rate of inflation and rate of return based on decades-long averages
const rateReturn = .073;
const rateInflation = .033;

function eventListeners() {
     // Simplify testing
     document.addEventListener('DOMContentLoaded', testData);
     
     // On Calculate Button, capture data and trigger calculation
     document.getElementById('calculate').addEventListener('click', captureData);
     
     // On Enter, capture data and trigger calculation
     document.addEventListener('keypress', function(event) {
          if (event.keyCode == 13) {
               captureData();
          }
     });
     
     // On Calculate Button, track when form inputs change and trigger calculation
     document.getElementById('calculate').addEventListener('click', secondaryListeners);
}



// After initial calc, listen for changes to data and auto-update
function secondaryListeners() {
     var questionList = document.querySelectorAll('.entry-box');
     for (var i = 0; i < questionList.length; i++) {
          questionList[i].addEventListener('change', captureData);
     }
}


// Capture data user entered and  error handling
function captureData() {
     
     // Object to store for each input
     function Inputs(val, elementID, errorMessage, isValid) {
          this.val = val;
          this.elementID = elementID;
          this.errorMessage = errorMessage;
          this.isValidNum = function isValidNum () {
               // Basic validation, to return numbers
               if ((this.val) || (this.val >= 0)) {
                    this.val = this.val.replace(/[\-|&;\$%@"<>\(\)\+,]/g, '');
                    parseFloat(this.val);
                    return this.val;
               } else {
                    return false;
               }
          }
          this.addErrorDiv = function addErrorDiv () {
               // Create new div with error text
               var errorDiv = document.createElement('div');
               errorDiv.className = ('error');
               var errorMessDiv = document.createTextNode(this.errorMessage);
               errorDiv.appendChild(errorMessDiv); //add the text node to the newly created div.
          
               // Place new error div under corresponding field
               var errorDivCurrent = document.getElementById(this.elementID).parentNode.parentNode;
               var errorDivNext = document.getElementById(this.elementID).parentNode.nextElementSibling;
               errorDivCurrent.insertBefore(errorDiv, errorDivNext);
          }
     };
               
     
     // Data for each input including customized error messages
     var ageObj = new Inputs(document.getElementById('age').value, 'age', 'Hmm, are these ages correct? Please take a look and try again.');
     
     var retireObj = new Inputs(document.getElementById('age-retire').value, 'age-retire', 'Zoikes! This calculator is optimized for folks who will retire in the future. Please update the ages you input.');

     var deathObj = new Inputs(document.getElementById('age-death').value, 'age-death', 'Oh man... This calculator expects you will die AFTER you retire. Please double-check the ages you input.');

     var savedObj = new Inputs(document.getElementById('saved').value, 'saved', 'Whooheee, please enter a number... And, we know the amount might be zilch.');

     var expensesObj = new Inputs(document.getElementById('expenses').value, 'expenses', 'Yowza! We\'re expecting your expenses will be AT LEAST  $6,000 per year... Please try again.');
     

     clearError();
     
     // Track toggle if there are errors in inputs
     var errorCheck = true;
     
     // Check if data in each input box is present and valid
     // Then, calculate the result

     if (!ageObj.isValidNum()) {
          ageObj.addErrorDiv();
          errorCheck = false;
     }
     if (!retireObj.isValidNum() || (ageObj.val > retireObj.val)) {
          retireObj.addErrorDiv();
          errorCheck = false;
     }
     if (!deathObj.isValidNum() || (retireObj.val > deathObj.val)) {
          deathObj.addErrorDiv();
          errorCheck = false;
     }
     if (!expensesObj.isValidNum() || (expensesObj.val < 6000)) {
          expensesObj.addErrorDiv();
          errorCheck = false;
     }
     if (!savedObj.isValidNum()) {
          savedObj.addErrorDiv();
          errorCheck = false;
     }
     
     if (errorCheck === true)  {
          console.log(`Age: ${ageObj.val}. Retirement: ${retireObj.val}. Life expectancy: ${deathObj.val}. Saved: ${savedObj.val}. Expenses: ${expensesObj.val}.`);
          calculate(ageObj.val, retireObj.val, deathObj.val, savedObj.val, expensesObj.val);
     } else {
          hideResults();
     }
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
     document.querySelector('.results').setAttribute('style', 'display: block');
     document.querySelector('.results').innerHTML = (`You should be saving about <strong><font color="#21BFE1">${saveAnnual.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 4 })}</font></strong> per year.`);
     // console.log(`And you should save ${saveAnnual} each year.`);
     
}

// Hide results in case of follow up calculation and error
function hideResults () {
     document.querySelector('.results').setAttribute('style', 'display: none, height: 3em');
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
     document.getElementById('saved').value = `$0`;
     document.getElementById('expenses').value = `$10,000`;
}


eventListeners();



///////////////////////////////////////////////////////////////
// Key Formulas to port from 2013 JAVA and Excel versions:
// Excel FV: interest_rate, number_payments, payment, PV, Type
// double fv = FV(0.033, i - age, 0.0, annual_expenses, 0);
// Excel PV: PV (rate, nper, pmt, [fv], [type])
// double pv = PV(0.073, 1, fv, -net, 0);
// net = pv;
