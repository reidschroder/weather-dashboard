apiKey ="0220bdc9ce3ee0ac9ca0de968fea102c"

//variables
searchBtn = document.querySelector("#search-btn")
clearHistoryBtn = document.querySelector("#clear-history-btn")
cityInput = document.querySelector("#city-input")
citySearch = document.querySelector("#city-search")


//currentDate.textContent = moment().format("MMM Do YY")


var formSubmitHandler = function(event) {
    //prevent page refresh
    event.preventDefault()

    var city = cityInput.value.trim();

    if (city) {
        //get weather funtion
        displayWeather(city);
        //forecast funtion
    }

    else {
        alert("Enter a valid city")
    }

}

//display weather function 

var displayWeather =function(city) {

var weatherApi = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiKey;

    fetch(weatherApi).then(function(response){
        if(response.ok){
        response.json().then(function(data){
            var todayDate = new Date(data.dt * 1000).toLocaleDateString();
            citySearch.textContent = city + " " + todayDate;
        
        })}
    })
    
}

//display forecast function





//event listener for search 
searchBtn.addEventListener("onClick", formSubmitHandler);