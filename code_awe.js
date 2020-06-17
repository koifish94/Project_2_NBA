//https://www.youtube.com/watch?v=AseoPgLN7CY

var data =[
  {"PLAYER":"Giannis Antetokounmpo", "Display Player":"Giannis Antetokounmpo", "PTS":29.9,"3P":1.5,"2P":9.5,"Steals":1,"BLK":1,"FT":6.3,"Turnover rate":3.7},
  {"PLAYER":"Lebron James", "Display Player":"Lebron James", "PTS":25.7,"3P":2.2,"2P":7.6,"Steals":1.2,"BLK":0.5,"FT":4,"Turnover rate":4},
  {"PLAYER":"Kawhi Leonard", "Display Player":"Kawhi Leonard", "PTS":26.9,"3P":2.1,"2P":7.2,"Steals":1.8,"BLK":0.6,"FT":6.1,"Turnover rate":2.7},
  {"PLAYER":"Anthony Davis", "Display Player":"Anthony Davis","PTS":26.7,"3P":1.2,"2P":8.1,"Steals":1.5,"BLK":2.4,"FT":7,"Turnover rate":2.5},
  {"PLAYER":"James Harden", "Display Player":"James Harden", "PTS":34.4,"3P":4.4,"2P":5.4,"Steals":1.7,"BLK":0.9,"FT":10.1,"Turnover rate":4.5},
];

var label = [
    "PTS",
    "3P",
    "2P",
    "Steals",
    "BLK",
    "FT",
    "Turnover rate"
];

var scales = {
  "PTS":40,
  "3P":5,
  "2P":10,
  "Steals":3,
  "BLK":2.5,
  "FT":11,
  "Turnover rate":5
};

var scalesAndAxes = {};
label.forEach(function (field){

  var o = {};
  o.scale = d3.scale.linear().domain([0, scales[field]]);
  o.axis = d3.svg.axis()
    .scale(o.scale)
    .tickFormat(function(d, i){ if(i != 0){return d + "";} else {return "";}  })
    .orient("bottom");

  scalesAndAxes[field] = o;
});

// Programmatically adds checkboxes to the dom dependent on the data
function createPlayerCheckBoxes(data) {
  var PlayerCheckBoxContainer = document.getElementById("Player-container");
  var checkBoxes = data.map((row) => {
    var checkBoxContainer = document.createElement("div");
    checkBoxContainer.setAttribute('style','padding-bottom: 5px;');
    checkBoxContainer.classList.add("Player-checkbox-container")
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
    checkBoxContainer.appendChild(checkBox);
    checkBoxContainer.appendChild(label);
    return checkBoxContainer;
  });
  checkBoxes.forEach((checkBox) => PlayerCheckBoxContainer.appendChild(checkBox));
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
  var checkedBoxesInput = Array.from(document.querySelectorAll("input.Player-checkbox:checked"));
  var selectedValues = checkedBoxesInput.map((input) => input.value);
  var filteredData = data.filter((row) => selectedValues.includes(row["Display Player"]))
  RadarChart(".radarChart", filteredData, radarChartOptions);
}



createPlayerCheckBoxes(data);
RadarChart(".radarChart", data, radarChartOptions);