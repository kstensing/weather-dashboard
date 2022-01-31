var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city");
var currentContainerEl = document.querySelector("#current-conditions-container");
var currentCity = document.querySelector("#current-city-weather")
var currentDay = moment().format('MMMM Do YYYY');


var formSubmitHandler = function(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();

    if (city) {
        getCity(city);
        cityInputEl.value = "";
    } else {
        alert("Please enter a valid city");
    }
   
};

var getIcon = function(city) {

}

var getCity = function(city) {
    // format the api url
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=55b53b07c2e560aae2f3aeb2fb43fe2f";

    // make a request to the url
    fetch(requestUrl)
    .then(function(response) {
        response.json().then(function(data) {
            displayCity(data, city);
            displayIcon(data);
        });
    });
};



var displayCity = function(cityInfo, searchTerm) {
    console.log(cityInfo);
    console.log(searchTerm);

    currentContainerEl.textContent = "";
    currentCity.textContent = cityInfo.name;


        
        var conditionEl = document.createElement("span");
        conditionEl.classList = "list-group";
        conditionEl.textContent = cityInfo.weather[0].icon;
        
        var cityWeather = "Temp: " + cityInfo.main.temp;
        var tempEl = document.createElement("p");
        tempEl.textContent = cityWeather;
        conditionEl.appendChild(tempEl);

        currentContainerEl.appendChild(conditionEl);
    
};

cityFormEl.addEventListener("submit", formSubmitHandler);

// current.temp
// current.dt
// current.humidity
// current.uvi
// current.wind_speed
// current.weather.icon