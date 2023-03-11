const key = "9e6b83894ab441424946812eee121904";
// https://api.openweathermap.org/data/2.5/weather?q={city}&appid={key}
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=9e6b83894ab441424946812eee121904

const userWeatherBtn = document.querySelector("[data-user-weather]");
const searchWeatherBtn = document.querySelector("[data-search-weather]");
const searchForm = document.querySelector(".search-form");
const weatherData = document.querySelector(".weather-info");
const locationSection = document.querySelector(".location-section");
const loadingSection = document.querySelector(".loading-section");
const grantAcess = document.querySelector("[grant-acess]");
const searchInput = document.querySelector("[data-input]");
const errorSection = document.querySelector(".error-box");

let currentTab;

// initial
currentTab = userWeatherBtn;
currentTab.classList.add("current-tab");
locationSection.classList.add("active");
getCoordSessionStorage();

// eventlistner

userWeatherBtn.addEventListener("click", () => {
  switchTabs(userWeatherBtn);
});

searchWeatherBtn.addEventListener("click", () => {
  switchTabs(searchWeatherBtn);
});

// function which switch bettween tabs

function switchTabs(clickedTab) {
  errorSection.classList.remove("active")
  if (clickedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    clickedTab.classList.add("current-tab");
    currentTab = clickedTab;

    // change hoga
    if (!searchForm.classList.contains("active")) {
      searchForm.classList.add("active");
      locationSection.classList.remove("active");
      weatherData.classList.remove("active");
    } else {
      /// means your weather tab
      searchForm.classList.remove("active");
      weatherData.classList.remove("active");

      getCoordSessionStorage();
    }
  }
}

function getCoordSessionStorage() {
  const locolCoords = sessionStorage.getItem("user-coordinate");
  if (!locolCoords) {
    // locol coords nii hai to acess window active
    locationSection.classList.add("active");
  } else {
    // agar coord hai to fetch api
    const coordinates = JSON.parse(locolCoords);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  errorSection.classList.remove("active")
  locationSection.classList.remove("active");
  loadingSection.classList.add("active");
  const { lat, lon } = coordinates;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=9e6b83894ab441424946812eee121904`
    );
    const data = await response.json();

    // data aa gaya
    loadingSection.classList.remove("active");
    weatherData.classList.add("active");

    renderWeatherInfo(data);
  } catch (error) {
    loadingSection.classList.remove("active");
    errorSection.classList.add("active");
    console.log(error);
  }
}

function renderWeatherInfo(weatherInfo) {
  const cityName = document.querySelector("[city]");
  const flagIcon = document.querySelector("[flag]");
  const descriptions = document.querySelector("[weather]");
  const weatherIcon = document.querySelector("[weather-icon]");
  const temps = document.querySelector("[temp]");
  const windSpeed = document.querySelector("[wind]");
  const humidity = document.querySelector("[humidity]");
  const cloudness = document.querySelector("[cloud]");

  cityName.innerText = weatherInfo?.name;
  flagIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country?.toLowerCase()}.png`;

  //weather is array
  descriptions.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  let tempK = (weatherInfo?.main?.temp);
  temps.innerText = (tempK - 273.15).toFixed(2) +" °C";
  windSpeed.innerText = weatherInfo?.wind?.speed + " m/sec";
  humidity.innerText = weatherInfo?.main?.humidity + " %";
  cloudness.innerText = weatherInfo?.clouds?.all + " %";
}

function getLocation() {
  // first find by geolocation and then save in localStorage
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {

    console.log("not supported");
  }
}

function showPosition(position) {
  const userCoords = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  console.log(userCoords, "showpos");
  sessionStorage.setItem("user-coordinate", JSON.stringify(userCoords));

  getCoordSessionStorage();
  // fetchUserWeatherInfo();
}

grantAcess.addEventListener("click", getLocation);

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityname = searchInput.value;

  if (cityname === "") {
    return;
  } else {
    fetchCityWeather(cityname);
  }
});

async function fetchCityWeather(city) {
  errorSection.classList.remove("active");
  loadingSection.classList.add("active");
  weatherData.classList.remove("active");
  locationSection.classList.remove("active");

  try {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
    );

    let data = await response.json();

    if(!data.sys){
      throw data;
    }
    loadingSection.classList.remove("active");
    weatherData.classList.add("active");

    renderWeatherInfo(data);
  } catch (e) {
    console.log(e,"err bhai");
    loadingSection.classList.remove("active");
    weatherData.classList.remove("active");
    errorSection.classList.add("active");
    console.log(e,"err bhai2");
  }
  console.log("err bhai2");
}
