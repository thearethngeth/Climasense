<template>
  <div class="weather-dashboard">
    <!-- Top section with search and location info -->
    <header class="dashboard-header">
      <div class="header-top">
        <WeatherSearch />
        <div class="units-toggle">
          <button 
            class="unit-btn" 
            :class="{ active: units === 'metric' }"
            @click="switchUnits('metric')"
          >°C</button>
          <button 
            class="unit-btn" 
            :class="{ active: units === 'imperial' }"
            @click="switchUnits('imperial')"
          >°F</button>
        </div>
      </div>
      <div class="location-info" v-if="currentLocation">
        <h1><i class="fas fa-map-marker-alt location-icon"></i> {{ currentLocation }}</h1>
        <p class="last-updated">Last updated: {{ lastUpdated }}</p>
      </div>
    </header>
    
    <!-- Weather alerts banner (only shows if there are alerts) -->
    <div class="alerts-banner" v-if="hasAlerts" @click="toggleAlertsModal">
      <div class="alert-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <div class="alert-message">
        <p>{{ alertsCount }} active weather {{ alertsCount === 1 ? 'alert' : 'alerts' }} for this location</p>
      </div>
      <div class="alert-action">
        <span>View Details</span>
        <i class="fas fa-chevron-right"></i>
      </div>
    </div>
    
    <!-- Main content area with animated transitions -->
    <main class="dashboard-content" data-aos="fade-up">
      <!-- Hero section with current weather -->
      <div class="weather-hero">
        <CurrentWeather />
      </div>
      
      <!-- Weather cards grid -->
      <div class="weather-grid">
        <!-- Air Quality Card -->
        <div class="weather-card" data-aos="fade-up" data-aos-delay="100">
          <div class="card-header">
            <h2><i class="fas fa-wind me-2"></i>Air Quality</h2>
          </div>
          <AirQuality />
        </div>
        
        <!-- UV Index Card -->
        <div class="weather-card" data-aos="fade-up" data-aos-delay="150">
          <div class="card-header">
            <h2><i class="fas fa-sun me-2"></i>UV Index</h2>
          </div>
          <UVIndex />
        </div>
        
        <!-- Sunrise/Sunset Card -->
        <div class="weather-card" data-aos="fade-up" data-aos-delay="200">
          <div class="card-header">
            <h2><i class="fas fa-sun me-2"></i>Sunrise & Sunset</h2>
          </div>
          <SunriseSunset />
        </div>
        
        <!-- Weather Map Card -->
        <div id="weather-map-section" class="weather-card full-width" data-aos="fade-up" data-aos-delay="250">
          <div class="card-header">
            <h2><i class="fas fa-map-marked-alt me-2"></i>Weather Map</h2>
          </div>
          <WeatherMap />
        </div>
        
        <!-- Hourly Forecast Card -->
        <div id="hourly-forecast-section" class="weather-card full-width" data-aos="fade-up" data-aos-delay="300">
          <div class="card-header">
            <h2><i class="fas fa-clock me-2"></i>Hourly Forecast</h2>
            <button class="toggle-view-btn"><i class="fas fa-chart-line"></i></button>
          </div>
          <HourlyForecast />
        </div>
        
        <!-- 5-Day Forecast Card -->
        <div id="five-day-forecast-section" class="weather-card full-width" data-aos="fade-up" data-aos-delay="400">
          <div class="card-header">
            <h2><i class="fas fa-calendar-week me-2"></i>5-Day Forecast</h2>
          </div>
          <FiveDayForecast />
        </div>
        
        <!-- Weather Highlights Card -->
        <div class="weather-card full-width" data-aos="fade-up" data-aos-delay="500">
          <div class="card-header">
            <h2><i class="fas fa-star me-2"></i>Weather Highlights</h2>
          </div>
          <WeatherHighlights />
        </div>
      </div>
    </main>
    
    <!-- Bottom Navigation Bar -->
    <nav class="bottom-navbar">
      <button class="bottom-nav-item" @click="scrollToSection('weather-map-section')" title="Weather Map">
        <i class="fas fa-map-marked-alt"></i>
        <span>Map</span>
      </button>
      <button class="bottom-nav-item" @click="scrollToSection('hourly-forecast-section')" title="Hourly Forecast">
        <i class="fas fa-clock"></i>
        <span>Hourly</span>
      </button>
      <button class="bottom-nav-item" @click="scrollToSection('five-day-forecast-section')" title="5-Day Forecast">
        <i class="fas fa-calendar-week"></i>
        <span>5-Day</span>
      </button>
      <button class="bottom-nav-item" @click="scrollToTop" title="Scroll to Top">
        <i class="fas fa-arrow-up"></i>
        <span>Top</span>
      </button>
    </nav>
    
    <!-- Footer area with attribution and theme toggle -->
    <footer class="dashboard-footer">
      <div class="footer-content">
        <p>© 2025 WeatherApp - Powered by <a href="https://openweathermap.org/" target="_blank" rel="noopener">OpenWeatherMap</a></p>
        <button class="theme-toggle" @click="toggleTheme">
          <i :class="isDarkTheme ? 'fas fa-sun' : 'fas fa-moon'"></i>
        </button>
      </div>
    </footer>
    
    <!-- Weather alerts modal -->
    <div class="modal-overlay" v-if="showAlertsModal" @click="toggleAlertsModal"></div>
    <div class="alerts-modal" v-if="showAlertsModal">
      <div class="modal-header">
        <h3>Weather Alerts</h3>
        <button class="close-btn" @click="toggleAlertsModal">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <WeatherAlerts />
      </div>
    </div>
  </div>
