<!-- src/components/WeatherSearch.vue -->
<template>
  <div class="weather-search mb-4" data-aos="fade-down">
    <div class="search-container">
      <h2 class="search-title">
        <i class="fas fa-cloud-sun me-2"></i>Weather Forecast
      </h2>
      <div class="search-box">
        <div class="search-input-group">
          <i class="fas fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            class="search-input"
            placeholder="Search for a city..."
            v-model="cityInput"
            @keyup.enter="searchCity"
            @focus="showSuggestions = true"
            @input="debouncedSearchSuggestions"
            autocomplete="off"
            :disabled="loading"
          />
          
          <!-- Search Suggestions -->
          <div v-if="showSuggestions && (suggestions.length > 0 || recentSearches.length > 0)" class="search-suggestions">
            <div v-if="suggestions.length > 0" class="suggestions-section">
              <h4 class="suggestions-title">Suggestions</h4>
              <ul class="suggestions-list">
                <li v-for="(suggestion, index) in suggestions" :key="`sugg-${index}`" @click="selectSuggestion(suggestion)">
                  <i class="fas fa-location-dot"></i>
                  <span>{{ suggestion.name }}, {{ suggestion.country }}</span>
                </li>
              </ul>
            </div>
            
            <div v-if="recentSearches.length > 0" class="suggestions-section">
              <h4 class="suggestions-title">Recent Searches</h4>
              <ul class="suggestions-list">
                <li v-for="(search, index) in recentSearches" :key="`recent-${index}`" @click="selectSuggestion(search)">
                  <i class="fas fa-history"></i>
                  <span>{{ search.name }}, {{ search.country }}</span>
                  <button class="btn-clear-history" @click.stop="removeFromHistory(index)">
                    <i class="fas fa-xmark"></i>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="search-buttons">
          <button
            class="search-button btn-search"
            @click="searchCity"
            :disabled="loading"
          >
            <i class="fas fa-search me-2"></i> Search
          </button>
          <button
            class="search-button btn-location"
            @click="getCurrentLocation"
            :disabled="loading"
          >
            <i class="fas fa-location-dot me-2"></i> Current Location
          </button>
        </div>
      </div>
      
      <!-- Popular Cities Quick Access -->
      <div class="popular-cities">
        <span class="popular-label">Popular:</span>
        <div class="popular-city-tags">
          <button 
            v-for="city in popularCities" 
            :key="city.name" 
            @click="quickSearch(city)"
            class="popular-city-tag"
          >
            {{ city.name }}
          </button>
        </div>
      </div>
      
      <div v-if="error" class="error-alert">
        <i class="fas fa-circle-exclamation me-2"></i>{{ error }}
      </div>
      
      <transition name="fade">
        <div v-if="loading" class="loading-indicator">
          <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
          </div>
          <span class="ms-2">Fetching weather data...</span>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "WeatherSearch",

  data() {
    return {
      cityInput: "",
      suggestions: [],
      showSuggestions: false,
      popularCities: [
        { name: "Phnom Penh", country: "KH" },
        { name: "Siem Reap", country: "KH" },
        { name: "Battambang", country: "KH" },
        { name: "Sihanoukville", country: "KH" },
        { name: "Kampot", country: "KH" }
      ],
      debounceTimer: null,
    };
  },

  computed: {
    loading() {
      return this.$store.state.loading;
    },
    error() {
      return this.$store.state.error;
    },
    recentSearches() {
      const storedSearches = localStorage.getItem('recentSearches');
      return storedSearches ? JSON.parse(storedSearches) : [];
    }
  },

  created() {
    // Initialize debounced search function
    this.debouncedSearchSuggestions = this.debounce(this.fetchSuggestions, 300);
    
    // Close suggestions on click outside
    document.addEventListener('click', this.handleClickOutside);
  },
  
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },

  methods: {
    debounce(func, wait) {
      return (...args) => {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          func.apply(this, args);
        }, wait);
      };
    },
    
    async searchCity() {
      if (!this.cityInput.trim()) return;

      try {
        await this.$store.dispatch("fetchWeatherByCity", this.cityInput.trim());
        // Only save to history if search was successful
        if (!this.$store.state.error) {
          this.saveToSearchHistory({
            name: this.cityInput.trim(),
            country: this.$store.state.weather?.sys?.country || ''
          });
        }
        this.cityInput = "";
        this.showSuggestions = false;
      } catch (error) {
        console.error("Search failed:", error);
      }
    },
    
    async fetchSuggestions() {
      if (!this.cityInput || this.cityInput.length < 2) {
        this.suggestions = [];
        return;
      }
      
      try {
        const API_KEY = process.env.VUE_APP_WEATHER_API_KEY;
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${this.cityInput}&limit=5&appid=${API_KEY}`
        );
        const data = await response.json();
        this.suggestions = data.map(city => ({
          name: city.name,
          country: city.country,
          lat: city.lat,
          lon: city.lon
        }));
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        this.suggestions = [];
      }
    },
    
    selectSuggestion(suggestion) {
      this.cityInput = suggestion.name;
      this.showSuggestions = false;
      
      if (suggestion.lat && suggestion.lon) {
        // If we have coordinates, use them directly
        this.$store.dispatch("fetchWeatherByCoords", { 
          lat: suggestion.lat, 
          lon: suggestion.lon 
        });
        this.saveToSearchHistory(suggestion);
      } else {
        // Otherwise search by city name
        this.searchCity();
      }
    },
    
    quickSearch(city) {
      this.cityInput = city.name;
      this.searchCity();
    },
    
    handleClickOutside(event) {
      const searchContainer = this.$el.querySelector('.search-input-group');
      if (searchContainer && !searchContainer.contains(event.target)) {
        this.showSuggestions = false;
      }
    },
    
    saveToSearchHistory(city) {
      let searches = this.recentSearches;
      
      // Remove duplicates
      searches = searches.filter(item => 
        item.name.toLowerCase() !== city.name.toLowerCase()
      );
      
      // Add to beginning of array
      searches.unshift(city);
      
      // Keep only the latest 5 searches
      if (searches.length > 5) {
        searches = searches.slice(0, 5);
      }
      
      localStorage.setItem('recentSearches', JSON.stringify(searches));
    },
    
    removeFromHistory(index) {
      let searches = this.recentSearches;
      searches.splice(index, 1);
      localStorage.setItem('recentSearches', JSON.stringify(searches));
    },

    async getCurrentLocation() {
      if (!navigator.geolocation) {
        this.$store.commit(
          "SET_ERROR",
          "Geolocation is not supported by your browser"
        );
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude: lat, longitude: lon } = position.coords;
          try {
            await this.$store.dispatch("fetchWeatherByCoords", { lat, lon });
            
            // Try to get city name from reverse geocoding
            if (this.$store.state.weather?.name) {
              this.saveToSearchHistory({
                name: this.$store.state.weather.name,
                country: this.$store.state.weather.sys?.country || '',
                lat,
                lon
              });
            }
          } catch (error) {
            console.error("Location fetch failed:", error);
          }
        },
        (error) => {
          this.$store.commit("SET_ERROR", "Unable to retrieve your location");
        }
      );
    },
  },
};
</script>

<style scoped>
.weather-search {
  max-width: 800px;
  margin: 0 auto;
}

.search-container {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 15px 30px rgba(124, 58, 237, 0.3);
  color: white;
  position: relative;
  overflow: visible;
}

.search-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.5px;
}

.search-box {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.search-input-group {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #a5a6f6;
  font-size: 1.2rem;
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 16px 16px 16px 45px;
  border-radius: 12px;
  border: none;
  font-size: 1.1rem;
  background-color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  color: #333;
  z-index: 1;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.4);
  background-color: white;
}

.search-input::placeholder {
  color: #9ca3af;
}

/* Search suggestions dropdown */
.search-suggestions {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  max-height: 300px;
  overflow-y: auto;
  z-index: 100;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.suggestions-section {
  padding: 10px 0;
}

.suggestions-section:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}

.suggestions-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 15px;
  margin: 5px 0;
}

.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestions-list li {
  padding: 10px 15px;
  display: flex;
  align-items: center;
  color: #333;
  cursor: pointer;
  position: relative;
}

.suggestions-list li:hover {
  background-color: #f9fafb;
}

.suggestions-list li i {
  color: #6366f1;
  margin-right: 10px;
  font-size: 0.9rem;
}

.btn-clear-history {
  position: absolute;
  right: 15px;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
}

.btn-clear-history:hover {
  color: #ef4444;
  background-color: #fee2e2;
}

/* Popular cities */
.popular-cities {
  display: flex;
  align-items: center;
  margin-top: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.popular-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.popular-city-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.popular-city-tag {
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 30px;
  padding: 5px 12px;
  font-size: 0.85rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.popular-city-tag:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.search-buttons {
  display: flex;
  gap: 10px;
  margin-top: 5px;
}

.search-button {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-search {
  background-color: white;
  color: #4f46e5;
}

.btn-search:hover {
  background-color: #f3f4f6;
  transform: translateY(-2px);
}

.btn-location {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.btn-location:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.search-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.error-alert {
  background-color: rgba(239, 68, 68, 0.9);
  color: white;
  padding: 12px;
  border-radius: 12px;
  margin-top: 15px;
  text-align: center;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Custom loading spinner */
.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  color: white;
  font-size: 1rem;
}

.spinner {
  width: 70px;
  text-align: center;
  margin-right: 8px;
}

.spinner > div {
  width: 12px;
  height: 12px;
  background-color: white;
  border-radius: 100%;
  display: inline-block;
  animation: bouncedelay 1.4s infinite ease-in-out both;
  margin: 0 2px;
}

.spinner .bounce1 {
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  animation-delay: -0.16s;
}

@keyframes bouncedelay {
  0%, 80%, 100% { 
    transform: scale(0);
  } 40% { 
    transform: scale(1.0);
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-leave-to, .fade-enter-from {
  opacity: 0;
}

/* Responsive adjustments */
@media (min-width: 640px) {
  .search-box {
    flex-direction: row;
    align-items: flex-start;
  }
  
  .search-input-group {
    flex: 3;
  }
  
  .search-buttons {
    flex: 2;
    margin-top: 0;
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .popular-cities {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .popular-city-tags {
    margin-top: 8px;
  }
}
</style>
