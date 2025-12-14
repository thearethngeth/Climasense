<template>  <div class="current-weather-card" v-if="weatherData">
    <div class="time-indicator">
      <span>{{ formattedDate }}</span>
      <span class="weather-update"><i class="fas fa-history me-1"></i> Updated {{ lastUpdateTime }}</span>
    </div>
    
    <div class="current-weather">
      <div class="details">
        <h1>{{ weatherData.weather.temp }}&deg;</h1>
        <div class="feels-like">
          <span>Feels like {{ weatherData.main.feels_like }}&deg;</span>
        </div>
        <p class="weather-desc">{{ weatherData.weather.description }}</p>
        <p class="location">
          <i class="fas fa-map-marker-alt me-2"></i>
          {{ weatherData.name }}, {{ weatherData.sys.country }}
        </p>
        <div class="temp-range">
          <span><i class="fas fa-arrow-down"></i> {{ weatherData.main.temp_min }}&deg;</span>
          <span><i class="fas fa-arrow-up"></i> {{ weatherData.main.temp_max }}&deg;</span>
        </div>
      </div>
      
      <div class="weather-icon-container">
        <div class="weather-icon" :class="{ 'night-mode': isNightTime }">
          <img :src="getWeatherIcon(weatherData.weather.icon)" :alt="weatherData.weather.description">
          <div class="time-of-day-indicator">
            {{ isNightTime ? 'Night' : 'Day' }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="divider my-2"></div>
    
    <div class="card-footer">
      <div class="info-item">
        <i class="fas fa-wind"></i>
        <div>
          <p class="info-value">{{ weatherData.wind.speed }} m/s</p>
          <p class="info-label">Wind</p>
        </div>
      </div>
      
      <div class="info-item">
        <i class="fas fa-tint"></i>
        <div>
          <p class="info-value">{{ weatherData.main.humidity }}%</p>
          <p class="info-label">Humidity</p>
        </div>
      </div>
      
      <div class="info-item">
        <i class="fas fa-compress-alt"></i>
        <div>
          <p class="info-value">{{ weatherData.main.pressure }}</p>
          <p class="info-label">Pressure</p>
        </div>
      </div>
      
      <div class="info-item">
        <i class="fas fa-eye"></i>
        <div>
          <p class="info-value">{{ formatVisibility }}</p>
          <p class="info-label">Visibility</p>
        </div>
      </div>
    </div>
  </div>  
    <div class="loading-card" v-else>
    <div class="weather-scene">
      <div class="cloud-container">
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
        <div class="cloud cloud-3"></div>
      </div>
      <div class="sun">
        <div class="sun-rays"></div>
      </div>
      <div class="rain-container">
        <div class="raindrop" v-for="n in 10" :key="n"></div>
      </div>
    </div>
    <div class="loading-animation">
      <i class="fas fa-cloud-sun fa-pulse"></i>
      <div class="loading-spinner"></div>
    </div>
    <p class="loading-text">Fetching weather data</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      weatherData: null, // Initialize to null to avoid undefined errors
      lastUpdate: null,
    };
  },
  computed: {
    storeWeather() {
      return this.$store.state.weather;
    },
    formatVisibility() {
      if (!this.weatherData || !this.weatherData.visibility) return 'N/A';
      return `${(this.weatherData.visibility / 1000).toFixed(1)} km`;
    },
    formattedDate() {
      const now = new Date();
      const options = { weekday: 'long', month: 'short', day: 'numeric' };
      return now.toLocaleDateString('en-US', options);
    },
    lastUpdateTime() {
      if (!this.lastUpdate) return 'Just now';
      
      const minutes = Math.floor((new Date() - this.lastUpdate) / 60000);
      if (minutes < 1) return 'Just now';
      if (minutes === 1) return '1 minute ago';
      if (minutes < 60) return `${minutes} minutes ago`;
      
      const hours = Math.floor(minutes / 60);
      if (hours === 1) return '1 hour ago';
      return `${hours} hours ago`;
    },
    isNightTime() {
      if (!this.weatherData || !this.weatherData.sys) return false;
      
      const now = Date.now() / 1000; // Current time in seconds
      const sunrise = this.weatherData.sys.sunrise;
      const sunset = this.weatherData.sys.sunset;
      
      return now < sunrise || now > sunset;
    }
  },
  watch: {
    // Watch for changes in the store's weather data
    storeWeather: {
      handler(newWeather) {
        if (newWeather) {
          this.updateWeatherData(newWeather);
          this.lastUpdate = new Date();
        }
      },
      immediate: true
    }
  },
  async mounted() {
    await this.fetchWeather();
    
    // Auto-refresh data every 30 minutes
    setInterval(() => {
      this.fetchWeather();
    }, 30 * 60 * 1000);
  },
  methods: {
    async fetchWeather() {
      try {
        // If weather data doesn't exist in store, fetch it
        if (!this.$store.state.weather) {
          await this.$store.dispatch('fetchWeather');
        }
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
      }
    },
    
    updateWeatherData(weatherData) {
      if (!weatherData) return;
      
      this.weatherData = {
        weather: {
          temp: Math.round(weatherData.main.temp), // Round temperature
          description: weatherData.weather[0].description,
          icon: weatherData.weather[0].icon
        },
        name: weatherData.name,
        sys: weatherData.sys,
        main: {
          temp_min: Math.round(weatherData.main.temp_min),
          temp_max: Math.round(weatherData.main.temp_max),
          feels_like: Math.round(weatherData.main.feels_like),
          humidity: weatherData.main.humidity,
          pressure: weatherData.main.pressure
        },
        wind: weatherData.wind,
        visibility: weatherData.visibility
      };
    },
    
    getWeatherIcon(icon) {
      return `https://openweathermap.org/img/wn/${icon}@4x.png`;
    }
  },
};
</script>

