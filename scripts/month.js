
const apiKey = "55afa5c5e5154ee6a8e201013251110";

const cityNameEl = document.getElementById("cityName");
const summaryEl = document.getElementById("monthlySummary");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

let chartInstance;

// Default
getMonthlyWeather("Karachi");

async function getMonthlyWeather(city) {
  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=10&aqi=no&alerts=no`
    );
    const data = await res.json();

    if (data.error) {
      alert("City not found!");
      return;
    }

    // Extract forecast data
    const days = data.forecast.forecastday.map(day => day.date);
    const temps = data.forecast.forecastday.map(day => day.day.avgtemp_c);

    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);

    // Update city name
    cityNameEl.textContent = `${data.location.name}, ${data.location.country}`;

    // Summary
    summaryEl.textContent = `This period’s highest temperature was ${maxTemp}°C and the lowest was ${minTemp}°C in ${data.location.name}.`;

    // Draw chart
    renderChart(days, temps);
  } catch (error) {
    console.error("Error fetching monthly data:", error);
    summaryEl.textContent = "Error loading data. Please try again.";
  }
}

function renderChart(days, temps) {
  const ctx = document.getElementById("monthChart").getContext("2d");

  if (chartInstance) chartInstance.destroy(); // remove old chart before creating new one

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: days,
      datasets: [
        {
          label: "Avg Temperature (°C)",
          data: temps,
          borderColor: "#00bcd4",
          backgroundColor: "rgba(0,188,212,0.2)",
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: "#00bcd4",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
          ticks: { color: "#fff" },
          grid: { color: "rgba(255,255,255,0.2)" },
        },
        x: {
          ticks: { color: "#fff" },
          grid: { color: "rgba(255,255,255,0.1)" },
        },
      },
      plugins: {
        legend: {
          labels: { color: "#fff" },
        },
      },
    },
  });
}

// Search button
searchBtn.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) {
    getMonthlyWeather(city);
    searchInput.value = "";
  }
});
