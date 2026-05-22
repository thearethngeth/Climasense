<template>
  <div class="app-container">
    <nav class="top-nav" :class="{ 'nav-scrolled': isScrolled }">
      <div class="nav-inner">

        <router-link class="brand" to="/">
          <div class="brand-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="currentColor" opacity="0.15"/>
              <path d="M6 13c0-2.2 1.8-4 4-4h8c1.1 0 2 .9 2 2s-.9 2-2 2H10c-1.1 0-2 .9-2 2s.9 2 2 2h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="17" cy="8" r="3" fill="currentColor" opacity="0.7"/>
            </svg>
          </div>
          <div class="brand-words">
            <span class="brand-name">Clima<span class="brand-accent">Sense</span></span>
            <span class="brand-tagline">Live Weather Intelligence</span>
          </div>
        </router-link>

        <div class="nav-links">
          <router-link class="nav-link" to="/" @click="closeMenu">
            <span class="nav-link-icon">
              <i class="fas fa-home"></i>
            </span>
          </router-link>

          <router-link class="nav-link" to="/about" @click="closeMenu">
            <span class="nav-link-icon">
              <i class="fas fa-info-circle"></i>
            </span>
          </router-link>

          <div class="nav-divider"></div>

          <button class="theme-toggle" @click="toggleTheme" :title="isDarkTheme ? 'Switch to light' : 'Switch to dark'">
            <span class="theme-toggle-track">
              <span class="theme-toggle-thumb">
                <i class="fas" :class="isDarkTheme ? 'fa-moon' : 'fa-sun'"></i>
              </span>
            </span>
          </button>
        </div>

      </div>

      <div class="nav-progress" :style="{ transform: `scaleX(${scrollProgress})` }"></div>
    </nav>

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <WeatherWiseAI />
  </div>
</template>

<script>
import WeatherWiseAI from '@/components/WeatherWiseAI.vue'

export default {
  components: { WeatherWiseAI },
  data() {
    return {
      menuActive: false,
      isScrolled: false,
      isDarkTheme: false,
      scrollProgress: 0,
    }
  },
  methods: {
    closeMenu() { this.menuActive = false },
    handleScroll() {
      this.isScrolled = window.scrollY > 40
      const docH = document.documentElement.scrollHeight - window.innerHeight
      this.scrollProgress = docH > 0 ? Math.min(window.scrollY / docH, 1) : 0
    },
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme
      document.body.classList.toggle('dark-theme', this.isDarkTheme)
      localStorage.setItem('weatherAppTheme', this.isDarkTheme ? 'dark' : 'light')
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDark: this.isDarkTheme } }))
    },
    initTheme() {
      const saved = localStorage.getItem('weatherAppTheme')
      if (saved) {
        this.isDarkTheme = saved === 'dark'
      } else {
        const h = new Date().getHours()
        this.isDarkTheme = h < 6 || h >= 18
      }
      document.body.classList.toggle('dark-theme', this.isDarkTheme)
    }
  },
  mounted() {
    const fa = document.createElement('link')
    fa.rel = 'stylesheet'
    fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css'
    document.head.appendChild(fa)

    const gf = document.createElement('link')
    gf.rel = 'stylesheet'
    gf.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap'
    document.head.appendChild(gf)

    window.addEventListener('scroll', this.handleScroll)
    this.initTheme()
    this.themeInterval = setInterval(() => {
      if (!localStorage.getItem('weatherAppTheme')) {
        const h = new Date().getHours()
        const night = h < 6 || h >= 18
        if (this.isDarkTheme !== night) {
          this.isDarkTheme = night
          document.body.classList.toggle('dark-theme', night)
        }
      }
    }, 60000)
    window.addEventListener('themeChanged', (e) => { this.isDarkTheme = e.detail.isDark })
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
    if (this.themeInterval) clearInterval(this.themeInterval)
  }
}
</script>

