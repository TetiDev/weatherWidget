let weather = {
  warszawa: {
    mon: {
      temp: 18,
      type: "Rain",
      pict: "rain_low",
      wind: 10,
    },
    tue: {
      temp: 23,
      type: "Sunny",
      pict: "sunny",
      wind: 4,
    },
    wed: {
      temp: 21,
      type: "Sunny & Cloud",
      pict: "sunny_cloud",
      wind: 3,
    },
    thu: {
      temp: 16,
      type: "Rain & Storm",
      pict: "rain_with_storm",
      wind: 8,
    },
    fri: {
      temp: 20,
      type: "Sunny & Cloud",
      pict: "sunny_cloud",
      wind: 2,
    },
    sat: {
      temp: 26,
      type: "Sunny",
      pict: "sunny",
      wind: 3,
    },
    sun: {
      temp: 28,
      type: "Rain high",
      pict: "rain_high",
      wind: 2,
    },
  },
  paris: {
    mon: {
      temp: 20,
      type: "Rain & Storm",
      pict: "rain_with_storm",
      wind: 8,
    },
    tue: {
      temp: 22,
      type: "Sunny & Cloud",
      pict: "sunny_cloud",
      wind: 3,
    },
    wed: {
      temp: 21,
      type: "Rain high",
      pict: "rain_high",
      wind: 3,
    },
    thu: {
      temp: 19,
      type: "Rain",
      pict: "rain_low",
      wind: 2,
    },
    fri: {
      temp: 25,
      type: "Sunny & Cloud",
      pict: "sunny_cloud",
      wind: 2,
    },
    sat: {
      temp: 24,
      type: "Rain high",
      pict: "rain_high",
      wind: 3,
    },
    sun: {
      temp: 25,
      type: "Sunny",
      pict: "sunny",
      wind: 2,
    },
  },
  london: {
    mon: {
      temp: 18,
      type: "Rain & Storm",
      pict: "rain_with_storm",
      wind: 10,
    },
    tue: {
      temp: 21,
      type: "Sunny & Cloud",
      pict: "sunny_cloud",
      wind: 3,
    },
    wed: {
      temp: 24,
      type: "Sunny",
      pict: "sunny",
      wind: 2,
    },
    thu: {
      temp: 20,
      type: "Rain",
      pict: "rain_low",
      wind: 3,
    },
    fri: {
      temp: 22,
      type: "Sunny & Cloud",
      pict: "sunny_cloud",
      wind: 2,
    },
    sat: {
      temp: 26,
      type: "Rain",
      pict: "rain_low",
      wind: 3,
    },
    sun: {
      temp: 29,
      type: "Sunny",
      pict: "sunny",
      wind: 3,
    },
  },
  "new york": {
    mon: {
      temp: 25,
      type: "Rain",
      pict: "rain_low",
      wind: 6,
    },
    tue: {
      temp: 23,
      type: "Sunny",
      pict: "sunny",
      wind: 3,
    },
    wed: {
      temp: 20,
      type: "Sunny & Cloud",
      pict: "sunny_cloud",
      wind: 2,
    },
    thu: {
      temp: 20,
      type: "Sunny",
      pict: "sunny",
      wind: 5,
    },
    fri: {
      temp: 30,
      type: "Rain High",
      pict: "rain_high",
      wind: 3,
    },
    sat: {
      temp: 24,
      type: "Rain & Storm",
      pict: "rain_with_storm",

      wind: 3,
    },
    sun: {
      temp: 25,
      type: "Sunny",
      pict: "sunny",
      wind: 2,
    },
  },
};

const apiKey = "6f035692382f13a1602ebdd889cd43a6";
let weekPattern = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let monthPatternLarge = ["January","February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let monthPatternSmall = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

let cities = ["Warszawa", "Paris", "New York", "London"];

//
function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function getDataFromApi(city) {
  let cityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  //let cityUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=4&appid=${apiKey}`;

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
let curDayWeekStr = weekPattern[now.getDay()].toLowerCase();
let curDay = now.getDate();
let curMonth = now.getMonth();

let curTempDayColor = document.querySelector(".block_weather__color .current_temp_day");
let speedWind = document.querySelector(".speed_wind");
let img = document.querySelector(".pict_day");
let typeWeather = document.querySelector(".type_weather");
let curDate = document.querySelector(".cur_date");
const blockDaysWeek = document.querySelector(".block_weather .days_weather");

function getNextDay(curDate) {
  curDate.setDate(curDate.getDate() + 1);
  return curDate;
}

//Постороение блока недели по дням
function bildDaysWeek(curDate, dataFromApi) {
  let curDaysWeek = now.getDay();
  let newWeek = [];
  while (newWeek.length < 4){
      newWeek.push(curDaysWeek);
      curDaysWeek = curDaysWeek > 5 ? 0 : ++curDaysWeek;
  }
  let newNow =  new Date(curDate);

  newWeek.forEach((elem) => {
    let div = document.createElement("div");
    div.className = "col-sm-3 day_weather";
    let weekDayNow = weekPattern[elem].toLowerCase();
    div.innerHTML =
      `<p class="week_day">${weekPattern[elem]}</p>
       <p class="date_day">${newNow.getDate()} ${monthPatternSmall[newNow.getMonth()]}</p>
       <img class="pict_day" src="http://openweathermap.org/img/wn/${dataFromApi.data.weather[0].icon}@2x.png" height="50" alt="pict"/>
       <span class="temp_day">${Math.round(dataFromApi.data.main.temp) < 100 ? Math.round(dataFromApi.data.main.temp) : Math.round(dataFromApi.data.main.temp/10)}°</span>
`;
    blockDaysWeek.append(div);
    newNow = getNextDay(newNow);
  })
}

//
function changeCityWeatherSearch(event) {
  event.preventDefault();
  let input = document.querySelector("input.city_search");
  //let inputValue = input.value.toLowerCase();
  let citySearch = input.value;
  console.log(citySearch);
  let inputValue = input.value.toLowerCase();
  let city = document.getElementById(citySearch);
  //document.querySelector(".active_city").classList.remove("active_city");
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
  console.log(response.data);
  let city = response.data.name;
  let cityLower = city.toLowerCase();
  //console.log(document.getElementById(cityLower));//.classList.add("active_city");

  document.querySelector(".caption_current_city").innerHTML = city;
  curTempDayColor.innerHTML = Math.round(response.data.main.temp) < 100 ? Math.round(response.data.main.temp) : Math.round(response.data.main.temp/10);
  localStorage.setItem("temp", curTempDayColor.innerHTML);
  speedWind.innerHTML = Math.round(response.data.wind.speed);
  img.src = `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;
  typeWeather.innerHTML = capitalize(response.data.weather[0].description);
  //curDate.innerHTML = capitalize(curDayWeekStr) + ", " + curDay + " " + monthPatternSmall[curMonth];
  let date = new Date(response.data.dt * 1000);
  //let options = { weekday: 'short', day: 'numeric', year: 'numeric', month: 'short' };
  let options = { weekday: 'short', day: 'numeric', month: 'short' };
  curDate.innerHTML = date.toLocaleDateString("en-US", options);

  //Погода по дням
  blockDaysWeek.innerHTML = "";
  bildDaysWeek(now, response);
}

function handlePosition(position) {
  let curLatitude = position.coords.latitude;
  let curLongitude = position.coords.longitude;
  console.log(curLatitude, curLongitude);
  let axi = axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${curLatitude}&lon=${curLongitude}&appid=${apiKey}`
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