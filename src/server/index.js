// setting up server requirements

let path = require('path')
const express = require('express')


// instance of express 
const app = express()


/* Middleware*/
//including body-parser
const bodyParser = require("body-parser");
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Cors for cross origin allowance
//including cors
const cors = require("cors");
//connecting cors
app.use(cors());

// setting up app main directory  

app.use(express.static('dist'))

//setting up the main get route

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

// designates what port the app will listen to for incoming requests
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})