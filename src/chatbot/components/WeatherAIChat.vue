<!-- src/chatbot/components/WeatherAIChat.vue -->
<template>
  <div class="ai-chat-container" data-aos="fade-up">
    <div class="ai-chat-card">
      <!-- Header -->
      <div class="chat-header">
        <div class="header-left">
          <i class="fas fa-robot header-icon"></i>
          <div class="header-info">
            <h3>Weather AI</h3>
            <p>Smart Q&A System</p>
          </div>
        </div>
        <button class="close-btn" @click="toggleChat" v-if="isExpanded">âœ•</button>
      </div>

      <!-- Chat Body -->
      <div class="chat-body" v-if="isExpanded">
        <!-- Messages Container -->
        <div class="messages-container">
          <div v-for="(msg, idx) in messages" :key="idx" :class="['message', msg.type]">
            <p class="message-text">{{ msg.text }}</p>
          </div>
        </div>

        <!-- Auto-Generated Insights Section -->
        <div v-if="messages.length > 1 && autoInsights.length > 0" class="insights-section">
          <h4 class="section-title">ðŸ“Š Weather Analysis</h4>
          <div class="insights-list">
            <div v-for="(insight, idx) in autoInsights" :key="idx" class="insight-item">
              {{ insight }}
            </div>
          </div>
        </div>

        <!-- Daily Recommendations -->
        <div v-if="recommendations.length > 0" class="recommendations-section">
          <h4 class="section-title">âœ¨ Daily Recommendations</h4>
          <div class="recommendations-list">
            <div v-for="(rec, idx) in recommendations" :key="idx" class="recommendation-item">
              {{ rec }}
            </div>
          </div>
        </div>

        <!-- Quick Suggestion Buttons -->
        <div v-if="messages.length <= 1" class="quick-suggestions">
          <p class="suggestions-label">Quick Questions:</p>
          <div class="suggestion-buttons">
            <button 
              v-for="(q, idx) in quickQuestions" 
              :key="idx"
              @click="askQuestion(q)"
              class="suggestion-btn">
              {{ q }}
            </button>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="chat-input-section">
        <div class="input-wrapper">
          <input 
            v-model="userQuestion" 
            @keyup.enter="askQuestion(userQuestion)"
            type="text"
            placeholder="Ask about temperature, rain, wind, etc..."
            class="chat-input"
          />
          <button @click="askQuestion(userQuestion)" class="send-btn" :disabled="!userQuestion.trim()">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>

      <!-- Floating Toggle Button -->
      <button v-if="!isExpanded" class="float-btn" @click="toggleChat">
        <i class="fas fa-robot"></i>
        <span class="unread-count" v-if="unreadMessages > 0">{{ unreadMessages }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { personalizationService } from '@/chatbot/services/personalizationService';
import { themeService } from '@/chatbot/services/themeService';

export default {
  name: 'WeatherAIChat',
  data() {
    return {
      isExpanded: true,
      userQuestion: '',
      messages: [],
      autoInsights: [],
      recommendations: [],
      quickQuestions: [
        'ðŸŒ¡ï¸ What\'s the current temperature?',
        'â˜” Will it rain today?',
        'ðŸ’¨ What\'s the wind speed?',
        'ðŸ’§ What\'s the humidity level?',
        'â˜€ï¸ What\'s the UV index?',
        'ðŸŒ… Sunrise & sunset times?'
      ],
      unreadMessages: 0,
      currentTheme: 'light',
      userName: 'Friend'
    };
  },
  computed: {
    ...mapState(['weather', 'forecast', 'airQuality']),
    themeStyles() {
      const theme = themeService.getCurrentTheme();
      return {
        '--theme-primary': theme.primary,
        '--theme-secondary': theme.secondary,
        '--theme-background': theme.background,
        '--theme-text': theme.text,
        '--theme-border': theme.border,
        '--theme-hover': theme.hover,
        '--theme-accent': theme.accent
      };
    }
  },
  methods: {
    toggleChat() {
      this.isExpanded = !this.isExpanded;
      if (this.isExpanded) {
        this.unreadMessages = 0;
      }
    },

    askQuestion(question) {
      if (!question.trim()) return;

      // Track interaction
      personalizationService.trackInteraction(question);

      // Add user message
      this.messages.push({
        type: 'user',
        text: question
      });

      this.userQuestion = '';

      // Generate response with delay
      setTimeout(() => {
        this.generateSmartResponse(question);
      }, 600);
    },

    generateSmartResponse(input) {
      const question = input.toLowerCase();
      let response = '';

      // Temperature & Feels-like
      if (question.includes('temperature') || question.includes('temp') || question.includes('warm') || question.includes('cold')) {
        response = `ðŸŒ¡ï¸ **Temperature Analysis**\n`;
        if (this.weather?.main?.temp) {
          const tempSymbol = personalizationService.getTemperatureSymbol();
          const currentTemp = personalizationService.convertTemperature(this.weather.main.temp);
          const feelsLike = personalizationService.convertTemperature(this.weather.main.feels_like);
          const maxTemp = personalizationService.convertTemperature(this.weather.main.temp_max);
          const minTemp = personalizationService.convertTemperature(this.weather.main.temp_min);
          
          response += `Current: ${currentTemp}${tempSymbol}\n`;
          response += `Feels like: ${feelsLike}${tempSymbol}\n`;
          response += `Max: ${maxTemp}${tempSymbol} | Min: ${minTemp}${tempSymbol}`;
          this.generateTemperatureInsights();
        } else {
          response += `Search for a location first to see temperature data!`;
        }
      }
      // Rain & Precipitation
      else if (question.includes('rain') || question.includes('precipitation') || question.includes('wet')) {
        response = `â˜” **Rain & Precipitation**\n`;
        if (this.weather?.clouds?.all !== undefined) {
          response += `Cloud coverage: ${this.weather.clouds.all}%\n`;
          response += `Precipitation chance: ${this.weather.clouds.all > 70 ? 'High' : this.weather.clouds.all > 40 ? 'Moderate' : 'Low'}`;
        } else {
          response += `Search for a location to see precipitation data!`;
        }
      }
      // Wind Speeds & Direction
      else if (question.includes('wind') || question.includes('speed') || question.includes('breeze')) {
        response = `ðŸ’¨ **Wind Analysis**\n`;
        if (this.weather?.wind?.speed) {
          const windSymbol = personalizationService.getWindSpeedSymbol();
          const windSpeed = personalizationService.convertWindSpeed(this.weather.wind.speed);
          const gust = personalizationService.convertWindSpeed(this.weather.wind.gust || this.weather.wind.speed);
          
          response += `Speed: ${windSpeed} ${windSymbol}\n`;
          response += `Direction: ${this.getWindDirection(this.weather.wind.deg)}\n`;
          response += `Gust: ${gust} ${windSymbol}`;
        } else {
          response += `Search for a location to see wind data!`;
        }
      }
      // Humidity
      else if (question.includes('humidity') || question.includes('humid') || question.includes('moisture')) {
        response = `ðŸ’§ **Humidity Levels**\n`;
        if (this.weather?.main?.humidity) {
          const humidity = this.weather.main.humidity;
          response += `Current: ${humidity}%\n`;
          response += `Status: ${humidity > 70 ? 'ðŸ”´ High (uncomfortable)' : humidity > 50 ? 'ðŸŸ¡ Moderate' : 'ðŸŸ¢ Low (comfortable)'}`;
        } else {
          response += `Search for a location to see humidity data!`;
        }
      }
      // Air Quality
      else if (question.includes('air quality') || question.includes('pollution') || question.includes('aqi')) {
        response = `ðŸ’¨ **Air Quality Information**\n`;
        if (this.airQuality?.list?.[0]?.main?.aqi) {
          const aqiLevel = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'][this.airQuality.list[0].main.aqi - 1];
          response += `AQI Level: ${aqiLevel}\n`;
          response += `Recommendation: ${this.getAQIRecommendation(this.airQuality.list[0].main.aqi)}`;
        } else {
          response += `Air quality data not available for this location`;
        }
      }
      // Sunrise & Sunset
      else if (question.includes('sunrise') || question.includes('sunset') || question.includes('sun time')) {
        response = `ðŸŒ… **Sunrise & Sunset Times**\n`;
        if (this.weather?.sys?.sunrise && this.weather?.sys?.sunset) {
          const sunrise = new Date(this.weather.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
          const sunset = new Date(this.weather.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
          response += `Sunrise: ${sunrise}\n`;
          response += `Sunset: ${sunset}`;
        } else {
          response += `Search for a location to see sunrise/sunset times!`;
        }
      }
      // 5-Day Forecast
      else if (question.includes('5-day') || question.includes('forecast') || question.includes('next 5')) {
        response = `ðŸ“… **5-Day Forecast**\n`;
        response += `View the 5-Day Forecast section on the homepage for detailed daily predictions including temperatures, precipitation, and wind speeds.`;
      }
      // Pressure & Visibility
      else if (question.includes('pressure') || question.includes('visibility') || question.includes('atmospheric')) {
        response = `ðŸ” **Pressure & Visibility**\n`;
        if (this.weather?.main?.pressure && this.weather?.visibility) {
          response += `Pressure: ${this.weather.main.pressure} hPa\n`;
          response += `Visibility: ${(this.weather.visibility / 1000).toFixed(1)} km`;
        } else {
          response += `Search for a location to see pressure and visibility data!`;
        }
      }
      // Cloud Coverage
      else if (question.includes('cloud') || question.includes('cloudy') || question.includes('overcast')) {
        response = `â˜ï¸ **Cloud Coverage**\n`;
        if (this.weather?.clouds?.all !== undefined) {
          const coverage = this.weather.clouds.all;
          response += `Coverage: ${coverage}%\n`;
          response += `Condition: ${coverage > 80 ? 'ðŸŒ§ï¸ Mostly cloudy' : coverage > 50 ? 'â›… Partly cloudy' : 'â˜€ï¸ Mostly clear'}`;
        } else {
          response += `Search for a location to see cloud data!`;
        }
      }
      // Weather Conditions
      else if (question.includes('weather') || question.includes('condition') || question.includes('how is')) {
        response = `ðŸŒ¤ï¸ **Weather Conditions**\n`;
        if (this.weather?.weather?.[0]) {
          const tempSymbol = personalizationService.getTemperatureSymbol();
          const temp = personalizationService.convertTemperature(this.weather.main.temp);
          response += `Status: ${this.weather.weather[0].main}\n`;
          response += `Description: ${this.weather.weather[0].description}\n`;
          response += `Temperature: ${temp}${tempSymbol}`;
        } else {
          response += `Search for a location to get current weather!`;
        }
      }
      // General Help
      else if (question.includes('help') || question.includes('what can') || question.includes('features')) {
        response = `ðŸ†˜ **I can answer questions about:**\n\n`;
        response += `ðŸŒ¡ï¸ Temperature & feels-like\n`;
        response += `â˜” Rain & precipitation\n`;
        response += `ðŸ’¨ Wind speeds & direction\n`;
        response += `ðŸ’§ Humidity levels\n`;
        response += `ðŸ’¨ Air quality\n`;
        response += `ðŸŒ… Sunrise/Sunset times\n`;
        response += `ðŸ“… 5-day forecast\n`;
        response += `ðŸ” Pressure & visibility\n`;
        response += `â˜ï¸ Cloud coverage\n`;
        response += `ðŸŒ¤ï¸ Weather conditions\n\nJust ask about any of these!`;
      }
      // Default
      else {
        response = `ðŸ’¡ I can help with temperature, rain, wind, humidity, air quality, sunrise/sunset, forecasts, pressure, clouds, and weather conditions. What would you like to know?`;
      }

      // Add bot response
      this.messages.push({
        type: 'bot',
        text: response
      });

      // Auto-scroll
      this.$nextTick(() => {
        const chatBody = document.querySelector('.chat-body');
        if (chatBody) {
          chatBody.scrollTop = chatBody.scrollHeight;
        }
      });
    },

    generateTemperatureInsights() {
      this.autoInsights = [];
      if (this.weather?.main?.temp) {
        const temp = this.weather.main.temp;
        if (temp > 30) {
          this.autoInsights.push('âš ï¸ High temperature - Stay hydrated!');
        } else if (temp < 0) {
          this.autoInsights.push('â„ï¸ Below freezing - Dress warmly!');
        } else if (temp > 20) {
          this.autoInsights.push('âœ… Pleasant temperature - Great day outside!');
        }

        if (this.weather.main.humidity > 70) {
          this.autoInsights.push('ðŸ’§ High humidity - May feel warmer than actual temperature');
        }
      }
    },

    generateRecommendations() {
      this.recommendations = [];
      
      if (!this.weather) return;

      const temp = this.weather.main?.temp || 0;
      const humidity = this.weather.main?.humidity || 0;
      const windSpeed = this.weather.wind?.speed || 0;

      // Clothing suggestions
      if (temp > 25) {
        this.recommendations.push('ðŸ‘• Wear light, breathable clothing');
      } else if (temp < 10) {
        this.recommendations.push('ðŸ§¥ Wear a warm jacket and layers');
      } else {
        this.recommendations.push('ðŸ‘” Wear comfortable, moderate clothing');
      }

      // Activity recommendations
      if (this.weather.clouds.all < 30 && windSpeed < 15) {
        this.recommendations.push('ðŸš´ Great day for outdoor activities!');
      } else if (this.weather.clouds.all > 70) {
        this.recommendations.push('ðŸ“š Better day for indoor activities');
      }

      // Health tips
      if (humidity > 70) {
        this.recommendations.push('ðŸ’§ Stay hydrated - high humidity level');
      }
      if (windSpeed > 20) {
        this.recommendations.push('ðŸŒ¬ï¸ Windy conditions - secure loose items');
      }
    },

    getWindDirection(degrees) {
      const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
      const index = Math.round(degrees / 22.5) % 16;
      return directions[index];
    },

    getAQIRecommendation(aqi) {
      const recommendations = [
        'Air quality is Good - Enjoy outdoor activities!',
        'Air quality is Fair - Suitable for most activities',
        'Moderate - Sensitive groups should limit outdoor exposure',
        'Poor - Everyone should reduce prolonged outdoor exposure',
        'Very Poor - Avoid outdoor activities'
      ];
      return recommendations[aqi - 1] || 'Data not available';
    },

    setTheme(themeName) {
      themeService.setTheme(themeName);
      this.currentTheme = themeName;
    },

    setUserName(name) {
      personalizationService.setUserName(name);
      this.userName = name;
    }
  },
  mounted() {
    // Initialize with personalization
    this.userName = personalizationService.userData.name;
    this.currentTheme = themeService.currentTheme;

    // Set initial greeting
    const greeting = personalizationService.getPersonalizedGreeting();
    this.messages = [
      { 
        type: 'bot', 
        text: `${greeting} ðŸ‘‹ I'm your Smart Weather AI Assistant. Ask me about temperature, rain, wind, humidity, air quality, sunrise/sunset, forecasts, and more!` 
      }
    ];

    this.generateRecommendations();
    themeService.applyTheme(this.currentTheme);
  },
  watch: {
    weather() {
      this.generateRecommendations();
    }
  }
};
</script>

<style scoped>
:root {
  --theme-primary: #667eea;
  --theme-secondary: #764ba2;
  --theme-background: #ffffff;
  --theme-text: #333333;
  --theme-border: #e0e0e0;
  --theme-hover: #f5f5f5;
  --theme-accent: #ffc107;
}

/* Container */
.ai-chat-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  width: 420px;
  max-width: 90vw;
}

/* Main Card */
.ai-chat-card {
  background: var(--theme-background);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 700px;
  max-height: 90vh;
}

/* ===== HEADER ===== */
.chat-header {
  background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-secondary) 100%);
  padding: 16px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 32px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.header-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.header-info p {
  margin: 2px 0 0 0;
  font-size: 11px;
  opacity: 0.9;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* ===== CHAT BODY ===== */
.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: var(--theme-hover);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 8px;
}

/* Messages */
.message {
  display: flex;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  justify-content: flex-end;
}

.message-text {
  background: var(--theme-background);
  padding: 12px 14px;
  border-radius: 10px;
  max-width: 82%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  font-size: 13px;
  color: var(--theme-text);
  word-wrap: break-word;
  white-space: pre-wrap;
  line-height: 1.4;
  margin: 0;
}

.message.user .message-text {
  background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-secondary) 100%);
  color: white;
}

