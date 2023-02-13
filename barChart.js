const barMargin = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const barChartContainer = document.querySelector("#barChart");
const width = barChartContainer.clientWidth - 20;
const height = barChartContainer.clientHeight;

let barSvg = d3
  .select("#barChart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

let sortedCountryType = [];
let topFiveCountyType = [];

function barChartCreator(countryType, countryTypeVar) {
  barSvg.selectAll("*").remove();

  let x = d3.scaleLog().domain([1, 1000000]).range([0, width]);

  let y = d3
    .scaleBand()
    .domain(countryType.map((d) => d[countryTypeVar]))
    // .padding(0.2)
    .range([0, width]);


  //   let xAxis = barSvg
  //     .append("g")
  //     .attr("class", "xAxis")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(d3.axisBottom(x).tickSize(0))
  //     .call((g) => {
  //       g.select(".domain").remove();
  //     });

  //   let yAxis = barSvg
  //     .append("g")
  //     .attr("class", "yAxis")
  //     .style("font-size", "8px")
  //     .attr("transform", "translate(-3," + -(y.bandwidth() / 30) + ")")
  //     .call(d3.axisRight(y).tickSize(0))
  //     .call((g) => {
  //       g.select(".domain").remove();
  //     });

  barSvg
    .append("g")
    .attr("class", "refugeesRects")
    .selectAll("rects")
    .exit()
    .remove()
    .data(countryType)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return x(1);
    })
    .attr("y", function (d) {
      return y(d[countryTypeVar]);
    })
    .attr("width", x(1))
    .attr("height", "20px")
    .style("fill", toggle === "out" ? originatedColor : headedColor)
    .style("opacity", 1)
    .on("mouseover", (e, d) => {
      content = `${
        toggle === "out" ? d["Country of asylum"] : d["Country of origin"]
      }<br>${d["International total"]}`;
      tooltip.html(content).style("visibility", "visible");
    })
    .on("mousemove", (e, d) => {
      tooltip
        .style("top", e.pageY - (tooltip.node().clientHeight + 5) + "px")
        .style("left", e.pageX - tooltip.node().clientWidth / 5 + "px");
    })
    .on("mouseout", (e, d) => {
      tooltip.style("visibility", "hidden");
    });

  barSvg
    .selectAll("rect")
    .transition()
    .duration(800)
    .attr("x", function (d) {
      return x(1);
    })
    .attr("width", function (d) {
      return x(+d["International total"]);
    })
    .delay(function (d, i) {
      return i * 200;
    });
}

function sortValues(countryType) {
  sortedCountryType = [];

  countryType.map((d) => {
    d["International total"] = +d["International total"];
  });

  sortedCountryType = countryType
    .slice()
    .sort((a, b) =>
      d3.descending(a["International total"], b["International total"])
    );
}

function topFiveFilter() {
  topFiveCountyType = [];

  if (sortedCountryType.length > 10) {
    for (let i = 0; i < 10; i++) {
      topFiveCountyType[i] = sortedCountryType[i];
    }
  } else {
    topFiveCountyType = sortedCountryType;
  }
}
