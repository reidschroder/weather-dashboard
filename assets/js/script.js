apiKey ="0220bdc9ce3ee0ac9ca0de968fea102c"

//variables
searchBtn = document.querySelector("#search-btn")
clearHistoryBtn = document.querySelector("#clear-history-btn")
cityInput = document.querySelector("#city-input")
citySearch = document.querySelector("#city-search")
uvIndex = document.querySelector("#uv-index")
searchList = document.querySelector("#search-list")
forecastContainer = document.querySelector("#forecast-container")


//currentDate.textContent = moment().format("MMM Do YY")


var formSubmitHandler = function(event) {
    //prevent page refresh
    event.preventDefault()

    var city = cityInput.value.trim();

    if (city) {
        //get weather funtion
        fetchWeather(city);
        //forecast funtion
        displayWeather(city);
        displayForecast(city);
        
    }

    else {
        alert("Please Enter A Valid City")
    }

}

//display weather function 

var fetchWeather =function(city) {

var weatherApi = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiKey + "&units=imperial";

    fetch(weatherApi).then(function(response){
        if(response.ok){
        response.json().then(function(data){
            var todayDate = new Date(data.dt * 1000).toLocaleDateString();
            citySearch.textContent = city + " " + todayDate;

            // clear historical data
            fetchWeather.innerHTML = "";

           

            
            
            
            // Lat & Lon 
            let lat = data.coord.lat;
            let lon = data.coord.lon;
            let uvLink = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&APPID=" + apiKey + "&units=imperial";

            fetch(uvLink).then(function(response){
                response.json().then(function(data){

                    console.log(data);


                    displayWeather(data);
                    displayForecast(data);

            
                })
            })
        
        })}
    })
    
}



//display Current Weather

var displayWeather = function(data) {
    console.log(data);

    

    let weather = data.current;
   console.log(weather);

    let temp = weather.temp;
    let humidity = weather.humidity;
    let wind = weather.wind_gust;
    let uvi = weather.uvi

    console.log(temp, humidity, wind, uvi);


    temperature = document.querySelector("#temperature");
    temperature.innerHTML = "Current Temperature: " + temp + " \u00B0 F";

    currentHumidity = document.querySelector("#humidity");
    currentHumidity.innerHTML = "Humidity: " + humidity;

    windGust = document.querySelector("#wind-gust");
    windGust.innerHTML = "Wind: " + wind + " MPH";

    uv = document.querySelector("#uv-index");
    uv.innerHTML = "UV Index: " + uvi;

    // display the uv index color chart
    if (uv < 3) {
        uv.classList.add("bg-success");

    }

    
    
}
// Display 5 Day Forecast
function displayForecast(data) {
    console.log(data);

    var forecastEl = document.createElement("div");
    forecastEl.classList.add("weather-card");

    



   // var dailyWeather = weather.daily;

    
    
}

// ======= Local Storage ========== ???????????????

var locationClickHandler = function(event) {
    var city = event.target.textContent;
    displayWeather(city);
    displayForecast(city);
}

let storage = JSON.parse(localStorage.getItem("storage")) || {};

// Store in local storage

var saveStorage = function() {
    var city = cityInput.value.trim();

    if (storage.indexOf(city) == -1) {
        storage.push(city);
        localStorage.setItem("storage", JSON.stringify(storage));
    }
    searchList.innerHTML = "";

    for (var i = 0; i < storage.length; i++) {
        var location = storage[i];
        var button = document.createElement("button");
        button.textContent = location;
        button.classList.add("btn");
        searchList.appendChild(button);

        button.addEventListener("click", locationClickHandler);
    }
}


//event listener for search 
searchBtn.addEventListener("click", formSubmitHandler);