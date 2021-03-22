// a placeholder for the data in case the user choose to save data

let tripSaver = {};
// a placeholder for the data stored in localstorage
let localTripSaver;
// get data from local storage
const scheduledTrips = document.getElementById("scheduled-trips");

console.log(localStorage.getItem("localTripSaver"));
if (localStorage.getItem("localTripSaver") == null) {
  console.log(localStorage.getItem("localTripSaver"));
  localTripSaver = [];
  console.log("check null");
  console.log(localTripSaver);
} else {
  localTripSaver = JSON.parse(localStorage.getItem("localTripSaver"));
  console.log("check full");
  console.log(localTripSaver);
}

// create function to Post Data
const postUserUrlData = async function (url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  try {
    const returnedData = await response.json();
    console.log(returnedData);
    return returnedData;
  } catch (error) {
    console.log(`error:${error}`);
  }
};

// postUserUrlData("http://localhost:3000/postUserInputs", {
//   userDestination: "paris",
// });

// helper function to convert a date string format from dd/mm/yyyy to yyyy-mm-dd
function dateFormat(date) {
  const day = date.slice(0, date.indexOf("/"));
  const month = date.slice(date.indexOf("/") + 1, date.lastIndexOf("/"));
  const year = date.slice(date.lastIndexOf("/") + 1);
  const newFormat = `${year}-${month}-${day}`;
  return newFormat;
}
// helper function to force the user to insert his date in dd/mm/yyyy format
function checkDate(date) {
  const expression = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
  const regex = new RegExp(expression);
  if (date.match(regex)) return true;
  else return false;
}

// helper function to scroll to find destination section
function scrollToFindDestination(target) {
  const findDestinationSection = document.getElementById(target);
  const headerBorders = document
    .getElementById("app-header")
    .getBoundingClientRect();
  let sectionBorders = findDestinationSection.getBoundingClientRect();
  window.scrollTo({
    left: sectionBorders.left + window.pageXOffset,
    top: sectionBorders.top + window.pageYOffset - headerBorders.height,
    behavior: "smooth",
  });
}
//
async function handleInputs() {
  //Selecting Dom Elements

  let destinationCity = document.getElementById("destination-city").value;
  let destinationCountry = document.getElementById("destination-country").value;
  let tripDate = document.getElementById("trip-date").value;
  const displayInfo = document.getElementById("display-info");
  // const cityImage = document.getElementById("city-image");
  // const saveTrip = document.getElementById("save-trip");
  // const deleteTrip = document.getElementById("delete-trip");

  // check if the date was inserted correctly as dd/mm/yyyy ex: 01/12/2021
  if (!checkDate(tripDate)) {
    alert(
      "Please Enter a valid Date following this format dd/mm/yyyy ex:24/01/2020"
    );
    return;
  }

  // Sending destination and tripDate to server and obtaining data required to be viewed on ui
  try {
    const data = await postUserUrlData("http://localhost:3000/postUserInputs", {
      destinationCity,
      destinationCountry,
      tripDate: dateFormat(tripDate),
    });
    console.log(data);

    console.log(data);
    if (data.weatherApi.status === "online") {
      displayInfo.innerHTML = `<div class="destination-image">
    <img src="${
      data.pixabayApi.imageUrl
    }" alt="trip image" id="city-image" class="city-image" />
    </div>
    <p class="remaining-days">
    Your trip to ${destinationCity} in ${destinationCountry} is about ${
        data.weatherApi.remainingDays
      } ${data.weatherApi.remainingDays > 1 ? "days" : "day"} away from today
    </p>
    <p class="average-temp">
    Average expected temperature is ${data.weatherApi.temp} degree
    </p>
    <p class="weather-description">
    Typical weather description is:"${data.weatherApi.description}"
    </p>
    <div class="results-btns">
    <button id="save-trip" class="btn" onclick="Client.addTrip()">
      Save
    </button>

    <button id="find-another-trip" class="btn" onclick=Client.findAnotherTrip()>Find Another Trip</button>
    </div>`;
      // cityImage.setAttribute("src", data.pixabayApi.imageUrl);
      //cityImage.src = data.pixabayApi.imageUrl;
      // assigning  final trip data to tripSaver Object
      tripSaver.destinationCountry = destinationCountry;
      tripSaver.destinationCity = destinationCity;
      tripSaver.remainingDays = data.weatherApi.remainingDays;
      tripSaver.destinationTemp = data.weatherApi.temp;
      tripSaver.weatherDescription = data.weatherApi.description;
      tripSaver.destinationImage = data.pixabayApi.imageUrl;
      console.log(tripSaver);
      // resetting inputs
      document.getElementById("destination-city").value = "";
      document.getElementById("destination-country").value = "";
      document.getElementById("trip-date").value = "";
      document.getElementById("show-trip").disabled = true;
    }
    // offline status
    else {
      displayInfo.innerHTML = "";
      displayInfo.innerHTML = `<p>${data.weatherApi.weatherStatus}</p>`;
    }
  } catch (error) {
    alert(
      "Failed to Fetch Data: due to invalid data insertion or connection error try again later.."
    );
  }
}
// helper function to add a trip to local storage

