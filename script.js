const apiKey = "6f035692382f13a1602ebdd889cd43a6";
let weekPattern = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//let monthPatternLarge = ["January","February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let monthPatternSmall = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

let cities = ["Warszawa", "Paris", "New York", "London"];

//
function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function getDataFromApi(city) {
  let cityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(cityUrl).then(fillData).catch((e)=>{
    if(e.response.data.cod === "404"){
      alert(capitalize(e.response.data.message));
    }
  });
}

function bildCityLink(cities) {
  let blockCities = document.querySelector(".block_weather .caption_city");

  cities.forEach((element, i) => {
    let div = document.createElement("div");
    let classCity = "";
    div.className = "col-sm-3";
    classCity = i === 0 ? "active_city" : "";
    div.innerHTML = `<span id="${element.toLowerCase()}" class="${classCity}">${element}</span>`;
    blockCities.append(div);
  });

  let cityItems = document.querySelectorAll(".caption_city span");
  for (let cityItem of cityItems) {
    cityItem.addEventListener("click", changeCityWeather);
  }
}

bildCityLink(cities);

//
let now = new Date();
console.log(now);
//let options = { weekday: 'short', day: 'numeric', year: 'numeric', month: 'short' };
//curDate.innerHTML = date.toLocaleDateString("en-US", options);

let curTempDayColor = document.querySelector(".block_weather__color .current_temp_day");
let speedWind = document.querySelector(".speed_wind");
let img = document.querySelector(".pict_day");
let typeWeather = document.querySelector(".type_weather");
let curDate = document.querySelector(".cur_date");
const blockDaysWeek = document.querySelector(".block_weather .days_weather");


//Постороение блока недели по дням
function bildDaysWeek(dataFromApi) {
  console.log("bildDaysWeek", dataFromApi.data);
  let dataWeeks = dataFromApi.data.daily;

  dataWeeks.forEach((elem, index) => {
    if(index >3){
      return;
    }

    let dayWeek = new Date(elem.dt * 1000).getDay();
    let dayMonth = new Date(elem.dt * 1000).getMonth();
    let dateWeek = new Date(elem.dt * 1000).getDate();
    let img = elem.weather[0].description;

    let div = document.createElement("div");
    div.className = "col-sm-3 day_weather";
    div.innerHTML =
      `<p class="week_day">${weekPattern[dayWeek]}</p>
       <p class="date_day">${dateWeek} ${monthPatternSmall[dayMonth]}</p>
       <img class="pict_day" src="img/${img}.png" height="50" alt="pict"/>
       <span class="temp_day">${Math.round(elem.temp.day)}°</span>
`;
    blockDaysWeek.append(div);
  });
}

//
function changeCityWeatherSearch(event) {
  event.preventDefault();
  let input = document.querySelector("input.city_search");
  let citySearch = input.value;
  console.log(citySearch);
  let inputValue = input.value.toLowerCase();
  let city = document.getElementById(citySearch);
  getDataFromApi(citySearch);
  document.querySelector(".city_search").value = '';
}

//
function changeCityWeather(event) {
  event.preventDefault();
  let city = capitalize(event.target.getAttribute("id"));
  getDataFromApi(city);
  //document.querySelector(".active_city").classList.remove("active_city");
  //fillData();
}

//
function fillData(response) {
  console.log("fillData", response.data);
  let coord = response.data.coord;
  let city = response.data.name;
  let cityLower = city.toLowerCase();

  document.querySelector(".caption_current_city").innerHTML = city;
  curTempDayColor.innerHTML = Math.round(response.data.main.temp) < 100 ? Math.round(response.data.main.temp) : Math.round(response.data.main.temp/10);
  localStorage.setItem("temp", curTempDayColor.innerHTML);
  speedWind.innerHTML = Math.round(response.data.wind.speed);
  img.src = `img/${response.data.weather[0].description}.png`;
  typeWeather.innerHTML = capitalize(response.data.weather[0].description);
  //curDate.innerHTML = capitalize(curDayWeekStr) + ", " + curDay + " " + monthPatternSmall[curMonth];
  let date = new Date(response.data.dt * 1000);
  let options = { weekday: 'short', day: 'numeric', month: 'short' };
  curDate.innerHTML = date.toLocaleDateString("en-US", options);

  //Погода по дням
  blockDaysWeek.innerHTML = "";
  getDataforDailyWeather(coord);
}

function getDataforDailyWeather(coord) {
  let curLat = coord['lat'];
  let curLon = coord['lon'];

  let axi = axios.get(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${curLat}&lon=${curLon}&appid=${apiKey}&units=metric`
  );
  axi.then(bildDaysWeek);
}

function handlePosition(position) {
  let curLatitude = position.coords.latitude;
  let curLongitude = position.coords.longitude;

  let axi = axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${curLatitude}&lon=${curLongitude}&appid=${apiKey}&units=metric`
  );
  axi.then(fillData);
}

navigator.geolocation.getCurrentPosition(handlePosition);

let measureF = document.querySelector(".measureF");
measureF.addEventListener("click", showMeasure);
let measureC = document.querySelector(".measureC");
measureC.addEventListener("click", showMeasure);

function showMeasure(event) {
  event.preventDefault();
  let classMeasure = event.target.getAttribute("class");
  if(classMeasure ==="measureC"){
    curTempDayColor.innerHTML = localStorage.getItem("temp");
  } else{
    curTempDayColor.innerHTML = Math.ceil((localStorage.getItem("temp") * 9) / 5 + 32);
  }
 }

  let form = document.querySelector("form");
  form.addEventListener("submit", changeCityWeatherSearch);