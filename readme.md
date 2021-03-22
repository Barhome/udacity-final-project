# My Travel Planner

My Travel Planner is a simple application that is created to help users to save information about their future tirps and to grab weather information and images of their destinations. The application is presented as a final project for [Udacity](www.udacity.com) Frontend Web Development Nanodegree.

## Features

- Weather forcast 16 days ahead. The user can only plan the trip within 16 days from now to get accurate weather information.
- Local storage, the user can save, display and delete any tirp depending on the usage of local storage.
- Responsive for all screen sizes

## Tools

- Node js
- Express server
- Webpack

## Installation To check the code

- Run `npm install` to install all packages and dependencies
- Run `npm run build-prod` then `npm run start` to turn on the server.
- Run `npm run build-dev` for development mode
- Run `npm run test` for jest testing

## About The Application

1. ### Landing Section

   - Two buttons, **The first** scrolls the app where you can display all your saved trips if there is any and **The second** scrolls the app where you can search for your next destination

2. ### Second Section

   - Search for your destination there.
   - hidden div where you can save your trip or reset to search another.
     -Display All trips here also for easier accessability of saved trips on local storage.

3. ### Third Section
   - Hidden Section at start to display all your saved trips from local storage.

## Note

- The application is simple I made it for self-learning purposes focusing on "fetchig data from apis using fetch api, asyn/await promises consuming, and using express server". When it comes to designing I wanted to show that I can use flexbox and grid system. I know that the app is not at top level when it comes to designing but if you know how to use css flexbox and grid system with the use of media queries you can deliver any static design and with the use of dom manipulation you can add the magical dynamic effects of javascrip and I also tried to force some frontend data validation with the use of regular expressions ex: when a user enters date.
