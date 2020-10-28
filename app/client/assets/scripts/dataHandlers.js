const popUpResult = document.querySelector('.search__result');
const dateField = document.getElementById('date');
let searchDate;
let daysUntilDeparture;
let weatherDataIsAvailable = false;

const setPlaceholderText = () => {
    const today = new Date();
    const y = today.getFullYear();
    let m = today.getMonth() + 1;
    let d = today.getDate();

    m = m < 10 ? '0' + m : m;
    d = d < 10 ? '0' + d : d;

    dateField.setAttribute('placeholder', `${d}-${m}-${y}`);
    searchDate = today.getTime();
};

const setDepatureDate = () => {
    const datestring = dateField.value;
    let departureDate;

    if (datestring) {
        const dateArray = datestring.split('-')
        
        // set month to correct date/month structure
        dateArray[2] = dateArray[2] - 1;
        dateArray.forEach((datepart, index) => {
            dateArray[index] = parseInt(datepart);    
        })
        departureDate = new Date(dateArray[2] + 1, dateArray[1] - 1, dateArray[0], 0,0,0)
        departureDate = departureDate.getTime();

    } else {
        departureDate = searchDate;
    }

    calculateDeparture(departureDate, searchDate)
    return departureDate
}

const calculateDeparture = (departureDay, searchDate) => {
    const differenceInTime = departureDay - searchDate;
    daysUntilDeparture = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    checkWeatherData(daysUntilDeparture);
    console.log(`There is ${daysUntilDeparture} days until depature!`);
    return daysUntilDeparture;
}

const checkWeatherData = (daysLeft) => {
    //check if forecast is available for depatureDate
    if(daysLeft <= 15) {
        weatherDataIsAvailable  = true;
    }
    console.log('weatherdata is available!')
}

function searchTravel(city) {
    getCityInfo(city).then(data => {
        //set DepartureDate with conversion function
        const departureDate = setDepatureDate();

        // Update UI for Travel info and countdown 
        updateTravelPlanner(departureDate);

        //save GeoData to /all
        postData('/save', {
            cityData: data,
            searchDate: searchDate,
            departureDate: departureDate
        })
        return data
    }).then(data => {
        // Update country information on all pages
        updateCityInfo(data)

        // Fetch weather and update UI
        getWeather().then(weather => {
            updateWeather(weather, daysUntilDeparture);
        });

        // update Map
        getMap(data);
    }).then(() => {
        //get ImageData and update Photo in resume
        getImage().then((data) => {
            updatePhotos(data);
        })

        popUpResult.classList.toggle('finished')
    })
} 

/* Function to GET Web API Data*/
const getCityInfo = async (city) => {

    const cityName = city ? city : document.getElementById('destination').value;
    const baseURL = 'http://api.geonames.org/searchJSON?q='
    const response = await fetch(baseURL + cityName + '&username=jonas_graae');

    if(response.status === 200) {
        let data = await response.json();
        data = data.geonames[0];
        return data;
    } else {
        throw new Error('Unable to fetch weather Data');
    }
// Google API for swithcing out geonames after udacity
// const baseURL = 'https://maps.googleapis.com/maps/api/geocode/json?address='
// const response = await fetch(baseURL + data.name + '&key=AIzaSyD8f2BlVwnHkEuYrZhe7JknUT9cDpJk-Nc');
}

const postData = async ( url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST', 
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },        
        body: JSON.stringify(data), 
    });

    try {
        console.log(response);
    } catch(error) {
        console.log("error", error);
    }
}

const updateCityInfo = data => {
    // Add title with city name
    const headline = document.querySelector('.sr--title');
    headline.innerHTML = `${data.name}<span class="dot">.<span>`;

    // add subtitle with country and flag
    const subline = `<h3 class="sr--flagtitle">${data.countryName}</h3>
                    <img class="sr--flag" src="https://www.countryflags.io/${data.countryCode}/flat/32.png" alt="Country Flag ${data.countryName}">`
    headline.insertAdjacentHTML("afterend", subline);

    // Add city names on other subpages
    const cityspans = document.querySelectorAll('.cityname');
    cityspans.forEach(city => {
        city.textContent = data.name;
    })
}