<style lang="scss">
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --sky-50:  #f4f9fb;
  --sky-100: #e5f2f7;
  --sky-200: #c8dde8;
  --sky-400: #5c97ad;
  --sky-500: #34748c;
  --sky-600: #24586d;
  --text-primary: #17242b;
  --text-secondary: #50646f;
  --text-muted: #899aa3;
  --bg-page: #eef5f7;
  --bg-card: #ffffff;
  --bg-card-alt: #f7fbfc;
  --border: rgba(52, 116, 140, 0.16);
  --border-strong: rgba(52, 116, 140, 0.34);
  --shadow-sm: 0 1px 3px rgba(23,36,43,0.05);
  --shadow-md: 0 10px 28px rgba(23,36,43,0.08);
  --shadow-lg: 0 18px 48px rgba(23,36,43,0.16);
  --radius-sm: 8px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 18px;
  --accent: #34748c;
  --accent-light: #e4f1f5;
  --accent-dark: #24586d;
  --card-bg: #ffffff;
  --card-shadow: var(--shadow-md);
  --btn-hover-bg: rgba(74,144,196,0.08);
  --text-on-accent: #ffffff;

  --nav-bg: rgba(255,255,255,0.92);
  --nav-border: rgba(52, 116, 140, 0.12);
  --nav-height: 62px;
}

body.dark-theme {
  --text-primary: #e7eef1;
  --text-secondary: #a5b7bf;
  --text-muted: #71858e;
  --bg-page: #0d1721;
  --bg-card: #121f2c;
  --bg-card-alt: #182838;
  --border: rgba(116, 170, 191, 0.14);
  --border-strong: rgba(116, 170, 191, 0.28);
  --shadow-sm: 0 1px 4px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.3);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.4);
  --accent-light: rgba(92, 151, 173, 0.14);
  --card-bg: #162030;
  --btn-hover-bg: rgba(74,144,196,0.12);
  --nav-bg: rgba(13, 23, 33, 0.92);
  --nav-border: rgba(116, 170, 191, 0.1);
}

body {
  font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg-page);
  color: var(--text-primary);
  line-height: 1.6;
  min-height: 100vh;
  transition: background 0.3s, color 0.3s;
}

.app-container { min-height: 100vh; }

/* ══════════════════════════════════════
   NAV
══════════════════════════════════════ */
.top-nav {
  position: sticky;
  top: 0;
  z-index: 1000;
  height: var(--nav-height);
  background: var(--nav-bg);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 1px solid var(--nav-border);
  transition: box-shadow 0.3s, border-color 0.3s;
}

.top-nav.nav-scrolled {
  box-shadow: 0 4px 24px rgba(23,36,43,0.1);
  border-bottom-color: var(--border);
}

.nav-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), #5bc4d8);
  transform-origin: left center;
  transform: scaleX(0);
  transition: transform 0.1s linear;
  border-radius: 0 1px 1px 0;
}

.nav-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 28px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 11px;
  text-decoration: none;
  flex-shrink: 0;

  &:hover .brand-icon { transform: rotate(-6deg) scale(1.08); }
  &:hover .brand-name { color: var(--accent); }
}

.brand-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--accent-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  transition: transform 0.25s cubic-bezier(.34,1.56,.64,1);
  flex-shrink: 0;
}

