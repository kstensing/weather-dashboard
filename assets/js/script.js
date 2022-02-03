var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city");
var currentContainerEl = document.querySelector("#current-conditions-container");
var currentCity = document.querySelector("#current-city-weather");
var forecastContainerEl = document.querySelector("#forecast-container");
var forecast = document.querySelector("#forecast");
var currentDay = moment().format(' (MM/DD/YYYY)');


// handler to accept 'submit'event
var formSubmitHandler = function (event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();

    // if the city is entered, run the getCIty function
    if (city) {
        getCity(city);
        // get 'history' form local storage -seeing if it exists
        var storedCityHistory = localStorage.getItem("history");
        var cityHistory = JSON.parse(storedCityHistory);
        //if there's nothing in local storage, create a list
        if (cityHistory == null) {
            cityHistory = [];
        };
        // add the new city to the list & add to local storage
        cityHistory.push(city);
        localStorage.setItem("history", JSON.stringify(cityHistory));

        // for each item in the list...
        for (var i = 0; i < cityHistory.length; i++) {
            // see if there are any prior added city buttons on the page, if so delete them
            var onPageButton = document.getElementById("new-button" + i);
            if (onPageButton) {
                onPageButton.remove();
            }
            //create a button on the page for each item in the city history list
            var cityHistoryLi = document.createElement("button");
            cityHistoryLi.classList = "btn btn-secondary btn-block";
            cityHistoryLi.textContent = cityHistory[i];
            cityHistoryLi.id = "new-button" + i;
            document.getElementById("history-container").appendChild(cityHistoryLi);
            // when the city button is clicked, run getCity function
            cityHistoryLi.addEventListener("click", function (event) {
                getCity(event.currentTarget.textContent);
            });

        };
    } else {
        // error handling if no city is entered
        alert("Please enter a valid city");
    };
};

// gather current city weather data and pass that info on
var getCity = function (city) {
    // format the api url
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=55b53b07c2e560aae2f3aeb2fb43fe2f";

    // make a request to the url
    fetch(requestUrl)
        .then(function (response) {
            response.json().then(function (data) {
                displayCity(data, city);
                displayForecast(data, city);
            });
        });
};

// function to display sections of the current weather api we want to show
var displayCity = function (cityInfo) {
    currentContainerEl.textContent = "";
    // display current day and cityname
    currentCity.textContent = cityInfo.name + currentDay;

    // obtain icon, create & display image element to the page
    var source = "http://openweathermap.org/img/wn/" + cityInfo.weather[0].icon + ".png";
    var imgEl = document.createElement("img");
    imgEl.setAttribute("src", source);
    var conditionEl = document.createElement("span");
    conditionEl.appendChild(imgEl);

    // obtain temp info from api and add to page
    var cityWeather = "Temp: " + cityInfo.main.temp + "°F";
    var tempEl = document.createElement("p");
    tempEl.textContent = cityWeather;
    conditionEl.appendChild(tempEl);

    // obtain wind info from api and add to page
    var cityWeatherWind = "Wind: " + cityInfo.wind.speed + " MPH";
    var windEl = document.createElement("p");
    windEl.textContent = cityWeatherWind;
    conditionEl.appendChild(windEl);

    // obtain humidity info from api and add to page
    var cityWeatherHumidity = "Humidity: " + cityInfo.main.humidity + "%";
    var humidityEl = document.createElement("p");
    humidityEl.textContent = cityWeatherHumidity;
    conditionEl.appendChild(humidityEl);

    // obtain uv index from api using lat & lon from current weather api & adding to page
    var uvUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityInfo.coord.lat + "&lon=" + cityInfo.coord.lon + "&appid=55b53b07c2e560aae2f3aeb2fb43fe2f";
    fetch(uvUrl)
        .then(function (response) {
            response.json().then(function (data) {
                var uvEl = document.createElement("div");
                var titleUvEl = document.createElement("p");
                titleUvEl.textContent = "UV Index: "
                titleUvEl.appendChild(uvEl)

                uvEl.textContent = data.current.uvi;

                // change background of UV index depending on severity
                if (data.current.uvi <= 2) {
                    uvEl.classList = "badge low";
                } else if (data.current.uvi > 2 && data.current.uvi < 6) {
                    uvEl.classList = "badge moderate";
                } else if (data.current.uvi > 5 && data.current.uvi < 8) {
                    uvEl.classList = "badge high";
                } else if (data.current.uvi >= 8) {
                    uvEl.classList = "badge veryHigh";
                };

                conditionEl.appendChild(titleUvEl);
            });
        });
    currentContainerEl.appendChild(conditionEl);
    // hide html code until this part of code is hit
    var pageContent = document.getElementById("page-content");
    pageContent.style.display = "block";
};

// 5 day forecast API call
var displayForecast = function (cityInfo) {

    forecastContainerEl.textContent = "";

    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cityInfo.coord.lat + "&lon=" + cityInfo.coord.lon + "&units=imperial&appid=55b53b07c2e560aae2f3aeb2fb43fe2f";

    fetch(forecastUrl)
        .then(function (response) {
            response.json().then(function (data) {
                //for each day, create an element containing below info
                for (var i = 0; i < data.list.length; i += 8) {
                    // check to see if days are present on page, if so, delete them
                    var dayId = document.getElementById("day" + i)
                    if (dayId) {
                        dayId.remove();
                    }
                    var forecastDay = document.querySelector("[data-day='" + i + "']");
                    var conditionEl = document.createElement("span");
                    conditionEl.id = "day" + i;
                    // obtain date using moment and append to day
                    var cityDate = data.list[i].dt;
                    var forecastDate = moment.unix(cityDate).format("MM/DD/YYYY");
                    var dateEl = document.createElement("h5");
                    dateEl.textContent = forecastDate;
                    conditionEl.appendChild(dateEl);
                    // obtain icon and append to day
                    var source = "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png";
                    var imgEl = document.createElement("img");
                    imgEl.setAttribute("src", source);
                    conditionEl.appendChild(imgEl);
                    // obtain temp and append to day
                    var cityWeather = "Temp: " + data.list[i].main.temp + "°F";
                    var tempEl = document.createElement("p");
                    tempEl.textContent = cityWeather;
                    conditionEl.appendChild(tempEl);
                    // obtain wind and append to day
                    var cityWeatherWind = "Wind: " + data.list[i].wind.speed + " MPH";
                    var windEl = document.createElement("p");
                    windEl.textContent = cityWeatherWind;
                    conditionEl.appendChild(windEl);
                    //obtain humidity and append to day
                    var cityWeatherHumidity = "Humidity: " + data.list[i].main.humidity + "%";
                    var humidityEl = document.createElement("p");
                    humidityEl.textContent = cityWeatherHumidity;
                    conditionEl.appendChild(humidityEl);

                    forecastDay.appendChild(conditionEl);

                }
            });
        });
};

// submit city button event listener to trigger form submit handler
cityFormEl.addEventListener("submit", formSubmitHandler);