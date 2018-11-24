import * as d3 from "d3";

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
).then(drawHeatMap);

const SVG_WIDTH = 1000;
const SVG_HEIGHT = 500;
const margin = { top: 20, bottom: 20, left: 20, right: 20 };

function drawHeatMap(incomingData) {
  console.log(incomingData);

  const BASE_TEMP = incomingData.baseTemperature;
  const monthlyVariance = incomingData.monthlyVariance;
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

  monthlyVariance.forEach(d => {
    d.abs = BASE_TEMP + d.variance;
  });

  const svg = d3
    .select("svg")
    .attr("width", SVG_WIDTH)
    .attr("height", SVG_HEIGHT);

  const xExtent = d3.extent(monthlyVariance, d => d.year);

  const xScale = d3
    .scaleLinear()
    .domain(xExtent)
    .range([margin.left, SVG_WIDTH - margin.right]);
  const yScale = d3
    .scaleLinear()
    .domain([1, 12])
    .range([SVG_HEIGHT - margin.bottom, margin.top]);
  const xAxis = d3.axisBottom().scale(xScale);
  const yAxis = d3
    .axisLeft(yScale)
    .ticks(12)
    .tickValues(MONTHS);

  svg
    .append("g")
    .attr(
      "transform",
      `translate(${SVG_HEIGHT - margin.bottom}, ${margin.left})`
    )
    .call(xAxis);

  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.bottom})`)
    .call(yAxis);
}