<style scoped>
/* General Card Styling */
.current-weather-card {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  border: none;
  background: linear-gradient(135deg, #6366f1, #a855f7); /* Modern purple gradient */
  border-radius: 20px;
  color: white;
  box-shadow: 0 10px 25px rgba(149, 128, 255, 0.3);
  overflow: hidden;
  padding: 25px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

@media (max-width: 1024px) {
  .current-weather-card {
    padding: 20px;
    border-radius: 16px;
  }
}

@media (max-width: 768px) {
  .current-weather-card {
    padding: 18px;
    border-radius: 14px;
    margin: 0;
  }
}

@media (max-width: 480px) {
  .current-weather-card {
    padding: 16px;
    border-radius: 12px;
  }
}

.current-weather-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(149, 128, 255, 0.4);
}

.time-indicator {
  display: flex;
  justify-content: space-between;
  opacity: 0.9;
  font-size: 0.9rem;
  margin-bottom: 20px;
  font-weight: 500;
}

.weather-update {
  opacity: 0.7;
}

/* Loading Card Styling */
.loading-card {
  width: 100%;
  max-width: 650px;
  min-height: 380px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(168, 85, 247, 0.8));
  border-radius: 20px;
  backdrop-filter: blur(10px);
  color: white;
  box-shadow: 0 10px 25px rgba(149, 128, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.loading-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shimmer 2.5s infinite;
  z-index: 1;
}

/* Animated weather scene */
.weather-scene {
  position: relative;
  width: 200px;
  height: 150px;
  margin-bottom: 30px;
}

.sun {
  position: absolute;
  top: 20px;
  left: 80px;
  width: 60px;
  height: 60px;
  background-color: #fcd34d;
  border-radius: 50%;
  box-shadow: 0 0 40px rgba(252, 211, 77, 0.8);
  animation: sunPulse 3s infinite ease-in-out;
  z-index: 1;
}

.sun-rays {
  position: absolute;
  top: -15px;
  left: -15px;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 10px solid rgba(252, 211, 77, 0.3);
  animation: raysPulse 3s infinite ease-in-out;
}

.cloud-container {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.cloud {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
}

.cloud-1 {
  top: 30px;
  left: 100px;
  width: 70px;
  height: 30px;
  animation: cloud1Move 7s infinite ease-in-out;
}

.cloud-2 {
  top: 50px;
  left: 30px;
  width: 60px;
  height: 25px;
  animation: cloud2Move 8s infinite ease-in-out;
}

.cloud-3 {
  top: 70px;
  left: 120px;
  width: 50px;
  height: 20px;
  animation: cloud3Move 6s infinite ease-in-out;
}

.rain-container {
  position: absolute;
  top: 70px;
  left: 20px;
  width: 160px;
  height: 80px;
  z-index: 0;
}

.raindrop {
  position: absolute;
  width: 3px;
  height: 15px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.8));
  border-radius: 0 0 5px 5px;
}

