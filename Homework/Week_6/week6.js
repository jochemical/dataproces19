// Javascript file - Linked view



// Executed as soon as page is html is loaded:
window.onload = function() {

  // request data
  var requests = [d3.json("output8.json")];

  // wait for all requests
  Promise.all(requests).then(function(response) {

    // select data
    var mem_data = response[0];

    // generate scatterplot
    scatterplot(mem_data);

    // generate piechart
    piechart(mem_data,"Australia");

  });
};


function piechart(data_,c) {

  // width height, padding and radius of svg:
  var svg_w2 =  1000
  var svg_h2  = 450
  var svg_pad2= 38

  // select needed data:
  var emp = data_[c]["Employment rate"];
  var data = {"Employed": emp, "Unemployed": 100-emp};

  // create svg element:
  var svg = d3.select("#pie")
    .append("svg")
      .attr("height", svg_h2)
      .attr("width", svg_w2)
    .append("g")
      .attr("transform", "translate(" + svg_w2 / 2 + "," + svg_h2 / 2 + ")");

  // radius pie chart
  var radius = ( svg_h2 / 1.8 ) - svg_pad2;

  // arc pie chart
  var arc = d3.arc()
    .outerRadius(radius)
    .innerRadius(0);

  // color pie chart:
  var color = d3.scaleOrdinal()
    .range(d3.schemeSet2)
    .domain(data);

  // arc starting position of each class:
  var angle = d3.pie()
    .value(function(d) {return d.value; });

  // adding data to var angle:
  var fixed_angles = angle(d3.entries(data));

  // create pie chart:
  svg.selectAll('piepiece')
    .data(fixed_angles)
    .enter()
    .append('path')
      .attr("stroke", "white")
      .style("stroke-width", "1px")
      .style("opacity", 0.8)
      .attr('d', arc)
      .attr('fill', function(d){ return(color(d.data.key)) })

  // text in piechart:
  svg.selectAll('piepiece')
    .data(fixed_angles)
    .enter()
    .append('text')
    .text(function(d){ return d.data.key})
      .style("font-size", 17)
      .style("font-family","Arial")
      .style("font-weight","bold")
      .style("text-anchor", "middle")
      // centroid function to define position of text
      .attr("transform", function(d) { return "translate(" +arc.centroid(d) + ")";  })

};


function scatterplot(DL_xyc){

  // Lists for scatterplot:
  var L_ns_x = [];
  var L_ns_y = [];
  var L_c = [];
  var L_z = [];


  // key1 are keywords
  for(key1 in DL_xyc){

    // if statements to skip empty cells
    if(DL_xyc[key1]["Years in education"]!==".."
      && DL_xyc[key1]["Household net adjusted disposable income"]!==".."
        && DL_xyc[key1]["Employment rate"]!==".."){

          // Filling lists
          L_c.push(key1);
          L_ns_x.push(DL_xyc[key1]["Years in education"]);
          L_ns_y.push(DL_xyc[key1]["Household net adjusted disposable income"]);
          L_z.push(DL_xyc[key1]["Employment rate"]);

    };
  };


  // SVG/image size:
    var w_svg = 1200;
    var h_svg = 400;

    var tip = d3.select('body')
            .append('div')
            .attr('class', 'tip')
            .html('I am a tooltip...')
            .style('border', '1px solid steelblue')
            .style('padding', '5px')
            .style('position', 'absolute')
            .style('display', 'none')
            // tooltip:
            .on('mouseover', function(d, i) {
              tip.transition().duration(0);
            })
            .on('mouseout', function(d, i) {
              tip.style('display', 'none');
            });

  //Create SVG element:
    var svg = d3.select("body")
              .append("svg")
              .attr("height", h_svg)
              .attr("width", w_svg);

  // Scaling:

  // Padding:
    var paddingx = 110;
    var paddingy = 50;

  // Data values:
    var x_min = 0.9*d3.min(L_ns_x);
    var x_max = 1.1*d3.max(L_ns_x);
    var y_min = 0.8*d3.min(L_ns_y);
    var y_max = 1.1*d3.max(L_ns_y);

  // Screen values:
    var sx_min = 0;
    var sx_max = w_svg - paddingx;
    var sy_min = 0;
    var sy_max = h_svg - paddingy;

  // Creates scale functions:
    var xScale = d3.scaleLinear().domain([x_min, x_max]).range([sx_min, sx_max]);
    var yScale = d3.scaleLinear().domain([y_min, y_max]).range([sy_max, sy_min]);

  //scaling values:

    // scaled x values
    var L_s_x = [];
    for(datx in L_ns_x){
      x_s = xScale(L_ns_x[datx]);
      L_s_x.push(x_s);
    };

    // scaled y values
    var L_s_y = [];
    for(daty in L_ns_y){
      y_s = yScale(L_ns_y[daty]);
      L_s_y.push(y_s);
    };

  // make dataset
    var dataset = [];
    for(index8 in L_s_x){
      var xy_s = [];
      xy_s.push( L_s_x[index8] );
      xy_s.push( L_s_y[index8] );
      xy_s.push( L_c[index8] );
      xy_s.push( L_z[index8] );
      dataset.push(xy_s);
    };


  //Add axes:

    // x-axis:
    var x_axis = d3.axisBottom().scale(xScale);
    svg.append("g").attr("transform", "translate(110,350)")
        .call(x_axis);

    // add x-label
    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", 800)
    .attr("y", 400)
    .text("Years of education");

    // add y-label
    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Household net adjusted disposable income");

    // y-axis:
    var y_axis = d3.axisLeft().scale(yScale);
    svg.append("g").attr("class","y axis").attr("transform","translate(110,0)")
        .call(y_axis);
        // (left-limit of translate is paddingx)

    // generate scatterplot:
    svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
          return paddingx + d[0];
        })
        .attr("cy", function(d) {
          return d[1];
        })
        .attr("r", 5)

        // tooltip function
        .on('mouseover', function(d, i) {
        tip.transition().duration(0);
        tip.style('top', d[1] + paddingy + 710 + 'px');
        tip.style('left', d[0] + paddingx + 'px');
        tip.style('display', 'block');
        tip.html(d[2]);
        })
        .on('mouseout', function(d, i) {
        tip.transition()
        .delay(200)
        .style('display', 'none');
        })

        // on click function
        .on("click", function(d){
          //update title
          d3.select("#title").text("Employment Rate " + d[2]);
          // update pie chart
          d3.select("svg").remove();
          piechart(DL_xyc,d[2]);
        });
};
