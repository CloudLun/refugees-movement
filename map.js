mapboxgl.accessToken =
  "pk.eyJ1IjoiY2xvdWRsdW4iLCJhIjoiY2s3ZWl4b3V1MDlkejNkb2JpZmtmbHp4ZiJ9.MbJU7PCa2LWBk9mENFkgxw";

const map = new mapboxgl.Map({
  container: "map", // container ID
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/cloudlun/cl2eq8ceb000a15o06rah6zx5", // style URL
  center: [25.128, 19.815], // starting position [lng, lat]
  zoom: 1.385, // starting zoom
  interactive: false,
});

let transform = d3.geoTransform({ point: projectPoint });
let path = d3.geoPath().projection(transform);
let container = map.getCanvasContainer();

let svg = d3
  .select(container)
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100vh")
  .style("position", "absolute")
  .style("z-index", 2);

let g = {
  countries: svg.append("g").attr("id", "countries"),
  centroids: svg.append("g").attr("id", "centroids"),
  path: svg.append("g").attr("id", "paths"),
};

let countryPositions = [];
let originCountry = [];
let asylumCountry = [];
let refugeesPath;

let countryColor = "#ffa500";
let pathColor = "#ffc966";

const r = 3.5;
const svgNode = document.querySelector("svg");
const tooltip = d3.select("body").append("div").attr("class", "tooltip");

function projectPoint(lon, lat) {
  var point = map.project(new mapboxgl.LngLat(lon, lat));
  this.stream.point(point.x, point.y);
}

function dataYearFilter(data, year) {
  return data.filter((d) => d["Year"] === year);
}

function countryCentroidCreator(data) {
  // centroids.selectAll("*").remove();
  centroids = g.centroids
    .selectAll("centroids")
    .data(data[1].features)
    .enter()
    .append("path")
    .attr("class", "centroid")
    .attr("id", (d) => `${d.properties.ISO}`)
    .attr("data-country", (d) => `${d.properties.COUNTRY}`)
    .attr("d", path.pointRadius(r))
    .attr("stroke", "none")
    .attr("fill", countryColor)
    .attr("fill-opacity", 0.6)
    .on("mouseover", (e, d) => {
      content = `${d.properties.COUNTRY}`;
      tooltip.html(content).style("visibility", "visible");
    })
    .on("mousemove", (e, d) => {
      tooltip
        .style("top", e.pageY - (tooltip.node().clientHeight + 5) + "px")
        .style("left", e.pageX - tooltip.node().clientWidth / 2.0 + "px");
    })
    .on("mouseout", (e, d) => {
      tooltip.style("visibility", "hidden");
    })
    .on("click", (e, d) => {
      originCountry = originCountryFilter(
        yearFilteredData,
        `${e.target.attributes["data-country"].value}`
      );

      asylumCountry = asylumCountryFilter(
        yearFilteredData,
        `${e.target.attributes["data-country"].value}`
      );

      centroids.style("opacity", 0.3);
      countryPositionsCreator();
      if (toggle === "out") {
        countriesCoordinatesCreator(originCountry);
        countryRefugeesPath(originCountry);
        countriesCirclesCreator(originCountry, "asylum_coordinates");
        sortValues(originCountry);
        topFiveFilter();
        barChartCreator(topFiveCountyType, "Country of asylum");
        infoTextsHandler(originCountry, "Country of origin");
      }
      if (toggle === "in") {
        countriesCoordinatesCreator(asylumCountry);
        countryRefugeesPath(asylumCountry);
        countriesCirclesCreator(asylumCountry, "origin_coordinates");
        sortValues(asylumCountry);
        topFiveFilter();
        barChartCreator(topFiveCountyType, "Country of origin");
        infoTextsHandler(asylumCountry, "Country of asylum");
      }
    });
}

