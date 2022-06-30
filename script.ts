//https://api.openweathermap.org/data/2.5/weather?q=Tuckerton&units=imperial&appid=6e21e21d00dac27b8e466eb450211833
const appKey = "6e21e21d00dac27b8e466eb450211833";
let city: String = "";
let searchHow: String = "";
let tempUnit: String;
let speedUnit: String;
let unit: String;
let latitude: Number;
let longitude: Number;

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

let weather = {
  fetchWeather: function (city: any) {
    changeUnit();
    if (latitude == null && longitude == null) {
      if (isNaN(city)) {
        searchHow = "q=" + city; //will search using city name
      } else {
        searchHow = "zip=" + city; //will search using zip code (us)
      }
    } else {
      searchHow = "&lat=" + latitude + "&lon=" + longitude; //will search using lat and long
    }
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?" +
        searchHow +
        "&units=" +
        unit +
        "&appid=" +
        appKey
    )
      .then((response) => response.json())
      .then((data) => this.displayWeather(data));
  },
  displayWeather: function (data: {
    weather?: any;
    main?: any;
    wind?: any;
    name?: any;
    country?: any;
    sys?: any;
  }) {
    try {
      const { name } = data;
      const { country, sunrise, sunset } = data.sys;
      const { icon, description } = data.weather[0];
      const { temp, humidity, temp_max, temp_min, feels_like } = data.main;
      const { speed, gust, deg } = data.wind;
      (document.querySelector(".city") as HTMLElement).innerText =
        "Weather in " + name + ", " + country;
      (document.querySelector(".icon") as HTMLImageElement).src =
        "https://openweathermap.org/img/wn/" + icon + ".png";
      (document.querySelector(".description") as HTMLElement).innerText =
        description;

      if (unit == "metric") {
        //displays all units in metric
        tempUnit = "°C";
        speedUnit = " km/h";
      } else if (unit == "imperial") {
        //displays all units in imperial
        tempUnit = "°F";
        speedUnit = " mp/h";
      }
      (document.querySelector(".temp") as HTMLElement).innerText =
        String(Math.round(temp)) + tempUnit;
      document.querySelector(".feelsLike").innerHTML =
        "Feels Like: " + Math.round(feels_like) + tempUnit;
      (document.querySelector(".wind") as HTMLElement).innerHTML =
        "Wind Speed: " +
        Math.round(speed) +
        speedUnit +
        " <i class='fa-solid fa-arrow-up fa-lg'></i>";
      (document.querySelector(".fa-arrow-up") as HTMLElement).style.transform =
        "rotate(" + deg + "deg)";
      if (isNaN(gust)) {
        (document.querySelector(".gust") as HTMLElement).innerText = "";
      } else {
        (document.querySelector(".gust") as HTMLElement).innerHTML =
          "Wind Gust: " +
          Math.round(gust) +
          speedUnit +
          " <i class='fa-solid fa-wind fa-lg'></i>";
      }
      (document.querySelector(".maxTemp") as HTMLElement).innerHTML =
        "Max Temp: " +
        Math.round(temp_max) +
        tempUnit +
        " <i class='fa-solid fa-temperature-arrow-up fa-lg'></i>";
      (document.querySelector(".minTemp") as HTMLElement).innerHTML =
        "Min Temp: " +
        Math.round(temp_min) +
        tempUnit +
        " <i class='fa-solid fa-temperature-arrow-down fa-lg'></i>";
      (document.querySelector(".humidity") as HTMLElement).innerHTML =
        "Humidity: " + humidity + " % ";
      document.querySelector(".weather").classList.remove("loading");
      (document.querySelector("footer") as HTMLElement).style.display = "block";
      console.log(sunrise, sunset); // sunrise and sunset in UTC need to convert....
      (document.querySelector(".container") as HTMLElement).style.marginTop =
        "0";
      // if (majorCities.includes(name)) {
      //   console.log("included!");
      //   (document.querySelector("body") as HTMLElement).style.backgroundImage =
      //     "url(https://source.unsplash.com/1600x900/?" + name + ")";
      // }
      (document.querySelector(".sbl-circ") as HTMLElement).style.display =
        "none";
      (
        document.querySelector(".fa-magnifying-glass") as HTMLElement
      ).style.display = "block";
      // if a city is not found
    } catch (error) {
      // (document.getElementById("check") as HTMLInputElement).style.display =
      //   "none";
      // document.querySelector(".weather").classList.add("loading");
      // (document.querySelector("footer") as HTMLElement).style.display = "none";
      // (document.querySelector(".container") as HTMLElement).style.marginTop =
      //   "230px";
      (document.querySelector(".search-bar") as HTMLInputElement).value = "";
      (document.querySelector(".search-bar") as HTMLInputElement).placeholder =
        "Invalid City or ZIP Code!";
      (document.querySelector(".sbl-circ") as HTMLElement).style.display =
        "none";
      (
        document.querySelector(".fa-magnifying-glass") as HTMLElement
      ).style.display = "block";
    }
  },

  search: function () {
    this.fetchWeather(
      (document.querySelector(".search-bar") as HTMLInputElement).value
    );
  },
};

document.querySelector(".search button").addEventListener("click", function () {
  beforeSearch();
});

(document.querySelector(".search-bar") as HTMLInputElement).addEventListener(
  "keyup",
  (event) => {
    if (event.key === "Enter") {
      beforeSearch();
    }
  }
);
function beforeSearch() {
  if ((document.querySelector(".search-bar") as HTMLInputElement).value != "") {
    (
      document.querySelector(".fa-magnifying-glass") as HTMLElement
    ).style.display = "none";

    (document.querySelector(".sbl-circ") as HTMLElement).style.display =
      "inline-block";
    latitude = null;
    longitude = null;
    weather.search();
  }
}
function changeUnit() {
  var chkBox = document.getElementById("check");
  if ((chkBox as HTMLInputElement).checked == false) {
    unit = "imperial";
  } else {
    unit = "metric";
  }
}
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      (
        document.querySelector(".fa-magnifying-glass") as HTMLElement
      ).style.display = "none";

      (document.querySelector(".sbl-circ") as HTMLElement).style.display =
        "inline-block";
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      (document.querySelector(".search-bar") as HTMLInputElement).value = "";
      weather.search();
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

/* Test lat and long
39.57058540789232 - latitude
-74.36876990998482 - longitude
*/
