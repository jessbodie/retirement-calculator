// Practical Retirement Calculator
// With 5 inputs, user gets an approximate amount to save annually for retirement
// Version 3.0, rewritten with data, ui, app controllers



var dataController = (function() {
     

     var data = {
          inputs: [
               {val: '', elementID: 'age', errorMessage: 'Hmm, are these ages correct? Please take a look and try again.', isValid: false},
               {val: '', elementID: 'age-retire', errorMessage: 'Zoikes! This calculator is optimized for folks who will retire in the future. Please update the ages you input.', helperText: 'Full Social Security benefits kick in at age 67 for people born in 1960 or later.', isValid: false},
               {val: '', elementID: 'age-death', errorMessage: 'Oh man... This calculator expects you will die AFTER you retire. Please double-check the ages you input.', helperText: 'According to the CDC, the average life expectancy for residents of the U.S. is 78.8 years.', isValid: false},
               {val: '', elementID: 'saved', errorMessage: 'Whooheee, please enter a number... And, we know the amount might be zilch.', isValid: false},
               {val: '', elementID: 'expenses', errorMessage: 'Yowza! We\'re expecting your expenses will be AT LEAST  $6,000 per year... Please try again.', isValid: false}
          ],
          rateReturn: .073,
          rateInflation: .033,
          saveAnnual: 0
     };

     
     return {

          // Get and return the 5 data inputs
          getDataFromForm: function(inputObj) {
               for (let i = 0; i < inputObj.inputBoxes.length; i++) {
                    // Check that data input boxes match data object and store
                    if (inputObj.inputBoxes[i].id === data.inputs[i].elementID) {
                         data.inputs[i].val = inputObj.inputBoxes[i].value;
                    } else {
                         // TODO
                         console.log("Check the getDataFromForm function. The IDs aren't matching.");
                    }
               }
               return {
                    inputs: data.inputs
               };
          },
          
          // Validation: Strip characters, check for null and greater than 0. Return numbers.
          validateInputs: function(inputsToUpdate) {
               for (let i = 0; i < inputsToUpdate.length; i++) {
                    inputsToUpdate[i].val = String(inputsToUpdate[i].val);
                    inputsToUpdate[i].val = inputsToUpdate[i].val.replace(/[\-|&;\$%@"<>\(\)\+,]/g, '');
                    inputsToUpdate[i].val = parseFloat(inputsToUpdate[i].val);

                    if (inputsToUpdate[i].val >= 0) {
                         inputsToUpdate[i].isValid = true;
                    } else {
                         inputsToUpdate[i].isValid = false;
                         console.log(inputsToUpdate[i]);
                         console.log("is set to false.");
                    }
               }

               // TODO Improve to pass 3 specific values rather than array #
               
               // Check if age is over retirement age
               if (inputsToUpdate[0].val > inputsToUpdate[1].val) {
                    inputsToUpdate[0].isValid = false;
                    inputsToUpdate[1].isValid = false;
               }

               if (inputsToUpdate[1].val > inputsToUpdate[2].val) {
                    inputsToUpdate[2].isValid = false;
               }

               if (inputsToUpdate[4].val > 6000) {
                    inputsToUpdate[4].isValid = true;
               }

               return inputsToUpdate;
          },


          // Calculation for how much to save annually
          calculateToSave: function(age, ageRetire, ageDeath, saved, expenses) {
               // Calc time periods in preparation for the PV and FV calcs
               let yearsUntilRetirement = ageRetire - age;
               let yearsWithdrawing = ageDeath - ageRetire;
          
               // Interim calcs of rate over periods to simplify PV and PMT formulas
               let x = Math.pow(1 + data.rateReturn, yearsUntilRetirement);
               const nper = 1;
               let z = Math.pow(1 + data.rateReturn, -nper);
               let y = Math.pow(1 + data.rateReturn, nper);
               
               // Iniviate key calc variables
               let retirementExpenses = saved;
               let pv;
               let fv = 0;
               
               // Calc expenses during retirement years
               for (var i = ageDeath-1; i >= ageRetire; i--) {
                    // Calc FV of costs each year
                    // Formula for fv = pv * (1 + (rate / freq))^periods
                    fv = expenses * Math.pow((1 + (data.rateInflation / 1)),(i - age));
                    
                    // Calculate PV needed to cover future costs
                    // Thanks for the PV formula: http://www.mohaniyer.com/old/pvcode.htm
                    pv = - ( z * (-1 * retirementExpenses * data.rateReturn - fv + y * fv )) / data.rateReturn;
                    
                    retirementExpenses = pv;
                    //console.log(`counter is: ${i-age} and fv is: ${fv} and pv is ${pv}`);
               }
               
               
               // Calculate annual PMT amount to save to cover future expenses
               data.saveAnnual = -1 * Math.round(((data.rateReturn * (retirementExpenses + x * saved))/(-1 + x)));
               data.saveAnnual = data.saveAnnual.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 4 });
          
               return data.saveAnnual;
          }

     };
})();

