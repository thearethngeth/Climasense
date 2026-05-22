<template>
  <div class="weather-stats-card">
    <div class="stats-content">
      <div class="stats-icon">
        <i class="fas fa-chart-bar"></i>
      </div>
      <div class="stats-info">
        <h3>Weather Statistics</h3>
        <p>Current atmospheric conditions and measurements</p>
        
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-icon">
              <i class="fas fa-thermometer-half"></i>
            </div>
            <div class="stat-data">
              <span class="stat-label">Feels Like</span>
              <span class="stat-value">{{ feelsLike }}&deg;</span>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-icon">
              <i class="fas fa-compress-arrows-alt"></i>
            </div>
            <div class="stat-data">
              <span class="stat-label">Pressure</span>
              <span class="stat-value">{{ pressure }} hPa</span>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-icon">
              <i class="fas fa-wind"></i>
            </div>
            <div class="stat-data">
              <span class="stat-label">Wind Speed</span>
              <span class="stat-value">{{ windSpeed }} m/s</span>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-icon">
              <i class="fas fa-compass"></i>
            </div>
            <div class="stat-data">
              <span class="stat-label">Wind Direction</span>
              <span class="stat-value">{{ windDirection }}&deg;</span>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-icon">
              <i class="fas fa-tachometer-alt"></i>
            </div>
            <div class="stat-data">
              <span class="stat-label">Dew Point</span>
              <span class="stat-value">{{ dewPoint }}&deg;</span>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-icon">
              <i class="fas fa-eye"></i>
            </div>
            <div class="stat-data">
              <span class="stat-label">Visibility</span>
              <span class="stat-value">{{ visibilityKm }} km</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'WeatherStats',
  setup() {
    const store = useStore();
    
    const weatherData = computed(() => store.state.weather);
    
    const feelsLike = computed(() => {
      return weatherData.value?.main?.feels_like 
        ? Math.round(weatherData.value.main.feels_like) 
        : '--';
    });
    
    const pressure = computed(() => {
      return weatherData.value?.main?.pressure || '--';
    });
    
    const windSpeed = computed(() => {
      return weatherData.value?.wind?.speed 
        ? weatherData.value.wind.speed.toFixed(1) 
        : '--';
    });
    
    const windDirection = computed(() => {
      return weatherData.value?.wind?.deg || '--';
    });
    
    const dewPoint = computed(() => {
      if (!weatherData.value?.main?.temp || !weatherData.value?.main?.humidity) {
        return '--';
      }
      // Simplified dew point calculation
      const temp = weatherData.value.main.temp;
      const humidity = weatherData.value.main.humidity;
      const a = 17.27;
      const b = 237.7;
      const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100.0);
      const dewPt = (b * alpha) / (a - alpha);
      return Math.round(dewPt);
    });
    
    const visibilityKm = computed(() => {
      if (!weatherData.value?.visibility) return '--';
      return (weatherData.value.visibility / 1000).toFixed(1);
    });
    
    return {
      feelsLike,
      pressure,
      windSpeed,
      windDirection,
      dewPoint,
      visibilityKm
    };
  }
};
</script>

<style scoped>
.weather-stats-card {
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.stats-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  height: 100%;
}

.stats-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
  border-radius: 20px;
  margin: 0 auto;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
}

.stats-icon i {
  font-size: 2rem;
  color: white;
}

.stats-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
}

.stats-info h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stats-info p {
  margin: 0;
  color: var(--text-secondary, #64748b);
  line-height: 1.6;
  font-size: 0.95rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(16, 185, 129, 0.05);
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid rgba(16, 185, 129, 0.1);
}

.stat-item:hover {
  background: rgba(16, 185, 129, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
  border-radius: 8px;
  flex-shrink: 0;
}

.stat-icon i {
  color: white;
  font-size: 1rem;
}

.stat-data {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  text-align: left;
  flex: 1;
}

.stat-label {
  font-size: 0.7rem;
  color: var(--text-tertiary, #94a3b8);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1rem;
  color: var(--text-primary, #334155);
  font-weight: 700;
}

@media (max-width: 480px) {
  .weather-stats-card {
    padding: 1rem;
  }
  
  .stats-icon {
    width: 60px;
    height: 60px;
  }
  
  .stats-icon i {
    font-size: 1.5rem;
  }
  
  .stats-info h3 {
    font-size: 1.25rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-item {
    padding: 0.75rem;
  }
}
</style>
