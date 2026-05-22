const apiKey = "YOUR_API_KEY";
const input = document.querySelector("input");
const searchBtn = document.querySelector(".search-icon i");
const cityName = document.querySelector(".city-name");
const weatherIcon = document.querySelector(".weather-image img");
let tempNumber = document.querySelector(".weather-temp h2");
let humidityNumber = document.querySelector(".humidity");
let windSpeedNumber = document.querySelector(".windspeed");
let visibilityNumber = document.querySelector(".visibility");
const weatherMain = document.querySelector(".weather-main");
const otherInfoContainer = document.querySelector(".other-info");

const weatherImages = {
  Clouds: "assets/cloudy.png",

  Clear: "assets/sunny.png",

  Rain: "assets/rainy.png",

  Thunderstorm: "assets/thunderstorm.png",

  Snow: "assets/snowy.png",

  Mist: "assets/foggy.png",

  Fog: "assets/foggy.png",
};

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (input.value.trim().length > 0) {
      searchWeather();
    } else {
      showError("City name could not be empty !!");
    }
  }
});

searchBtn.addEventListener("click", () => {
  if (input.value.trim().length > 0) {
    searchWeather();
  } else {
    showError("City name could not be empty !!");
  }
});

function showError(message) {
  document.querySelector(".error-statement")?.remove();

  const span = document.createElement("span");
  span.innerText = message;
  span.classList.add("error-statement");

  const container = document.querySelector(".input-btns-container");
  container.insertAdjacentElement("afterend", span);

  cityName.style.display = "none";
  weatherMain.style.display = "none";
  otherInfoContainer.style.display = "none";
}

async function searchWeather() {
  document.querySelector(".error-statement")?.remove();
  const city = input.value.trim();
  if (!city) return;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      showError("Invalid city name !!");

      return;
    } else {
      document.querySelector(".error-statement")?.remove();

      cityName.innerText = data.name;
      tempNumber.innerText = data.main.temp;
      humidityNumber.innerText = data.main.humidity;
      windSpeedNumber.innerText = data.wind.speed + " km/h";
      visibilityNumber.innerText = data.visibility / 1000 + " km";
      const condition = data.weather[0].main;

      weatherIcon.src = weatherImages[condition] || "assets/cloudy.png";

      cityName.style.display = "block";
      weatherMain.style.display = "block";
      otherInfoContainer.style.display = "flex";
      console.log(condition);
    }
  } catch (error) {
    console.log("City Not Found!! ");
  }
}