var UIController = (function() {

     return {
          // Get the list of input boxes
          getInputList: function() {
               return {
                    inputBoxes: document.querySelectorAll('.entry-box')
               };
          },
          
          // Show the helper icons for the objects that have helper text
          displayHelper: function(dataInputs) {
               var helperIcon = [];
               for (let i = 0; i < dataInputs.inputs.length; i++) {
                    if (dataInputs.inputs[i].helperText) {
                         // Create helper icon div
                         helperIcon[i] = document.createElement('div');
                         helperIcon[i].className = ('helper');
                         var helperIconText = document.createTextNode('?');
                         helperIcon[i].appendChild(helperIconText); // Add the text node to the newly created div.
                         
                         // Insert helper div on question that has the helper text
                         var helperDivParent = document.getElementById(dataInputs.inputs[i].elementID).parentNode.childNodes[1].childNodes[1];
                         helperDivParent.appendChild(helperIcon[i]);

                         // Listener to show helper text on hover
                         helperIcon[i].addEventListener('mouseenter', displayHelperText);
                         helperIcon[i].addEventListener('click', displayHelperText);
                         helperIcon[i].addEventListener('touchstart', displayHelperText);

                         // Listener to hide helper text on leave
                         helperIcon[i].addEventListener('mouseleave', removeHelperText);
                         
                         function displayHelperText() {
                         
                              // Create div with class and text associated
                              var helperHoverDiv = document.createElement('div');
                              helperHoverDiv.className = ('helper-text');
                              var helperTextDiv = document.createTextNode(dataInputs.inputs[i].helperText);
                              helperHoverDiv.appendChild(helperTextDiv); //add the text node to the newly created div.
                         
                              // Place new HELPER div under corresponding field
                              helperIcon[i].parentNode.appendChild(helperHoverDiv);
                              
                              // For mobile, user clicks helper text to hide it
                              helperHoverDiv.addEventListener('click', removeHelperText);

                         }
                         
                         function removeHelperText () {
                              document.querySelector('.helper-text').remove();
                         }

                         
                    }
               }
          },
               
          // Displan new error div when data is not valid
          displayErrors: function(inputs) {
               for (i = 0; i < inputs.length; i++) {
                    if (inputs[i].isValid === false) {

                         // Create new div with error text
                         var errorDiv = document.createElement('div');
                         errorDiv.className = ('error');
                         var errorMessDiv = document.createTextNode(inputs[i].errorMessage);
                         errorDiv.appendChild(errorMessDiv); //add the text node to the newly created div.
                    
                         // Place new error div under corresponding field
                         var errorDivCurrent = document.getElementById(inputs[i].elementID).parentNode.parentNode;
                         var errorDivNext = document.getElementById(inputs[i].elementID).parentNode.nextElementSibling;
                         errorDivCurrent.insertBefore(errorDiv, errorDivNext);
                    }
               }
               for (i = 0; i < inputs.length; i++) {
                    if (inputs[i].isValid === false) {
                         return false;
                    }
               }
               return true;
          },

          // Display the amount to save restuls
          displayToSave: function(toSave) {
               // On click show amount needed to save
               document.querySelector('.results').setAttribute('style', 'visibility: visible');
               document.querySelector('.results').innerHTML = (`You should be saving about <strong><font color="#21BFE1">${toSave}</font></strong> per year.`);
          },

          clearError: function() {
               var errorList = document.querySelectorAll('.error');
               for (let i = 0; i < errorList.length; i++) {
                    errorList[i].remove();
               }
          },
          
          hideResults: function() {
               document.querySelector('.results').setAttribute('style', 'visibility: hidden');
          },
          
          clearFields: function () {
               let questionList = document.querySelectorAll('.entry-box');
               for (let i = 0; i < questionList.length; i++) {
                    questionList[i].addEventListener('click', function() {
                              questionList[i].value = "";
                    });
               }
          }

     };
})();


// Global controller
var controller = (function(UICtrl, dataCtrl) {

     // Array of input boxes
     var inputs = UICtrl.getInputList();
     
     // When user clicks calculate button, show calculation
     var calculate = function() {
          // Clear any previous errors
          UICtrl.clearError();
          UICtrl.hideResults();
          
          // Ingest values from array of input boxes
          var fullData = dataCtrl.getDataFromForm(inputs);

          // Validate the inputted data and return updated
          fullData.inputs = dataCtrl.validateInputs(fullData.inputs);
          
          if (UICtrl.displayErrors(fullData.inputs)) {

               // Calculate how much to save
               var amtToSave = dataCtrl.calculateToSave(fullData.inputs[0].val, fullData.inputs[1].val, fullData.inputs[2].val, fullData.inputs[3].val, fullData.inputs[4].val);
               // Display how much to save
               UICtrl.displayToSave(amtToSave);
          } else {
               UICtrl.hideResults();
          }
     
     };
     
     var setupEventListeners = function(questionList, data) {
          // On load, show helper icons
          document.addEventListener('DOMContentLoaded', function(){
               var origData = dataCtrl.getDataFromForm(inputs);
               UICtrl.displayHelper(origData);
          });
          
          // On Calculate Button, capture data and trigger calculation
          document.getElementById('calculate').addEventListener('click', calculate);

          // Listen if changes on text fields, then calculate
          document.getElementById('calculate').addEventListener('click', calcOnChange);
          
          // On Enter, capture data and trigger calculation
          document.addEventListener('keypress', function(event) {
               if (event.keyCode == 13) {
                    calculate();
                    calcOnChange();
               }
          });
          
          function calcOnChange () {
               for (var i = 0; i < questionList.inputBoxes.length; i++) {
                    questionList.inputBoxes[i].addEventListener('change', calculate);
               }
          }
          
          // On click of field, clear for new data
          document.addEventListener('DOMContentLoaded', UICtrl.clearFields);
          
     }


     return {
          init: function() {
               console.log("started the init function");
               setupEventListeners(UICtrl.getInputList());
          }
          
          

     };
     
})(UIController, dataController);

controller.init();


///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
// Key Formulas to port from 2013 JAVA and Excel versions:
// Excel FV: interest_rate, number_payments, payment, PV, Type
// double fv = FV(0.033, i - age, 0.0, annual_expenses, 0);
// Excel PV: PV (rate, nper, pmt, [fv], [type])
// double pv = PV(0.073, 1, fv, -net, 0);
// net = pv;
