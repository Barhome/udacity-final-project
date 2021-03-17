// import { testJs } from "./js/test.js";
// import "./styles/test.scss";
// testJs();
import { handleInputs } from "./js/handleInputs";
import "./styles/header.scss";
import "./styles/grid.scss";
import "./styles/base.scss";
import imgStart from "./media/images/1.jpg";
import imgIntroJs from "./media/images/1.png";

const img = document.getElementById("city-image");
const imgIntro = document.getElementById("img-intro");

img.src = imgStart;
imgIntro.src = imgIntroJs;
document.getElementById("save-trip").addEventListener("click", handleInputs);

export { imgStart };
