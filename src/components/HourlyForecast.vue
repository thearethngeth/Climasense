<template>
  <div class="hourly-forecast-container" data-aos="fade-up" data-aos-delay="200">
    <div class="hourly-header">
      <h2><i class="fas fa-clock me-2"></i>Hourly Forecast</h2>
      <div class="hourly-controls">
        <div v-if="lastUpdated" class="hourly-updated">
          <i class="fas fa-sync-alt me-1"></i> Updated {{ lastUpdated }}
        </div>
        <button @click="scrollLeft" class="scroll-btn scroll-left">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button @click="scrollRight" class="scroll-btn scroll-right">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="hourly-loading">
      <div class="hourly-loading-container">
        <div class="hourly-skeleton-container">
          <div class="hourly-skeleton" v-for="i in 8" :key="i">
            <div class="skeleton-time"></div>
            <div class="skeleton-icon"></div>
            <div class="skeleton-temp"></div>
            <div class="skeleton-detail"></div>
            <div class="skeleton-detail"></div>
          </div>
        </div>
      </div>
      <div class="hourly-loading-text">Loading hourly forecast...</div>
    </div>
    
    <!-- Hourly Forecast Content -->
    <div v-else class="hourly-forecast-scroll" ref="scrollContainer">
      <div class="hourly-forecast">
        <div
          v-for="(forecast, index) in hourlyForecasts"
          :key="index"
          class="hourly-card"
          :class="{'current-hour': isCurrentHour(forecast.dt_txt)}"
        >
          <div class="hour-time">{{ formatHour(forecast.dt_txt) }}</div>
          <div class="hour-day" v-if="showDay(index, forecast.dt_txt)">
            {{ formatDay(forecast.dt_txt) }}
          </div>
          <div class="hour-icon">
            <i
              :class="[getWeatherIcon(forecast.weather[0].icon), getIconColor(forecast.weather[0].icon)]"
              :title="forecast.weather[0].description"
            ></i>
          </div>
          <div class="hour-temp">{{ formatTemp(forecast.main.temp) }}&deg;C</div>
          <div class="hour-feels-like" v-if="showFeelsLike(forecast)">
            Feels like {{ formatTemp(forecast.main.feels_like) }}&deg;
          </div>
          <div class="hour-description">
            {{ forecast.weather[0].description }}
          </div>
          <div class="hour-details">
            <div class="hour-detail">
              <i class="fas fa-droplet"></i> {{ forecast.main.humidity }}%
            </div>
            <div class="hour-detail">
              <i class="fas fa-wind"></i> {{ forecast.wind.speed }} m/s
            </div>
          </div>
          <div v-if="forecast.pop" class="hour-precipitation">
            <i class="fas fa-cloud-rain"></i> {{ Math.round(forecast.pop * 100) }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "HourlyForecast",  data() {
    return {
      refreshTimer: null,
      showCount: 8, // Number of hourly forecasts to show initially
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
    forecast() {
      return this.$store.state.forecast;
    },
    hourlyForecasts() {
      if (!this.forecast) return [];
      return this.forecast.list.slice(0, this.showCount);
    },
  },
  mounted() {
    this.fetchData();
    
    // Set up auto-refresh every 30 minutes
    this.refreshTimer = setInterval(() => {
      this.fetchData();
    }, 30 * 60 * 1000);
  },
  beforeUnmount() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  },
  methods: {
    formatHour(datetime) {
      return moment(datetime).format("h A"); // Format time as "6 PM"
    },
    formatDay(datetime) {
      const today = moment().startOf('day');
      const forecastDate = moment(datetime).startOf('day');
      
      if (forecastDate.isSame(today)) {
        return 'Today';
      } else if (forecastDate.isSame(today.clone().add(1, 'days'))) {
        return 'Tomorrow';
      } else {
        return moment(datetime).format("ddd");
      }
    },
    formatTemp(temp) {
      return temp.toFixed(1);
    },
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
    isCurrentHour(datetime) {
      const now = moment();
      const forecastTime = moment(datetime);
      // Check if forecast time is within 30 minutes of current time
      return Math.abs(now.diff(forecastTime, 'minutes')) < 30;
    },
    showDay(index, datetime) {
      // Show the day label on the first forecast or when the day changes
      if (index === 0) return true;
      
      const prevDay = moment(this.hourlyForecasts[index - 1].dt_txt).startOf('day');
      const currentDay = moment(datetime).startOf('day');
      
      return !prevDay.isSame(currentDay);
    },
    showFeelsLike(forecast) {
      // Only show feels-like if it is significantly different from actual temperature.
      return Math.abs(forecast.main.temp - forecast.main.feels_like) > 1;
    },    async fetchData() {
      // Data is fetched by HomeView on load, so no separate dispatch is needed here.
    },
    scrollLeft() {
      if (this.$refs.scrollContainer) {
        this.$refs.scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
      }
    },
    scrollRight() {
      if (this.$refs.scrollContainer) {
        this.$refs.scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
      }
    },
  },
};
</script>

