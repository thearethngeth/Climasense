<template>
  <div class="about-weather-card">
    <div class="about-content">
      <div class="about-icon">
        <i class="fas fa-info-circle"></i>
      </div>
      <div class="about-info">
        <h3>About WeatherApp</h3>
        <p>Your comprehensive weather companion providing real-time weather data, forecasts, and insights powered by OpenWeatherMap API.</p>
        
        <div class="features-list">
          <div class="feature-item">
            <i class="fas fa-check-circle"></i>
            <span>Real-time weather updates</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-check-circle"></i>
            <span>5-day detailed forecasts</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-check-circle"></i>
            <span>Air quality monitoring</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-check-circle"></i>
            <span>UV index tracking</span>
          </div>
        </div>

        <div class="version-info">
          <span class="version-badge">Version 1.0.0</span>
          <span class="year-badge">© 2026</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutWeather'
}
</script>

<style scoped>
.about-weather-card {
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  height: 100%;
}

.about-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 20px;
  margin: 0 auto;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
}

.about-icon i {
  font-size: 2rem;
  color: white;
}

.about-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
}

.about-info h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.about-info p {
  margin: 0;
  color: var(--text-secondary, #64748b);
  line-height: 1.6;
  font-size: 0.95rem;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(99, 102, 241, 0.05);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(99, 102, 241, 0.1);
  transform: translateX(5px);
}

.feature-item i {
  color: #10b981;
  font-size: 1.1rem;
}

.feature-item span {
  color: var(--text-primary, #334155);
  font-size: 0.9rem;
  font-weight: 500;
}

.version-info {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid rgba(99, 102, 241, 0.1);
}

.version-badge,
.year-badge {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6366f1;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

@media (max-width: 480px) {
  .about-weather-card {
    padding: 1rem;
  }
  
  .about-icon {
    width: 60px;
    height: 60px;
  }
  
  .about-icon i {
    font-size: 1.5rem;
  }
  
  .about-info h3 {
    font-size: 1.25rem;
  }
}
</style>
