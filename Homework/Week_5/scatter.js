// Javascript file - Scatterplot
// Naam: Jochem Kemp
// Studentnummer: 6128203

var mem_data = [];
var bol_data = 1;
var bol_year = 1;


// Executed as soon as page is html is loaded:
window.onload = function() {
  var requests = [d3.json("tourists.json"), d3.json("ppp.json"), d3.json("gdp.json")];
  Promise.all(requests).then(function(response) {
    console.log(response);
    var use_data = [ response[0] , response[1] , response[2] ];
    mem_data = parsedata( use_data );
    console.log("mem_data:");
    console.log(mem_data);

    // generate scatterplot
    scatterplot(mem_data,bol_data);
  });
};


function Buttonfunction1() {

  // remove former svg
  d3.select("svg").remove();
  // change bolean switch
  bol_data = bol_data * -1;

  // generate new scatterplot
  if(bol_data==-1){
    d3.select("h2").remove();
    d3.select("body").append("h2").text("Plot of GDP against Total International Arrivals");
    scatterplot(mem_data,bol_data);
  };

  if(bol_data==1){
    d3.select("h2").remove();
    d3.select("body").append("h2").text("Plot of PPP against Total International Arrivals");
    scatterplot(mem_data,bol_data);
  };
}


function Buttonfunction2() {

  // remove former svg:
  d3.select("svg").remove();
  // change boolean switch:
  bol_year = bol_year * -1;

  // generate new scatterplot:
  if(bol_year==-1){
    d3.select("h3").remove();
    d3.select("body").append("h3").text("Year: 2014");
    scatterplot(mem_data,bol_data);
  };

  if(bol_year==1){
    d3.select("h3").remove();
    d3.select("body").append("h3").text("Year: 2013");
    console.log("year: 2013!");
    scatterplot(mem_data,bol_data);
  };
}


function parsedata(L_dict){

  // object for selecting data
  var DL_xyc = {"2013":[], "2014":[]};
  // {"gpd":, "ppp": ,"country":   }

  // Object for cleaned data
  var DL_xyc_clean = {"2013":[], "2014":[]};

  // split L_dict, L-dict is een lijst bestaande uit 2 json object (beide datasets)
  dict0 = L_dict[0]; // Data for TIA
  dict1 = L_dict[1]; // Data for PPP
  dict2 = L_dict[2]; // Data for GDP

  for(key0 in dict0){ // key are keywords
    for(index0 in dict0[key0]){ // subdict are indexnumbers (subdict->index1)

      var xyc_10 = {};
      var xyc_11 = {};

      if(dict0[key0][index0]["Time"]==2013){
        // Met dict0[key] loop je over alle landen(dict) heen.
        // Met [subdict]["Datapoint"] loop je over alle jaren(dict) heen v1 specifiek land
        xyc_10.TIA = dict0[key0][index0]["Datapoint"];
        xyc_10.Country = dict0[key0][index0]["Country"];
        DL_xyc["2013"].push(xyc_10);
      }

      if(dict0[key0][index0]["Time"]==2014){

        xyc_11.TIA = dict0[key0][index0]["Datapoint"]; // "TIA" because we use dict0
        xyc_11.Country = dict0[key0][index0]["Country"];
        DL_xyc["2014"].push(xyc_11);
      }
    };
  };

  for(key1 in dict1){ // key zijn keywords
    for(index1 in dict1[key1]){ // subdict zijn indexnummers

        if(dict1[key1][index1]["Time"]==="2013"){

          for (index12 in DL_xyc["2013"]){

              if(key1 == DL_xyc["2013"][index12]["Country"]){

                DL_xyc["2013"][index12].PPP = dict1[key1][index1]["Datapoint"];
            };
          };
        };

        if(dict1[key1][index1]["Time"]==="2014"){

          for(index13 in DL_xyc["2014"]){

              if(key1 == DL_xyc["2014"][index13]["Country"]){

                DL_xyc["2014"][index13].PPP = dict1[key1][index1]["Datapoint"];
            };
          };
        };
    };
  };

  for(key2 in dict2){ // key zijn keywords
    for(index2 in dict2[key2]){ // subdict zijn indexnummers

        if(dict2[key2][index2]["Year"]==="2013"){

          for (index22 in DL_xyc["2013"]){

              if(key2 == DL_xyc["2013"][index22]["Country"]){

                DL_xyc["2013"][index22].GDP = dict2[key2][index2]["Datapoint"];
            };
          };
        };

        if(dict2[key2][index2]["Year"]==="2014"){

          for(index23 in DL_xyc["2014"]){

              if(key2 == DL_xyc["2014"][index23]["Country"]){

                DL_xyc["2014"][index23].GDP = dict2[key2][index2]["Datapoint"];
            };
          };
        };
    };
  };

  for(index4 in DL_xyc["2013"]){

      if( Object.keys( DL_xyc["2013"][index4]).length == 4){
          console.log( DL_xyc["2013"][index4] );
          DL_xyc_clean["2013"].push(DL_xyc["2013"][index4]);
      };
  };

  for(index5 in DL_xyc["2014"]){

      if(Object.keys( DL_xyc["2014"][index5]).length == 4){

        DL_xyc_clean["2014"].push(DL_xyc["2014"][index5]);
      };
  };

  console.log( Object.keys( DL_xyc["2013"][21]  ).length );
  DL_xyc["2013"].splice(21, 1);
  return DL_xyc_clean;
};


