
// Javascript code to plot graph of KNMI-data

var fileName = "knmi_out.js";
var txtFile = new XMLHttpRequest();
txtFile.onreadystatechange = function() {
    if (txtFile.readyState === 4 && txtFile.status == 200) {
        dic = JSON.parse(txtFile.responseText);
        // dic bestaat niet globaal
        // txtFile.responseText is een jasonstring
        // mbv JSON.parse() wordt deze string ontleedt.

        // print dic:
        console.log(dic);

        // rewrite data:
        new_dic = rewriter(dic);
        console.log(new_dic);

        // plot data:
        plot = plot(new_dic);
    }
}
txtFile.open("GET", fileName);
txtFile.send();
console.log("Test1");


function createTransform(domain, range){
	// domain is a two-element array of the data bounds [domain_min, domain_max]
	// range is a two-element array of the screen bounds [range_min, range_max]
	// this gives you two equations to solve:
	// range_min = alpha * domain_min + beta
	// range_max = alpha * domain_max + beta
 		// a solution would be:
    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]
    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max
    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
    }
}


// Rewrite data to screen points:
function rewriter(dic){

  // List that will contain the x and y values of points in the graph
  var L_plotx = [];
  var L_ploty = [];

// data bounds:
  var L_dx = [01, 24];
  var L_dy = [0, 100];

// screen bounds
  var L_sx = [0 , 300];
  var L_sy = [0 , 250];

// Creating equations:
  var f_x = createTransform(L_dx, L_sx);
  var f_y = createTransform(L_dy, L_sy);

// test equations:
  console.log(f_x);
  console.log(f_y);

//loop over elements of dictionary('array'):
  for(var key in dic) {

    // get coordinates using the equations
    var value = dic[key];
    var sx = f_x(key);
    var sy = f_y(value);

    // appending values to list:
    L_plotx.push(sx);
    L_ploty.push(sy);
  }
// return of function:
  return [L_plotx, L_ploty];
}


// function to make plot:
function plot(L_plot){
// make plot:
 const canvas = document.getElementById('graph');
 const ctx = canvas.getContext('2d');

// Set line width
 ctx.lineWidth = 2;

// Axis
 ctx.strokeRect(0, 0, 300, 250);
//..

// Using arguments:
 L_plotx = L_plot[0];
 L_ploty = L_plot[1];

// starting point:
 ctx.moveTo(L_plotx[0], L_ploty[0]);

// Plotting line:
 var i = 0;
 for(var point in L_plot[0]) {

// x and y coordinates for next point:
   var x = L_plotx[i]
   var y = L_ploty[i]

// update index:
   i = i + 1;

// line to new point:
   ctx.lineTo(x, y);
 }
 ctx.stroke();
}
