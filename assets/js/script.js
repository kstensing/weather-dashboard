var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city");
var currentContainerEl = document.querySelector("#current-conditions-container");
var currentCity = document.querySelector("#current-city-weather");
var forecastContainerEl = document.querySelector("#forecast-container");
var forecast = document.querySelector("#forecast");
var currentDay = moment().format(' (MM/DD/YYYY)');

var formSubmitHandler = function (event) {
        event.preventDefault();
        var city = cityInputEl.value.trim();

        if (city) {
            getCity(city);
            var storedCityHistory = localStorage.getItem("history");
            var cityHistory = JSON.parse(storedCityHistory);
            if (cityHistory == null) {
                cityHistory = [];
            };
            cityHistory.push(city);
            localStorage.setItem("history", JSON.stringify(cityHistory));

            for (var i = 0; cityHistory.length; i++) {
                var cityHistoryLi = document.createElement("button");
                cityHistoryLi.classList = "btn btn-secondary btn-block";
                cityHistoryLi.textContent = cityHistory[i];
                document.getElementById("history-container").appendChild(cityHistoryLi);

                cityInputEl.value = "";
            };
            } else {
                alert("Please enter a valid city");
            };
        };
    

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

        // var displayHistory = function (cityHistory) {
        //     for (var i = 0; cityHistory.length; i++) {
        //         var cityHistoryLi = document.createElement("button");
        //         cityHistoryLi.classList = "btn btn-secondary btn-block";
        //         cityHistoryLi.textContent = cityHistory[i]; 
        //         document.getElementById("history-container").appendChild(cityHistoryLi);
        //     }
        // }

        var displayCity = function (cityInfo, searchTerm) {
            currentContainerEl.textContent = "";
            currentCity.textContent = cityInfo.name + currentDay;

            var source = "http://openweathermap.org/img/wn/" + cityInfo.weather[0].icon + ".png";
            var imgEl = document.createElement("img");
            imgEl.setAttribute("src", source);
            var conditionEl = document.createElement("span");
            conditionEl.appendChild(imgEl);


            var cityWeather = "Temp: " + cityInfo.main.temp + "°F";
            var tempEl = document.createElement("p");
            tempEl.textContent = cityWeather;
            conditionEl.appendChild(tempEl);

            var cityWeatherWind = "Wind: " + cityInfo.wind.speed + " MPH";
            var windEl = document.createElement("p");
            windEl.textContent = cityWeatherWind;
            conditionEl.appendChild(windEl);

            var cityWeatherHumidity = "Humidity: " + cityInfo.main.humidity + "%";
            var humidityEl = document.createElement("p");
            humidityEl.textContent = cityWeatherHumidity;
            conditionEl.appendChild(humidityEl);

            var uvUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityInfo.coord.lat + "&lon=" + cityInfo.coord.lon + "&appid=55b53b07c2e560aae2f3aeb2fb43fe2f";
            fetch(uvUrl)
                .then(function (response) {
                    response.json().then(function (data) {
                        var uvEl = document.createElement("div");
                        var titleUvEl = document.createElement("p");
                        titleUvEl.textContent = "UV Index: "
                        titleUvEl.appendChild(uvEl)

                        uvEl.textContent = data.current.uvi;

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
        };



        var displayForecast = function (cityInfo, city) {

            forecastContainerEl.textContent = "";

            var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cityInfo.coord.lat + "&lon=" + cityInfo.coord.lon + "&units=imperial&appid=55b53b07c2e560aae2f3aeb2fb43fe2f";

            fetch(forecastUrl)
                .then(function (response) {
                    response.json().then(function (data) {
                        for (var i = 0; i < data.list.length; i += 8) {

                            var forecastDay = document.querySelector("[data-day='" + i + "']");
                            var conditionEl = document.createElement("span");

                            var cityDate = data.list[i].dt;
                            var forecastDate = moment.unix(cityDate).format("MM/DD/YYYY");
                            var dateEl = document.createElement("h5");
                            dateEl.textContent = forecastDate;
                            conditionEl.appendChild(dateEl);

                            var source = "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png";
                            var imgEl = document.createElement("img");
                            imgEl.setAttribute("src", source);
                            conditionEl.appendChild(imgEl);

                            var cityWeather = "Temp: " + data.list[i].main.temp + "°F";
                            var tempEl = document.createElement("p");
                            tempEl.textContent = cityWeather;
                            conditionEl.appendChild(tempEl);

                            var cityWeatherWind = "Wind: " + data.list[i].wind.speed + " MPH";
                            var windEl = document.createElement("p");
                            windEl.textContent = cityWeatherWind;
                            conditionEl.appendChild(windEl);

                            var cityWeatherHumidity = "Humidity: " + data.list[i].main.humidity + "%";
                            var humidityEl = document.createElement("p");
                            humidityEl.textContent = cityWeatherHumidity;
                            conditionEl.appendChild(humidityEl);

                            forecastDay.appendChild(conditionEl);

                        }
                    });
                });
        };

        cityFormEl.addEventListener("submit", formSubmitHandler);