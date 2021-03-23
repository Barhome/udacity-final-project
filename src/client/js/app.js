// a placeholder for the data in case the user choose to save data

let tripSaver = {};

//global variable will be used in previewing grid header

const scheduledTrips = document.getElementById("scheduled-trips");

// a placeholder for the data stored in localstorage
let localTripSaver;
// get data from local storage

if (localStorage.getItem("localTripSaver") == null) {
  localTripSaver = [];
} else {
  localTripSaver = JSON.parse(localStorage.getItem("localTripSaver"));
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
    return returnedData;
  } catch (error) {
    console.log(`error:${error}`);
  }
};

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
// helper function to be add to eventlistner

async function handleInputs() {
  //Selecting Dom Elements

  const destinationCity = document.getElementById("destination-city").value;
  const destinationCountry = document.getElementById("destination-country")
    .value;
  const tripDate = document.getElementById("trip-date").value;
  const displayInfo = document.getElementById("display-info");
  //check if city and and country are not empty

  if (
    !checkEmptyInput(destinationCountry) &&
    !checkEmptyInput(destinationCity)
  ) {
    alert(
      "Please insert the required search input correctly:Text must not Start with a space"
    );
    return;
  }
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

    // viewing on ui

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

      // assigning  final trip data to tripSaver Object

      tripSaver.destinationCountry = destinationCountry;
      tripSaver.destinationCity = destinationCity;
      tripSaver.remainingDays = data.weatherApi.remainingDays;
      tripSaver.destinationTemp = data.weatherApi.temp;
      tripSaver.weatherDescription = data.weatherApi.description;
      tripSaver.destinationImage = data.pixabayApi.imageUrl;

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
  document.getElementById("save-trip").disabled = true;
  alert("Your trip has been saved to your local system:Local Storage");
}
//helper function to hide all tirps
function hideAllTrips() {
  scrollToFindDestination("intro-section");
  setTimeout(() => {
    scheduledTrips.classList.remove("scheduled-trips");
    scheduledTrips.classList.add("hide");
    document.getElementById("trips-grid").classList.remove("trips-grid");
    document.getElementById("trips-grid").classList.add("hide");
  }, 1000);
}
// helper function to show all the trips stored in local storage

function showTrips() {
  let tripsGrid = "";
  const tripsGridNode = document.getElementById("trips-grid");
  // check if the local storage is empty
  if (!localTripSaver.length) {
    scheduledTrips.classList.add("hide");
    scheduledTrips.classList.remove("scheduled-trips");
    tripsGridNode.classList.add("hide");
    tripsGridNode.classList.remove("trips-grid");
    tripsGridNode.innerHTML = tripsGrid;
    scrollToFindDestination("find-destination");
    setTimeout(() => {
      alert("You don't have any saved Trips");
    }, 1000);

    return;
  }
  scheduledTrips.classList.remove("hide");
  scheduledTrips.classList.add("scheduled-trips");
  tripsGridNode.classList.remove("hide");
  tripsGridNode.classList.add("trips-grid");

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

// helper function to check over empty inputs
function checkEmptyInput(stringValue) {
  //regex that allows to enter up to 6 seperate words no numbers allowed ex:Rio De Janeiro united kingdom of Emirates
  const regex = /^[a-z]{1,}\s{0,}[a-z]{0,}\s{0,}[a-z]{0,}\s{0,}[a-z]{0,}\s{0,}[a-z]{0,}\s{0,}[a-z]{0,}\s{0,}/gi;
  return regex.test(stringValue);
}

export {
  postUserUrlData,
  handleInputs,
  scrollToFindDestination,
  addTrip,
  showTrips,
  deleteTrip,
  findAnotherTrip,
  hideAllTrips,
};
