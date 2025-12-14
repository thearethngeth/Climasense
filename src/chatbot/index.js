// src/chatbot/index.js

// ===== COMPONENTS =====
export { default as WeatherAIChat } from './components/WeatherAIChat.vue';

// ===== SERVICES - WEATHER & AI =====
export { aiWeatherService } from './services/aiWeatherService';

// ===== SERVICES - PERSONALIZATION =====
export { personalizationService } from './services/personalizationService';

// ===== SERVICES - DESIGN & THEME =====
export { themeService } from './services/themeService';

/**
 * Initialize Chatbot System
 * 
 * Usage:
 * import { initChatbot } from '@/chatbot'
 * initChatbot()
 */
export function initChatbot() {
  // Apply saved theme on startup
  const savedTheme = localStorage.getItem('weatherAI_theme') || 'light';
  themeService.setTheme(savedTheme);
  
  return {
    personalizationService,
    themeService,
    aiWeatherService
  };
}

/**
 * Get Chatbot API
 * 
 * Provides unified access to all chatbot services
 */
export function getChatbotAPI() {
  return {
    // Personalization
    personalization: personalizationService,
    
    // Theme & Design
    theme: themeService,
    
    // Weather & AI
    weather: aiWeatherService,
    
    // Utilities
    getGreeting: () => personalizationService.getPersonalizedGreeting(),
    convertTemp: (c) => personalizationService.convertTemperature(c),
    convertWind: (ms) => personalizationService.convertWindSpeed(ms),
    
    // Current Theme Info
    getCurrentTheme: () => themeService.getCurrentTheme(),
    getAllThemes: () => themeService.getAllThemes(),
  };
}