'use strict'



const api_key = "4cedc134ea38c21edb52a130f13f2c0a";

// @param {string} URL
// @param {function} API


export const fetchData = function (url, callback)
{
    fetch(`${url}&appid=${api_key}`)
        .then(res => res.json())
        .then(data => callback(data));
}
export const url ={
    currentWeather(lat,lon)
    {
        return `http://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=metric`
    },
    forecast(lat,lon)
    {
        return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric`
    },

    airPollution(lat,lon)
    {
        return `http://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}`
    },
    reverseGeo(lat,lon)
    {
        return `http://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=5`
    },
    // @param{string} query Search : "London", "New York"
    // @returns
    geo(query)
    {
        return `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`
    }
}