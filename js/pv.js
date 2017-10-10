// Function to calculate present value of an investment..

// Parameters are rate, total number of periods, payment made each period, future value and type (when payments are due)

function pv(rate, per, nper, pmt, fv)

{
nper = parseFloat(nper);
pmt = parseFloat(pmt);
fv = parseFloat(fv);
rate = eval((rate)/(per * 100));

{
x = Math.pow(1 + rate, -nper);
y = Math.pow(1 + rate, nper);
pv_value = - ( x * ( fv * rate - pmt + y * pmt )) / rate;
}

pv_value = conv_number(pv_value,2);
return (pv_value);
}







// Function to calculate Periodic Payments.

function pmt(rate, per, nper, pv, fv)

{
fv = parseFloat(fv);
nper = parseFloat(nper);
pv = parseFloat(pv);
per = parseFloat(per);

{
x = Math.pow(1 + rate,nper);
pmt_value = -((rate * (fv + x * pv))/(-1 + x));
}

pmt_value = conv_number(pmt_value,2);
return (pmt_value);
}

function conv_number(expr, decplaces)
{ // This function is from David Goodman's Javascript Bible.
var str = "" + Math.round(eval(expr) * Math.pow(10,decplaces));
while (str.length <= decplaces) {
str = "0" + str;
}

var decpoint = str.length - decplaces;
return (str.substring(0,decpoint) + "." + str.substring(decpoint,str.length));
}
