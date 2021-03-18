// import { testJs } from "./js/test.js";
// import "./styles/test.scss";
// testJs();
import { handleInputs, scrollToFindDestination } from "./js/handleInputs";
import "./styles/header.scss";
import "./styles/grid.scss";
import "./styles/base.scss";
import "./styles/savedData.scss";
import imgStart from "./media/images/1.jpg";
import imgIntroJs from "./media/images/1.png";

const img = document.getElementById("city-image");
const imgIntro = document.getElementById("img-intro");
const imgCard = document.getElementsByClassName("img-card");

img.src = imgStart;
imgIntro.src = imgIntroJs;
for (let i = 0; i < imgCard.length; i++) {
  imgCard[i].src = imgStart;
}
document.getElementById("show-trip").addEventListener("click", handleInputs);
document
  .getElementById("find-destination-btn")
  .addEventListener("click", scrollToFindDestination);

export { imgStart };
