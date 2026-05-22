<template>
  <div class="mood-tracker">
    <div class="mood-section">
      <h3 class="mood-title">How's the weather making you feel today?</h3>
      
      <div class="mood-selector">
        <button 
          v-for="mood in moods" 
          :key="mood.emoji"
          class="mood-btn"
          :class="{ 'selected': selectedMood === mood.emoji }"
          @click="selectMood(mood)"
          :title="mood.label"
        >
          <span class="mood-emoji">{{ mood.emoji }}</span>
          <span class="mood-label">{{ mood.label }}</span>
        </button>
      </div>

      <transition name="fade">
        <div v-if="selectedMood" class="mood-feedback">
          <p>✨ Mood logged! Current weather: {{ currentTemp }}°{{ tempUnit }}</p>
        </div>
      </transition>
    </div>

    <div v-if="moodHistory.length > 0" class="mood-insights">
      <h4><i class="fas fa-chart-line"></i> Your Weather Mood Insights</h4>
      <div class="insights-grid">
        <div class="insight-card">
          <div class="insight-icon">😊</div>
          <div class="insight-text">
            <strong>{{ happyCount }}</strong> happy days
          </div>
        </div>
        <div class="insight-card">
          <div class="insight-icon">🌡️</div>
          <div class="insight-text">
            <strong>{{ favoriteTemp }}°{{ tempUnit }}</strong> your best temp
          </div>
        </div>
        <div class="insight-card">
          <div class="insight-icon">📊</div>
          <div class="insight-text">
            <strong>{{ moodHistory.length }}</strong> days tracked
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'MoodTracker',
  data() {
    return {
      moods: [
        { emoji: '😊', label: 'Happy', value: 5 },
        { emoji: '😌', label: 'Calm', value: 4 },
        { emoji: '😐', label: 'Neutral', value: 3 },
        { emoji: '😔', label: 'Low', value: 2 },
        { emoji: '😖', label: 'Uncomfortable', value: 1 }
      ],
      selectedMood: null,
      moodHistory: []
    };
  },
  computed: {
    ...mapState({
      weatherData: state => state.weatherData,
      units: state => state.units
    }),
    currentTemp() {
      return this.weatherData?.main?.temp 
        ? Math.round(this.weatherData.main.temp) 
        : '--';
    },
    tempUnit() {
      return this.units === 'metric' ? 'C' : 'F';
    },
    happyCount() {
      return this.moodHistory.filter(m => m.moodValue >= 4).length;
    },
    favoriteTemp() {
      if (this.moodHistory.length === 0) return '--';
      const happyMoods = this.moodHistory.filter(m => m.moodValue >= 4);
      if (happyMoods.length === 0) return '--';
      const avgTemp = happyMoods.reduce((sum, m) => sum + m.temp, 0) / happyMoods.length;
      return Math.round(avgTemp);
    }
  },
  methods: {
    selectMood(mood) {
      this.selectedMood = mood.emoji;
      
      const moodEntry = {
        mood: mood.emoji,
        moodValue: mood.value,
        label: mood.label,
        temp: this.currentTemp,
        weather: this.weatherData?.weather?.[0]?.main || 'Unknown',
        date: new Date().toISOString(),
        timestamp: Date.now()
      };
      
      this.moodHistory.push(moodEntry);
      this.saveMoodHistory();
      
      setTimeout(() => {
        this.selectedMood = null;
      }, 3000);
    },
    saveMoodHistory() {
      try {
        localStorage.setItem('weatherMoodHistory', JSON.stringify(this.moodHistory));
      } catch (error) {
        console.error('Failed to save mood history:', error);
      }
    },
    loadMoodHistory() {
      try {
        const saved = localStorage.getItem('weatherMoodHistory');
        if (saved) {
          this.moodHistory = JSON.parse(saved);
        }
      } catch (error) {
        console.error('Failed to load mood history:', error);
        this.moodHistory = [];
      }
    }
  },
  mounted() {
    this.loadMoodHistory();
  }
};
</script>

<style scoped>
.mood-tracker {
  padding: 20px;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.mood-section {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.mood-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 20px;
  text-align: center;
}

.mood-selector {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.mood-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mood-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-4px) scale(1.05);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.mood-btn.selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  transform: scale(1.1);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.mood-emoji {
  font-size: 2rem;
  transition: transform 0.3s ease;
}

.mood-btn:hover .mood-emoji {
  transform: scale(1.2) rotate(5deg);
}

.mood-label {
  font-size: 0.85rem;
  color: #fff;
  font-weight: 500;
}

.mood-feedback {
  text-align: center;
  padding: 12px;
  background: rgba(52, 211, 153, 0.2);
  border-radius: 8px;
  color: #fff;
  font-weight: 500;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.mood-insights {
  margin-top: 24px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.mood-insights h4 {
  color: #fff;
  font-size: 1.1rem;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.insight-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.insight-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.insight-icon {
  font-size: 2rem;
}

.insight-text {
  color: #fff;
  font-size: 0.9rem;
}

.insight-text strong {
  display: block;
  font-size: 1.2rem;
  color: #667eea;
  margin-bottom: 2px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .mood-selector {
    gap: 8px;
  }
  
  .mood-btn {
    padding: 12px 4px;
  }
  
  .mood-emoji {
    font-size: 1.5rem;
  }
  
  .mood-label {
    font-size: 0.75rem;
  }
}
</style>
