// import { testJs } from "./js/test.js";
// import "./styles/test.scss";
// testJs();
import { handleInputs } from "./js/handleInputs";
import "./styles/header.scss";
import "./styles/grid.scss";
import "./styles/base.scss";
import imgStart from "./media/images/1.jpg";
const img = document.getElementById("city-image");
img.src = imgStart;
document.getElementById("save-trip").addEventListener("click", handleInputs);

export { imgStart };
