<template>
  <div class="forecast-container" data-aos="fade-up" data-aos-delay="100">
    <div class="forecast-header">
      <h2><i class="fas fa-calendar-days me-2"></i>5-Day Forecast</h2>
      <div class="forecast-updated" v-if="lastUpdated">
        <i class="fas fa-sync-alt me-1"></i> Updated {{ lastUpdated }}
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="forecast-loading">
      <div class="forecast-loading-animation">
        <div class="forecast-loading-days">
          <div class="skeleton-day" v-for="i in 5" :key="i">
            <div class="skeleton-header"></div>
            <div class="skeleton-icon"></div>
            <div class="skeleton-temp"></div>
            <div class="skeleton-desc"></div>
          </div>
        </div>
      </div>
      <div class="forecast-loading-text">Loading forecast data...</div>
    </div>
    
    <!-- Forecast Content -->
    <div v-else class="forecast-body">
      <div class="day-forecast">
        <div
          v-for="forecast in fiveDayForecast"
          :key="forecast.dt"
          class="forecast-item"
        >
          <div class="forecast-day">{{ formatDay(forecast.dt_txt) }}</div>
          <div class="forecast-date">{{ formatDate(forecast.dt_txt) }}</div>
          <div class="forecast-icon">
            <i
              :class="[getWeatherIcon(forecast.weather[0].icon), getIconColor(forecast.weather[0].icon)]"
              :title="forecast.weather[0].description"
            ></i>
          </div>
          <div class="forecast-temp">{{ formatTemp(forecast.main.temp) }}&deg;C</div>
          <div class="forecast-temp-range">
            <span class="temp-high"><i class="fas fa-arrow-up"></i> {{ formatTemp(forecast.main.temp_max) }}&deg;</span>
            <span class="temp-low"><i class="fas fa-arrow-down"></i> {{ formatTemp(forecast.main.temp_min) }}&deg;</span>
          </div>
          <div class="forecast-desc">{{ forecast.weather[0].description }}</div>
          <div class="forecast-details">
            <span><i class="fas fa-droplet"></i> {{ forecast.main.humidity }}%</span>
            <span><i class="fas fa-wind"></i> {{ forecast.wind.speed }} m/s</span>
          </div>
          <div class="forecast-precipitation" v-if="forecast.pop">
            <i class="fas fa-cloud-rain"></i> {{ Math.round(forecast.pop * 100) }}% chance
          </div>
        </div>
      </div>
    </div>
    
    <button @click="refreshForecast" class="refresh-button" :disabled="isLoading">
      <i class="fas fa-sync-alt" :class="{'fa-spin': isRefreshing}"></i>
    </button>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "FiveDayForecast",  data() {
    return {
      isRefreshing: false,
      refreshTimer: null
    };
  },
  computed: {
    isLoading() {
      return this.$store.state.forecastLoading;
    },
    lastUpdated() {
      if (!this.$store.state.lastUpdated) return null;
      return moment(this.$store.state.lastUpdated).format('h:mm A');
    },
    fiveDayForecast() {
      const forecast = this.$store.state.forecast;
      if (!forecast) return [];
      
      return this.getUniqueDayForecasts(forecast.list);
    },
  },
  mounted() {
    this.fetchData();
    
    // Set up auto-refresh every 30 minutes
    this.refreshTimer = setInterval(() => {
      this.fetchData(true);
    }, 30 * 60 * 1000);
  },
  beforeUnmount() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  },
  methods: {
    getWeatherIcon(iconCode) {
      const iconMap = {
        '01d': 'fas fa-sun',
        '01n': 'fas fa-moon',
        '02d': 'fas fa-cloud-sun',
        '02n': 'fas fa-cloud-moon',
        '03d': 'fas fa-cloud',
        '03n': 'fas fa-cloud',
        '04d': 'fas fa-cloud',
        '04n': 'fas fa-cloud',
        '09d': 'fas fa-cloud-rain',
        '09n': 'fas fa-cloud-rain',
        '10d': 'fas fa-cloud-sun-rain',
        '10n': 'fas fa-cloud-moon-rain',
        '11d': 'fas fa-bolt',
        '11n': 'fas fa-bolt',
        '13d': 'fas fa-snowflake',
        '13n': 'fas fa-snowflake',
        '50d': 'fas fa-smog',
        '50n': 'fas fa-smog'
      };
      return iconMap[iconCode] || 'fas fa-cloud';
    },
    getIconColor(iconCode) {
      const colorMap = {
        '01d': 'icon-sun',
        '01n': 'icon-moon',
        '02d': 'icon-cloud-sun',
        '02n': 'icon-cloud-moon',
        '03d': 'icon-cloud',
        '03n': 'icon-cloud',
        '04d': 'icon-cloud',
        '04n': 'icon-cloud',
        '09d': 'icon-rain',
        '09n': 'icon-rain',
        '10d': 'icon-rain',
        '10n': 'icon-rain',
        '11d': 'icon-thunder',
        '11n': 'icon-thunder',
        '13d': 'icon-snow',
        '13n': 'icon-snow',
        '50d': 'icon-fog',
        '50n': 'icon-fog'
      };
      return colorMap[iconCode] || 'icon-cloud';
    },
    formatTemp(temp) {
      return Math.round(temp);
    },
    formatDate(date) {
      return moment(date).format("D MMM");
    },
    formatDay(date) {
      return moment(date).format("dddd");
    },
    getUniqueDayForecasts(forecasts) {
      const uniqueDays = {};
      return forecasts
        .filter((forecast) => {
          const day = moment(forecast.dt_txt).format("YYYY-MM-DD");
          if (!uniqueDays[day]) {
            uniqueDays[day] = true;
            return true;
          }
          return false;
        })
        .slice(0, 5); // Get only the first 5 unique days
    },    async fetchData(isRefresh = false) {
      // Data is fetched by HomeView on load via fetchWeatherByCoords/fetchWeatherByCity.
      // No separate dispatch is needed here; the store watcher handles updates.
      this.isRefreshing = false;
    },
    async refreshForecast() {
      if (!this.isRefreshing) {
        await this.fetchData(true);
      }
    }
  },
};
</script>

