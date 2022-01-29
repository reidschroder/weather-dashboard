apiKey = "0220bdc9ce3ee0ac9ca0de968fea102c";

//variables
searchBtn = document.querySelector("#search-btn");
clearHistoryBtn = document.querySelector("#clear-history-btn");
cityInput = document.querySelector("#city-input");
citySearch = document.querySelector("#city-search");
uvIndex = document.querySelector("#uv-index");
searchList = document.querySelector("#search-list");
forecastContainer = document.querySelector("#forecast-container");
temperature = document.querySelector("#temperature");
currentHumidity = document.querySelector("#humidity");
windGust = document.querySelector("#wind-gust");
uv = document.querySelector("#uv-index");
previousCityContainer = document.querySelector("#previous-city");
//weatherIcon = document.createElement("#current-icon");


//currentDate.textContent = moment().format("MMM Do YY")

var formSubmitHandler = function (event) {
  //prevent page refresh
  event.preventDefault();

  forecastContainer.innerHTML = "";
  citySearch.innerHTML = "";
  temperature.innerHTML = "";
  currentHumidity.innerHTML = "";
  windGust.innerHTML = "";
  uv.innerHTML = "";

  var city = cityInput.value.trim();

  if (city) {
    fetchCoord(city);
  } else {
    alert("Please Enter A Valid City");
  }
};

//fetch lat & lon function

var fetchCoord = function (city) {
  var weatherApi =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&APPID=" +
    apiKey +
    "&units=imperial";

  fetch(weatherApi).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        var todayDate = new Date(data.dt * 1000).toLocaleDateString();
        citySearch.textContent = data.name + " " + todayDate;

        console.log(data);
        // Lat & Lon
        let lat = data.coord.lat;
        let lon = data.coord.lon;
        fetchWeather(lat, lon);

        previousCity(lat, lon, data.name);
      });
    } else {
      alert("City Could Not Be Found");
    }
  });
};

var fetchWeather = function (lat, lon) {
  let uvLink =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&APPID=" +
    apiKey +
    "&units=imperial";

  fetch(uvLink).then(function (response) {
    response.json().then(function (data) {
      console.log(data);

      displayWeather(data);
      displayForecast(data);
    });
  });
};

// Previous Cities ===========
var previousCity = function (lat, lon, name) {
  let cityDiv = document.createElement("button");
  cityDiv.innerText = name;
   cityDiv.setAttribute("data-lat", lat);
  cityDiv.setAttribute("data-lon", lon);
  cityDiv.setAttribute("class", "button");

  previousCityContainer.appendChild(cityDiv);
};

//create function that goes to fetch weather
var prevoiusSubmitHandler = function(event) {
    event.preventDefault();

    var lat = event.target.getAttribute("data-lat");
    var lon = event.target.getAttribute("data-lon");
    var cityDiv = event.target.textContent;

    forecastContainer.innerHTML = "";
    citySearch.innerHTML = "";
    temperature.innerHTML = "";
    currentHumidity.innerHTML = "";
    windGust.innerHTML = "";
    uv.innerHTML = "";

    previousCity(lat, lon, cityDiv);


}
//event.target
// pull lat & lon from data attributes
// pass lat & lon in fetch weather

//display Current Weather

var displayWeather = function (data) {
  let weather = data.current;
  console.log(data);

  let temp = data.current.temp;
  let humidity = weather.humidity;
  let wind = weather.wind_gust;
  let uvi = weather.uvi;

  console.log(temp, humidity, wind, uvi);

  temperature.innerHTML = "Current Temperature: " + temp + "\u00B0 F";

  currentHumidity.innerHTML = "Humidity: " + humidity;

  windGust.innerHTML = "Wind: " + wind + " MPH";

  uv.innerHTML = "UV Index: " + uvi;

  // display the uv index color chart
  if (uvi < 3) {
    uv.classList.add("bg-success");
  } else if (uvi < 7) {
    uv.classList.add("bg-warning");
  } else {
  }
};
// Display 5 Day Forecast ==========
function displayForecast(data) {
  console.log(data);

  var daily = data.daily;

  console.log(daily);

  for (var i = 0; i < 5; i++) {
    //var dailyTemp = (daily[i] temp.day);

    var forecastEl = document.createElement("div");

    let forecastDate = new Date(daily[i].dt * 1000).toLocaleDateString();
    let forecastTemp = daily[i].temp.day;
    let forecastHumidity = daily[i].humidity;
    let forecastWind = daily[i].wind_gust;
    let forecastUvi = daily[i].uvi;

    console.log(forecastTemp, forecastHumidity, forecastWind, forecastUvi);

    forecastEl.innerHTML =
        forecastDate +
        "<br>" +
        "<br>" +
      forecastTemp +
      "\u00B0 F" +
      "<br>" +
      "Humidity: " +
      forecastHumidity +
      "<br>" +
      "Wind: " +
      forecastWind +
      " MPH" +
      "<br>" +
      "UV Index: " +
      forecastUvi;

    forecastContainer.appendChild(forecastEl);

    //forecastTemperature = document.querySelector("#forecast-container");
    // forecastTemperature.innerHTML = "Temperature: " + forecastTemp + "\u00B0 F";

    // futureHumidity = document.querySelector("#forecast-container");
    // futureHumidity.innerHTML = "Humidity: " + forecastHumidity;

    // forecastWindGust = document.querySelector("#forecast-container");
    // forecastWindGust.innerHTML = "Wind: " + forecastWind + " MPH";

    // forecastUv = document.querySelector("#forecast-container");
    // forecastUv.innerHTML = "UV Index: " + forecastUvi;
  }

  //forecastTemperature = document.querySelector(forecastContainer);
  //forecastTemperature.innerHTML = "Temperature: " + forecastTemp + "\u00B0 F";

  // futureHumidity = document.querySelector(forecastContainer);
  //futureHumidity.innerHTML = "Humidity: " + forecastHumidity;

  //forecastWindGust = document.querySelector(forecastContainer);
  //forecastWindGust.innerHTML = "Wind: " + forecastWind + " MPH";

  //forecastUv = document.querySelector(forecastContainer);
  // forecastUv.innerHTML = "UV Index: " + forecastUvi;

  // var dailyWeather = weather.daily;
}

// ======= Local Storage ========== ???????????????

var locationClickHandler = function (event) {
  var city = event.target.textContent;
  displayWeather(city);
  displayForecast(city);
};

let storage = JSON.parse(localStorage.getItem("storage")) || {};

// Store in local storage

if (storage.length > 0) {
  previousCity(storage[storage.length - 1]);
}

for (var i = 0; i < storage.length; i++) {
  previousCity(storage[i]);
}

// event listener for Previous cities =====
//previousCityContainer.addEventListener("click", previousSubmitHandler);

//event listener for search
searchBtn.addEventListener("click", formSubmitHandler);
