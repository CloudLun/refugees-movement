const info = document.querySelector(".info");
const refNum = document.querySelector("#refugeesNum");
const countryName = document.querySelector("#countryName");
const refPer = document.querySelector("#refugeesPer");
const lineChartContainer = document.querySelector('#lineChartContainer') 
const barChartContainer = document.querySelector('#barChartContainer')
const lineArrow = document.querySelector('.lineArrow')
const barArrow = document.querySelector('.barArrow')
// const yearTotal = [23030073, 23861182, 24562810, 24846772, 25943419, 31575589]
let tooltip = d3.select("body").append("div").attr("class", "tooltip");

let yearFilteredData = [];
let toggle = 'out'

function infoTextsHandler(data, countryTypeVar) {
  let refNumHTML = `${countryRefugeesTotal(data)}`;
  let counrtyNameHTML = `${data[0][countryTypeVar]}`;
  // let refPerHTML = `${(
  //   (countryRefugeesTotal(data) / countryYearRefugeesTotal()) *
  //   100
  // ).toFixed(2)}%`;

  refNum.innerHTML = refNumHTML;
  countryName.innerHTML = counrtyNameHTML;
  // refPer.innerHTML = refPerHTML;

  //   let rawHTML = `${countryRefugeesTotal()} refugees originated from ${
  //     data[0][countryTypeVar]
  //   } which accounted for ${(
  //     (countryRefugeesTotal() / countryYearRefugeesTotal()) *
  //     100
  //   ).toFixed(2)}% of global total refugees`;
  //   info.innerHTML = rawHTML;
}

function countryRefugeesTotal(data) {
  let total = 0;
  for (let i = 0; i < data.length; i++) {
    total += +data[i]["International total"];
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

lineArrow.addEventListener('click', () => {

  lineArrow.classList.toggle('turnLeft')
  console.log('aa')
  lineChartContainer.classList.toggle('lineChartClosed')
})

barArrow.addEventListener('click', () => {
  barArrow.classList.toggle('turnRight')
  barChartContainer.classList.toggle('barChartClosed')
})