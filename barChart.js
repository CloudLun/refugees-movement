const barMargin = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const barChart = document.querySelector("#barChart");
const width = barChart.clientWidth - 40;
const height = barChart.clientHeight;

let barSvg = d3
  .select("#barChart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

let sortedCountryType = [];
let topFiveCountyType = [];

function barChartCreator(countryType, countryTypeVar) {
  barSvg.selectAll("*").remove();

  let x = d3
    .scaleLog()
    .domain([1, 1000000])
    .range([0, width - 100]);

  let y = d3
    .scaleBand()
    .domain(countryType.map((d) => d[countryTypeVar]))
    // .padding(0.2)
    .range([15, height]);


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

  barSvg
    .selectAll("num")
    .data(countryType)
    .enter()
    .append("text")
    .text((d) => +d["International total"])
    .attr("x", (d) => x(+d["International total"]) + 5)
    .attr("y", (d) => y(d[countryTypeVar]) + 15)
    .attr("fill", "white")

  barSvg
    .selectAll("country")
    .data(countryType)
    .enter()
    .append("text")
    .text((d) =>
      toggle === "out" ? d["Country of asylum"] : d["Country of origin"]
    )
    .attr("x", (d) => x(1))
    .attr("y", (d) => y(d[countryTypeVar])-5)
    .attr("fill", "white")
    .attr('font-size', '14px')
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


