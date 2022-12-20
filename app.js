const info = document.querySelector(".info");
const refNum = document.querySelector("#refugeesNum");
const countryName = document.querySelector("#countryName");
const refPer = document.querySelector("#refugeesPer");
// const yearTotal = [23030073, 23861182, 24562810, 24846772, 25943419, 31575589]

let yearFilteredData = [];
let toggle = 'out'

function infoTextsHandler(data, countryTypeVar) {
  let refNumHTML = `${countryRefugeesTotal()}`;
  let counrtyNameHTML = `${data[0][countryTypeVar]}`;
  let refPerHTML = `${(
    (countryRefugeesTotal() / countryYearRefugeesTotal()) *
    100
  ).toFixed(2)}%`;

  refNum.innerHTML = refNumHTML;
  countryName.innerHTML = counrtyNameHTML;
  refPer.innerHTML = refPerHTML;

  //   let rawHTML = `${countryRefugeesTotal()} refugees originated from ${
  //     data[0][countryTypeVar]
  //   } which accounted for ${(
  //     (countryRefugeesTotal() / countryYearRefugeesTotal()) *
  //     100
  //   ).toFixed(2)}% of global total refugees`;
  //   info.innerHTML = rawHTML;
}

function countryRefugeesTotal() {
  let total = 0;
  for (let i = 0; i < originCountry.length; i++) {
    total += +originCountry[i]["International total"];
  }
  return total;
}

function countryYearRefugeesTotal() {
  let total = 0;
  for (let i = 0; i < yearFilteredData.length; i++) {
    total += +yearFilteredData[i]["International total"];
  }
  return total;
}

