var width = parseInt(d3.select("#chLine").style("width"));

var height = width - width / 3;

var margin = 20;

var labelArea = 110;

var tPadBot = 30;
var tPadLeft = 30;

var svg = d3
    .select("#chLine")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "chart");

var circRadius;
function crGet() {
    if (width <= 510) {
        circRadius = 5;
    }
    else {
        circRadius = 10;
    }
}
crGet();

//Labels for Axis

//Bottom Axis
svg.append("g").attr("class", "xText");

var xText = d3.select(".xText");

function xTextRefresh() {
    xText.attr(
        "transform",
        "translate(" +
        ((width - labelArea) / 2 + labelArea) +
        ", " +
        (height - margin - tPadBot) +
        ")"
    );
}
xTextRefresh();
console.log(xTextRefresh);

//Rebounds
xText
  .append("text")
  .attr("y", -30)
  .attr("data-name", "TRB")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("Total Rebounds Per Game");

  //Assists
  xText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "AST")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Assists Per Game");

//3 pointers attempted
xText
  .append("text")
  .attr("y", 30)
  .attr("data-name", "3PA")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("3 Pointers Attempted");


//Left Axis
var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

svg.append("g").attr("class", "yText");

var yText = d3.select(".yText");

function yTextRefresh() {
    yText.attr(
      "transform",
      "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
    );
  }
  yTextRefresh();
  console.log(yTextRefresh);

//Points
yText
  .append("text")
  .attr("y", -30)
  .attr("data-name", "PTS")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Points Per Game");

//Field Goal Percentage
yText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "FG%")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Field Goal Percentage");

//3 Point Percentage
yText
  .append("text")
  .attr("y", 30)
  .attr("data-name", "3P%")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("3 Point Percentage");

//Import csv
d3.csv("NBA_Top_50.csv").then(function(data) {
    // Visualize the data
    visualize(data);
  });

  
  
