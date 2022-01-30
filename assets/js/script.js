var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city");


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

// submitBtn.addEventListener('click', citySubmitHandler)

var getCity = function(city) {
    // format the api url
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=55b53b07c2e560aae2f3aeb2fb43fe2f";

    // make a request to the url
    fetch(requestUrl)
    .then(function(response) {
        response.json().then(function(data) {
            console.log(data);
        });
    });
};

cityFormEl.addEventListener("submit", formSubmitHandler);