function addTrip() {
  const trip = {
    destinationCountry: tripSaver.destinationCountry,
    destinationCity: tripSaver.destinationCity,
    remainingDays: tripSaver.remainingDays,
    destinationTemp: tripSaver.destinationTemp,
    weatherDescription: tripSaver.weatherDescription,
    destinationImage: tripSaver.destinationImage,
  };
  localTripSaver.push(trip);
  localStorage.setItem("localTripSaver", JSON.stringify(localTripSaver));
  console.log(localTripSaver);
  document.getElementById("save-trip").disabled = true;
  alert("Your trip has been saved to your local system:Local Storage");
}

// helper function to show all the trips stored in local storage

function showTrips() {
  // bug code is not working the way it is supposed to work

  // const gridHeader = document.createElement("H1");
  // const text = document.createTextNode("Your Scheduled Trips");
  //const scheduledTrips = document.getElementById("scheduled-trips");
  // gridHeader.appendChild(text);
  // tripsGridNode.before(gridHeader);

  let tripsGrid = "";
  const tripsGridNode = document.getElementById("trips-grid");

  if (!localTripSaver.length) {
    scheduledTrips.classList.add("hide");
    tripsGridNode.innerHTML = tripsGrid;
    setTimeout(() => {
      alert("You don't have any saved Trips");
    }, 1000);
    return;
  }
  scheduledTrips.classList.remove("hide");
  // looping to create a grid
  for (let i = 0; i < localTripSaver.length; i++) {
    tripsGrid += `<div class="card">
    <div class="img-div">
      <img class="img-card" src="" alt="" id="img-card-${i}"/>
    </div>
    <h4>${localTripSaver[i].destinationCountry}-${
      localTripSaver[i].destinationCity
    } is about ${localTripSaver[i].remainingDays} ${
      localTripSaver[i].remainingDays > 1 ? "days" : "day"
    } away</h4>
    <h4>Expected Degree is ${localTripSaver[i].destinationTemp} degree</h4>
    <h4>Weather description:${localTripSaver[i].weatherDescription}</h4>
    <button id="delete" class="btn-delete" onclick=Client.deleteTrip(${i})>Delete</button>
  </div>`;
  }
  tripsGridNode.innerHTML = tripsGrid;

  // looping to inject images in each card
  for (let i = 0; i < localTripSaver.length; i++) {
    const localCityimage = document.getElementById(`img-card-${i}`);
    localCityimage.src = localTripSaver[i].destinationImage;
  }
  scrollToFindDestination("scheduled-trips");
}

// helper function to delete a trip from grid

function deleteTrip(id) {
  localTripSaver.splice(id, 1);
  localStorage.setItem("localTripSaver", JSON.stringify(localTripSaver));
  showTrips();
}

//helper function to find another trip
function findAnotherTrip() {
  const displayInfo = document.getElementById("display-info");
  displayInfo.innerHTML = "";
  displayInfo.innerHTML = "<h1>Your Journey Starts Here..</h1>";
  document.getElementById("show-trip").removeAttribute("disabled");
}
export {
  postUserUrlData,
  handleInputs,
  scrollToFindDestination,
  addTrip,
  showTrips,
  deleteTrip,
  dateFormat,
  findAnotherTrip,
};
