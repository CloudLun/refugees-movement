const data = {
  countries: "./data/raw/countries.geojson",
  centroids: "./data/raw/centroids.geojson",
  refugees: "./data/data.csv",
  // ref_2017: "./data/data_2017.csv",
  // ref_2018: "./data/data_2018.csv",
  // ref_2019: "./data/data_2019.csv",
  // ref_2020: "./data/data_2020.csv",
  // ref_2021: "./data/data_2021.csv",
  // ref_2022: "./data/data_2022.csv",
};

const promises = [
  d3.json(data.countries),
  d3.json(data.centroids),
  d3.csv(data.refugees),
  // d3.csv(data.ref_2017),
  // d3.csv(data.ref_2018),
  // d3.csv(data.ref_2019),
  // d3.csv(data.ref_2020),
  // d3.csv(data.ref_2021),
  // d3.csv(data.ref_2022),
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
