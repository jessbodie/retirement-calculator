// TODO  UI
// 2. Move focus of cursor through form fields.
// TODO
// 2. Calculation for FV

const rateReturn = .073;
const rateInflation = .033;

function eventListeners() {

     document.getElementById('calculate').addEventListener('click', captureCalculate);
     
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
          let ageRetire = 65;
          document.getElementById('age-retire').value = 65;
     }
     parseFloat(ageRetire);
     
     let ageDeath = document.getElementById('age-death').value;
     if (!ageDeath) {
          let ageDeath = 85;
          document.getElementById('age-death').value = 85;
     }
     parseFloat(ageDeath);
     
     let saved = document.getElementById('saved').value;
     if (!saved) {
          let saved = 0;
          document.getElementById('saved').value = 0;
          console.log(saved);
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
          saved = expenses.replace('$', '');
     }
     parseFloat(expenses);
     
     // console.log(`Your age is ${age}. You will retire at ${ageRetire}. You will die at ${ageDeath}. You have ${saved} saved for retirement. You have ${expenses} in expenses.`);
     
     // Calc time periods in preparation for the PV and FV calcs
     let yearsUntilRetirement = ageRetire - age;
     let yearsWithdrawing = ageDeath - ageRetire;
     
     // Interim calc of rate over period
     let x = Math.pow(1 + rateReturn, yearsUntilRetirement);
     
     // Calc PV of total expenses to cover
     let net = saved;
     // console.log(net);


     
     for (var i = ageDeath-1; i >= ageRetire; i--) {
          // Calc future value of costs each year
          // Formula for fv = pv * (1 + (rate / freq))^periods
          fv = expenses * Math.pow((1 + (rateInflation / 1)),(i - age));
          
          pv = net / (1 + Math.pow(rateReturn, i-age));
          // console.log(pv);
          
          // TODO
          // Formula for pv = fv / (1 + (rate / freq))^periods
          //pv = fv * ((1 - (1 / (1 + rateReturn) * 1)) / rateReturn);
          // pv = -net * Math.pow((1 + (rateReturn / 1)), 1);
          // Formula for pv = ((PMT/period) - fv) * (1 / (1 +rate)) - (PMT / rate)
          // TODO
          // pv = fv * ((1 - (1 / (1 + rateReturn) * 1)) / rateReturn);
          
          
          net = pv;
          console.log(`counter is: ${i-age} and fv is: ${fv} and pv is ${pv}`);
          // From 2013 JAVA version:
          // FV: interest_rate, number_payments, payment, PV, Type
          // double fv = FV(0.033, i - age, 0.0, annual_expenses, 0);
          // PV: PV (rate, nper, pmt, [fv], [type])
          // double pv = PV(0.073, 1, fv, -net, 0);
          // net = pv;
     }
     
     
     let retirementExpenses = net;

     // Calculate annual PMT amount to save to cover future expenses
     let saveAnnual = Math.round(((rateReturn * (retirementExpenses + x * saved))/(-1 + x)));

     // On click show amount needed to save
     document.querySelector('.results').textContent = (`You should be saving about ${saveAnnual.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 4 })} per year.`);
     
}




eventListeners();

//PV: p = (-m[((1+r)n-1)/r](1+rt) - f) / (1+r)n

//PV: p = (-m[((  (1+r)^n) -1) / r] (1+rt) - f) / (1+r)^n

//PV: p = (-m[((  rateOverTime) -1) / r] (1+rt) - f) / rateOverTime
//pv = (-payment [(rateOverTime - 1) / rate] * (1 + rate) - FV) / rateOverTime;


// rateOverTime = Math.pow((1 + rate), periods);

rateOverTime = 1.276281563;
pv = (-1 * 10000 * ((rateOverTime - 1) / .05) * (1.05) - 500000) / rateOverTime;
console.log(pv);