</template>

<script>
import WeatherSearch from '@/components/WeatherSearch.vue'
import CurrentWeather from '@/components/CurrentWeather.vue'
import FiveDayForecast from '@/components/FiveDayForecast.vue'
import AirQuality from '@/components/AirQuality.vue'
import SunriseSunset from '@/components/SunriseSunset.vue'
import WeatherHighlights from '@/components/WeatherHighlights.vue'
import HourlyForecast from '@/components/HourlyForecast.vue'
import UVIndex from '@/components/UVIndex.vue'
import WeatherMap from '@/components/WeatherMap.vue'
import WeatherAlerts from '@/components/WeatherAlerts.vue'
import { onMounted, ref, computed } from 'vue'
import { useStore } from 'vuex'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default {
  name: 'HomeView',
  components: {
    WeatherSearch,
    CurrentWeather,
    FiveDayForecast,
    AirQuality,
    SunriseSunset,
    WeatherHighlights,
    HourlyForecast,
    UVIndex,
    WeatherMap,
    WeatherAlerts
  },
  setup() {
    const store = useStore()
    const showAlertsModal = ref(false)
    const isDarkTheme = ref(false)
    
    // Get current location from store
    const currentLocation = computed(() => {
      return store.getters.currentLocation
    })
    
    // Get last updated time from store
    const lastUpdated = computed(() => {
      return store.getters.lastUpdatedFormatted || new Date().toLocaleString()
    })
    
    // Get current units
    const units = computed(() => {
      return store.state.units
    })
    
    // Get weather alerts
    const hasAlerts = computed(() => {
      return store.getters.hasAlerts
    })
    
    const alertsCount = computed(() => {
      return store.state.weatherAlerts?.length || 0
    })
    
    // Toggle theme between light and dark
    const toggleTheme = () => {
      isDarkTheme.value = !isDarkTheme.value
      document.body.classList.toggle('dark-theme', isDarkTheme.value)
      localStorage.setItem('darkTheme', isDarkTheme.value)
    }
    
    // Toggle alerts modal
    const toggleAlertsModal = () => {
      showAlertsModal.value = !showAlertsModal.value
      
      // Add/remove body scroll lock
      if (showAlertsModal.value) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
    
    // Switch between metric and imperial units
    const switchUnits = (newUnits) => {
      if (newUnits !== store.state.units) {
        store.dispatch('changeUnits', newUnits)
      }
    }
    
    // Scroll to specific section
    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        const offset = 100 // Offset for navbar
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - offset
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }
    
    // Scroll to top of page
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
    
    // Try to get user's location on mount
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            store.dispatch('fetchWeatherByCoords', {
              lat: latitude,
              lon: longitude
            })
          },
          (error) => {
            console.error('Geolocation error:', error)
            // Fall back to default location (New York)
            store.dispatch('fetchWeatherByCity', 'New York')
          }
        )
      } else {
        // Geolocation not supported
        store.dispatch('fetchWeatherByCity', 'New York')
      }
    }
    
    onMounted(() => {
      // Initialize animations
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
      })
      
      // Check saved theme preference
      const savedTheme = localStorage.getItem('darkTheme') === 'true'
      if (savedTheme) {
        isDarkTheme.value = true
        document.body.classList.add('dark-theme')
      }
      
      // Get initial weather data
      getUserLocation()
    })
    
    return {
      currentLocation,
      lastUpdated,
      isDarkTheme,
      toggleTheme,
      hasAlerts,
      alertsCount,
      showAlertsModal,
      toggleAlertsModal,
      units,
      switchUnits,
      scrollToSection,
      scrollToTop
    }
  }
}
</script>

