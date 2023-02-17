const originatedContainer = document.querySelector(".yearOriginated");
const headedContainer = document.querySelector(".yearHeaded");

let originatedHTML = "";
let headedHTML = "";
const numberList = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "nineteen",
  "twenty",
];

for (let i = 0; i < 20; i++) {
  originatedHTML += `<div class= originatedGrid id=${numberList[i]}></div>`;
  headedHTML += `<div class= headedGrid></div>`;
}

originatedContainer.innerHTML = originatedHTML;
headedContainer.innerHTML = headedHTML;
