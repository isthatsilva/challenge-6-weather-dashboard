// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
// https://api.openweathermap.org/data/2.5/weather?q=&appid={API key}


const apiKey = '1b2fdc660301f80a208e6e6a63cb9e0b';

let recents = [];
let lastCity = '';

$(document).ready(function () {
    let getWeather = function(city) {
        let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=1b2fdc660301f80a208e6e6a63cb9e0b&units=imperial";
        fetch(apiUrl)
            .then(function(response) {
                if (response.ok) {
                    response.json().then(function(data) {
                        displayWeather(data);
                    });
                } else {
                    alert("ERROR: " + response.statusText);
                }
            console.log("Got weather!");
        })
    
        .catch(function(error) {
            alert("Unable to get weather");
        })
    };
    
    let submitHandler = function(event) {
        event.preventDefault();
        let cityName = $('#cityInput').val();
        if (cityName) {
            getWeather(cityName);
            $('#cityInput').val("");
        } else {
            alert("Not a city")
        }
    };
    
    let displayWeather = function(weatherData) {
    
        $("#cityName").text(weatherData.name + " (" + dayjs(weatherData.dt * 1000).format("MM/DD/YYYY") + ") ").append(`<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"></img>`);
    
        $("#cityTemp").text("Temp: " + weatherData.main.temp.toFixed(1) + " F");
        $("#cityHumid").text("Humidity: " + weatherData.main.humidity + "%");
        $("#cityWind").text("Wind: " + weatherData.wind.speed.toFixed(1) + " mph");
    
        fetch("https://api.openweathermap.org/data/2.5/uvi?lat=" + weatherData.coord.lat + "&lon="+ weatherData.coord.lon + "&appid=1b2fdc660301f80a208e6e6a63cb9e0b")
            .then(function(response) {
                response.json().then(function(data) {
                    $("#uv-box").text(data.value);
                })
            });
    
        fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + weatherData.name + "&appid=1b2fdc660301f80a208e6e6a63cb9e0b&units=imperial")
            .then(function(response) {
                response.json().then(function(data) {
                    $('#fiveDay').empty();
                    for (i = 7; i <= data.list.length; i += 8) {
                        let daysCard =`
                        <div class="col-md-2 m-2 py-3 card text-white bg-primary">
                            <div class="card-body p-1">
                                <h5 class="card-title">` + dayjs(data.list[i].dt * 1000).format("MM/DD/YYYY") + `</h5>
                                <img src="https://openweathermap.org/img/wn/` + data.list[i].weather[0].icon + `.png" alt="rain">
                                <p class="card-text">Temp: ` + data.list[i].main.temp.toFixed(1) + `</p>
                                <p class="card-text">Humidity: ` + data.list[i].main.humidity + `</p>
                            </div>
                        </div>
                        `;
    
                        $('#fiveDay').append(daysCard);
                    }
                })
        });
    
        lastCity = weatherData.name;
        recentCity(weatherData.name);
    };

    let recentCity = function (city) {
        if (!recent.includes(city)) {
            recent.push(city);
    
            $('#recentResults').append("<a href='#' class='list-group-item list-group-item-action' id='" + city + "'>" + city + "</a>");
        }
        localStorage.setItem('weatherSearchHistory', JSON.stringify(recent));
        localStorage.setItem('lastCity', JSON.stringify(lastCity));
        recentCityDisplay();
    };
    
    
    let recentCityDisplay = function() {
        recent = JSON.parse(localStorage.getItem('weatherSearchHistory'));
        lastCity = JSON.parse(localStorage.getItem('lastCity'));
        if (!recent) {
            recent = []
        } if (!lastCity) {
            lastCity = ""
        }
    
        $('#recentResults').empty();
    
        for (i=0; i < history.length; i++) {
            $("#recentResults").append("<a href='#' class='list-group-item list-group-item-action' id='" + recent[i] + "'>" + recent[i] + "</a>");
        }
    };
    
    recentCityDisplay();
    
    if (lastCity != "") {
        getWeather(lastCity);
    }
    
    $('#search-form').submit(submitHandler);
    
    // Allows user to click on a previously searched city to pull up its weather again
    $('#recentResults').on('click', function(event) {
        let previousCity = $(event.target).closest("a").attr("id");
        getWeather(previousCity);
    });
})