<style lang="scss">
.weather-dashboard {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg-gradient);
  position: relative;
  overflow-x: hidden;
  color: var(--text-primary);
  transition: all 0.3s ease;
  
  // Header styles
  .dashboard-header {
    padding: 1.75rem 2.5rem;
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    position: sticky;
    top: 0;
    z-index: 100;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%);
    backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    border-radius: 0 0 1.5rem 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
    
    @media (max-width: 1024px) {
      padding: 1.5rem 2rem;
    }
    
    @media (max-width: 768px) {
      padding: 1.25rem 1.5rem;
      border-radius: 0 0 1rem 1rem;
    }
    
    @media (max-width: 480px) {
      padding: 0.4rem 0.3rem;
      border-radius: 0 0 0.4rem 0.4rem;
    }
    
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      
      @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
      }
    }
    
    .units-toggle {
      display: flex;
      border-radius: 1.5rem;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.5);
      border: 2px solid rgba(99, 102, 241, 0.2);
      height: 48px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      
      @media (max-width: 480px) {
        height: 28px;
        border-radius: 0.6rem;
      }
      
      .unit-btn {
        width: 52px;
        border: none;
        background: transparent;
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 700;
        font-size: 1.1rem;
        
        @media (max-width: 480px) {
          width: 32px;
          font-size: 0.7rem;
        }
        
        &.active {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
          transform: scale(1.05);
        }
        
        &:hover:not(.active) {
          background: rgba(99, 102, 241, 0.1);
          transform: translateY(-2px);
        }
      }
    }
    
    .location-info {
      margin-top: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
      
      h1 {
        font-size: 2rem;
        font-weight: 800;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0;
        letter-spacing: -0.5px;
        
        @media (max-width: 1024px) {
          font-size: 1.75rem;
        }
        
        @media (max-width: 768px) {
          font-size: 1.5rem;
        }
        
        @media (max-width: 480px) {
          font-size: 0.9rem;
          letter-spacing: 0;
        }
        
        .location-icon {
          color: #6366f1;
          animation: pulse 2s infinite;
          filter: drop-shadow(0 2px 6px rgba(99, 102, 241, 0.4));
        }
      }
      
      .last-updated {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin: 0;
        
        @media (max-width: 480px) {
          font-size: 0.6rem;
        }
      }
    }
  }
  
  // Alerts banner
  .alerts-banner {
    display: flex;
    align-items: center;
    background: rgba(244, 67, 54, 0.1);
    color: #f44336;
    padding: 0.75rem 2rem;
    margin: 0.5rem 2rem;
    border-radius: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    max-width: 1600px;
    margin-left: auto;
    margin-right: auto;
    
    @media (max-width: 1024px) {
      padding: 0.625rem 1.5rem;
      margin: 0.5rem 1.5rem;
    }
    
    @media (max-width: 768px) {
      padding: 0.625rem 1rem;
      margin: 0.5rem 1rem;
      font-size: 0.9rem;
    }
    
    @media (max-width: 480px) {
      padding: 0.25rem 0.3rem;
      margin: 0.2rem 0.3rem;
      font-size: 0.65rem;
      border-radius: 0.4rem;
    }
    
    &:hover {
      background: rgba(244, 67, 54, 0.15);
      transform: translateY(-2px);
    }
    
    .alert-icon {
      font-size: 1.5rem;
      margin-right: 1rem;
      animation: pulse 1.5s infinite;
    }
    
    .alert-message {
      flex: 1;
      
      p {
        margin: 0;
        font-weight: 600;
      }
    }
    
    .alert-action {
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      font-weight: 500;
      
      i {
        margin-left: 0.5rem;
      }
    }
  }
  
  // Main content area
  .dashboard-content {
    flex: 1;
    width: 100%;
    max-width: 100%;
    margin: 1.5rem auto 2.5rem;
    padding: 0 2.5rem;
    
    @media (max-width: 1024px) {
      padding: 0 1.5rem;
      margin: 0.75rem auto 1.5rem;
    }
    
    @media (max-width: 768px) {
      padding: 0 1rem;
      margin: 0.5rem auto 1rem;
    }
    
    @media (max-width: 480px) {
      padding: 0 0.25rem;
      margin: 0.15rem auto 0.4rem;
    }
    
    .weather-hero {
      margin-bottom: 2rem;
      border-radius: 1.5rem;
      overflow: hidden;
      box-shadow: var(--card-shadow);
      
      @media (max-width: 1024px) {
        margin-bottom: 1.5rem;
        border-radius: 1.25rem;
      }
      
      @media (max-width: 768px) {
        margin-bottom: 1.25rem;
        border-radius: 1rem;
      }
      
      @media (max-width: 480px) {
        margin-bottom: 0.4rem;
        border-radius: 0.5rem;
      }
    }
    
    .weather-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      
      @media (max-width: 1400px) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.25rem;
      }
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      @media (max-width: 480px) {
        gap: 0.3rem;
      }
      
      .weather-card {
        background: linear-gradient(135deg, var(--card-bg) 0%, rgba(255, 255, 255, 0.8) 100%);
        backdrop-filter: blur(10px);
        border-radius: 1.5rem;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.3);
        transition: all 0.3s ease;
        
        @media (max-width: 480px) {
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }
        
        &:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 16px 48px rgba(99, 102, 241, 0.15);
          border-color: rgba(99, 102, 241, 0.2);
        }
        
        @media (max-width: 1024px) {
          border-radius: 1.25rem;
          
          &:hover {
            transform: translateY(-5px);
          }
        }
        
        @media (max-width: 768px) {
          border-radius: 1rem;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
          
          &:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(99, 102, 241, 0.12);
          }
        }
        
        &.full-width {
          grid-column: 1 / -1;
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.75rem;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
          border-bottom: 2px solid rgba(99, 102, 241, 0.1);
          
          @media (max-width: 1024px) {
            padding: 1.125rem 1.5rem;
          }
          
          @media (max-width: 768px) {
            padding: 1rem 1.25rem;
          }
          
          @media (max-width: 480px) {
            padding: 0.4rem 0.5rem;
          }
          
          h2 {
            font-size: 1.3rem;
            font-weight: 700;
            margin: 0;
            display: flex;
            align-items: center;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            
            @media (max-width: 768px) {
              font-size: 1.1rem;
            }
            
            @media (max-width: 480px) {
              font-size: 0.85rem;
            }
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            
            @media (max-width: 1024px) {
              font-size: 1.2rem;
            }
            
            @media (max-width: 768px) {
              font-size: 1.1rem;
            }
            
            @media (max-width: 480px) {
              font-size: 0.85rem;
            }
            
            i {
              color: #6366f1;
              margin-right: 0.75rem;
              font-size: 1.4rem;
              filter: drop-shadow(0 2px 4px rgba(99, 102, 241, 0.3));
              
              @media (max-width: 768px) {
                font-size: 1.2rem;
                margin-right: 0.5rem;
              }
              
              @media (max-width: 480px) {
                font-size: 0.8rem;
                margin-right: 0.25rem;
              }
            }
          }
          
          .toggle-view-btn {
            background: transparent;
            border: none;
            color: var(--accent-color);
            font-size: 1rem;
            cursor: pointer;
            padding: 0.3rem;
            border-radius: 0.3rem;
            transition: background 0.2s ease;
            
            &:hover {
              background: var(--btn-hover-bg);
            }
          }
        }
      }
    }
  }
  
  // Footer
  .dashboard-footer {
    padding: 1rem 2rem;
    background: var(--footer-bg);
    border-top: 1px solid var(--border-color);
    backdrop-filter: blur(8px);
    position: relative;
    
    .footer-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1600px;
      margin: 0 auto;
      
      p {
        margin: 0;
        color: var(--text-secondary);
        font-size: 0.9rem;
      }
      
      a {
        color: var(--accent-color);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s ease;
        
        &:hover {
          text-decoration: underline;
        }
      }
      
      .theme-toggle {
        background: transparent;
        color: var(--accent-color);
        border: 1px solid var(--border-color);
        border-radius: 50%;
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          background: var(--btn-hover-bg);
          transform: rotate(15deg);
        }
        
        i {
          font-size: 1.1rem;
        }
      }
    }
  }
  
  // Weather Alerts Modal
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    z-index: 1000;
  }
  
  .alerts-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    background: var(--card-bg);
    border-radius: 1rem;
    z-index: 1001;
    box-shadow: var(--card-shadow-hover);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border-color);
      
      h3 {
        margin: 0;
        font-size: 1.3rem;
        color: var(--text-primary);
      }
      
      .close-btn {
        background: transparent;
        border: none;
        color: var(--text-secondary);
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0.3rem;
        border-radius: 50%;
        line-height: 1;
        transition: all 0.2s ease;
        
        &:hover {
          background: var(--btn-hover-bg);
          color: var(--accent-color);
        }
      }
    }
    
    .modal-body {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
    }
  }
}

