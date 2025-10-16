const apiKey = "55afa5c5e5154ee6a8e201013251110"; 
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

// ===== Initialize Map =====
const map = L.map("map").setView([24.8607, 67.0011], 7); // Karachi default

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

const layerGroup = L.layerGroup().addTo(map);

// ===== Fetch Weather & Update Info =====
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

    const { lat, lon } = data.location;
    const temp = data.current.temp_c;
    const desc = data.current.condition.text;
    const wind = data.current.wind_kph;
    const hum = data.current.humidity;

    // Update info box
    document.getElementById("cityName").textContent =
      `${data.location.name}, ${data.location.country}`;
    document.getElementById("condition").textContent = `🌥️ ${desc}`;
    document.getElementById("temp").textContent = `🌡️ ${temp}°C`;
    document.getElementById("wind").textContent = `💨 Wind: ${wind} km/h`;
    document.getElementById("humidity").textContent = `💧 Humidity: ${hum}%`;

    // Update map location
    map.setView([lat, lon], 8);
    layerGroup.clearLayers();

    const marker = L.marker([lat, lon]).addTo(layerGroup);
    marker.bindPopup(
      `<b>${data.location.name}</b><br>${desc}<br>${temp}°C`
    );

    // Add weather overlay (clouds & rain)
    L.tileLayer(
      "https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=439d4b804bc8187953eb36d2a8c26a02",
      { opacity: 0.6 }
    ).addTo(layerGroup);

  } catch (error) {
    console.error("Radar fetch error:", error);
  }
}

// ===== Search Event =====
searchBtn.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) {
    getWeather(city);
    searchInput.value = "";
  }
});

// ===== Resize Fix =====
window.addEventListener("resize", () => {
  setTimeout(() => {
    map.invalidateSize();
  }, 200);
});

// Default load
getWeather("Karachi");