/* ===== INSIGHTS SECTION ===== */
.insights-section,
.recommendations-section {
  background: var(--theme-background);
  padding: 12px;
  border-radius: 10px;
  border-left: 3px solid var(--theme-primary);
}

.section-title {
  margin: 0 0 10px 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--theme-primary);
  text-transform: uppercase;
}

.insights-list,
.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.insight-item,
.recommendation-item {
  font-size: 12px;
  color: var(--theme-text);
  line-height: 1.3;
  padding: 6px 0;
  border-bottom: 1px solid var(--theme-border);
}

.insight-item:last-child,
.recommendation-item:last-child {
  border-bottom: none;
}

/* ===== QUICK SUGGESTIONS ===== */
.quick-suggestions {
  background: var(--theme-background);
  padding: 12px;
  border-radius: 10px;
}

.suggestions-label {
  margin: 0 0 10px 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--theme-text);
}

.suggestion-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.suggestion-btn {
  background: var(--theme-hover);
  border: 1px solid var(--theme-border);
  color: var(--theme-text);
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
  text-align: left;
  font-weight: 500;
  font-family: inherit;
}

.suggestion-btn:hover {
  background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary));
  color: white;
  border-color: var(--theme-primary);
  transform: translateX(4px);
}

/* ===== INPUT AREA ===== */
.chat-input-section {
  padding: 14px 16px;
  background: var(--theme-background);
  border-top: 1px solid var(--theme-border);
}

