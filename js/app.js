
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

searchField.addEventListener("input",function(){
    searchTimeout ?? clearTimeout(searchTimeout);

    if(searchField.value){
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

                const /**NodeList | [] */ items = [];

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
            });
        }, searchTimeoutDuration);
    }
});

// document.addEventListener("DOMContentLoaded", function() {
//     var myBlock = document.getElementById("search-view");
//     var toggleButton = document.getElementById("toggleButton");
  
//     toggleButton.addEventListener("click", function() {
//       myBlock.classList.toggle("active");
//     });
//   });
