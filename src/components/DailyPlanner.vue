<template>
  <div class="daily-planner-container">
    <!-- Time of Day Forecast Section -->
    <div class="planner-section time-of-day-section">
      <div class="section-header">
        <h3><i class="fas fa-sun me-2"></i>Today's Timeline</h3>
        <span class="section-date">{{ currentDate }}</span>
      </div>
      
      <div class="time-periods">
        <!-- Morning -->
        <div class="time-period morning" :class="{ 'active-period': currentPeriod === 'morning' }">
          <div class="period-header">
            <div class="period-icon">
              <i class="fas fa-cloud-sun"></i>
            </div>
            <div class="period-info">
              <h4>Morning</h4>
              <span class="period-time">6 AM - 12 PM</span>
            </div>
          </div>
          <div class="period-weather" v-if="morningForecast">
            <img :src="getWeatherIcon(morningForecast.weather[0].icon)" :alt="morningForecast.weather[0].description" />
            <div class="period-temp">{{ formatTemp(morningForecast.main.temp) }}&deg;</div>
          </div>
          <div class="period-details" v-if="morningForecast">
            <div class="detail-item">
              <i class="fas fa-temperature-high"></i>
              <span>High: {{ formatTemp(morningForecast.main.temp_max) }}&deg;</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-droplet"></i>
              <span>{{ morningForecast.main.humidity }}%</span>
            </div>
            <div class="detail-item" v-if="morningForecast.pop">
              <i class="fas fa-cloud-rain"></i>
              <span>{{ Math.round(morningForecast.pop * 100) }}%</span>
            </div>
          </div>
          <div class="period-tip">
            <i class="fas fa-lightbulb"></i>
            <span>{{ getMorningTip() }}</span>
          </div>
        </div>

        <!-- Afternoon -->
        <div class="time-period afternoon" :class="{ 'active-period': currentPeriod === 'afternoon' }">
          <div class="period-header">
            <div class="period-icon">
              <i class="fas fa-sun"></i>
            </div>
            <div class="period-info">
              <h4>Afternoon</h4>
              <span class="period-time">12 PM - 6 PM</span>
            </div>
          </div>
          <div class="period-weather" v-if="afternoonForecast">
            <img :src="getWeatherIcon(afternoonForecast.weather[0].icon)" :alt="afternoonForecast.weather[0].description" />
            <div class="period-temp">{{ formatTemp(afternoonForecast.main.temp) }}&deg;</div>
          </div>
          <div class="period-details" v-if="afternoonForecast">
            <div class="detail-item">
              <i class="fas fa-temperature-high"></i>
              <span>High: {{ formatTemp(afternoonForecast.main.temp_max) }}&deg;</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-droplet"></i>
              <span>{{ afternoonForecast.main.humidity }}%</span>
            </div>
            <div class="detail-item" v-if="afternoonForecast.pop">
              <i class="fas fa-cloud-rain"></i>
              <span>{{ Math.round(afternoonForecast.pop * 100) }}%</span>
            </div>
          </div>
          <div class="period-tip" :class="{ 'warning': hasThunderstormRisk }">
            <i :class="hasThunderstormRisk ? 'fas fa-exclamation-triangle' : 'fas fa-lightbulb'"></i>
            <span>{{ getAfternoonTip() }}</span>
          </div>
        </div>

        <!-- Evening -->
        <div class="time-period evening" :class="{ 'active-period': currentPeriod === 'evening' }">
          <div class="period-header">
            <div class="period-icon">
              <i class="fas fa-moon"></i>
            </div>
            <div class="period-info">
              <h4>Evening</h4>
              <span class="period-time">6 PM - 12 AM</span>
            </div>
          </div>
          <div class="period-weather" v-if="eveningForecast">
            <img :src="getWeatherIcon(eveningForecast.weather[0].icon)" :alt="eveningForecast.weather[0].description" />
            <div class="period-temp">{{ formatTemp(eveningForecast.main.temp) }}&deg;</div>
          </div>
          <div class="period-details" v-if="eveningForecast">
            <div class="detail-item">
              <i class="fas fa-temperature-low"></i>
              <span>Low: {{ formatTemp(eveningForecast.main.temp_min) }}&deg;</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-droplet"></i>
              <span>{{ eveningForecast.main.humidity }}%</span>
            </div>
            <div class="detail-item" v-if="eveningForecast.pop">
              <i class="fas fa-cloud-rain"></i>
              <span>{{ Math.round(eveningForecast.pop * 100) }}%</span>
            </div>
          </div>
          <div class="period-tip">
            <i class="fas fa-lightbulb"></i>
            <span>{{ getEveningTip() }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Seasonal Planning Section -->
    <div class="planner-section seasonal-section">
      <div class="section-header">
        <h3><i class="fas fa-leaf me-2"></i>Seasonal Planning</h3>
        <span class="current-season">{{ currentSeason }}</span>
      </div>
      
      <div class="seasonal-content">
        <div class="season-indicator" :class="seasonClass">
          <i :class="seasonIcon"></i>
          <span>{{ currentSeason }}</span>
        </div>
        
        <div class="seasonal-tips">
          <div class="seasonal-tip" v-for="(tip, index) in seasonalTips" :key="index">
            <i :class="tip.icon"></i>
            <span>{{ tip.text }}</span>
          </div>
        </div>
        
        <div class="best-activity-window" v-if="bestActivityWindow">
          <div class="window-header">
            <i class="fas fa-clock"></i>
            <span>Best Activity Window</span>
          </div>
          <div class="window-time">{{ bestActivityWindow }}</div>
        </div>
      </div>
    </div>

    <!-- Regional Differences Section -->
    <div class="planner-section regional-section">
      <div class="section-header">
        <h3><i class="fas fa-map-marker-alt me-2"></i>Regional Insights</h3>
      </div>
      
      <div class="regional-cards">
        <!-- Coastal -->
        <div class="regional-card coastal" :class="{ 'active-region': regionType === 'coastal' }">
          <div class="region-icon">
            <i class="fas fa-water"></i>
          </div>
          <div class="region-name">Coastal</div>
          <div class="region-characteristics">
            <span><i class="fas fa-cloud-rain"></i> More rain</span>
            <span><i class="fas fa-wind"></i> Windier</span>
          </div>
          <div class="region-advice">{{ getCoastalAdvice() }}</div>
        </div>

        <!-- Mountains -->
        <div class="regional-card mountains" :class="{ 'active-region': regionType === 'mountains' }">
          <div class="region-icon">
            <i class="fas fa-mountain"></i>
          </div>
          <div class="region-name">Mountains</div>
          <div class="region-characteristics">
            <span><i class="fas fa-temperature-low"></i> Cooler</span>
            <span><i class="fas fa-cloud-showers-heavy"></i> More rain</span>
          </div>
          <div class="region-advice">{{ getMountainAdvice() }}</div>
        </div>

        <!-- Plains -->
        <div class="regional-card plains" :class="{ 'active-region': regionType === 'plains' }">
          <div class="region-icon">
            <i class="fas fa-wheat-awn"></i>
          </div>
          <div class="region-name">Plains</div>
          <div class="region-characteristics">
            <span><i class="fas fa-temperature-high"></i> Hotter</span>
            <span><i class="fas fa-sun"></i> Drier</span>
          </div>
          <div class="region-advice">{{ getPlainsAdvice() }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'DailyPlanner',
  setup() {
    const store = useStore();
    
    const currentDate = computed(() => moment().format('dddd, MMMM D'));
    
    const currentPeriod = computed(() => {
      const hour = moment().hour();
      if (hour >= 6 && hour < 12) return 'morning';
      if (hour >= 12 && hour < 18) return 'afternoon';
      return 'evening';
    });
    
    const forecast = computed(() => store.state.forecast);
    const currentWeather = computed(() => store.state.weather);
    
    // Get forecast for specific time periods
    const getForecastForHour = (targetHour) => {
      if (!forecast.value?.list) return null;
      
      const today = moment().format('YYYY-MM-DD');
      return forecast.value.list.find(item => {
        const itemDate = moment(item.dt_txt);
        return itemDate.format('YYYY-MM-DD') === today && 
               itemDate.hour() >= targetHour && 
               itemDate.hour() < targetHour + 6;
      }) || forecast.value.list[0];
    };
    
    const morningForecast = computed(() => getForecastForHour(6));
    const afternoonForecast = computed(() => getForecastForHour(12));
    const eveningForecast = computed(() => getForecastForHour(18));
    
    // Check for thunderstorm risk
    const hasThunderstormRisk = computed(() => {
      if (!afternoonForecast.value) return false;
      const weatherId = afternoonForecast.value.weather[0]?.id;
      return weatherId >= 200 && weatherId < 300; // Thunderstorm codes
    });
    
    // Determine current season based on month
    const currentSeason = computed(() => {
      const month = moment().month();
      if (month >= 2 && month <= 4) return 'Spring';
      if (month >= 5 && month <= 7) return 'Summer';
      if (month >= 8 && month <= 10) return 'Fall';
      return 'Winter';
    });
    
    const seasonClass = computed(() => currentSeason.value.toLowerCase());
    
    const seasonIcon = computed(() => {
      switch (currentSeason.value) {
        case 'Spring': return 'fas fa-seedling';
        case 'Summer': return 'fas fa-sun';
        case 'Fall': return 'fas fa-leaf';
        case 'Winter': return 'fas fa-snowflake';
        default: return 'fas fa-calendar';
      }
    });
    
    // Seasonal tips based on current season and weather
    const seasonalTips = computed(() => {
      const tips = [];
      const isWetSeason = ['Spring', 'Summer'].includes(currentSeason.value);
      
      if (isWetSeason) {
        tips.push({ icon: 'fas fa-cloud-sun-rain', text: 'Expect afternoon storms - use morning weather windows' });
        tips.push({ icon: 'fas fa-umbrella', text: 'Keep an umbrella handy for sudden showers' });
        tips.push({ icon: 'fas fa-clock', text: 'Plan outdoor activities before 2 PM' });
      } else {
        tips.push({ icon: 'fas fa-check-circle', text: 'Dry season - plan outdoor activities with confidence' });
        tips.push({ icon: 'fas fa-sun', text: 'Lower humidity makes it comfortable outside' });
        tips.push({ icon: 'fas fa-hiking', text: 'Great time for hiking and outdoor sports' });
      }
      
      return tips;
    });
    
    // Best activity window based on weather
    const bestActivityWindow = computed(() => {
      if (!forecast.value?.list) return 'Morning (6 AM - 10 AM)';
      
      const isWetSeason = ['Spring', 'Summer'].includes(currentSeason.value);
      if (isWetSeason) {
        return 'Morning (6 AM - 11 AM)';
      }
      return 'All day - favorable conditions';
    });
    
    // Detect region type based on weather patterns (simplified)
    const regionType = ref('plains'); // Default, could be detected from location data
    
    const getWeatherIcon = (icon) => {
      return `https://openweathermap.org/img/wn/${icon}@2x.png`;
    };
    
    const formatTemp = (temp) => Math.round(temp);
    
    // Time-of-day tips
    const getMorningTip = () => {
      if (!morningForecast.value) return 'Check back for morning forecast';
      const temp = morningForecast.value.main.temp;
      if (temp < 10) return 'Bundle up! Cool morning ahead';
      if (temp > 25) return 'Already warm - stay hydrated';
      return 'Pleasant morning for outdoor activities';
    };
    
    const getAfternoonTip = () => {
      if (!afternoonForecast.value) return 'Check back for afternoon forecast';
      if (hasThunderstormRisk.value) return 'Thunderstorm risk - seek shelter if needed';
      const pop = afternoonForecast.value.pop || 0;
      if (pop > 0.5) return 'High chance of rain - plan indoor activities';
      if (pop > 0.3) return 'Possible showers - have a backup plan';
      return 'Good conditions for afternoon activities';
    };
    
    const getEveningTip = () => {
      if (!eveningForecast.value) return 'Check back for evening forecast';
      const pop = eveningForecast.value.pop || 0;
      if (pop > 0.3) return 'Rain may continue into the evening';
      return 'Clear evening expected - enjoy outdoor dining';
    };
    
    // Regional advice
    const getCoastalAdvice = () => {
      const windSpeed = currentWeather.value?.wind?.speed || 0;
      if (windSpeed > 10) return 'Strong sea breeze today';
      return 'Mild coastal conditions';
    };
    
    const getMountainAdvice = () => {
      const temp = currentWeather.value?.main?.temp || 20;
      if (temp < 15) return 'Pack warm layers for elevation';
      return 'Comfortable mountain weather';
    };
    
    const getPlainsAdvice = () => {
      const temp = currentWeather.value?.main?.temp || 20;
      if (temp > 30) return 'Expect hot conditions - seek shade';
      return 'Pleasant open-area weather';
    };
    
    return {
      currentDate,
      currentPeriod,
      morningForecast,
      afternoonForecast,
      eveningForecast,
      hasThunderstormRisk,
      currentSeason,
      seasonClass,
      seasonIcon,
      seasonalTips,
      bestActivityWindow,
      regionType,
      getWeatherIcon,
      formatTemp,
      getMorningTip,
      getAfternoonTip,
      getEveningTip,
      getCoastalAdvice,
      getMountainAdvice,
      getPlainsAdvice
    };
  }
};
</script>

<style scoped>
.daily-planner-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
}