.input-wrapper {
  display: flex;
  gap: 10px;
  align-items: center;
}

.chat-input {
  flex: 1;
  border: 1px solid var(--theme-border);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 12px;
  font-family: inherit;
  background: var(--theme-hover);
  color: var(--theme-text);
  transition: all 0.2s;
}

.chat-input:focus {
  outline: none;
  background: var(--theme-background);
  border-color: var(--theme-primary);
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.send-btn {
  background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary));
  color: white;
  border: none;
  border-radius: 8px;
  width: 38px;
  height: 38px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== FLOATING BUTTON ===== */
.float-btn {
  background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-secondary) 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  font-size: 28px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.35);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.float-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 28px rgba(102, 126, 234, 0.4);
}

.unread-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 11px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

/* ===== SCROLLBAR ===== */
.chat-body::-webkit-scrollbar {
  width: 5px;
}

.chat-body::-webkit-scrollbar-track {
  background: transparent;
}

.chat-body::-webkit-scrollbar-thumb {
  background: var(--theme-border);
  border-radius: 4px;
}

.chat-body::-webkit-scrollbar-thumb:hover {
  background: var(--theme-primary);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .ai-chat-container {
    width: 93%;
    bottom: 12px;
    right: 3.5%;
  }

  .ai-chat-card {
    height: 600px;
  }

  .message-text {
    max-width: 85%;
  }

  .suggestion-btn {
    font-size: 11px;
    padding: 8px 10px;
  }

  .float-btn {
    width: 58px;
    height: 58px;
    font-size: 26px;
  }
}
</style>