function countryPositionsCreator() {
  countryPositions = [];
  const countryCentroids = document.querySelectorAll(".centroid");
  for (let i = 0; i < countryCentroids.length; i++) {
    countryPositions.push({
      country: countryCentroids[i].getAttribute("data-country"),
      position: [
        d3.select(`path#${countryCentroids[i].id}`).node().getBBox().x + r,
        d3.select(`path#${countryCentroids[i].id}`).node().getBBox().y + r,
      ],
    });
  }
}

function originCountryFilter(data, country) {
  return data.filter((d) => d["Country of origin"] === country);
}

function asylumCountryFilter(data, country) {
  return data.filter((d) => d["Country of asylum"] === country);
}

function countriesCoordinatesCreator(countryType) {
  for (let i = 0; i < countryType.length; i++) {
    for (let j = 0; j < countryPositions.length; j++) {
      if (
        countryType[i]["Country of origin"] === countryPositions[j]["country"]
      ) {
        countryType[i]["origin_coordinates"] = countryPositions[j]["position"];
      }
      if (
        countryType[i]["Country of asylum"] === countryPositions[j]["country"]
      ) {
        countryType[i]["asylum_coordinates"] = countryPositions[j]["position"];
      }
    }
  }
}

function countriesCirclesCreator(countryType, countryTypeVar) {
  g.countries.selectAll("*").remove();
  g.countries
    .append("g")
    .attr("class", "countries")
    .selectAll("circles")
    .data(countryType)
    .enter()
    .append("circle")
    .attr("cx", (d, i) => d[countryTypeVar][0])
    .attr("cy", (d) => d[countryTypeVar][1])
    .attr("r", 3)
    .style("fill", countryColor)
    .style("opacity", 0.7);
}

function countryRefugeesPath(countryType) {
  let wScale = d3.scaleLinear().domain([1, 100000]).range([1, 8]);
  g.path.selectAll("*").remove();
  refugeesPath = g.path
    .selectAll("refugeesPath")
    .data(countryType)
    .enter()
    .append("path")
    .attr("class", "countryPath")
    .attr("d", (d) => {
      let dx = d["origin_coordinates"][0] - d["asylum_coordinates"][0],
        dy = d["origin_coordinates"][1] - d["asylum_coordinates"][1];
      dr = Math.sqrt(dx * dx + dy * dy);
      return (
        "M" +
        d["origin_coordinates"][0] +
        "," +
        d["origin_coordinates"][1] +
        "A" +
        dr +
        "," +
        dr +
        " 0 0,1 " +
        d["asylum_coordinates"][0] +
        "," +
        d["asylum_coordinates"][1]
      );
    })
    .attr("fill", "none")
    .style("opacity", 0.6)
    .attr("stroke", pathColor)
    .attr("stroke-width", (d) => wScale(+d["International total"]))
    // .on("mouseover", (e, d) => {
    //   // refugeesPath.style('opacity', 0.1)
    //   console.log('aa')
    // })
    // .on("mouseout", (e, d) => {
    // })
    .transition()
    .duration(1400)
    .attrTween("stroke-dasharray", function () {
      var len = this.getTotalLength();
      return function (t) {
        return d3.interpolateString("0," + len, len + ",0")(t);
      };
    });
}

function mappingDefaultHandler() {
  g.path.selectAll("*").remove();
  g.countries.selectAll("*").remove();
  g.centroids.selectAll("*").remove();
  barSvg.selectAll("*").remove();
}

// map.on("viewreset", render);
// map.on("move", render);
// map.on("moveend", render);

// console.log(e.target.attributes["data-country"].value);
// e.target.classList.contains("clicked")
//   ? d3.select(e.target).attr("class", "centroid")
//   : d3.select(e.target).attr("class", "centroid clicked");
// e.target.classList.contains("clicked")
//   ? d3.select(e.target).attr("fill", "red")
//   : d3.select(e.target).attr("fill", "orange");

// .attr("x1", (d) => {
//   d["origin_coordinates"][0];
// })
// .attr("y1", (d) => {
//   d["origin_coordinates"][1];
// })
// .attr("x2", (d) => {
//   d["asylum_coordinates"][0];
// })
// .attr("y2", (d) => {
//   d["asylum_coordinates"][1];
// })
