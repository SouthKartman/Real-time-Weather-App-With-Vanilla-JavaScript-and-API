
`use strict`

import { fetchData, url } from "./api.js";
import * as module from './module.js';


// @param {NodeList} elements : Elements node array
// @param {string} eventType : "click", "mouseover"
// @param {function} callback : callback functiom


const addEventOnElements = function(elements, eventType, callback){
for (const element of elements) element.addEventListener(eventType, callback);
}

// Toggle search in mobile device

const searchView = document.querySelector("[data-search-view]");
const searchTogglers = document.querySelectorAll("[data-search-toggler]");

const toggleSearch = () => searchView.classList.toggle("active");
addEventOnElements(searchTogglers, "click", toggleSearch);

// Search Integration

const searchField = document.querySelector("[data-search-field]"); 
const searchResult = document.querySelector("[data-search-result]");

let searchTimeout = null;
const searchTimeoutDuration = 500;

searchField.addEventListener("input",function() {
    searchTimeout ?? clearTimeout(searchTimeout);

    if(!searchField.value){
        searchResult.classList.remove("active");
        searchResult.innerHTML = "";
        searchField.classList.remove("searching");
    } else {
        searchField.classList.add("searching");
    }

    if(searchField.value)
    {
        searchTimeout = setTimeout(() => {
            fetchData(url.geo(searchField.value), function (locations) {
                searchField.classList.remove("searching");
                searchResult.classList.add("active");
                searchResult.innerHTML = `
                    <ul class="view-list" data-search-list></ul>`;

                const /** {NodeList} | [] */ items = [];

                for (const { name, lat, lon, country, state } of locations) {
                    const searchItem = document.createElement("li");
                    searchItem.classList.add("view-item");

                    searchItem.innerHTML = `
                        <span class="m-icon">location_on</span>
                        <div>
                                <p class="item-title">${name}</p>
                                <p class="p-label-2 item-subtitle">${state || ""}, ${country}</p>
                        </div>
                        <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" aria-label="${name}"></a>`;

                    searchResult.querySelector("[data-search-list]").appendChild(searchItem);
                    items.push(searchItem.querySelector("[data-search-toggler]"));
                }

                addEventOnElements(items,"click", function()
                {
                    toggleSearch();
                    searchResult.classList.remove("active");
                })

            });
        }, searchTimeoutDuration);
    }
});



