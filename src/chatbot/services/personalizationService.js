// src/chatbot/services/personalizationService.js

class PersonalizationService {
  constructor() {
    this.storageKey = 'weatherAI_personalization';
    this.userData = this.loadUserData();
    this.preferences = this.loadPreferences();
  }

  /**
   * Load user data from localStorage
   */
  loadUserData() {
    try {
      const stored = localStorage.getItem(`${this.storageKey}_user`);
      return stored ? JSON.parse(stored) : this.getDefaultUserData();
    } catch (error) {
      console.error('Error loading user data:', error);
      return this.getDefaultUserData();
    }
  }

  /**
   * Load user preferences from localStorage
   */
  loadPreferences() {
    try {
      const stored = localStorage.getItem(`${this.storageKey}_prefs`);
      return stored ? JSON.parse(stored) : this.getDefaultPreferences();
    } catch (error) {
      console.error('Error loading preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  /**
   * Get default user data structure
   */
  getDefaultUserData() {
    return {
      name: 'Friend',
      lastLocation: null,
      favoriteLocations: [],
      preferences: {},
      interactionCount: 0,
      lastInteraction: null,
      theme: 'default',
      language: 'en'
    };
  }

  /**
   * Get default preferences
   */
  getDefaultPreferences() {
    return {
      temperatureUnit: 'celsius',
      windSpeedUnit: 'kmh',
      showNotifications: true,
      soundNotifications: false,
      theme: 'light',
      dateFormat: 'en-US',
      compactMode: false
    };
  }

  /**
   * Set user name for personalization
   */
  setUserName(name) {
    this.userData.name = name || 'Friend';
    this.saveUserData();
    return this.userData.name;
  }

  /**
   * Get personalized greeting
   */
  getPersonalizedGreeting() {
    const hour = new Date().getHours();
    const name = this.userData.name;
    let greeting = '';

    if (hour < 12) {
      greeting = `Good morning${name !== 'Friend' ? `, ${name}` : ''}! ☀️`;
    } else if (hour < 18) {
      greeting = `Good afternoon${name !== 'Friend' ? `, ${name}` : ''}! 🌤️`;
    } else {
      greeting = `Good evening${name !== 'Friend' ? `, ${name}` : ''}! 🌙`;
    }

    return greeting;
  }

  /**
   * Add favorite location
   */
  addFavoriteLocation(location, lat, lon) {
    const exists = this.userData.favoriteLocations.find(
      loc => loc.name.toLowerCase() === location.toLowerCase()
    );

    if (!exists) {
      this.userData.favoriteLocations.push({
        name: location,
        latitude: lat,
        longitude: lon,
        addedAt: new Date().toISOString()
      });
      this.saveUserData();
    }

    return this.userData.favoriteLocations;
  }

  /**
   * Remove favorite location
   */
  removeFavoriteLocation(location) {
    this.userData.favoriteLocations = this.userData.favoriteLocations.filter(
      loc => loc.name.toLowerCase() !== location.toLowerCase()
    );
    this.saveUserData();
    return this.userData.favoriteLocations;
  }

  /**
   * Get favorite locations
   */
  getFavoriteLocations() {
    return this.userData.favoriteLocations;
  }

  /**
   * Set theme preference
   */
  setTheme(theme) {
    if (['light', 'dark', 'ocean', 'sunset', 'forest'].includes(theme)) {
      this.preferences.theme = theme;
      this.userData.theme = theme;
      this.savePreferences();
      this.saveUserData();
      return theme;
    }
    return this.preferences.theme;
  }

  /**
   * Get current theme
   */
  getTheme() {
    return this.preferences.theme || 'light';
  }

  /**
   * Set temperature unit
   */
  setTemperatureUnit(unit) {
    if (['celsius', 'fahrenheit', 'kelvin'].includes(unit)) {
      this.preferences.temperatureUnit = unit;
      this.savePreferences();
      return unit;
    }
    return this.preferences.temperatureUnit;
  }

  /**
   * Convert temperature based on user preference
   */
  convertTemperature(celsius) {
    const unit = this.preferences.temperatureUnit;
    switch (unit) {
      case 'fahrenheit':
        return Math.round((celsius * 9/5) + 32);
      case 'kelvin':
        return Math.round(celsius + 273.15);
      default:
        return Math.round(celsius);
    }
  }

  /**
   * Get temperature unit symbol
   */
  getTemperatureSymbol() {
    const unit = this.preferences.temperatureUnit;
    switch (unit) {
      case 'fahrenheit': return '°F';
      case 'kelvin': return 'K';
      default: return '°C';
    }
  }

  /**
   * Set wind speed unit
   */
  setWindSpeedUnit(unit) {
    if (['kmh', 'mph', 'ms'].includes(unit)) {
      this.preferences.windSpeedUnit = unit;
      this.savePreferences();
      return unit;
    }
    return this.preferences.windSpeedUnit;
  }

  /**
   * Convert wind speed based on user preference
   */
  convertWindSpeed(mps) {
    const unit = this.preferences.windSpeedUnit;
    switch (unit) {
      case 'mph':
        return Math.round(mps * 2.237);
      case 'ms':
        return Math.round(mps * 10) / 10;
      default: // kmh
        return Math.round(mps * 3.6);
    }
  }

  /**
   * Get wind speed unit symbol
   */
  getWindSpeedSymbol() {
    const unit = this.preferences.windSpeedUnit;
    switch (unit) {
      case 'mph': return 'mph';
      case 'ms': return 'm/s';
      default: return 'km/h';
    }
  }

  /**
   * Track interaction
   */
  trackInteraction(question) {
    this.userData.interactionCount++;
    this.userData.lastInteraction = {
      question,
      timestamp: new Date().toISOString()
    };
    this.saveUserData();
  }

  /**
   * Get personalized response based on history
   */
  getPersonalizedResponse(baseResponse) {
    const count = this.userData.interactionCount;
    let personalizedGreeting = '';

    if (count === 1) {
      personalizedGreeting = '🎉 Nice to meet you! ';
    } else if (count === 5) {
      personalizedGreeting = '👍 You\'re asking great questions! ';
    } else if (count === 10) {
      personalizedGreeting = '🌟 You\'re becoming a weather expert! ';
    } else if (count > 20) {
      personalizedGreeting = '⭐ You know the weather inside out! ';
    }

    return personalizedGreeting + baseResponse;
  }

  /**
   * Save user data to localStorage
   */
  saveUserData() {
    try {
      localStorage.setItem(`${this.storageKey}_user`, JSON.stringify(this.userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  /**
   * Save preferences to localStorage
   */
  savePreferences() {
    try {
      localStorage.setItem(`${this.storageKey}_prefs`, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }

  /**
   * Get all user data
   */
  getAllUserData() {
    return {
      user: this.userData,
      preferences: this.preferences
    };
  }

  /**
   * Reset all data
   */
  resetAllData() {
    this.userData = this.getDefaultUserData();
    this.preferences = this.getDefaultPreferences();
    localStorage.removeItem(`${this.storageKey}_user`);
    localStorage.removeItem(`${this.storageKey}_prefs`);
    return true;
  }

  /**
   * Export user data
   */
  exportUserData() {
    return {
      exported: new Date().toISOString(),
      data: this.getAllUserData()
    };
  }

  /**
   * Import user data
   */
  importUserData(data) {
    try {
      if (data.user) this.userData = data.user;
      if (data.preferences) this.preferences = data.preferences;
      this.saveUserData();
      this.savePreferences();
      return true;
    } catch (error) {
      console.error('Error importing user data:', error);
      return false;
    }
  }
}

// Export singleton instance
export const personalizationService = new PersonalizationService();
