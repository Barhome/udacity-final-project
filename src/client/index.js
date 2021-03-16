// import { testJs } from "./js/test.js";
// import "./styles/test.scss";
// testJs();
import { handleInputs } from "./js/handleInputs";
import "./styles/header.scss";
import "./styles/grid.scss";
import "./styles/base.scss";
import imgParis from "./media/images/1.jpg";
const img = document.getElementById("city-image");
img.src = imgParis;
document.getElementById("save-trip").addEventListener("click", handleInputs);

export { imgParis };
