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
        cityInputEl.value = "";
    } else {
        alert("Please enter a valid city");
    }
};

var getCity = function (city) {
    // format the api url
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=55b53b07c2e560aae2f3aeb2fb43fe2f";

    // make a request to the url
    fetch(requestUrl)
        .then(function (response) {
            response.json().then(function (data) {
                console.log("first data: ", data);                
                displayCity(data, city);
                displayForecast(data, city);
            });
        });
};

var displayCity = function (cityInfo, searchTerm) {
    currentContainerEl.textContent = "";
    currentCity.textContent = cityInfo.name + currentDay;

    var conditionEl = document.createElement("span");
    conditionEl.classList = "list-group";
    conditionEl.textContent = "http://openweathermap.org/img/wn/" + cityInfo.weather[0].icon + ".png";

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

    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cityInfo.coord.lat + "&lon=" + cityInfo.coord.lon + "&appid=55b53b07c2e560aae2f3aeb2fb43fe2f";
    console.log("forecast Url: ",forecastUrl)
    fetch(forecastUrl)
        .then(function (response) {
                response.json().then(function (data) {
                        console.log("data from Url: ",data.list.length);
                        
                        var dateTest = data.list[0].dt;
                        var date = moment.unix(dateTest).format("MM DD YYYY");
                        console.log("Time: ", date);
                        var cityIcon = data.list[0].weather.icon;
                        var cityTemp = data.list[0].main.temp;
                        var cityWind = data.list[0].wind.speed;
                        //var cityHumidity = data.list[0].

                        console.log("Temp: ", cityTemp);
                        for (var i = 0; i < data.list.length; i+=5) {
                           console.log("I: ", i)
                        }
                        // for (var i = 1; i < 6; i++) {
                            // var forecastDay = document.querySelector("[data-day='" + i + "']");
                            // var conditionEl = document.createElement("p");
                            // conditionEl.classList = "list-group";
                            // conditionEl.textContent = data.list[i].weather[0].icon;

                            // var cityWeather = "Temp: " + data.list[i].temp + "°F";
                            // var tempEl = document.createElement("p");
                            // tempEl.textContent = cityWeather;
                            // conditionEl.appendChild(tempEl);

                            // var cityWeatherWind = "Wind: " + data.list[i].speed + " MPH";
                            // var windEl = document.createElement("p");
                            // windEl.textContent = cityWeatherWind;
                            // conditionEl.appendChild(windEl);

                            // var cityWeatherHumidity = "Humidity: " + data.list[i].humidity + "%";
                            // var humidityEl = document.createElement("p");
                            // humidityEl.textContent = cityWeatherHumidity;
                            // conditionEl.appendChild(humidityEl);

                            // forecastDay.appendChild(conditionEl);
                        // });
                });

                
        });
};
cityFormEl.addEventListener("submit", formSubmitHandler);