function scatterplot(DL_xyc, datachoice){

  // list full of points [[],[],[],enz.]
  var countries10 = [];
  var countries11 = [];

  var x_values10 = [];
  var y_values10 = [];
  var x_values11 = [];
  var y_values11 = [];

  for(index6 in DL_xyc["2013"]){

    countries10.push(DL_xyc["2013"][index6]["Country"]);

    x_values10.push(DL_xyc["2013"][index6]["TIA"]);

    if(datachoice==-1){
      y_values10.push(DL_xyc["2013"][index6]["PPP"]);
    };

    if(datachoice==1){
      y_values10.push(DL_xyc["2013"][index6]["GDP"]);
    };
  };

  for(index7 in DL_xyc["2014"]){

    countries11.push(DL_xyc["2014"][index7]["Country"]);

    x_values11.push(DL_xyc["2014"][index7]["TIA"]);

    if(datachoice==-1){
      y_values11.push(DL_xyc["2014"][index7]["PPP"]);
    };

    if(datachoice==1){
      y_values11.push(DL_xyc["2014"][index7]["GDP"]);
    };
  };

///////////////////////////////////////////////////////////////////////////////

    // Choose data corresponding to bolean
    if(bol_year==1){
      var L_ns_x = x_values10;
      var L_ns_y = y_values10;
      var L_c = countries10;
    };

    if(bol_year==-1){
      var L_ns_x = x_values11;
      var L_ns_y = y_values11;
      var L_c = countries11;
    };

  // SVG/image size:
    var w_svg = 1200; //600
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
    var paddingx = 110; //80;
    var paddingy = 50;
  // Data values:
    var x_min = 0; //d3.min(x_values10);
    var x_max = 1.2*d3.max(L_ns_x);
    var y_min = -100*d3.min(L_ns_y)//0; //d3.min(y_values10);
    var y_max = 1.2*d3.max(L_ns_y);//+0.5*d3.max(y_values10);

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
    var output_range_y = [sy_max, sy_min];

  // Creates scale functions:
    var xScale = d3.scaleLinear().domain(input_dom_x).range(output_range_x);
    var yScale = d3.scaleLinear().domain(input_dom_y).range(output_range_y);

  //scaling values:
    var L_s_x = []; // scaled x values
    for(datx in L_ns_x){
      x_s = xScale(L_ns_x[datx]);
      L_s_x.push(x_s);}

    var L_s_y = []; // scaled x values
    for(daty in L_ns_y){
      y_s = yScale(L_ns_y[daty]);
      L_s_y.push(y_s);}

  // make dataset
    var dataset = [];
    for(index8 in L_s_x){
      var xy_s = [];
      xy_s.push( L_s_x[index8] );
      xy_s.push( L_s_y[index8] );
      xy_s.push( L_c[index8] );
      dataset.push(xy_s);
    };

    console.log(dataset);

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
    .text("Total international arrivals (TIA)");

    // add y-label
    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("GDP or PPP")

    // y-axis:
    var y_axis = d3.axisLeft().scale(yScale);
    svg.append("g").attr("class","y axis").attr("transform","translate(110,0)") // linkerlimit is paddingx
        .call(y_axis);

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
        tip.style('top', d[1] + paddingy + 410 + 'px');
        tip.style('left', d[0] + paddingx + 'px');
        tip.style('display', 'block');
        tip.html(d[2]);
        })
        .on('mouseout', function(d, i) {
        tip.transition()
        .delay(200)
        .style('display', 'none');
      })
};