//visualization function
  function visualize(theData) {

    var curX = "PTS";
    var curY = "Ratings";
    var curA = "AST"
    var curR = "TRB"

    var xMin;
    var xMax;
    var yMin;
    var yMax;
  
    var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([30, -50])
    .html(function(d) {
        var theX;

        var playerName = "<div>" + d.Player + "</div>";
        
        var theY = "<div>" + curY + ": " + d[curY] + "</div>";
        
        if (curX === "PTS") {
          
          theX = "<div>" + curX + ": " + d[curX] + "</div>";
        }

        if (curA === "AST") {
          theA = "<div>" + curA + ": " + d[curA] + "</div>";

        }

        if (curR === "TRB") {
          theR = "<div>" + curR + ": " + d[curR] + "</div>";
        }
        else {
        
          theY = "<div>" +
            curY +
            ": " +
            parseFloat(d[curY]).toLocaleString("en") +
            "</div>";
        }
        // Display what we capture.
        return playerName + theX + theY + theA + theR;
      });
    // Call the toolTip function.
    svg.call(toolTip);

    function xMinMAX() {
      xMin = d3.min(theData, function(d) {
        return parseFloat(d[curX]) * 0.90;
      });

      xMax = d3.max(theData, function(d) {
        return parseFloat(d[curX]) * 1.10;
      });
    }

    function yMinMax() {
      yMin = d3.min(theData, function(d) {
        return parseFloat(d[curY]) * 0.90;
      });

      yMax = d3.max(theData, function(d) {
        return parseFloat(d[curY]) * 1.10;
      });
    }
    //change the label text
    function labelChange(axis, clickedText) {
      d3
        .selectAll(".aText")
        .filter("." + axis)
        .filter(".active")
        .classed("active", false)
        .classed("inactive", true);
//text clicked to active
        clickedText.classed("inactive", false).classed("active", true);
    }

  //Scatter plot placement
    xMinMAX();
    yMinMax();
//placement of circles
    var xScale = d3
      .scaleLinear()
      .domain([xMin, xMax])
      .range([margin + labelArea, width - margin]);
    var yScale = d3
      .scaleLinear()
      .domain([yMin, yMax])
      .range([height - margin - labelArea, margin]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
//tick counts
    function tickCount() {
      if (width <= 500) {
        xAxis.ticks(5);
        yAxis.ticks(5);
      }
      else {
        xAxis.ticks(10);
        yAxis.ticks(10);
      }
    }
    tickCount();


    //append axes in group elements

    svg
      .append("g")
      .call(xAxis)
      .attr("class", "xAxis")
      .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
    svg 
      .append("g")
      .call(yAxis)
      .attr("class", "yAxis")
      .attr("transform", "translate(0," + (margin - labelArea) + ", 0)");

  
    //grouping for dots and labels 
    var theCircles = svg.selectAll("g theCircles").data(theData).enter();

    //append circles for each player
    theCircles
      .append("circle")
      .attr("cx", function(d) {
        return xScale(d[curX]);
      })
      .attr("cy", function(d) {
        return yScale(d[curY]);
      })
      .attr("r", circRadius)
      .attr("class", function(d) {
        return "playerCircle" + d.abbr;
      })

      //mouseover and mouseout rules
      .on("mouseover", function(d) {
        toolTip.show(d, this);
        d3.select(this).style("stroke", "#323232");
      })
      .on("mouseout", function(d) {
        toolTip.hide(d);
        d3.select(this).style("stroke", "#e3e3e3");
      });

    theCircles
      .append("text")
      .text(function(d) {
        return d.abbr
      })
      .attr("dx", function(d) {
        return xScale(d[curX]);
      })
      .attr("dy", function(d) {
        return yScale(d[curY]) + circRadius / 2.5;
      })
      .attr("font-size", circRadius)
      .attr("class", "playerText")
      .on("mouseover", function(d) {
        toolTip.show(d);
        d3.select("." +d.abbr).style("stroke", "323232");
      })
      .on("mouseout", function(d) {
        toolTip.hide(d);
        d3.select("." + d.abbr).style("stroke", "#e3e3e3");
      });

    //making graph dynamic
    d3.selectAll(".aText").on("click", function() {
      var self = d3.select(this);

      if(self.classed("inactive")) {
        var axis = self.attr("data-axis");
        var name = self.attr("data-name");

        if (axis === "x") {
          curX = name;

          xMinMAX();

          xScale.domain([xMin, xMax]);

          svg.select(".xAxis").transition().duration(300).call(xAxis);

          d3.selectAll("circle").each(function() {
            d3 
              .select(this)
              .transition()
              .attr("cx", function(d) {
                return xScale(d[curX]);
              })
              .duration(300);
          });

          d3.selectAll(".playerText").each(function() {
            d3
              .select(this)
              .transition()
              .attr("dx", function(d) {
                return xScale(d[curX]);
              })
              .duration(300);
          });

        //change classes of active label and clicked on label
        labelChange(axis, self);
      }
      else {
        curY = name; 
        yMinMax();

        yScale.domain([yMin, yMax]);

        svg.select(".yAxis").transition().duration(300).call(yAxis);

        d3.selectAll("circle").each(function() {
          d3
            .select(this)
            .transition()
            .attr("cy", function(d) {
              return yScale(d[curY]);
            })
            .duration(300);
        });

        //change location of player text
        d3.selectAll(".playerText").each(function() {
          d3 
            .select(this)
            .transition()
            .attr("dy", function(d) {
              return yScale(d[curY]) + circRadius / 3;
            })
            .duration(300);
        });

        //change classes of active label and clicked label
        labelChange(axis, self);


       }
      }
    });

  //changing window sizes
  d3.select(window).on("resize", resize);

  function resize() {
    width = parseInt(d3.select("chLine").style("width"));
    height = width = width / 3.9;
    leftTextY = (height + labelArea) / 2 - labelArea;

    svg.attr("width", width).attr("height", height);

    xScale.range([margin + labelArea, width - margin]);
    yScale.range([height - margin - labelArea, margin]);

    svg
      .select(".xAxis")
      .call(xAxis)
      .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
    
    svg.select(".yAxis").call(yAxis);

    tickCount();

    //update labels
    xTextRefresh();
    yTextRefresh();

    crGet();

  d3
    .selectAll("circle")
    .attr("cy", function(d) {
      return yScale(d[curY]);
    })
    .attr("cx", function(d) {
      return xScale(d[curX]);
    })
    .attr("r", function() {
      return circRadius;
    });

  //change location and size of player names

  d3
    .selectAll(".playerText")
    .attr("dy", function(d) {
      return yScale(d[curY]) + circRadius / 3;
    })
    .attr("dx", function(d) {
      return xScale(d[curX]);
    })
    .attr("r", circRadius / 3);
  }


}