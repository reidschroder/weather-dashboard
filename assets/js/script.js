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
weatherIcon = document.querySelector("#icon");

searchHistory = [];

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
        var todaysDate = new Date(data.dt * 1000).toLocaleDateString();

        citySearch.textContent = data.name + " " + todaysDate;
        console.log(data);
        // Lat & Lon
        let lat = data.coord.lat;
        let lon = data.coord.lon;

        fetchWeather(lat, lon, data.name);
        saveInfo(lon, lat, data.name);
        previousCity(lat, lon, data.name);
      });
    } else {
      alert("City Could Not Be Found");
    }
  });
};

var fetchWeather = function (lat, lon) {
  let oneCallApi =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&APPID=" +
    apiKey +
    "&units=imperial";

  fetch(oneCallApi).then(function (response) {
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

//create function that goes to fetch previous weather
var prevoiusSubmitHandler = function (event) {
  event.preventDefault();

  let lat = event.target.getAttribute("data-lat");
  let lon = event.target.getAttribute("data-lon");
  let city = event.target.textContent;

  citySearch.textContent = "";
  forecastContainer.textContent = "";

  fetchWeather(lat, lon, city);
};
// pass lat & lon in fetch weather

//display Current Weather

var displayWeather = function (data) {
  //let weather = data.current;
  console.log(data);

  let temp = data.current.temp;
  let humidity = data.current.humidity;
  let wind = data.current.wind_speed;
  let uvi = data.current.uvi;
  let icon = data.current.weather[0].icon;
  console.log(data);

  console.log(temp, humidity, wind, uvi);

  weatherIcon = "src='https://openweathermap.org/img/wn/" + icon + "@2x.png'";

  temperature.innerHTML = "Current Temperature: " + temp + "\u00B0 F";

  currentHumidity.innerHTML = "Humidity: " + humidity;

  windGust.innerHTML = "Wind: " + wind + " MPH";

  uv.innerHTML = "UV Index: " + uvi;

  // display the uv index color chart
  if (uvi < 3) {
    uv.classList.add("text-success");
  } else if (uvi < 7) {
    uv.classList.add("text-warning");
  } else {
    uv.classList.add("text.danger");
  }
};
// Display 5 Day Forecast ==========
function displayForecast(data) {
  console.log(data);

  var daily = data.daily;

  console.log(daily);

  for (var i = 0; i < 5; i++) {
    var forecastEl = document.createElement("div");

    let forecastDate = new Date(daily[i].dt * 1000).toLocaleDateString();
    let forecastTemp = daily[i].temp.day;
    let forecastHumidity = daily[i].humidity;
    let forecastWind = daily[i].wind_speed;
    let forecastUvi = daily[i].uvi;
    let forecastIcon = daily[i].weather[0].icon;

    console.log(forecastTemp, forecastHumidity, forecastWind, forecastUvi);

    //============Delete bg-success and add different color ================================
    forecastEl.classList.add("border", "bg-info", "text-center");

    forecastEl.innerHTML =
      forecastDate +
      "<br>" +
      "<img src='https://openweathermap.org/img/wn/" +
      forecastIcon +
      "@2x.png' />" +
      "<br>" +
      forecastTemp +
      "\u00B0 F" +
      "<br>" +
      "Humidity: " +
      forecastHumidity +
      "<br>" +
      "Wind: " +
      forecastWind +
      " MPH";

    forecastContainer.appendChild(forecastEl);
  }
}

// ======= Local Storage ==========

var saveInfo = function (lat, lon, location) {
  var saveCity = {
    name: location,
    latitude: lat,
    longitude: lon,
  };
  searchHistory.push(saveCity);

  localStorage.setItem("Searched Cities", JSON.stringify(searchHistory));
};

var loadInfo = function () {
  searchHistory = JSON.parse(getItem("Searched Cities"));
  if (!searchHistory) {
    searchHistory = [];
  }
};

// Clear Local Storage
clearHistoryBtn.addEventListener("click", function () {
  localStorage.clear();
  searchHistory = [];
});

// event listener for Previous cities =====
previousCityContainer.addEventListener("click", prevoiusSubmitHandler);

//event listener for search
searchBtn.addEventListener("click", formSubmitHandler);