const updateTravelPlanner = (departureDate) => {
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }
    const travelDay = new Date(departureDate).toLocaleDateString('dk-DK', options);
    const bookingDay = new Date(searchDate).toLocaleDateString('dk-DK', options);

    let countDownString = ''

    if(daysUntilDeparture === 0) {
        countDownString = `Departure is today! Go pack`;
    } else {
        countDownString = `There is ${daysUntilDeparture} days to departure`;
    }

    let weatherDataString = '';

    if(weatherDataIsAvailable) {
        weatherDataString = `<label for="weather">See the weather forcast for your travel</label>`;
    } else {
        weatherDataString = `<label for="weather">See the weatherforecast for today</label>`;
        console.log(weatherDataIsAvailable)
    }

    const resumePage = document.querySelector('.sr--inner')
    const travelPlanner= `<div class="travel_planer">
                            <h3>Travel Planner</h3>
                            <ul>
                                <li>Booking date: ${bookingDay}</li>
                                <li>Departure date: ${travelDay}</li>
                                <li>${countDownString}</li>
                                <li>${weatherDataString}</li>
                            </ul>
                        </div>`

    resumePage.insertAdjacentHTML('beforeend', travelPlanner)
}

const getImage = async (city) => {
    const response = await fetch('http://localhost:8080/images');

    try {
        const imageData = await response.json();
        const image = `<img class="sr--photo" src="${imageData.hits[0].webformatURL}" alt="Photo of city">`;
        document.querySelector('.sr--flag').insertAdjacentHTML('afterend', image)
        return imageData;
    } catch (error) {
        console.log(`There was no image for ${city}`)
    }
}

const updatePhotos = data => {
    const photoFrag = document.createDocumentFragment();

    data.hits.forEach((photo, index) => {
        if(index <= 12 && index > 0) {
            const image = document.createElement('img');
            image.classList.add('sr--gallery--photo')
            image.setAttribute('src', `${data.hits[index].webformatURL}`); 
            photoFrag.appendChild(image); 
        }
    });

    document.querySelector('.sr--gallery').appendChild(photoFrag);
}

const getWeather = async () => {
    const response = await fetch('http://localhost:8080/weather');

    try {
        const weatherData = await response.json();
        console.log(weatherData)
        return weatherData;
    } catch (error) {
        console.log(`There was an error fetching the weather!`)
    }
}

const updateWeather = (weatherData, daysleft) => {
    //update resume page
    const travelPlaner = document.querySelector('.travel_planer')
    const resumeWeather = `<h4 class="sr--weather">Todays temperature is ${weatherData.data[0].temp}&deg</h4>`
    travelPlaner.insertAdjacentHTML('beforebegin', resumeWeather)

    console.log(daysleft)
    // if forecast is available get this otherwise todays weather
    daysleft = weatherDataIsAvailable ? daysleft : 0;

    console.log(daysleft)

    // Update weather Tile Today
    const weatherTodayTile = document.querySelector('.weather__today');
    const weatherElements =`<img class="weather__today__icon" src="https://www.weatherbit.io/static/img/icons/${weatherData.data[daysleft].weather.icon}.png">
                            <h3>${weatherData.data[daysleft].weather.description}</h3>
                            <h4>${weatherData.data[daysleft].valid_date}</h4>
                            <h1 class="weather__today__temperature">${weatherData.data[daysleft].temp}&deg</h1>`;
    weatherTodayTile.insertAdjacentHTML('afterbegin', weatherElements) 
} 

const getMap = (data) => {
    const coordinates_destination = { lat: parseInt(data.lat) , lng: parseInt(data.lng) }
    const map = new google.maps.Map(document.getElementById("map"), {
        center: coordinates_destination,
        zoom: 6,
    });

    const marker = new google.maps.Marker({
        position: coordinates_destination,
        map: map,
    });
}

export { searchTravel, getImage, updatePhotos, calculateDeparture, setPlaceholderText}