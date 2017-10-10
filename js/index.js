// TODO  UI
// 2. Move focus of cursor through form fields.

const rateReturn = .073;
const rateInflation = .033;

function eventListeners() {
     document.addEventListener('DOMContentLoaded', reset);
     document.getElementById('calculate').addEventListener('click', captureCalculate);
}

function reset() {
     document.getElementById('age').value = "";
     document.getElementById('age-retire').value = "";
     document.getElementById('age-death').value="";
     document.getElementById('saved').value="$";
     document.getElementById('expenses').value="$";
}


function captureCalculate() {
     // Capture data user entered and error handling
     let age = document.getElementById('age').value;
     parseFloat(age);
     if (!age) {
          alert("Please enter your age.");
     }
     
     let ageRetire = document.getElementById('age-retire').value;
     if (!ageRetire) {
          document.getElementById('age-retire').value = 65;
     }
     parseFloat(ageRetire);
     
     let ageDeath = document.getElementById('age-death').value;
     if (!ageDeath) {
          document.getElementById('age-death').value = 85;
     }
     parseFloat(ageDeath);
     
     let saved = document.getElementById('saved').value;
     if (!saved) {
          document.getElementById('saved').value = '$0';
     }
     if (saved.includes('$')) {
          saved = saved.replace('$', '');
     }
     parseFloat(saved);
     
     let expenses = document.getElementById('expenses').value;
     if (!expenses) {
          alert("Please add your approximate annual expenses.");
     }
     if (expenses.includes('$')) {
          expenses = expenses.replace('$', '');
     }
     parseFloat(expenses);
     
     console.log(`Your age is ${age}. You will retire at ${ageRetire}. You will die at ${ageDeath}. You have ${saved} saved for retirement. You have ${expenses} in expenses.`);
     
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
     
}






eventListeners();



// Key Formulas to port from 2013 JAVA and Excel versions:
// Excel FV: interest_rate, number_payments, payment, PV, Type
// double fv = FV(0.033, i - age, 0.0, annual_expenses, 0);
// Excel PV: PV (rate, nper, pmt, [fv], [type])
// double pv = PV(0.073, 1, fv, -net, 0);
// net = pv;