const container = document.querySelector("[data-container]");
const loading = document.querySelector("[data-loading]");
const currentLocationBtn = document.querySelector("[data-current-location-btn]");
const errorContent = document.querySelector("[data-error-content]");
/** 
 //@param {number} lat Latitude
// @param {number} long Longitude
*/
export const updateWeather = function (lat,lon)
{
    loading.style.display = "grid";
    container.style.overflowY = "hidden";
    container.classList.contains("fade-in") ?? container.classList.remove("fade-in");
    errorContent.style.display = "none";


    const currentWeatherSection = document.getElementById("current-weather-card");
    const highlightSection = document.querySelector("[data-highlights]");
    const hourlySection = document.querySelector("[data-hourly-forecast]");
    const forecastSection = document.querySelector("[data-5-day-forecast]");

    currentWeatherSection.innerHTML = "";
    highlightSection.innerHTML = "";
    hourlySection.innerHTML = "";
    forecastSection.innerHTML = "";

if (window.location.hash === "#/current-location")
{
    currentLocationBtn.setAttribute("disabled", "");
}else
{
    currentLocationBtn.removeAttribute("disabled")
}

// CurrentWeatherSection

fetchData(url.currentWeather(lat,lon),function (currentWeather){
    const {
        weather,
        dt:dateUnix,
        sys:{sunrise, sunriseUnixUTC, sunset: sunsetUnixUTC},
        main:{temp,feels_like,pressure,humidity},
        visibility,
        timezone,
        name
    } = currentWeather
    const [{ description, icon }] = weather; 

    const card = document.createElement("div");
    card.classList.add("card","card-lg","current-weather-card")

    //Главный блок погоды

    card.innerHTML = `
        

        <h2 class="title-2 card-title">Now</h2>

        <div class="weapper">
            <p class="heading">${parseInt(temp) + 0}&deg; <sup>C</sup></p>

            <img src="img/weather_icons/${icon}.png" alt="" height="64" width="64" class="weather-icon"
            alt="${description}">
        </div>
        <p class="body-1">${name}</p>
        <p class="body-3">${description}</p>

        <ul class="meta-list">

            <li class="meta-item">
                <span class="m-icon">calendar_today</span>

                <p class="title meta-text">${module.getDate(dateUnix,timezone)}</p>
            </li>

            <li class="meta-item">
                <span class="m-icon">location_on</span>

                <p class="title meta-text" data-location></p>
            </li>

        </ul>
    `;

    // const forecast = document.createElement("div");
    // forecast.classList.add("card","card-lg","forecast-card")

    // forecast.innerHTML = `

    // `;

    fetchData(url.reverseGeo(lat,lon), function([{name,country}]){
        card.querySelector("[data-location]").innerHTML = `${name},${country},`
    });


    currentWeatherSection.appendChild(card);

    // <div class="card card-lg current-weather-card"></div>

    fetchData(url.airPollution(lat,lon), function (airPollution)
    {
        const[
            {
                main: {aqi},
                components: {no2,o3,so2,pm2_5}
            }
        ] = airPollution.list;

        const card = document.createElement("div");
        card.classList.add("card", "card-lg");
        card.innerHTML = `


                <h2 class="title-2" id="hightlights-label">Todays Hightlights</h2>

                <div class="highlight-list">

                    <div class="highlight-card ">
                        <div class="card card-sm hightlight-card one">

                            <h3 class="title-3">Air Quality Index</h3>

                            <div class="wrapper">

                                <div class="m-icon" style="width: 3pc;">air</div>

                                <ul class="card-list">

                                    <li class="card-item air">
                                        <p class="title-1">${Number(pm2_5).toPrecision(3)}</p>

                                        <p class="label-1">PM<sub>2.5</sub></p>
                                    </li>

                                    <li class="card-item air">
                                        <p class="title-1">${Number(so2).toPrecision(3)}</p>

                                        <p class="label-1">SO<sub>2</sub></p>
                                    </li>

                                    <li class="card-item air">
                                        <p class="title-1">${Number(no2).toPrecision(3)}</p>

                                        <p class="label-1">NO<sub>2</sub></p>
                                    </li>

                                    <li class="card-item air">
                                        <p class="title-1">${Number(o3).toPrecision(3)}</p>

                                        <p class="label-1">O3</p>
                                    </li>

                                </ul>

                            </div>

                            <span class="badge aqi-${aqi} label-${aqi}" title="${module.aqiText[aqi].message}">
                                ${module.aqiText[aqi].level}
                            </span>

                        </div>
                    </div>

                    <div class="highlight-card two">
                        <div class="card-sm hightlight-card two">

                            <h3 class="title-3">Sunrise & Sunset</h3>

                            <div class="card-list">

                                <div class="card-item">
                                    
                                    <!-- <span class="m-icon">clear_day</span> -->
                                    <span class="m-icon">thermostat</span>

                                    <div>

                                        <p class="label-1">Sunrise</p>

                                        <p class="title-1">${module.getTime(sunrise,timezone)}</p>
                                    </div>
                                </div>

                                <div class="card-item">
                                
                                    <!-- <span class="m-icon">clear_night</span> -->
                                    <span class="m-icon">thermostat</span>
                                    <div>

                                        <p class="label-1">Sunset</p>

                                        <p class="title-1">${module.getTime(sunsetUnixUTC,timezone)}</p>
                                    </div>
                                    
                                </div>
                            </div>

                        

                        </div>
                    </div>

                    <div class="card card-sm highlight-card">

                        <h3 class="title-3">Humidity</h3>

                        <div class="wrapper">

                            <span class="m-icon">thermostat</span>
                            <!-- <span class="m-icon">humidity_percentage</span> -->

                            <p class="p-title-1">${humidity}<sup>%</sup></p>
                        </div>

                    </div>

                    <div class="card card-sm highlight-card">

                        <h3 class="title-3">Pressure</h3>

                        <div class="wrapper">
                            
                            <span class="m-icon">airwave</span>

                            <p class="p-title-1">${pressure}<sub>hPa</sub></p>

                        </div>

                    </div>

                    <div class="card card-sm highlight-card">

                        <h3 class="title-3">Visibility</h3>

                        <div class="wrapper">
                            <span class="m-icon">visibility</span>

                            <p class="p-title-1">${visibility / 1000}<sub>km</sub></p>

                        </div>

                    </div>

                    <div class="card card-sm highlight-card">

                        <h3 class="title-3">Feels Like</h3>

                        <div class="wrapper">
                            <span class="m-icon">thermostat</span>

                            <p class="p-title-1">${parseInt(feels_like)}&deg;<sup>C</sup></p>
                        </div>

                    </div>

                </div>

            

        `;

        highlightSection.appendChild(card);

    })

    fetchData(url.forecast(lat,lon), function(forecast)
    {
        const {
            list:forecastList,
            city:{timezone}

         } = forecast;

         hourlySection.innerHTML = `
         
         <h2 class="title-2">
            Today at
        </h2>

     <div class="slider-container">

         <ul class="slider-list" data-temp>

         </ul>

         <ul class="slider-list" data-wind>

         </ul>

     </div>
         `;

         for (const [index, data] of forecastList.entries())
         {
            if(index > 7) break;

            const
            {
                dt:dateTimeUnix,
                main:{temp},
                weather,
                wind:{deg:windDirection, speed: windSpeed}
            } = data;

            const[{icon,description}] = weather;

            const tempLi = document.createElement("li");
            tempLi.classList.add("slider-item");
            tempLi.innerHTML = `
                <div class="card card-sm slider-card" >

                    <p class="body-3">${module.getHours(dateTimeUnix,timezone)}</p>

                    <img src="img/weather_icons/${icon}.png" width="48" height="48" loading="lazy" alt="${description}" title="${description}" class="weather-icon">

                    <p class="body-3">${parseInt(temp)}&deg;</p>

                </div>
            `;

            hourlySection.querySelector("[data-temp]").appendChild(tempLi);

            const windLi = document.createElement("li");
            windLi.classList.add("slider-item");
            windLi.innerHTML = `
            <div class="card card-sm slider-card" >

                <p class="body-3">${module.getHours(dateTimeUnix,timezone)}</p>

                <img src="img/weather_icons/direction.png" width="48" 
                    height="48" loading="lazy" alt="direction" 
                    title="direction" class="weather-icon" 
                    style="transform: rotate(${windDirection - 180}deg)">

                <p class="body-3">${parseInt(module.mps_to_kmh(windSpeed))} km/h</p>

            </div>
            `;

            hourlySection.querySelector("[data-wind]").appendChild(windLi);

         };

        //  forecastSection.innerHTML = `
        //     <h2 class="title-2" id="forecast-label">5 Days Forecast</h2>

        //     <div class="card card-lg forecast-card">

        //         <ul data-forecast-list>

                    
                    
        //         </ul>
                
        //     </div>
        //  `;
         
         for( let i = 7, len = forecastList.lenght; i < len; i+=8)
         {
            const{
                main:{temp_max},
                weather,
                dt_txt
            } = forecastList[i];
            const [{icon, description}] = weather
            const date = new Date(dt_txt);

            const li = document.createElement("li");

            li.classList.add("card-item");

            li.innerHTML = `
                <div class="icon-wrapper">
                    <img src="img/weather_icons/{${icon}}.png" width="36" height="36" alt="${description}" class="weather-icon">
                    <span class="span" title="${description}">
                        <p class="title-2">${temp_max}</p>
                    </span>
                </div>

                <p class="label-1">${date.getDate()} ${module.monthNames[date.getUTCMonth()]}</p>
                <p class="label-1">${module.weekDayNames[module.getUTCDay()]}</p>
            `;

            forecastSection.querySelector("[data-forecast-list]").appendChild(li);
         }

         loading.style.display = "none";
         container.style.overflowY = "overlay";
         container.classList.add("fade-in");
    });

});

}

 export const error404 = function(){

 }

// document.addEventListener("DOMContentLoaded", function() {
//     var myBlock = document.getElementById("search-view");
//     var toggleButton = document.getElementById("toggleButton");
  
//     toggleButton.addEventListener("click", function() {
//       myBlock.classList.toggle("active");
//     });
//   });