// Animations
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

// Create CSS variables to make theme toggling easier
:root {
  --bg-gradient: linear-gradient(135deg, #f0f9ff, #e0f2fe, #dbeafe);
  --header-bg: rgba(240, 249, 255, 0.85);
  --card-bg: rgba(255, 255, 255, 0.9);
  --footer-bg: rgba(255, 255, 255, 0.7);
  --text-primary: #334155;
  --text-secondary: #64748b;
  --accent-color: #6366f1;
  --border-color: rgba(203, 213, 225, 0.5);
  --card-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  --card-shadow-hover: 0 10px 25px rgba(0, 0, 0, 0.1);
  --btn-hover-bg: rgba(99, 102, 241, 0.1);
}

// Light theme overrides for better daytime visibility
body:not(.dark-theme) {
  --bg-gradient: linear-gradient(135deg, #e0f2fe 0%, #fef3c7 50%, #fce7f3 100%);
  --header-bg: rgba(255, 255, 255, 0.95);
  --card-bg: rgba(255, 255, 255, 0.95);
  --text-primary: #1e293b;
  --text-secondary: #475569;
  --accent-color: #6366f1;
  --border-color: rgba(203, 213, 225, 0.6);
  --card-shadow: 0 4px 20px rgba(99, 102, 241, 0.08);
  --card-shadow-hover: 0 10px 30px rgba(99, 102, 241, 0.15);
  
  .weather-card {
    background: rgba(255, 255, 255, 0.98) !important;
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.1) !important;
    border: 1px solid rgba(99, 102, 241, 0.1) !important;
  }
  
  .card-header {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(168, 85, 247, 0.08)) !important;
    border-bottom: 2px solid rgba(99, 102, 241, 0.15) !important;
    
    h2 {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
  
  .dashboard-header {
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.1);
  }
  
  .location-info h1 {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .units-toggle {
    background: rgba(255, 255, 255, 0.95);
    border: 2px solid rgba(99, 102, 241, 0.2);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
    
    .unit-btn {
      color: #475569;
      font-weight: 600;
      
      &.active {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
      }
      
      &:hover:not(.active) {
        background: rgba(99, 102, 241, 0.1);
        color: #6366f1;
      }
    }
  }
  
  .alerts-banner {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.12));
    border: 2px solid rgba(239, 68, 68, 0.3);
    
    .alert-icon {
      color: #dc2626;
    }
    
    .alert-message p {
      color: #991b1b;
    }
  }
}

