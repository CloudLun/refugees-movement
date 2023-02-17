const data = {
  centroids: "./data/raw/centroids.geojson",
  refugees: "./data/data.csv",
  originYearData: "./data/total_data_year_country_origin.csv",
  asylumYearData: "./data/total_data_year_country_asylum.csv",
};

const promises = [d3.json(data.centroids), d3.csv(data.refugees),d3.csv(data.originYearData),d3.csv(data.asylumYearData)];

const yearOptions = document.querySelector("#yearsSelection");
const btn = document.querySelector(".btn");

Promise.all(promises).then((data) => {
  yearFilteredData = dataYearFilter(data[1], "2021");
  countryCentroidCreator(data, data[2], data[3]);
  yearOptions.addEventListener("change", (event) => {
    target = event.target.value;
    yearFilteredData = dataYearFilter(data[1], target);
    mappingDefaultHandler();
    countryCentroidCreator(data, data[2], data[3]);
  });
  btn.addEventListener("click", () => {
    btn.classList.toggle("btn-in");
    if (btn.classList.contains("btn-in")) {
      toggle = "in";
      mappingDefaultHandler();
      countryCentroidCreator(data, data[2], data[3]);
      btn.style.backgroundColor = headedColor;
    } else {
      toggle = "out";
      mappingDefaultHandler();
      countryCentroidCreator(data, data[2], data[3]);
      btn.style.backgroundColor = originatedColor;
    }
  });
});
