const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch')

// Hide my API key and Password with dotenv
const dotenv = require('dotenv');
dotenv.config();

//Setup express
const app = express();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors())
app.use(express.static('dist'))

let appData;

app.get('/', function (req, res) {
    res.send('./dist/index.html');
})

app.post('/save', (req,res) => {
    appData = req.body.cityData;
    appData.searchDate = req.body.searchDate;
    appData.departureDate = req.body.departureDate;
})

app.get('/all', (req, res) => {
    res.send(appData);
});

app.get('/weather', async (req, res) => {
    const baseURL = 'https://api.weatherbit.io/v2.0/forecast/daily?';
    const WB_API_KEY = `&key=${process.env.WB_API_KEY}`;
    const latitude = `&lat=${appData.lat}`;
    const longitude = `&lon=${appData.lng}`;
    
    const queryURL = baseURL + latitude + longitude + WB_API_KEY;
    console.log(queryURL); 

    const response = await fetch(queryURL);

    try {
        let data = await response.json();
        appData.weather = data;
        res.send(data);
    } catch (error) {
        throw new Error(error);
    }
});

app.get('/images', async (req, res) => {
    const baseURL = 'https://pixabay.com/api/?';
    const PB_API_KEY = `key=${process.env.PB_API_KEY}`;
    const destinationQuery = `&q=${encodeURIComponent(appData.name)}`;
    const dimensions = '&min_width=450&min_height=450&image_type=photo&orientation=landscape'
    
    const queryURL = baseURL + PB_API_KEY + destinationQuery + dimensions;
    console.log(queryURL); 

    const response = await fetch(queryURL);

    try {
        let data = await response.json();
        appData.pixabay = data;
        res.send(data);
    } catch (error) {
        throw new Error(error);
    }
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(8080, () => {
        console.log('node server runs on port 8080');
    });
}

module.exports = app;