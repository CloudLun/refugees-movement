mapboxgl.accessToken =
  "pk.eyJ1IjoiY2xvdWRsdW4iLCJhIjoiY2s3ZWl4b3V1MDlkejNkb2JpZmtmbHp4ZiJ9.MbJU7PCa2LWBk9mENFkgxw";

const map = new mapboxgl.Map({
  container: "map", // container ID
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/cloudlun/cl2eq8ceb000a15o06rah6zx5",
  center: [9.128, 7.815], // starting position [lng, lat]
  zoom: 2.13, // starting zoom
  projection: {
    name: 'mercator'
}
});

function projectPoint(lon, lat) {
  var point = map.project(new mapboxgl.LngLat(lon, lat));
  this.stream.point(point.x, point.y);
}

let transform = d3.geoTransform({ point: projectPoint });
let path = d3.geoPath().projection(transform);

const data = {
  countries: "./data/raw/countries.geojson",
  centroids: "./data/raw/centroids.geojson",
  refugees: "./data/data.csv",
};


const container = map.getCanvasContainer();
const svg = d3
  .select(container)
  .append("svg")
  .attr("width", "800px")
  .attr("height", "700px")
  .style("position", "absolute")
  .style("z-index", 2);

const g = {
  countries: svg.append("g").attr("id", "countries"),
  centroids: svg.append("g").attr("id", "centroids"),
  path: svg.append("g").attr("id", "paths"),
};

const scale = {
  nodes: d3.scaleLinear(),
  path: d3.scaleLinear(),
};

const promises = [
  d3.json(data.countries),
  d3.json(data.centroids),
  d3.csv(data.refugees),
];

const tooltip = d3.select("body").append("div").attr("class", "tooltip");

Promise.all(promises).then((data) => {

//   countryPolygonCreator(data[0].features);
  countryCentroidCreator(data[1].features);

  function render() {
    // countries.attr("d", path);
    centroids.attr("d", path.pointRadius(3));
  }

  render();
  map.on("viewreset", render);
  map.on("move", render);
  map.on("moveend", render);
});

function countryPolygonCreator(data) {
  countries = g.countries
    .selectAll("countries")
    .data(data)
    .attr("class", "country")
    .attr("data-country", (d) => `${d.properties.COUNTRY}`)
    .enter()
    .append("path")
    .attr("stroke", "none")
    .attr("fill", "gray")
    .attr("stroke-width", 0.25)
    .attr("fill-opacity", 0.8);
}

function countryCentroidCreator(data) {
  centroids = g.centroids
    .selectAll("centroids")
    .data(data)
    .attr("class", "centroid")
    .attr("data-country", (d) => `${d.properties.COUNTRY}`)
    .enter()
    .append("path")
    .attr("stroke", "none")
    .attr("fill", "orange")
    .attr("stroke-width", 0.25)
    .attr("fill-opacity", 0.8)
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
    });
}
