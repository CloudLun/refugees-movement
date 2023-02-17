const lineChart = document.querySelector("#lineChart");
const lineWidth = lineChart.clientWidth;
const lineHeight = lineChart.clientHeight;

let lineChartSvg = d3
  .select(`#lineChart`)
  .append("svg")
  .attr("width", lineWidth)
  .attr("height", lineHeight);

let lineChartPath;
let lineChartDot;
let lineChartDotBackground;
let x;
let y;

function lineChartCreator(data, countryTypeVar, country) {
  lineChartSvg.selectAll("*").remove();

  let countryData = data.filter((d) => d[countryTypeVar] === country);
  x = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d3.timeParse("%Y")(d["Year"])))
    .range([10, lineWidth - 25]);
  y = d3
    .scaleLinear()
    .domain([500, 1000000])
    .range([lineHeight - 20, 25]);

  let xAxis = d3
    .axisBottom(x)
    .ticks(6)
    .tickSize(5)
    .tickFormat(d3.timeFormat("%Y"));

  let yAxis = d3
    .axisLeft(y)
    .ticks(5)
    .tickSize(-(lineWidth - 50))
    .tickFormat((d) => d / 1000 + "k");

  lineChartSvg
    .append("g")
    .attr("transform", `translate(0, ${lineHeight - 20})`)
    .call(xAxis)
    .style("opacity", 0.5);

  lineChartSvg
    .append("g")
    .attr("transform", `translate(30, 0)`)
    .call(yAxis)
    .style("opacity", 0.5)
    .select(".domain")
    .remove();

  lineChartPath = lineChartSvg
    .append("path")
    .datum(countryData)
    .attr("fill", "none")
    .attr("stroke", toggle === "out" ? originatedColor : headedColor)
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        // .curve(d3.curveBasis)
        .x((d) => x(d3.timeParse("%Y")(d["Year"])))
        .y((d) => y(+d["International total"]))
    );

  lineChartDotBackground = lineChartSvg
    .selectAll("dotBackgroud")
    .data(countryData)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d3.timeParse("%Y")(d["Year"])))
    .attr("cy", (d) => y(+d["International total"]))
    .attr("r", 5)
    .attr("fill", "black");

  lineChartDot = lineChartSvg
    .selectAll("dot")
    .exit()
    .remove()
    .data(countryData)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d3.timeParse("%Y")(d["Year"])))
    .attr("cy", (d) => y(+d["International total"]))
    .attr("r", 3)
    .attr("fill", toggle === "out" ? originatedColor : headedColor)
    .style("z-index", "140")
    .on("mouseover", (e, d) => {
      content = `${d["International total"]}`;
      tooltip.html(content).style("visibility", "visible");
    })
    .on("mousemove", (e, d) => {
      tooltip
        .style("top", e.pageY - (tooltip.node().clientHeight + 5) + "px")
        .style("left", e.pageX - tooltip.node().clientWidth / 2 + "px");
    })
    .on("mouseout", (e, d) => {
      tooltip.style("visibility", "hidden");
    });
}

function updateLineChart(data, countryTypeVar, country) {
  let countryData = data.filter((d) => d[countryTypeVar] === country);
  lineChartPath
    .datum(countryData)
    .transition()
    .duration(1000)
    .attr("stroke", toggle === "out" ? originatedColor : headedColor)
    .attr(
      "d",
      d3
        .line()
        // .curve(d3.curveBasis)
        .x((d) => x(d3.timeParse("%Y")(d["Year"])))
        .y((d) => y(+d["International total"]))
    );
  lineChartDotBackground
    .data(countryData)
    .transition()
    .duration(1000)
    .attr("cx", (d) => x(d3.timeParse("%Y")(d["Year"])))
    .attr("cy", (d) => y(+d["International total"]));

  lineChartDot
    .data(countryData)
    .transition()
    .duration(1000)
    .attr("cx", (d) => x(d3.timeParse("%Y")(d["Year"])))
    .attr("cy", (d) => y(+d["International total"]))
    .attr("fill", toggle === "out" ? originatedColor : headedColor);
}
