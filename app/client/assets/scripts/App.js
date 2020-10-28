import "../styles/globals.scss";
import { searchTravel, setPlaceholderText } from './dataHandlers';

const heroes = document.querySelectorAll('.hero');
const buttons_goToday = document.querySelectorAll('.go_today');
const buttons_pickDate = document.querySelectorAll('.pick_date');
const searchTrigger = document.getElementById('search_travel_button');
let i = 1;

//Set Placeholdertext on datefield
setPlaceholderText();

(function heroSlide() {   
    //consider set interval to shorten code 
    setTimeout(function() {
        heroes.forEach(hero => {
            hero.classList.remove('active');
            if(heroes[i] === hero) {
                hero.classList.add('active');
            }
        })
        i += 1;
        if(i === 4) {
            i = 0;
            heroSlide();
        } else {
            heroSlide();
        }
    }, 5000)
})()

buttons_goToday.forEach((button) => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const city = button.parentElement.getAttribute('data-city');
        //Start data search and update UI
        searchTravel(city);
    })
})

buttons_pickDate.forEach((button) => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const city = button.parentElement.getAttribute('data-city');
        document.getElementById('destination').value = city;
        document.getElementById('travel_search_trigger').checked = true;
        setTimeout(() => {
            document.getElementById('date').focus();
        }, 50)
    })
})

searchTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('button was clicked - Look for data');
    //Start data search and update UI
    searchTravel();
})