<style scoped>
/* Container Styling */
.forecast-container {
  max-width: 900px;
  margin: 25px auto;
  border-radius: 20px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  position: relative;
}

/* Header Styling */
.forecast-header {
  background: linear-gradient(135deg, #06b6d4, #0ea5e9);
  color: white;
  padding: 20px;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.forecast-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.forecast-updated {
  font-size: 0.8rem;
  opacity: 0.8;
  margin-top: 5px;
  display: flex;
  align-items: center;
}

/* Loading State Styling */
.forecast-loading {
  padding: 30px 20px;
  background: linear-gradient(to bottom, #f0f9ff, #e0f2fe);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 250px;
}

.forecast-loading-animation {
  width: 100%;
}

.forecast-loading-days {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 15px;
}

.skeleton-day {
  flex: 1 1 calc(20% - 15px);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 250px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.skeleton-day::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.skeleton-header {
  height: 22px;
  width: 80%;
  background: #e2e8f0;
  border-radius: 6px;
  margin-bottom: 8px;
}

.skeleton-icon {
  width: 65px;
  height: 65px;
  background: #e2e8f0;
  border-radius: 12px;
  margin: 15px 0;
}

.skeleton-temp {
  height: 30px;
  width: 50%;
  background: #e2e8f0;
  border-radius: 6px;
  margin-bottom: 10px;
}

.skeleton-desc {
  height: 16px;
  width: 70%;
  background: #e2e8f0;
  border-radius: 6px;
}

.forecast-loading-text {
  color: #64748b;
  margin-top: 20px;
  font-size: 1.1rem;
  font-weight: 500;
}

/* Body Styling */
.forecast-body {
  padding: 20px;
  background: linear-gradient(to bottom, #f0f9ff, #e0f2fe);
}

/* Forecast Items */
.day-forecast {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 15px;
}

.forecast-item {
  flex: 1 1 calc(20% - 15px);
  background: linear-gradient(to bottom, #ffffff, #f8fafc);
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  padding: 20px 15px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(6, 182, 212, 0.1);
}

.forecast-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #06b6d4, #0ea5e9, #06b6d4);
  transform: translateX(-100%);
  transition: transform 0.4s ease;
}

.forecast-item:hover::before {
  transform: translateX(0);
}

.forecast-item:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(6, 182, 212, 0.2);
  border-color: rgba(6, 182, 212, 0.3);
}

.forecast-day {
  font-size: 1.15rem;
  font-weight: 700;
  background: linear-gradient(135deg, #0284c7, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
}

.forecast-date {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 12px;
  font-weight: 500;
}

.forecast-icon {
  margin: 5px auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.forecast-icon i {
  font-size: 3rem;
  transition: all 0.3s ease;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

.forecast-item:hover .forecast-icon i {
  transform: scale(1.1) rotate(5deg);
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.2));
}

/* Dynamic icon colors */
.icon-sun {
  color: #fbbf24;
  animation: pulse-glow 2s ease-in-out infinite;
}

.icon-moon {
  color: #ddd6fe;
  filter: drop-shadow(0 0 10px rgba(221, 214, 254, 0.5));
}

.icon-cloud-sun {
  background: linear-gradient(135deg, #fbbf24 0%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.icon-cloud-moon {
  background: linear-gradient(135deg, #ddd6fe 0%, #93c5fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.icon-cloud {
  color: #94a3b8;
}

.icon-rain {
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.icon-thunder {
  color: #eab308;
  animation: flash 2s ease-in-out infinite;
}

.icon-snow {
  color: #e0f2fe;
  filter: drop-shadow(0 0 8px rgba(224, 242, 254, 0.8));
  animation: float-snow 3s ease-in-out infinite;
}

.icon-fog {
  color: #cbd5e1;
  opacity: 0.8;
}

@keyframes pulse-glow {
  0%, 100% {
    filter: drop-shadow(0 0 5px rgba(251, 191, 36, 0.5));
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.8));
  }
}

@keyframes flash {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0.6; }
}

@keyframes float-snow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.forecast-temp {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 5px 0;
}

.forecast-temp-range {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 5px 0 10px;
  font-size: 0.9rem;
}

.temp-high {
  color: #ef4444;
  font-weight: 500;
}

.temp-low {
  color: #3b82f6;
  font-weight: 500;
}

.forecast-desc {
  font-size: 0.9rem;
  color: #64748b;
  text-transform: capitalize;
  margin-bottom: 12px;
}

.forecast-precipitation {
  font-size: 0.85rem;
  color: #3b82f6;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.forecast-details {
  display: flex;
  justify-content: space-around;
  font-size: 0.85rem;
  color: #64748b;
  margin-top: 10px;
  border-top: 1px solid #e2e8f0;
  padding-top: 10px;
}

.forecast-details i {
  color: #0284c7;
  margin-right: 5px;
}

/* Responsive design */
@media (max-width: 992px) {
  .forecast-item {
    flex: 1 1 calc(33.333% - 15px); /* 3 items per row */
  }
}

@media (max-width: 768px) {
  .forecast-item {
    flex: 1 1 calc(50% - 10px); /* 2 items per row */
  }
}

@media (max-width: 480px) {
  .forecast-item {
    flex: 1 1 100%; /* 1 item per row */
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .forecast-item {
    flex: 1 1 calc(45% - 10px); /* 2 items per row for smaller screens */
  }
}

@media (max-width: 480px) {
  .forecast-item {
    flex: 1 1 100%; /* 1 item per row for very small screens */
  }
  
  .skeleton-day {
    flex: 1 1 100%; /* 1 item per row for very small screens */
    height: 220px;
  }
}

/* Refresh button */
.refresh-button {
  position: absolute;
  bottom: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: #0ea5e9;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.refresh-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
</style>
