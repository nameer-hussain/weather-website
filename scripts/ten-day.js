const apiKey = "55afa5c5e5154ee6a8e201013251110"; 
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const forecastContainer = document.getElementById("forecastContainer");
const locationName = document.getElementById("locationName"); 

async function fetchTenDayForecast(city) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=10&aqi=no&alerts=no`
    );
    const data = await response.json();
    
    
    locationName.textContent = `Location: ${data.location.name}, ${data.location.country}`;
    
    displayForecast(data.forecast.forecastday);
  } catch (error) {
    console.error("Error fetching 10-day forecast:", error);
    locationName.textContent = "Location not found ❌";
  }
}

function displayForecast(days) {
  forecastContainer.innerHTML = "";

  days.forEach(day => {
    const card = document.createElement("div");
    card.classList.add("day-card");
    card.innerHTML = `
      <h3>${new Date(day.date).toDateString()}</h3>
      <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
      <p>${day.day.condition.text}</p>
      <p>🌡️ Max: ${day.day.maxtemp_c}°C / Min: ${day.day.mintemp_c}°C</p>
    `;
    forecastContainer.appendChild(card);
  });
}

searchBtn.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) fetchTenDayForecast(city);
});