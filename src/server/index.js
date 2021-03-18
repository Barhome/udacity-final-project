//settin up environment variable
const dotenv = require("dotenv");
dotenv.config();

// declare api credentials for setting up  environment variable
const key_geonames = process.env.API_KEY1;
const key_weather = process.env.API_KEY2;
const key_pixabay = process.env.API_KEY3;

// setting up project endpoint
const projectData = {};
projectData.geonames = {};
projectData.weatherApi = {};
projectData.pixabayApi = {};
let destinationCity = "";
let destinationCountry = "";
let tripDate = "";
// setting up server requirements

let path = require("path");
const express = require("express");
const fetch = require("node-fetch"); //usig fetch server side

// instance of express
const app = express();

/* Middleware*/
//including body-parser
const bodyParser = require("body-parser");
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
//including cors
const cors = require("cors");
const { request } = require("http");
//connecting cors
app.use(cors());

// setting up app main directory

app.use(express.static("dist"));

//setting up the main get route

app.get("/", function (req, res) {
  res.sendFile("dist/index.html");
});

// designates what port the app will listen to for incoming requests
app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});

//helper function to remove spaces from a string

function removeSpaces(stringData) {
  return stringData.split(" ").join("");
}
//helper function to check the remaining days to your trip day

function getRemainingDays(date) {
  const today = new Date();
  console.log(today);
  const tripDay = new Date(date);
  console.log(tripDay);
  const remainingDays = Math.round((tripDay - today) / (1000 * 60 * 60 * 24));
  return remainingDays;
}

// helper function to extract the matching traveling day data from weatherbit api

function getTravelingDayData(tripDate, weatherApiData) {
  projectData.weatherApi.status = "offline";
  for (let i = 0; i < weatherApiData.data.length; i++) {
    if (weatherApiData.data[i].valid_date === tripDate) {
      projectData.weatherApi.temp = weatherApiData.data[i].temp;
      projectData.weatherApi.description =
        weatherApiData.data[i].weather.description;
      projectData.weatherApi.remainingDays = getRemainingDays(tripDate);
      projectData.weatherApi.status = "online";
      projectData.weatherApi.weatherStatus =
        "You have planned your trip within 16 days you can get information about the weather in your destination";
      break;
    }
  }

  if (projectData.weatherApi.status === "offline") {
    projectData.weatherApi.weatherStatus =
      "You need to plan your trip within 16 days from now to get information about the weather in your destination";
    projectData.weatherApi.temp = "no temprature to show";
    projectData.weatherApi.remainingDays = getRemainingDays(tripDate);
  }
}

// creating post route for user Inputs

const postUserInputs = async function (req, res) {
  console.log(req.body);
  destinationCity = req.body.destinationCity;
  destinationCountry = req.body.destinationCountry;

  tripDate = req.body.tripDate;
  const requestGeonames = await fetch(
    `http://api.geonames.org/searchJSON?q=${destinationCity}&maxRows=1&username=${key_geonames}`
  );
  const geonamesData = await requestGeonames.json();
  const requestWeatherApi = await fetch(
    `http://api.weatherbit.io/v2.0/forecast/daily?lat=${geonamesData.geonames[0].lat}&lon=${geonamesData.geonames[0].lng}&key=${key_weather}`
  );
  const weatherApiData = await requestWeatherApi.json();
  const requestPixabayApi = await fetch(
    `https://pixabay.com/api/?key=${key_pixabay}&q=${removeSpaces(
      destinationCity
    )}+${removeSpaces(destinationCountry)}+tourism&image_type=photo`
  );
  const pixabayApiData = await requestPixabayApi.json();

  try {
    //console.log(weatherApiData.data[0].temp);
    //console.log(weatherApiData);
    projectData.geonames.lng = geonamesData.geonames[0].lng;
    projectData.geonames.lat = geonamesData.geonames[0].lat;
    //get weather data for the exact traveling day
    getTravelingDayData(tripDate, weatherApiData);
    //projectData.weatherApi.temp = weatherApiData.data[0].temp;
    projectData.pixabayApi.imageUrl = pixabayApiData.hits[0].largeImageURL;

    console.log(projectData);
    res.send(projectData);
  } catch (error) {
    console.log(`error:${error}`);
  }
};

app.post("/postUserInputs", postUserInputs);
