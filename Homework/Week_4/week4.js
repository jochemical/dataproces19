// Javascript code to plot barchart:

d3.json("output.json").then(function(dictionary) {
  // structure data:
  var data_x = [];
  var data_y = [];
  var LL_xy = [];
  for(key in dictionary){

    data_x.push(parseFloat(key));
    data_y.push(parseFloat(dictionary[key]["Value"]));
  }

  // Fill double list:
  LL_xy.push(data_x);
  LL_xy.push(data_y);
  // Calling function:
  barplot(LL_xy);
});


// Function to plot barchart:
function barplot(LL_nsdata){ // nsdata = not scaled data

// data division:
  var L_ns_x = LL_nsdata[0];
  var L_ns_y = LL_nsdata[1];

// SVG/image size:
  var w_svg = 2000;
  var h_svg = 400;
  var pad_bar = 3;

//Create SVG element:
  var svg = d3.select("body")
            .append("svg")
            .attr("height", h_svg)
            .attr("width", w_svg);

// Scaling:

// Padding:
  var paddingx = 50;
  var paddingy = 50;
// Data values:
  var x_min = d3.min(L_ns_x);
  var x_max = d3.max(L_ns_x);
  var y_min = d3.min(L_ns_y);
  var y_max = d3.max(L_ns_y);
// Screen values:
  var sx_min = 0;
  var sx_max = w_svg - paddingx; // width of SVG
  var sy_min = 0;
  var sy_max = h_svg - paddingy; // Height of SVG
// domain and range x:
  var input_dom_x = [x_min, x_max]; // depends on data
  var output_range_x = [sx_min, sx_max]; // depends on pixels of image, you decide
// domain and range y:
  var input_dom_y = [y_min, y_max]; // depends on data
  var output_range_y = [sy_max, sy_min]; // depends on pixels of image, you decide
// Creates scale functions:
  var xScale = d3.scaleLinear().domain(input_dom_x).range(output_range_x);
  var yScale = d3.scaleLinear().domain(input_dom_y).range(output_range_y);

//scaling values:
  var L_s_y = []; // scaled x values
  for(var dat in L_ns_y){
    y_s = yScale(L_ns_y[dat]);
    L_s_y.push(y_s);}

// change name
  var dataset = L_s_y;

// Add axes:
// x-axis:
  var x_axis = d3.axisTop().tickFormat("").scale(xScale);
  svg.append("g").attr("transform", "translate(49,350)")
      .call(x_axis);
// y-axis:
  var y_axis = d3.axisLeft().scale(yScale);
  svg.append("g").attr("transform","translate(49,0)") // linkerlimit is paddingx
      .call(y_axis);

// plotting bars:
  svg.selectAll("rect")
               .data(dataset)
               .enter()
               .append("rect")
               .attr("height", function(d) {
                  return d; })
               .attr("width", w_svg / dataset.length - pad_bar)
               .attr("y", function(d) {
                  return (h_svg-paddingy) - d; }) //Height minus data value
               .attr("x", function(d, i) {
                  return paddingx + i * ((w_svg - paddingx) / dataset.length); })
                .attr("fill", "rgb(0, 100, 120)");


// adding years:
   svg.selectAll("text.axis")
    .data(L_ns_x).enter().append("text")
    .text(function(d){return d})
    .attr("x", function(d,i){ return (paddingx +i*((w_svg-paddingx) / dataset.length)) })
    .attr("transform","translate(0,"+ (h_svg-paddingy + 20) +")")
    .style("font-size","14px");
//  .attr('transform', 'rotate(45 -10 10)');

};
