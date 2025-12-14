// src/chatbot/services/themeService.js

class ThemeService {
  constructor() {
    this.themes = {
      light: {
        name: 'Light',
        primary: '#667eea',
        secondary: '#764ba2',
        background: '#ffffff',
        text: '#333333',
        border: '#e0e0e0',
        hover: '#f5f5f5',
        accent: '#ffc107'
      },
      dark: {
        name: 'Dark',
        primary: '#4a5568',
        secondary: '#2d3748',
        background: '#1a202c',
        text: '#e2e8f0',
        border: '#4a5568',
        hover: '#2d3748',
        accent: '#f6ad55'
      },
      ocean: {
        name: 'Ocean',
        primary: '#0ea5e9',
        secondary: '#06b6d4',
        background: '#f0f9ff',
        text: '#0c4a6e',
        border: '#bae6fd',
        hover: '#e0f2fe',
        accent: '#06b6d4'
      },
      sunset: {
        name: 'Sunset',
        primary: '#ea580c',
        secondary: '#dc2626',
        background: '#fff7ed',
        text: '#7c2d12',
        border: '#fed7aa',
        hover: '#fed7aa',
        accent: '#f97316'
      },
      forest: {
        name: 'Forest',
        primary: '#059669',
        secondary: '#047857',
        background: '#f0fdf4',
        text: '#164e63',
        border: '#86efac',
        hover: '#dcfce7',
        accent: '#10b981'
      },
      purple: {
        name: 'Purple',
        primary: '#a855f7',
        secondary: '#9333ea',
        background: '#faf5ff',
        text: '#5b21b6',
        border: '#e9d5ff',
        hover: '#f3e8ff',
        accent: '#d946ef'
      },
      minimal: {
        name: 'Minimal',
        primary: '#1f2937',
        secondary: '#374151',
        background: '#ffffff',
        text: '#1f2937',
        border: '#d1d5db',
        hover: '#f9fafb',
        accent: '#6b7280'
      }
    };

    this.currentTheme = this.getStoredTheme() || 'light';
  }

  /**
   * Get all available themes
   */
  getAllThemes() {
    return Object.keys(this.themes);
  }

  /**
   * Get theme by name
   */
  getTheme(name) {
    return this.themes[name] || this.themes['light'];
  }

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return this.themes[this.currentTheme];
  }

  /**
   * Set current theme
   */
  setTheme(name) {
    if (this.themes[name]) {
      this.currentTheme = name;
      localStorage.setItem('weatherAI_theme', name);
      this.applyTheme(name);
      return true;
    }
    return false;
  }

  /**
   * Get stored theme from localStorage
   */
  getStoredTheme() {
    return localStorage.getItem('weatherAI_theme');
  }

  /**
   * Apply theme to DOM
   */
  applyTheme(name) {
    const theme = this.themes[name];
    if (!theme) return;

    // Create CSS variables
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-secondary', theme.secondary);
    root.style.setProperty('--theme-background', theme.background);
    root.style.setProperty('--theme-text', theme.text);
    root.style.setProperty('--theme-border', theme.border);
    root.style.setProperty('--theme-hover', theme.hover);
    root.style.setProperty('--theme-accent', theme.accent);
  }

  /**
   * Get theme colors as CSS variables string
   */
  getThemeCSS(name) {
    const theme = this.themes[name] || this.themes['light'];
    return `
      --theme-primary: ${theme.primary};
      --theme-secondary: ${theme.secondary};
      --theme-background: ${theme.background};
      --theme-text: ${theme.text};
      --theme-border: ${theme.border};
      --theme-hover: ${theme.hover};
      --theme-accent: ${theme.accent};
    `;
  }

  /**
   * Get contrasting text color for background
   */
  getContrastColor(bgColor) {
    const rgb = parseInt(bgColor.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }

  /**
   * Get theme recommendations based on time of day
   */
  getRecommendedTheme() {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) {
      return 'ocean'; // Morning - fresh ocean
    } else if (hour >= 12 && hour < 17) {
      return 'sunset'; // Afternoon - warm sunset
    } else if (hour >= 17 && hour < 21) {
      return 'purple'; // Evening - twilight purple
    } else {
      return 'dark'; // Night - dark mode
    }
  }

  /**
   * Generate color gradient from theme
   */
  getGradient(name, angle = 135) {
    const theme = this.themes[name] || this.themes['light'];
    return `linear-gradient(${angle}deg, ${theme.primary} 0%, ${theme.secondary} 100%)`;
  }
}

// Export singleton instance
export const themeService = new ThemeService();