.brand-words {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.brand-name {
  font-size: 15.5px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.3px;
  line-height: 1;
  transition: color 0.2s;
}

.brand-accent { color: var(--accent); }

.brand-tagline {
  font-size: 9px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  line-height: 1;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2px;
}

.nav-divider {
  width: 1px;
  height: 20px;
  background: var(--border-strong);
  margin: 0 8px;
  opacity: 0.5;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 13px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  text-decoration: none;
  position: relative;
  transition: color 0.2s, background 0.2s;
  letter-spacing: -0.1px;

  &::after {
    content: '';
    position: absolute;
    bottom: 3px;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 16px;
    height: 2px;
    border-radius: 2px;
    background: var(--accent);
    transition: transform 0.2s cubic-bezier(.34,1.56,.64,1);
  }

  &:hover {
    color: var(--accent);
    background: var(--accent-light);
  }

  &.router-link-active {
    color: var(--accent-dark);
    background: var(--accent-light);
    &::after { transform: translateX(-50%) scaleX(1); }
  }
}

.nav-link-icon {
  width: 42px;
  height: 42px;
  border-radius: 6px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  i { font-size: 11.5px; }
}

.nav-link:hover .nav-link-icon,
.nav-link.router-link-active .nav-link-icon {
  background: rgba(52, 116, 140, 0.12);
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  transition: background 0.2s;

  &:hover { background: var(--accent-light); }
}

.theme-toggle-track {
  width: 44px;
  height: 24px;
  border-radius: 100px;
  background: var(--accent-light);
  border: 1.5px solid var(--border-strong);
  display: flex;
  align-items: center;
  padding: 2px;
  position: relative;
  transition: background 0.3s, border-color 0.3s;

  body.dark-theme & {
    background: var(--accent-dark);
    border-color: rgba(116, 170, 191, 0.4);
  }
}

.theme-toggle-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--bg-card);
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), background 0.3s;
  position: absolute;
  left: 2px;
  color: var(--accent);

  body.dark-theme & {
    transform: translateX(20px);
    color: #a5b7bf;
    background: #1e3247;
  }

  i { font-size: 9px; }
}

.weatherwise-ai-panel {
  position: fixed !important;
  right: 20px !important;
  bottom: 20px !important;
  top: auto !important;
  left: auto !important;
  width: min(440px, calc(100vw - 40px));
  height: min(700px, calc(100vh - 100px));
  border-radius: var(--radius-xl);
  background: var(--bg-card) !important;
  border: 0.5px solid var(--border-strong);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  z-index: 10000 !important;
  overflow: hidden;
}

.weatherwise-ai-header {
  background: var(--accent) !important;
  color: white;
  padding: 14px 18px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  flex-shrink: 0;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  i { font-size: 22px; color: rgba(255,255,255,0.9); }
}

.weatherwise-ai-close {
  background: rgba(255,255,255,0.15);
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  &:hover { background: rgba(255,255,255,0.25); }
}

.weatherwise-ai-body {
  flex: 1;
  overflow-y: auto;
  background: var(--bg-card-alt);
  .weatherwise-ai-container { height: 100%; }
  .ai-chatbot-card { height: 100%; border-radius: 0; box-shadow: none; }
}

.floating-chat-trigger {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: var(--accent);
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(74,144,196,0.4);
  z-index: 9999;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(74,144,196,0.5); }
}

@media (max-width: 768px) {
  .weatherwise-ai-panel {
    top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
    width: 100vw; height: 100vh; border-radius: 0;
  }
  .weatherwise-ai-header { border-radius: 0; }
  .nav-inner { padding: 0 16px; }
  .brand-tagline { display: none; }
  .nav-link span:not(.nav-link-icon) { display: none; }
  .nav-link { padding: 7px 9px; }
  .nav-divider { margin: 0 4px; }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s, transform 0.25s; }
.fade-enter-from { opacity: 0; transform: translateY(8px); }
.fade-leave-to { opacity: 0; transform: translateY(-4px); }

.slide-in-enter-active { animation: slideInRight 0.25s ease-out; }
.slide-in-leave-active { animation: slideOutRight 0.25s ease-in; }
@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }

.mb-1{margin-bottom:.25rem}.mb-2{margin-bottom:.5rem}.mb-3{margin-bottom:1rem}.mb-4{margin-bottom:1.5rem}
.mt-1{margin-top:.25rem}.mt-2{margin-top:.5rem}.mt-3{margin-top:1rem}.mt-4{margin-top:1.5rem}
.ms-1{margin-left:.25rem}.ms-2{margin-left:.5rem}.me-1{margin-right:.25rem}.me-2{margin-right:.5rem}
.d-flex{display:flex}.align-items-center{align-items:center}.justify-content-between{justify-content:space-between}
.text-center{text-align:center}

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--accent); }
</style>