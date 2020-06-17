// Original website visited below recommended the later websites for radar chart coding
//http://bl.ocks.org/chrisrzhou/2421ac6541b68c1680f8

//https://github.com/alangrafu/radar-chart-d3
//http://bl.ocks.org/nbremer/6506614
 
function RadarChart(id, data, options) {
    let fullDataset = data;
    var config = {
      w: 600, 
      h: 600, 
      margin: {top: 20, right: 20, bottom: 20, left: 20}, 
      labelFactor: 0.85,  
      wrapWidth: 60,      
      opacityArea: 0.35,  
      dotRadius: 4,       
      opacityCircles: 0.1,
      strokeWidth: 0.7,   
      roundStrokes: false,
      color: d3.scale.category10(),  
      hover: true,
      axisLabels: true,
      tickLabels: true,
      label: false,
      scalesAndAxes: false,
    };

    //Put all of the options into a variable called config
    if('undefined' !== typeof options){
      for(var i in options){
        if('undefined' !== typeof options[i]){ config[i] = options[i]; }
      }
    }

    // If label specified, filter and sort data to label
    if (config.label != false){
      data = subsetAndSortData(data, config.label);
    } else {
      config.label = Object.keys(data[0]);
    }

    // Auto-generate scales and axes from given data extents or use given ones.
    var autos;
    if (config.scalesAndAxes === false){
      autos = autoScalesAxes(data);
    } else {
      autos = config.scalesAndAxes;
    }
    var scales = config.label.map(function(k){ return autos[k].scale; });
    var axes = config.label.map(function(k){ return autos[k].axis; });

    // Rearrange data to an array of arrays
    data = data.map(function(row){
      var newRow = config.label.map(function(key) {
          return {"axis": key, "value": row[key]};
      });
      return newRow;
    });

    var total = config.label.length,            
      radius = Math.min(config.w/2, config.h/2),    
      angleSlice = Math.PI * 2 / total;       

    // Update ranges of scales to match radius.
    scales = scales.map(function(i){
      if (typeof i.rangePoints !== 'undefined'){
          return i.rangePoints([0, radius]);
      } else {
          return i.range([0, radius]);
      }
    });



    //Remove chart when deselected
    d3.select(id).select("svg").remove();

    //Initiate the radar chart SVG
    var svg = d3.select(id).append("svg")
      .attr("width",  config.w + config.margin.left + config.margin.right)
      .attr("height", config.h + config.margin.top + config.margin.bottom)
      .attr("class", "radar"+id);

    var g = svg.append("g")
      .attr("transform", "translate(" + (config.w/2 + config.margin.left) + "," + (config.h/2 + config.margin.top) + ")");

    var axisGrid = g.append("g").attr("class", "axisWrapper");

    var axis = axisGrid.selectAll(".axis")
      .data(config.label)
      .enter()
      .append("g")
      .attr("class", "axis");

    //Append the axes
    var axisGroup = axis.append("g")
      .attr("transform", function(d, i){ return "rotate(" + (180 / Math.PI * (i * angleSlice) + 270) + ")"; })
      .each(function(d, i){
        var ax = axes[i];
        if (config.tickLabels !== true){
          ax = ax.tickFormat(function(d){ return ""; });
        }
        ax(d3.select(this));
      });

    //Append axis category labels
    if (config.axisLabels === true){
        axisGroup.append("text")
        .attr("class", "legend")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + radius * config.labelFactor + ", 20)")
        .attr("dy", "0.35em")
        .text(function(d){return d;})
        .call(wrap, config.wrapWidth);
    }



    let cbinput = Array.from(document.querySelectorAll("input.Player-checkbox:checked"));
    let checkedBoxContainers = cbinput.map((input) => input.parentNode);
    checkedBoxContainers.forEach((div, i) => {
      let colorDiv = document.createElement("div");
      colorDiv.classList.add("legend-color")
      colorDiv.setAttribute("style", "background-color:" + config.color(i) + ";");
      div.appendChild(colorDiv);
    });



    //The radial line function
    var radarLine = d3.svg.line.radial()
      .interpolate("linear-closed")
      .radius(function(d, i) { return scales[i](d.value); })
      .angle(function(d,i) {  return i*angleSlice; });

    if(config.roundStrokes) {
      radarLine.interpolate("cardinal-closed");
    }

    //Create a wrapper for the blobs
    var blobWrapper = g.selectAll(".radarWrapper")
      .data(data)
      .enter().append("g")
      .attr("class", "radarWrapper");

    //Append the backgrounds
    blobWrapper
      .append("path")
      .attr("class", "radarArea")
      .attr("d", function(d,i) { return radarLine(d); })
      .style("fill", function(d,i) { return config.color(i); })
      .style("fill-opacity", config.opacityArea)
      .on('mouseover', function (d,i){
        if (config.hover === true){
          //Dim all blobs
          d3.selectAll(".radarArea")
            .transition().duration(200)
            .style("fill-opacity", 0.1);
          //Bring back the hovered over blob
          d3.select(this)
            .transition().duration(200)
            .style("fill-opacity", 0.7);
        }
        let cbinput = Array.from(document.querySelectorAll("input.Player-checkbox:checked"));
        let legendNames = cbinput.map((input) => input.parentNode.querySelector("span"));
        legendNames[i].classList.add("selected-player");
      })
      .on('mouseout', function(d,i){
        if (config.hover === true){
          //Bring back all blobs
          d3.selectAll(".radarArea")
            .transition().duration(200)
            .style("fill-opacity", config.opacityArea);
        }
        let cbinput = Array.from(document.querySelectorAll("input.Player-checkbox:checked"));
        let legendNames = cbinput.map((input) => input.parentNode.querySelector("span"));
        legendNames[i].classList.remove("selected-player");
      });

    //Create the outlines
    blobWrapper.append("path")
      .attr("class", "radarStroke")
      .attr("d", function(d,i) { return radarLine(d); })
      .style("stroke-width", config.strokeWidth + "px")
      .style("stroke", function(d,i) { return config.color(i); })
      .style("fill", "none");

    //Append the circles
    blobWrapper.selectAll(".radarCircle")
      .data(function(d,i) { return d; })
      .enter().append("circle")
      .attr("class", "radarCircle")
      .attr("r", config.dotRadius)
      .attr("cx", function(d,i){ return scales[i](d.value) * Math.cos(angleSlice*i - Math.PI/2); })
      .attr("cy", function(d,i){ return scales[i](d.value) * Math.sin(angleSlice*i - Math.PI/2); })
      .style("fill", function(d,i,j) { return config.color(j); })
      .style("fill-opacity", 0.8);


    if (config.hover === true){

      //Wrapper for the invisible circles on top
      var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarCircleWrapper");

      //Append a set of invisible circles on top for the mouseover pop-up
      blobCircleWrapper.selectAll(".radarInvisibleCircle")
        .data(function(d,i) { return d; })
        .enter().append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", config.dotRadius*1.5)
        .attr("cx", function(d,i){ return scales[i](d.value) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("cy", function(d,i){ return scales[i](d.value) * Math.sin(angleSlice*i - Math.PI/2); })
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function(d,i) {
          newX =  parseFloat(d3.select(this).attr('cx')) - 10;
          newY =  parseFloat(d3.select(this).attr('cy')) - 10;

          tooltip
            .attr('x', newX)
            .attr('y', newY)
            .text(function(x){return d.value;})
            .transition().duration(200)
            .style('opacity', 1);
        })
        .on("mouseout", function(){
          tooltip.transition().duration(200)
            .style("opacity", 0);
        });

      //Set up the small tooltip for when you hover over a circle
      var tooltip = g.append("text")
        .attr("class", "tooltip")
        .style("opacity", 0);
  }


    //http://bl.ocks.org/mbostock/7555321
    //Wraps SVG text
    function wrap(text, width) {
      text.each(function() {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.4, // ems
          y = text.attr("y"),
          x = text.attr("x"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }

  }


  function subsetAndSortData(data, label){
    data = data.map(function(row){
      var newRow = {};
      label.map(function(key) {
        newRow[key] = row[key];
      });
      return newRow;
    });
    return data;
  }

  function autoScalesAxes(data){

    var ret = {};
    var labelNames = Object.keys(data[0]);

    labelNames.map(function(i){

      var axisData = data.map(function(row){
        return row[i];
      });

      var scale;
      var axis;

      if ((typeof axisData[0] === "string") || (typeof axisData[0] === "boolean")){

        var uniqueValues = d3.map(data, function(a){return a[i]; }).keys();
        uniqueValues.unshift("  "); // Padding, so it doesn't start from the center

        scale = d3.scale.ordinal()
          .domain(uniqueValues);

        axis = d3.svg.axis()
          .scale(scale)
          .tickValues(uniqueValues)
          .orient("bottom");

      } else {

          // Numeric values get a linear scale
        var extent = d3.extent(data, function(a){return a[i];});

        scale = d3.scale.linear()
          .domain(extent);

        axis = d3.svg.axis()
          .scale(scale)
          .tickFormat(function(d, i){ if(i != 0){return d + "";} else {return "";}  })
          .orient("bottom");

      }

      ret[i] = {};
      ret[i].scale = scale;
      ret[i].axis = axis;

    });

    return ret;

  }

  //https://www.youtube.com/watch?v=AseoPgLN7CY
  //https://github.com/alangrafu/radar-chart-d3/blob/master/src/radar-chart.js

  // data.js

var data =[
  {"PLAYER":"Giannis Antetokounmpo", "Display Player":"Giannis Antetokounmpo", "PTS":29.9,"3P":1.5,"2P":9.5,"Steals":1,"BLK":1,"FT":6.3,"TOV":3.7},
  {"PLAYER":"Lebron James", "Display Player":"Lebron James", "PTS":25.7,"3P":2.2,"2P":7.6,"Steals":1.2,"BLK":0.5,"FT":4,"TOV":4},
  {"PLAYER":"Kawhi Leonard", "Display Player":"Kawhi Leonard", "PTS":26.9,"3P":2.1,"2P":7.2,"Steals":1.8,"BLK":0.6,"FT":6.1,"TOV":2.7},
  {"PLAYER":"Anthony Davis", "Display Player":"Anthony Davis","PTS":26.7,"3P":1.2,"2P":8.1,"Steals":1.5,"BLK":2.4,"FT":7,"TOV":2.5},
  {"PLAYER":"James Harden", "Display Player":"James Harden", "PTS":34.4,"3P":4.4,"2P":5.4,"Steals":1.7,"BLK":0.9,"FT":10.1,"TOV":4.5},
];

var label = [
    "PTS",
    "3P",
    "2P",
    "Steals",
    "BLK",
    "FT",
    "TOV"
];

var scales = {
  "PTS":40,
  "3P":5,
  "2P":10,
  "Steals":3,
  "BLK":2.5,
  "FT":11,
  "TOV":5
};

var scalesAndAxes = {};
label.forEach(function (label){

  var o = {};
  o.scale = d3.scale.linear().domain([0, scales[label]]);
  o.axis = d3.svg.axis()
    .scale(o.scale)
    .tickFormat(function(d, i){ if(i != 0){return d + "";} else {return "";}  })
    .orient("bottom");

  scalesAndAxes[label] = o;
});

function createPlayerCheckBoxes(data) {
  var Playercbcontainer = document.getElementById("Player-container");
  var checkBoxes = data.map((row) => {
    var cbcontainer = document.createElement("div");
    cbcontainer.setAttribute('style','padding-bottom: 5px;');
    cbcontainer.classList.add("Player-checkbox-container")
    var checkBox = document.createElement("input");
    var label = document.createElement("span");
    checkBox.setAttribute("type", "checkbox");
    checkBox.value = row["Display Player"];
    checkBox.checked = true;
    checkBox.classList.add("Player-checkbox");
    checkBox.addEventListener('change', (event) => {
      removeColors();
      refilterData();
    })

    label.innerHTML = checkBox.value;
    cbcontainer.appendChild(checkBox);
    cbcontainer.appendChild(label);
    return cbcontainer;
  });
  checkBoxes.forEach((checkBox) => Playercbcontainer.appendChild(checkBox));
}

var radarChartOptions = {
  label: label,
  scalesAndAxes: scalesAndAxes,
};

function removeColors() {
  var colorBoxes = document.querySelectorAll(".legend-color")
  colorBoxes.forEach((div) => div.parentNode.removeChild(div));
}

function refilterData() {
  var cbinput = Array.from(document.querySelectorAll("input.Player-checkbox:checked"));
  var selectedValues = cbinput.map((input) => input.value);
  var filteredData = data.filter((row) => selectedValues.includes(row["Display Player"]))
  RadarChart(".radarChart", filteredData, radarChartOptions);
}



createPlayerCheckBoxes(data);
RadarChart(".radarChart", data, radarChartOptions);
