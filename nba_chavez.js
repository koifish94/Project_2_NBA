anychart.onDocumentReady(function () {

    // create a data set
    var data = anychart.data.set([
      ["Gorgui Dieng", 16229213],
      ["Dewayne Dedmon", 1333334],
      ["Jae Crowder", 7815533],
      ["Kentavious Pope", 8089282],
      ["Jalen Brunson", 1416852],
      ["Miles Bridges", 3755400],
      ["Jeff Green", 3405280],
      ["Rodney Hood", 5718000],
      ["Kevin Huerter", 2636280],
      ["Jonathan Issac", 5806440],
      ["Josh Jackson", 7059480],
      ["Frank Kamisky", 4767000]
    ]);

    // create a chart
    var chart1 = anychart.bar();

    // create a bar series and set the data
    var series = chart1.bar(data);

    // set the chart title
    chart1.title("Median Player Rating(76) Salaries($)");

    // set the titles of the axes
    chart1.xAxis().title("Player");
    chart1.yAxis().title("Salaries($)");

    // set the container id
    chart1.container("container");

    // initiate drawing the chart
    chart1.draw();
});