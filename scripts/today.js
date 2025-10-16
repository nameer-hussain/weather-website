
const apiKey = "55afa5c5e5154ee6a8e201013251110"; 

const cityNameEl = document.getElementById("cityName");
const weatherDescEl = document.getElementById("weatherDesc");
const temperatureEl = document.getElementById("temperature");
const humidityEl = document.querySelector(".extra span:nth-child(1)");
const windEl = document.querySelector(".extra span:nth-child(2)");
const weatherIconEl = document.getElementById("weatherIcon");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

// Default city
getWeather("Karachi");

async function getWeather(city) {
  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
    );
    const data = await res.json();

    if (data.error) {
      alert("City not found!");
      return;
    }

    // Extract values
    const temp = Math.round(data.current.temp_c);
    const desc = data.current.condition.text;
    const hum = data.current.humidity;
    const wind = Math.round(data.current.wind_kph);
    const iconUrl = "https:" + data.current.condition.icon;
    const isDay = data.current.is_day; // ✅ 1 = Day, 0 = Night
    
    if (!data.current || !data.location) {
  alert("Weather data not available for this location!");
  return;
}

    // Update UI
    cityNameEl.textContent = `${data.location.name}, ${data.location.country}`;
    temperatureEl.textContent = `${temp}°C`;
    weatherDescEl.textContent = desc;
    humidityEl.textContent = `💧 Humidity: ${hum}%`;
    windEl.textContent = `🌬️ Wind: ${wind} km/h`;
    weatherIconEl.src = iconUrl;

    // Dynamic background update
    changeBackground(desc, isDay);
  } catch (error) {
    console.error("Weather fetch error:", error);
  }
}

// Search button click
searchBtn.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) {
    getWeather(city);
    searchInput.value = "";
  }
});

// Dynamic background changer (with day/night)
function changeBackground(condition, isDay) {
  const body = document.body;
  let bg = "";

  condition = condition.toLowerCase();

  if (isDay) {
    // 🌞 DAY BACKGROUNDS
    if (condition.includes("cloud")) bg = "url('background/cloudy.jpg')";
    else if (condition.includes("rain")) bg = "url('background/rainy.jpg')";
    else if (condition.includes("sun") || condition.includes("clear"))
      bg = "url('background/sunny.jpg')";
    else if (condition.includes("snow")) bg = "url('background/snow.jpg')";
    else bg = "url('background/sunny.jpg')";
  } else {
    // 🌙 NIGHT BACKGROUNDS
    if (condition.includes("cloud")) bg = "url('background/nightcloudy.webp')";
    else if (condition.includes("rain")) bg = "url('background/nightrainy.jpg')";
    else if (condition.includes("clear"))
      bg = "url('background/nightclear.jpg')";
    else if (condition.includes("snow")) bg = "url('background/nightsnow.jpg')";
    else bg = "url('background/nightclear.jpg')";
  }

  body.style.backgroundImage = bg;
  body.style.backgroundSize = "cover";
  body.style.backgroundPosition = "center";
  body.style.transition = "background 1s ease-in-out";
}