.raindrop:nth-child(1) { left: 10%; top: 0; animation: rainfall 1.5s infinite ease-in 0.1s; }
.raindrop:nth-child(2) { left: 20%; top: 10px; animation: rainfall 1.3s infinite ease-in 0.3s; }
.raindrop:nth-child(3) { left: 30%; top: 0; animation: rainfall 1.6s infinite ease-in 0.5s; }
.raindrop:nth-child(4) { left: 40%; top: 15px; animation: rainfall 1.4s infinite ease-in 0.2s; }
.raindrop:nth-child(5) { left: 50%; top: 5px; animation: rainfall 1.7s infinite ease-in 0.1s; }
.raindrop:nth-child(6) { left: 60%; top: 0; animation: rainfall 1.2s infinite ease-in 0.4s; }
.raindrop:nth-child(7) { left: 70%; top: 10px; animation: rainfall 1.8s infinite ease-in 0.6s; }
.raindrop:nth-child(8) { left: 80%; top: 5px; animation: rainfall 1.3s infinite ease-in 0.3s; }
.raindrop:nth-child(9) { left: 90%; top: 0; animation: rainfall 1.5s infinite ease-in 0.2s; }
.raindrop:nth-child(10) { left: 95%; top: 10px; animation: rainfall 1.6s infinite ease-in 0.5s; }

.loading-animation {
  position: relative;
  margin-bottom: 20px;
  z-index: 3;
}

.loading-animation i {
  font-size: 3rem;
  color: #fcd34d;
  text-shadow: 0 0 20px rgba(252, 211, 77, 0.5);
  animation: pulse 2s infinite;
}

.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 1px;
  position: relative;
  z-index: 3;
}

.loading-text::after {
  content: '';
  position: absolute;
  animation: loadingDots 1.5s infinite;
}

/* Loading animations */
@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

@keyframes pulse {
  0% { opacity: 0.6; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.6; transform: scale(0.95); }
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes loadingDots {
  0% { content: '.'; }
  33% { content: '..'; }
  66% { content: '...'; }
  100% { content: ''; }
}

@keyframes sunPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.9; }
}

@keyframes raysPulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.5; }
}

@keyframes cloud1Move {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-20px); }
}

@keyframes cloud2Move {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(20px); }
}

@keyframes cloud3Move {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-15px); }
}

@keyframes rainfall {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(80px) scale(0.5); opacity: 0; }
}

/* Current Weather Section */
.current-weather {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 200px;
  margin-bottom: 15px;
}

.details {
  font-size: 1.2rem;
}

.details h1 {
  font-size: 5rem;
  font-weight: 700;
  margin: 0;
  line-height: 1;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: inline-block;
}

.feels-like {
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 10px;
}

.weather-desc {
  font-size: 1.5rem;
  text-transform: capitalize;
  margin-bottom: 0.5rem;
}

.location {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 10px;
}

.temp-range {
  display: flex;
  gap: 15px;
  font-size: 0.9rem;
  opacity: 0.8;
}

.weather-icon-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.weather-icon {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  padding: 10px;
  margin-bottom: 10px;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.weather-icon.night-mode {
  background: rgba(99, 102, 241, 0.3);
  animation: nightMode 2s ease-in-out;
}

.weather-icon img {
  width: 150px;
  height: 150px;
  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.5));
  transition: transform 0.3s ease;
}

.weather-icon:hover img {
  transform: scale(1.05);
}

.time-of-day-indicator {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.2);
  padding: 3px 12px;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 500;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

