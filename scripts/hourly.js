const apiKey = "55afa5c5e5154ee6a8e201013251110"; // WeatherAPI key

const hourlyTitle = document.getElementById("hourlyTitle");
const hourlyData = document.getElementById("hourlyData");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

getHourly("Karachi");

// ===== Fetch Hourly Data =====
async function getHourly(city) {
  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&hours=24`
    );
    const data = await res.json();

    if (data.error) {
      alert("City not found!");
      return;
    }

    hourlyTitle.textContent = `Hourly Forecast (${data.location.name})`;

    hourlyData.innerHTML = "";
    data.forecast.forecastday[0].hour.forEach((hour) => {
      const time = hour.time.split(" ")[1];
      const temp = Math.round(hour.temp_c);
      const cond = hour.condition.text;
      const wind = Math.round(hour.wind_kph);
      const hum = hour.humidity;
      const icon = "https:" + hour.condition.icon;

      const row = `
        <tr>
          <td>${time}</td>
          <td>${temp}°C</td>
          <td><img src="${icon}" width="32" alt=""> ${cond}</td>
          <td>${wind}</td>
          <td>${hum}</td>
        </tr>
      `;
      hourlyData.insertAdjacentHTML("beforeend", row);
    });
  } catch (err) {
    console.error("Hourly fetch error:", err);
  }
}

searchBtn.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) {
    getHourly(city);
    searchInput.value = "";
  }
});
