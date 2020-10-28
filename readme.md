# The Travel Planer App
This project is an asynchronous web app with a node backend, that uses Web API and user data to dynamically update the UI.

The app does the folliwing when searching for a location:

- Fetches geoinformation from geonames API
- Fetches multiple pictures from pixabay API
- Fetches weatherdata from weatherbit API and shows todays weather
- Fetches Map from google Maps Javascript API
- Have a count down for departure

## Part of Udacity Frontend web development Nanodegree Program
This app is fifth and final project in Udacitys Frontend web development Nanodegree Program. This exercise challenge the student to create a node backend and fetch data from various API's, and combine this into a new travel experience with geoinfo, images and weatherdata. 

## installation

In order to run this project, type the folling in the terminal:

1. Create new file to save personal Credentials to Weatherbit and Pixabay
```touch .env```

2. Type in API key in .env file
```WB_API_KEY=${your API key}```
```PB_API_KEY=${your API key}```

3. install all node packages:
```npm install```

4. Build dist folder with final project
```npm run build```

5. Start backend
```npm run start```