// Dark theme variables
body.dark-theme {
  --bg-gradient: linear-gradient(135deg, #0f172a, #1e293b, #334155);
  --header-bg: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%);
  --card-bg: rgba(30, 41, 59, 0.85);
  --footer-bg: rgba(15, 23, 42, 0.7);
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --accent-color: #818cf8;
  --border-color: rgba(51, 65, 85, 0.5);
  --card-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  --card-shadow-hover: 0 16px 48px rgba(99, 102, 241, 0.2);
  --btn-hover-bg: rgba(129, 140, 248, 0.15);
  
  .weather-card {
    background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.8) 100%) !important;
    border-color: rgba(51, 65, 85, 0.4) !important;
  }
  
  .card-header {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%) !important;
    border-bottom-color: rgba(99, 102, 241, 0.2) !important;
    
    h2 {
      background: linear-gradient(135deg, #818cf8 0%, #a78bfa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    i {
      color: #818cf8 !important;
      filter: drop-shadow(0 2px 4px rgba(129, 140, 248, 0.4));
    }
  }
  
  .units-toggle {
    background: rgba(30, 41, 59, 0.7);
    border-color: rgba(99, 102, 241, 0.3);
  }
}

// Bottom Navigation Bar Styles
.bottom-navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 -4px 24px rgba(99, 102, 241, 0.15);
  border-top: 2px solid rgba(99, 102, 241, 0.2);
  z-index: 999;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 0.5rem 0.4rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.25rem 0.15rem;
  }
  
  .bottom-nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.625rem 1.25rem;
    background: transparent;
    border: none;
    color: #475569;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    border-radius: 12px;
    transition: all 0.3s ease;
    min-width: 70px;
    
    @media (max-width: 768px) {
      padding: 0.5rem 0.75rem;
      min-width: 60px;
      font-size: 0.8rem;
    }
    
    @media (max-width: 480px) {
      padding: 0.25rem 0.3rem;
      min-width: 42px;
      font-size: 0.6rem;
      gap: 0.08rem;
    }
    
    i {
      font-size: 1.25rem;
      transition: all 0.3s ease;
      
      @media (max-width: 768px) {
        font-size: 1.1rem;
      }
      
      @media (max-width: 480px) {
        font-size: 0.85rem;
      }
    }
    
    span {
      font-size: 0.75rem;
      
      @media (max-width: 480px) {
        font-size: 0.55rem;
      }
    }
    
    &:hover {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
      color: #6366f1;
      transform: translateY(-2px);
      
      i {
        transform: scale(1.15);
        color: #6366f1;
      }
    }
    
    &:active {
      transform: translateY(0);
    }
  }
}

// Dark theme for bottom navbar
body.dark-theme .bottom-navbar {
  background: rgba(30, 41, 59, 0.98);
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.5);
  border-top-color: rgba(99, 102, 241, 0.3);
  
  .bottom-nav-item {
    color: #94a3b8;
    
    &:hover {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15));
      color: #818cf8;
      
      i {
        color: #818cf8;
      }
    }
  }
}

// Add padding to dashboard content to prevent overlap with bottom nav
.weather-dashboard {
  padding-bottom: 80px;
  
  @media (max-width: 768px) {
    padding-bottom: 70px;
  }
  
  @media (max-width: 480px) {
    padding-bottom: 65px;
  }
}
</style>