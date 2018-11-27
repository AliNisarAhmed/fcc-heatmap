import * as d3 from "d3";

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
).then(drawHeatMap);

const SVG_WIDTH = 1500;
const SVG_HEIGHT = 500;
const margin = { top: 20, bottom: 20, left: 100, right: 20 };

function drawHeatMap(incomingData) {
  console.log(incomingData);

  const BASE_TEMP = incomingData.baseTemperature;
  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const COLORS = [
    "#313695",
    "#4575b4",
    "#74add1",
    "#abd9e9",
    "#e0f3f8",
    "#ffffbf",
    "#fee090",
    "#fdae61",
    "#f46d43",
    "#d73027",
    "#a50026"
  ];

  const thresholds = [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8];

  const monthlyVariance = incomingData.monthlyVariance;

  monthlyVariance.forEach(d => {
    d.abs = BASE_TEMP + d.variance;
    d.monthName = MONTHS[d.month - 1];
  });

  console.log(monthlyVariance);

  const svg = d3
    .select("svg")
    .attr("width", SVG_WIDTH)
    .attr("height", SVG_HEIGHT);

  // **** SCALES ****

  const xScale = d3
    .scaleLinear()
    .domain([1753, 2015])
    .range([margin.left, SVG_WIDTH - margin.right]);

  const yScale = d3
    .scaleBand()
    .domain(MONTHS)
    .range([margin.top, SVG_HEIGHT - margin.bottom]);

  const absMax = d3.max(monthlyVariance, d => d.abs);
  const absMin = d3.min(monthlyVariance, d => d.abs);

  console.log(absMax, absMin);

  const fillScale = d3
    .scaleThreshold()
    .domain(thresholds)
    .range(COLORS);

  // **** X-Axis and Y-Axis ****

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .attr("transform", `translate(0, ${SVG_HEIGHT - margin.bottom})`)
    .attr("id", "x-axis")
    .call(xAxis);
  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .attr("id", "y-axis")
    .call(yAxis);

  const rect = svg
    .selectAll("rect")
    .data(monthlyVariance)
    .enter()
    .append("rect")
    .attr("x", d => xScale(d.year))
    .attr("y", d => yScale(d.monthName))
    .attr("height", "38px")
    .attr("width", "6px")
    .attr("class", "cell")
    .attr("data-month", d => d.month - 1)
    .attr("data-year", d => d.year)
    .attr("data-temp", d => d.abs)
    .attr("fill", d => fillScale(d.abs))
    .attr("stroke", "none")
    .attr("stroke-width", "1px")
    .style("opacity", 0.9);

  //  TOOLTIP

  d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  rect.on("mouseenter", function(d) {
    d3.select("#tooltip")
      .style("opacity", 0.95)
      .attr("data-year", d.year)
      .html(
        `<span>${d.year} - ${d.monthName}</span> <br />
         <span>${d.abs.toFixed(2)}℃</span> <br />
         <span>${d.variance}℃</span>
        `
      )
      .style("left", `${d3.event.x + 10}px`)
      .style("top", `${d3.event.y - 100}px`)
      .transition()
      .duration(200);

    d3.select(this)
      .style("stroke", "black")
      .style("stroke-width", "2px");
  });

  rect.on("mouseleave", function(d) {
    d3.select(this).style("stroke", "none");

    d3.select("#tooltip").style("opacity", 0);
  });

  // Legend

  const legend = svg
    .append("g")
    .attr("id", "legend")
    .attr("transform", "translate(60, 520)");

  const legendGroups = legend
    .selectAll("g")
    .data(thresholds)
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(${i * 35}, 0)`);

  legendGroups
    .append("rect")
    .attr("width", 38)
    .attr("height", 35)
    .style("fill", d => fillScale(d))
    .style("stroke", "black")
    .style("stroke-width", "1px");

  legendGroups
    .append("text")
    .attr("x", (d, i) => i)
    .attr("y", 50)
    .attr("dx", 15)
    .text(d => (String(d).length < 2 ? String(d) + ".0" : String(d)));
}