/* Divider */
.divider {
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Footer Styling */
.card-footer {
  display: flex;
  justify-content: space-between;
  padding: 15px 0 5px;
  font-size: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  width: 23%;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.card-footer i {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.3rem;
  margin-bottom: 5px;
}

.info-value {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.info-label {
  margin: 0;
  font-size: 0.8rem;
  opacity: 0.8;
}

/* Adding responsive design */
@media (max-width: 768px) {
  .current-weather {
    flex-direction: column-reverse;
    align-items: center;
    gap: 20px;
  }
  
  .details {
    text-align: center;
    width: 100%;
  }
  
  .card-footer {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .info-item {
    width: 47%;
    margin-bottom: 10px;
  }
}

@media (max-width: 480px) {
  .time-indicator {
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }
  
  .details h1 {
    font-size: 4rem;
  }
  
  .weather-desc {
    font-size: 1.2rem;
  }
  
  .info-item {
    width: 100%;
  }
  
  .weather-icon img {
    width: 120px;
    height: 120px;
  }
}

/* Add a subtle weather background pattern */
.current-weather-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 28' width='56' height='28'%3E%3Cpath fill='%23ffffff' fill-opacity='0.05' d='M56 26v2h-7.75c2.3-1.27 4.94-2 7.75-2zm-26 2a2 2 0 1 0-4 0h-4.09A25.98 25.98 0 0 0 0 16v-2c.67 0 1.34.02 2 .07V14a2 2 0 0 0-2-2v-2a4 4 0 0 1 3.98 3.6 28.09 28.09 0 0 1 2.8-3.86A8 8 0 0 0 0 6V4a9.99 9.99 0 0 1 8.17 4.23c.94-.95 1.96-1.83 3.03-2.63A13.98 13.98 0 0 0 0 0h7.75c2 1.1 3.73 2.63 5.1 4.45 1.12-.72 2.3-1.37 3.53-1.93A20.1 20.1 0 0 0 14.28 0h2.7c.45.56.88 1.14 1.29 1.74 1.3-.48 2.63-.87 4-1.15-.11-.2-.23-.4-.36-.59H26v.07a28.4 28.4 0 0 1 4 0V0h4.09l-.37.59c1.38.28 2.72.67 4.01 1.15.4-.6.84-1.18 1.3-1.74h2.69a20.1 20.1 0 0 0-2.1 2.52c1.23.56 2.41 1.2 3.54 1.93A16.08 16.08 0 0 1 48.25 0H56c-4.58 0-8.65 2.2-11.2 5.6 1.07.8 2.09 1.68 3.03 2.63A9.99 9.99 0 0 1 56 4v2a8 8 0 0 0-6.77 3.74c1.03 1.2 1.97 2.5 2.79 3.86A4 4 0 0 1 56 10v2a2 2 0 0 0-2 2.07 28.4 28.4 0 0 1 2-.07v2c-9.2 0-17.3 4.78-21.91 12H30zM7.75 28H0v-2c2.81 0 5.46.73 7.75 2zM56 20v2c-5.6 0-10.65 2.3-14.28 6h-2.7c4.04-4.89 10.15-8 16.98-8zm-39.03 8h-2.69C10.65 24.3 5.6 22 0 22v-2c6.83 0 12.94 3.11 16.97 8zm15.01-.4a28.09 28.09 0 0 1 2.8-3.86 8 8 0 0 0-13.55 0c1.03 1.2 1.97 2.5 2.79 3.86a4 4 0 0 1 7.96 0zm14.29-11.86c1.3-.48 2.63-.87 4-1.15a25.99 25.99 0 0 0-44.55 0c1.38.28 2.72.67 4.01 1.15a21.98 21.98 0 0 1 36.54 0z'%3E%3C/path%3E%3C/svg%3E");
  z-index: 0;
  opacity: 0.4;
  pointer-events: none;
}

.current-weather-card > * {
  position: relative;
  z-index: 1;
}

/* Add animation for day/night transition */
.weather-icon.night-mode {
  animation: nightMode 2s ease-in-out;
}

@keyframes nightMode {
  0% { transform: scale(0.95); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
</style>
