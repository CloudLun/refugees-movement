const data = {
  countries: "",
  centroids: "./data/raw/centroids.geojson",
  refugees: "./data/data.csv",
};

const promises = [
  d3.json(data.countries),
  d3.json(data.centroids),
  d3.csv(data.refugees),
];

const yearOptions = document.querySelector("#years");
const btn = document.querySelector(".btn");

Promise.all(promises).then((data) => {
  yearFilteredData = dataYearFilter(data[2], "2021");
  countryCentroidCreator(data);
  yearOptions.addEventListener("change", (event) => {
    target = event.target.value;
    yearFilteredData = dataYearFilter(data[2], target);
    mappingDefaultHandler();
    countryCentroidCreator(data);
  });
  btn.addEventListener("click", () => {
    btn.classList.toggle("btn-in");
    if (btn.classList.contains("btn-in")) {
      toggle = "in";
      mappingDefaultHandler();
      countryCentroidCreator(data);
    } else {
      toggle = "out";
      mappingDefaultHandler();
      countryCentroidCreator(data);
    }
  });
});