/* Section Styling */
.planner-section {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%);
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(203, 213, 225, 0.3);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(99, 102, 241, 0.1);
}

.section-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.section-date,
.current-season {
  font-size: 0.85rem;
  color: #6366f1;
  font-weight: 500;
}

/* Time Periods */
.time-periods {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.time-period {
  background: linear-gradient(145deg, #f8fafc, #f1f5f9);
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.time-period.active-period {
  border-color: #6366f1;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.time-period.morning {
  background: linear-gradient(145deg, #fef3c7, #fde68a);
}

.time-period.afternoon {
  background: linear-gradient(145deg, #fed7aa, #fdba74);
}

.time-period.evening {
  background: linear-gradient(145deg, #c7d2fe, #a5b4fc);
}

.period-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.period-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.morning .period-icon {
  background: rgba(251, 191, 36, 0.3);
  color: #d97706;
}

.afternoon .period-icon {
  background: rgba(249, 115, 22, 0.3);
  color: #ea580c;
}

.evening .period-icon {
  background: rgba(99, 102, 241, 0.3);
  color: #4f46e5;
}

.period-info h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.period-time {
  font-size: 0.75rem;
  color: #6b7280;
}

.period-weather {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.75rem 0;
}

.period-weather img {
  width: 50px;
  height: 50px;
}

.period-temp {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.period-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #4b5563;
  background: rgba(255, 255, 255, 0.5);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}

.detail-item i {
  font-size: 0.7rem;
  color: #6366f1;
}

.period-tip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  font-size: 0.75rem;
  color: #374151;
}

.period-tip i {
  color: #f59e0b;
}

.period-tip.warning {
  background: rgba(239, 68, 68, 0.15);
  color: #dc2626;
}

.period-tip.warning i {
  color: #dc2626;
}

/* Seasonal Section */
.seasonal-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.season-indicator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-weight: 600;
  width: fit-content;
}

.season-indicator.spring {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #059669;
}

.season-indicator.summer {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #d97706;
}

.season-indicator.fall {
  background: linear-gradient(135deg, #fed7aa, #fdba74);
  color: #ea580c;
}

.season-indicator.winter {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #2563eb;
}

.season-indicator i {
  font-size: 1.2rem;
}

.seasonal-tips {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.seasonal-tip {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: rgba(99, 102, 241, 0.05);
  border-radius: 8px;
  font-size: 0.85rem;
  color: #374151;
}

.seasonal-tip i {
  color: #6366f1;
  width: 20px;
  text-align: center;
}

.best-activity-window {
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.window-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #059669;
  margin-bottom: 0.25rem;
}

.window-time {
  font-size: 1rem;
  font-weight: 600;
  color: #065f46;
}

/* Regional Cards */
.regional-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.regional-card {
  background: linear-gradient(145deg, #f8fafc, #f1f5f9);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.regional-card.active-region {
  border-color: #6366f1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.regional-card.coastal {
  background: linear-gradient(145deg, #e0f2fe, #bae6fd);
}

.regional-card.mountains {
  background: linear-gradient(145deg, #e5e7eb, #d1d5db);
}

.regional-card.plains {
  background: linear-gradient(145deg, #fef3c7, #fde68a);
}

.region-icon {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
  font-size: 1.3rem;
}

.coastal .region-icon {
  background: rgba(14, 165, 233, 0.2);
  color: #0284c7;
}

.mountains .region-icon {
  background: rgba(107, 114, 128, 0.2);
  color: #4b5563;
}

.plains .region-icon {
  background: rgba(245, 158, 11, 0.2);
  color: #d97706;
}

.region-name {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.region-characteristics {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.region-characteristics span {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.region-advice {
  font-size: 0.8rem;
  color: #374151;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 6px;
}

/* Dark Theme */
:global(body.dark-theme) .planner-section {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%);
  border-color: rgba(51, 65, 85, 0.3);
}

:global(body.dark-theme) .section-header {
  border-bottom-color: rgba(99, 102, 241, 0.2);
}

:global(body.dark-theme) .section-header h3 {
  color: #e2e8f0;
}

:global(body.dark-theme) .time-period {
  background: linear-gradient(145deg, rgba(51, 65, 85, 0.8), rgba(30, 41, 59, 0.8));
}

:global(body.dark-theme) .time-period.morning {
  background: linear-gradient(145deg, rgba(217, 119, 6, 0.3), rgba(245, 158, 11, 0.2));
}

:global(body.dark-theme) .time-period.afternoon {
  background: linear-gradient(145deg, rgba(234, 88, 12, 0.3), rgba(249, 115, 22, 0.2));
}

:global(body.dark-theme) .time-period.evening {
  background: linear-gradient(145deg, rgba(79, 70, 229, 0.3), rgba(99, 102, 241, 0.2));
}

:global(body.dark-theme) .period-info h4,
:global(body.dark-theme) .period-temp {
  color: #e2e8f0;
}

:global(body.dark-theme) .period-time,
:global(body.dark-theme) .detail-item {
  color: #94a3b8;
}

:global(body.dark-theme) .period-tip {
  background: rgba(15, 23, 42, 0.5);
  color: #cbd5e1;
}

:global(body.dark-theme) .regional-card {
  background: linear-gradient(145deg, rgba(51, 65, 85, 0.8), rgba(30, 41, 59, 0.8));
}

:global(body.dark-theme) .region-name {
  color: #e2e8f0;
}

:global(body.dark-theme) .region-advice {
  background: rgba(15, 23, 42, 0.5);
  color: #cbd5e1;
}

:global(body.dark-theme) .seasonal-tip {
  background: rgba(99, 102, 241, 0.1);
  color: #cbd5e1;
}

:global(body.dark-theme) .best-activity-window {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1));
}

:global(body.dark-theme) .window-time {
  color: #34d399;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .time-periods,
  .regional-cards {
    grid-template-columns: 1fr;
  }
  
  .time-period,
  .regional-card {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.75rem;
    text-align: left;
  }
  
  .period-header {
    grid-column: 1 / -1;
  }
  
  .regional-card {
    grid-template-columns: auto 1fr auto;
    align-items: center;
  }
  
  .region-icon {
    margin: 0;
  }
  
  .region-characteristics {
    flex-direction: row;
    gap: 0.5rem;
  }
}
</style>
