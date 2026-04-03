const apiKey = "75635fe2f69ad821748e76b3d353b6a9";
//  Get location automatically
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      getWeatherByCoords(position.coords.latitude, position.coords.longitude);
    });
  }
};

// Fetch using city name
async function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("Enter city");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.cod != 200) return alert(data.message);

  updateUI(data);
  getForecast(data.coord.lat, data.coord.lon);
}

// Fetch using coordinates
async function getWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const res = await fetch(url);
  const data = await res.json();

  updateUI(data);
  getForecast(lat, lon);
}

// Update UI
function updateUI(data) {
  document.getElementById("cityName").innerText = data.name;

  // Date & Time
  const now = new Date();
  document.getElementById("dateTime").innerText =
    now.toDateString() + " | " + now.toLocaleTimeString();

  document.getElementById("temp").innerText = data.main.temp + "°C";
  document.getElementById("condition").innerText = data.weather[0].main;
  document.getElementById("feels").innerText =
    "Feels like: " + data.main.feels_like + "°C";

  document.getElementById("humidity").innerText =
    "Humidity: " + data.main.humidity + "%";
  document.getElementById("wind").innerText =
    "Wind: " + data.wind.speed + " m/s";

  //  Sunrise/Sunset
  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

  document.getElementById("sunrise").innerText = "Sunrise: " + sunrise;
  document.getElementById("sunset").innerText = "Sunset: " + sunset;

  // Icon
  document.getElementById("icon").src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  //  Day/Night
  const isDay = data.dt >= data.sys.sunrise && data.dt < data.sys.sunset;

  const weather = data.weather[0].main;

  if (isDay) {
    document.body.style.backgroundImage =
      "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb')";
  } else {
    document.body.style.backgroundImage =
      "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee')";
  }
}

// 5-Day Forecast
async function getForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const res = await fetch(url);
  const data = await res.json();

  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "";

  // Take one entry per day (every 8th = 24hrs)
  for (let i = 0; i < data.list.length; i += 8) {
    const item = data.list[i];

    const date = new Date(item.dt * 1000).toDateString();
    const temp = item.main.temp;
    const icon = item.weather[0].icon;

    const div = document.createElement("div");
    div.innerHTML = `
      <p>${date}</p>
      <img src="https://openweathermap.org/img/wn/${icon}.png">
      <p>${temp}°C</p>
    `;

    forecastDiv.appendChild(div);
  }
}