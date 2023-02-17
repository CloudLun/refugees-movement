const lineOneContainer = document.querySelector("#one");
const lineWidth = lineOneContainer.clientWidth - 20;
const lineHeight = lineOneContainer.clientHeight - 20;

const topOriginList = [
  "Syrian",
  "Afghanistan",
  "Ukraine",
  "South Sudan",
  "Myanmar",
  "Sudan",
  "Central African",
  "Venezuela",
  "Congo",
  "Mexico",
  "Brazil",
  "Nigeria",
  "China",
  "Ethopia",
  "Iran",
  "Iraq",
  "Russia",
  "Colombia",
  "Pakistan",
  "Yemen",
];

const topOriginData = {
  all: "./data/data.csv",
  origin: "./data/top_origin_country_data.csv",
};

const topOriginPromises = [
  d3.csv(topOriginData.all),
  d3.csv(topOriginData.origin),
];

Promise.all(topOriginPromises).then((data) => {
  for (let i = 0; i < topOriginList.length; i++) {
    createLineChartHandler(data[1], data[0], numberList[i], topOriginList[i]);
  }
});

function createLineChartHandler(data, all, num, country) {
  let lineChartSvg = d3
    .select(`#${num}`)
    .append("svg")
    .attr("width", lineWidth)
    .attr("height", lineHeight);
  let countryData = data.filter((d) => d["Country of origin"] === country);
  let x = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => +d["Year"]))
    .range([0, lineWidth]);
  lineChartSvg
    .append("g")
    .attr("transform", "translate(0," + lineHeight + ")")
    .call(d3.axisBottom(x));
  let y = d3
    .scaleLinear()
    .domain(d3.extent(all, (d) => +d["International total"]))
    .range([lineHeight, 0]);

  lineChartSvg
    .append("path")
    .datum(countryData)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .curve(d3.curveBasis)
        .x((d) => x(+d.Year))
        .y((d) => y(+d["International total"]))
    );

  lineChartSvg
    .selectAll("dot")
    .data(countryData)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(+d.Year))
    .attr("cy", (d) => y(+d["International total"]))
    .attr("r", 2)
    .attr("fill", "#69b3a2");
}
