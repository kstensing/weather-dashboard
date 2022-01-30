// var submitBtn = document.getElementById("submitBtn");

// //or
// var cityFormEl = document.querySelector("#city-form");
// var cityInputEl = document.querySelector("#city");

// var getCity = function() {
//     var 
// }

// function currentApi(city) {
//     var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=7639c4b1dc8d0eed150771de25344bd2";

//     fetch(requestUrl)
//     .then(function(response) {
//         response.json();
//     })
//     .then(function(data) {
//         console.log(data);
//     })
// }

// var citySubmitHandler = function(event) {
//     event.preventDefault();
//     console.log(event);
// };

// submitBtn.addEventListener('click', citySubmitHandler)

var getCity = function(city) {
    // format the api url
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=7639c4b1dc8d0eed150771de25344bd2";

    // make a request to the url
    fetch(requestUrl)
    .then(function(response) {
        response.json().then(function(data) {
            console.log(data);
        });
    });
};

getCity("minneapolis");