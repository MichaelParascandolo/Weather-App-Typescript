//https://api.openweathermap.org/data/2.5/weather?q=Tuckerton&units=imperial&appid=6e21e21d00dac27b8e466eb450211833
var appKey = "6e21e21d00dac27b8e466eb450211833";
var city = "";
var searchHow = "";
var tempUnit;
var speedUnit;
var unit;
var latitude;
var longitude;
// const majorCities: String[] = [
//   "New York",
//   "London",
//   "Tokyo",
//   "Los Angeles",
//   "Chicago",
//   "Houston",
//   "Phoenix",
//   "Philadelphia",
//   "San Antonio",
// ];
// const random = Math.floor(Math.random() * majorCities.length);
// let randomCity = majorCities[random];
var weather = {
    fetchWeather: function (city) {
        var _this = this;
        changeUnit();
        if (latitude == null && longitude == null) {
            if (isNaN(city)) {
                searchHow = "q=" + city; //will search using city name
            }
            else {
                searchHow = "zip=" + city; //will search using zip code (us)
            }
        }
        else {
            searchHow = "&lat=" + latitude + "&lon=" + longitude; //will search using lat and long
        }
        fetch("https://api.openweathermap.org/data/2.5/weather?" +
            searchHow +
            "&units=" +
            unit +
            "&appid=" +
            appKey)
            .then(function (response) { return response.json(); })
            .then(function (data) { return _this.displayWeather(data); });
    },
    displayWeather: function (data) {
        try {
            var name_1 = data.name;
            var _a = data.sys, country = _a.country, sunrise = _a.sunrise, sunset = _a.sunset;
            var _b = data.weather[0], icon = _b.icon, description = _b.description;
            var _c = data.main, temp = _c.temp, humidity = _c.humidity, temp_max = _c.temp_max, temp_min = _c.temp_min, feels_like = _c.feels_like;
            var _d = data.wind, speed = _d.speed, gust = _d.gust, deg = _d.deg;
            document.querySelector(".city").innerText =
                "Weather in " + name_1 + ", " + country;
            document.querySelector(".icon").src =
                "https://openweathermap.org/img/wn/" + icon + ".png";
            document.querySelector(".description").innerText =
                description;
            if (unit == "metric") {
                //displays all units in metric
                tempUnit = "°C";
                speedUnit = " km/h";
            }
            else if (unit == "imperial") {
                //displays all units in imperial
                tempUnit = "°F";
                speedUnit = " mp/h";
            }
            document.querySelector(".temp").innerText =
                String(Math.round(temp)) + tempUnit;
            document.querySelector(".feelsLike").innerHTML =
                "Feels Like: " + Math.round(feels_like) + tempUnit;
            document.querySelector(".wind").innerHTML =
                "Wind Speed: " +
                    Math.round(speed) +
                    speedUnit +
                    " <i class='fa-solid fa-arrow-up fa-lg'></i>";
            document.querySelector(".fa-arrow-up").style.transform =
                "rotate(" + deg + "deg)";
            if (isNaN(gust)) {
                document.querySelector(".gust").innerText = "";
            }
            else {
                document.querySelector(".gust").innerHTML =
                    "Wind Gust: " +
                        Math.round(gust) +
                        speedUnit +
                        " <i class='fa-solid fa-wind fa-lg'></i>";
            }
            document.querySelector(".maxTemp").innerHTML =
                "Max Temp: " +
                    Math.round(temp_max) +
                    tempUnit +
                    " <i class='fa-solid fa-temperature-arrow-up fa-lg'></i>";
            document.querySelector(".minTemp").innerHTML =
                "Min Temp: " +
                    Math.round(temp_min) +
                    tempUnit +
                    " <i class='fa-solid fa-temperature-arrow-down fa-lg'></i>";
            document.querySelector(".humidity").innerHTML =
                "Humidity: " + humidity + " % ";
            document.querySelector(".weather").classList.remove("loading");
            document.querySelector("footer").style.display = "block";
            console.log(sunrise, sunset); // sunrise and sunset in UTC need to convert....
            document.querySelector(".container").style.marginTop =
                "0";
            // if (majorCities.includes(name)) {
            //   console.log("included!");
            //   (document.querySelector("body") as HTMLElement).style.backgroundImage =
            //     "url(https://source.unsplash.com/1600x900/?" + name + ")";
            // }
            document.querySelector(".sbl-circ").style.display =
                "none";
            document.querySelector(".fa-magnifying-glass").style.display = "block";
            // if a city is not found
        }
        catch (error) {
            // (document.getElementById("check") as HTMLInputElement).style.display =
            //   "none";
            // document.querySelector(".weather").classList.add("loading");
            // (document.querySelector("footer") as HTMLElement).style.display = "none";
            // (document.querySelector(".container") as HTMLElement).style.marginTop =
            //   "230px";
            document.querySelector(".search-bar").value = "";
            document.querySelector(".search-bar").placeholder =
                "Invalid City or ZIP Code!";
            document.querySelector(".sbl-circ").style.display =
                "none";
            document.querySelector(".fa-magnifying-glass").style.display = "block";
        }
    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
    }
};
document.querySelector(".search button").addEventListener("click", function () {
    beforeSearch();
});
document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        beforeSearch();
    }
});
function beforeSearch() {
    if (document.querySelector(".search-bar").value != "") {
        document.querySelector(".fa-magnifying-glass").style.display = "none";
        document.querySelector(".sbl-circ").style.display =
            "inline-block";
        latitude = null;
        longitude = null;
        weather.search();
    }
}
function changeUnit() {
    var chkBox = document.getElementById("check");
    if (chkBox.checked == false) {
        unit = "imperial";
    }
    else {
        unit = "metric";
    }
}
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            document.querySelector(".fa-magnifying-glass").style.display = "none";
            document.querySelector(".sbl-circ").style.display =
                "inline-block";
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            document.querySelector(".search-bar").value = "";
            weather.search();
        });
    }
    else {
        alert("Geolocation is not supported by this browser.");
    }
}
/* Test lat and long
39.57058540789232 - latitude
-74.36876990998482 - longitude
*/
