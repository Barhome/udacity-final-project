import {
  addTrip,
  handleInputs,
  scrollToFindDestination,
  showTrips,
  deleteTrip,
  findAnotherTrip,
} from "./js/app";
import "./styles/header.scss";
import "./styles/fetchData.scss";
import "./styles/base.scss";
import "./styles/savedData.scss";
import "./styles/mediaQuery.scss";
import imgIntroJs from "./media/images/1.png";

createElement("test");
// landing section image
const imgIntro = document.getElementById("img-intro");
imgIntro.src = imgIntroJs;

// listner to fetch data
document.getElementById("show-trip").addEventListener("click", handleInputs);

// eventlistner to scroll
document
  .getElementById("find-destination-btn")
  .addEventListener("click", function () {
    scrollToFindDestination("find-destination");
  });

// eventlistner to view saved trips on local storage
const allTrips = document.getElementsByClassName("all-trips");
for (let i = 0; i < allTrips.length; i++) {
  allTrips[i].addEventListener("click", showTrips);
}

export { addTrip, deleteTrip, findAnotherTrip };
