// a placeholder for the data in case the user choose to save data

let tripSaver = {};

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

async function handleInputs() {
  //Selecting Dom Elements

  const destinationCity = document.getElementById("destination-city").value;
  const destinationCountry = document.getElementById("destination-country")
    .value;
  const tripDate = document.getElementById("trip-date").value;
  const displayInfo = document.getElementById("display-info");
  const cityImage = document.getElementById("city-image");
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
  const data = await postUserUrlData("http://localhost:3000/postUserInputs", {
    destinationCity,
    destinationCountry,
    tripDate: dateFormat(tripDate),
  });

  if (data.weatherApi.status === "online") {
    displayInfo.innerHTML = `<p class="remaining-days">Your trip to ${destinationCity} in ${destinationCountry} is about ${
      data.weatherApi.remainingDays
    } ${data.weatherApi.remainingDays > 1 ? "days" : "day"} away from today</p>
        <p class="average-temp">Average expected temperature is ${
          data.weatherApi.temp
        } degree</p>
        <p class="weather-description">Typical weather description is:"${
          data.weatherApi.description
        }"</p>
        <div class="results-btns">
          <button id="save-trip" class="btn">Save <br />Trip Details</button>
          <button id="delete-trip" class="btn">
            Search <br />Another Trip
          </button>
        </div>`;
    // cityImage.setAttribute("src", data.pixabayApi.imageUrl);
    cityImage.src = data.pixabayApi.imageUrl;
    // assigning  final trip data to tripSaver Object
    tripSaver.destinationCountry = destinationCountry;
    tripSaver.destinationCity = destinationCity;
    tripSaver.remainingDays = data.weatherApi.remainingDays;
    tripSaver.destinationTemp = data.weatherApi.temp;
    tripSaver.weatherDescription = data.weatherApi.description;
    tripSaver.destinationImage = data.pixabayApi.imageUrl;
    console.log(tripSaver);
  }
  // offline status
  else {
    displayInfo.innerHTML = "";
    displayInfo.innerHTML = `<p>${data.weatherApi.weatherStatus}</p>`;
    cityImage.src = Client.imgStart;
  }
}
// helper function to scroll to find destination section
function scrollToFindDestination() {
  const findDestinationSection = document.getElementById("find-destination");
  let sectionBorders = findDestinationSection.getBoundingClientRect();
  window.scrollTo({
    left: sectionBorders.left + window.pageXOffset,
    top: sectionBorders.top + window.pageYOffset - 50,
    behavior: "smooth",
  });
}

export { postUserUrlData, handleInputs, scrollToFindDestination };