<style scoped>
/* Container styling */
.hourly-forecast-container {
  max-width: 900px;
  margin: 25px auto;
  border-radius: 20px;
  overflow: hidden;
  background: white;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
  position: relative;
}

/* Header styling */
.hourly-header {
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  color: white;
  padding: 20px;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.hourly-header h2 {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
}

.hourly-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hourly-updated {
  font-size: 0.8rem;
  opacity: 0.8;
  margin-right: 10px;
}

.scroll-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.scroll-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* Loading state */
.hourly-loading {
  padding: 30px 20px;
  background: linear-gradient(to bottom, #fdf2f8, #f5f3ff);
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hourly-loading-container {
  width: 100%;
  overflow: hidden;
}

.hourly-skeleton-container {
  display: flex;
  gap: 20px;
  padding: 10px 0;
}

.hourly-skeleton {
  min-width: 150px;
  height: 180px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
}

.hourly-skeleton::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  animation: shimmer 1.5s infinite;
}

.skeleton-time {
  width: 60%;
  height: 20px;
  background: #e2e8f0;
  border-radius: 4px;
  margin-bottom: 12px;
}

.skeleton-icon {
  width: 50px;
  height: 50px;
  background: #e2e8f0;
  border-radius: 12px;
  margin: 10px 0;
}

.skeleton-temp {
  width: 70%;
  height: 25px;
  background: #e2e8f0;
  border-radius: 4px;
  margin: 10px 0;
}

.skeleton-detail {
  width: 80%;
  height: 15px;
  background: #e2e8f0;
  border-radius: 4px;
  margin-top: 8px;
}

.hourly-loading-text {
  color: #64748b;
  margin-top: 20px;
  font-size: 1.1rem;
  font-weight: 500;
}

/* Scrollable container */
.hourly-forecast-scroll {
  padding: 25px;
  overflow-x: auto;
  background: linear-gradient(to bottom, #fdf2f8, #f5f3ff);
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
  scroll-behavior: smooth;
}

.hourly-forecast-scroll::-webkit-scrollbar {
  height: 8px;
}

.hourly-forecast-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.hourly-forecast-scroll::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}

/* Hourly cards container */
.hourly-forecast {
  display: flex;
  gap: 20px;
  min-width: max-content;
}

/* Individual hour card */
.hourly-card {
  min-width: 150px;
  background: linear-gradient(to bottom, #ffffff, #fdfbff);
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(236, 72, 153, 0.1);
}

.hourly-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #ec4899, #8b5cf6, #ec4899);
  transform: translateX(-100%);
  transition: transform 0.4s ease;
}

.hourly-card:hover::before {
  transform: translateX(0);
}

.hourly-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 20px 40px rgba(236, 72, 153, 0.15);
  border-color: rgba(236, 72, 153, 0.3);
}

.hourly-card.current-hour {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(139, 92, 246, 0.15));
  border: 2px solid rgba(139, 92, 246, 0.4);
  transform: scale(1.05);
  box-shadow: 0 15px 35px rgba(139, 92, 246, 0.2);
}

.hourly-card.current-hour::before {
  content: 'Now';
  position: absolute;
  top: 0;
  right: 0;
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 10px;
  border-bottom-left-radius: 12px;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Time display */
.hour-time {
  font-weight: 700;
  font-size: 1.1rem;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 5px;
  letter-spacing: 0.5px;
}

.hour-day {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 10px;
  font-weight: 500;
}

/* Weather icon */
.hour-icon {
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hour-icon i {
  font-size: 2.8rem;
  transition: all 0.3s ease;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

.hourly-card:hover .hour-icon i {
  transform: scale(1.15) rotate(-5deg);
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

/* Temperature */
.hour-temp {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 5px 0;
}

.hour-feels-like {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 8px;
}

.hour-description {
  font-size: 0.9rem;
  color: #4b5563;
  text-transform: capitalize;
  margin-bottom: 10px;
}

/* Additional weather details */
.hour-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
  font-size: 0.9rem;
  color: #64748b;
}

.hour-precipitation {
  font-size: 0.85rem;
  color: #3b82f6;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.hour-detail {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.hour-details i {
  color: #8b5cf6;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hourly-card {
    min-width: 130px;
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .hourly-card {
    min-width: 110px;
    padding: 12px;
  }
  
  .hour-time {
    font-size: 1rem;
  }
  
  .hour-temp {
    font-size: 1.2rem;
  }
}
</style>
