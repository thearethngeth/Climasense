<template>
  <div class="app-container">
    <nav class="premium-navbar" :class="{'scrolled': isScrolled}">
      <div class="navbar-container">
        <!-- Logo and brand section -->
        <router-link class="navbar-brand" to="/">
          <div class="brand-icon-wrapper">
            <i class="fas fa-cloud-sun navbar-logo"></i>
          </div>
          <span class="brand-text">
            Weather<span class="brand-accent">App</span>
            <span class="brand-tagline">Live Weather Intelligence</span>
          </span>
        </router-link>

        <!-- Mobile menu button -->
        <button class="navbar-toggler" type="button" @click="toggleMenu" aria-label="Toggle navigation">
          <div class="hamburger" :class="{'is-active': menuActive}">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        <!-- Weather Chatbot - CENTERED IN NAVBAR -->
        <div class="navbar-chatbot-center">
          <button class="navbar-chatbot-btn" @click="toggleNavbarChat" title="Weather AI Chat">
            <i class="fas fa-comments"></i>
          </button>
        </div>

        <!-- Navigation links -->
        <div class="navbar-menu" :class="{ 'menu-active': menuActive }">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" to="/" @click="closeMenu">
                <i class="fas fa-home me-1"></i> Home
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/about" @click="closeMenu">
                <i class="fas fa-info-circle me-1"></i> About
              </router-link>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link" @click.prevent="toggleTheme">
                <i class="fas" :class="[isDarkTheme ? 'fa-sun' : 'fa-moon']"></i>
                <span class="ms-1">{{ isDarkTheme ? 'Light' : 'Dark' }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Premium accent line -->
      <div class="navbar-accent-line"></div>
    </nav>

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    
    <!-- Side Panel Chat Window - Fixed to Right -->
    <div v-if="showNavbarChat" class="navbar-chat-window">
      <div class="navbar-chat-header">
        <span>💬 Weather AI Chat</span>
        <button @click="toggleNavbarChat" class="navbar-chat-close">✕</button>
      </div>
      <div class="navbar-chat-body">
        <div v-if="!navbarChatMinimized">
          <!-- Chat Messages -->
          <div v-for="(msg, idx) in chatMessages" :key="idx" :class="['chat-msg', msg.type]">
            <p>{{ msg.text }}</p>
          </div>
          
          <!-- Quick Questions Dropdown (shown if no messages yet) -->
          <div v-if="chatMessages.length <= 1" class="quick-questions-section">
            <label class="quick-questions-label">Quick Questions:</label>
            <div class="quick-questions-buttons">
              <button v-for="(q, idx) in quickQuestions" 
                      :key="idx"
                      @click="selectQuickQuestion(q)"
                      class="quick-question-btn">
                {{ q }}
              </button>
            </div>
          </div>
          
          <!-- Input Area -->
          <div class="chat-input-wrapper">
            <input v-model="navbarChatInput" 
                   @keyup.enter="sendNavbarChat"
                   type="text" 
                   placeholder="Ask me anything..."
                   class="navbar-chat-input">
            <button @click="sendNavbarChat" class="chat-send-btn" :disabled="!navbarChatInput.trim()">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuActive: false,
      isScrolled: false,
      isDarkTheme: false,
      showNavbarChat: false,
      navbarChatMinimized: false,
      navbarChatInput: '',
      chatMessages: [
        { type: 'bot', text: '👋 Hi! I\'m your Weather AI Assistant. Ask me about weather, clothing advice, travel tips, or activities!' }
      ],
      quickQuestions: [
        '🌤️ What\'s the weather like today?',
        '👕 What should I wear?',
        '🌧️ Will it rain today?',
        '💨 What\'s the air quality?',
        '☀️ What\'s the UV index?',
        '🌡️ How hot/cold is it?',
        '💧 What\'s the humidity level?',
        '🌬️ How windy is it?',
        '🌅 When is sunrise/sunset?',
        '⚠️ Any weather alerts?',
        '📅 What\'s the weekly forecast?',
        '🏃 Good for outdoor activities?'
      ]
    }
  },
  methods: {
    toggleMenu() {
      this.menuActive = !this.menuActive;
    },
    closeMenu() {
      this.menuActive = false;
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;
      document.body.classList.toggle('dark-theme', this.isDarkTheme);
      localStorage.setItem('weatherAppTheme', this.isDarkTheme ? 'dark' : 'light');
    },
    initTheme() {
      // Check if user has previously set a theme preference
      const savedTheme = localStorage.getItem('weatherAppTheme');
      if (savedTheme) {
        this.isDarkTheme = savedTheme === 'dark';
        document.body.classList.toggle('dark-theme', this.isDarkTheme);
      } else {
        // Auto-detect theme based on time of day
        const currentHour = new Date().getHours();
        // Day time: 6 AM to 6 PM (light theme)
        // Night time: 6 PM to 6 AM (dark theme)
        const isNightTime = currentHour < 6 || currentHour >= 18;
        this.isDarkTheme = isNightTime;
        document.body.classList.toggle('dark-theme', this.isDarkTheme);
      }
    },
    autoUpdateTheme() {
      // Auto-update theme every minute if user hasn't manually set preference
      const savedTheme = localStorage.getItem('weatherAppTheme');
      if (!savedTheme) {
        const currentHour = new Date().getHours();
        const isNightTime = currentHour < 6 || currentHour >= 18;
        if (this.isDarkTheme !== isNightTime) {
          this.isDarkTheme = isNightTime;
          document.body.classList.toggle('dark-theme', this.isDarkTheme);
        }
      }
    },
    toggleNavbarChat() {
      this.showNavbarChat = !this.showNavbarChat;
      // Handle body scroll and padding when chat is open
      if (this.showNavbarChat) {
        document.body.style.overflow = 'hidden';
        // Add padding on larger screens to prevent content jump
        if (window.innerWidth > 768) {
          document.body.classList.add('chat-open');
        }
      } else {
        document.body.style.overflow = '';
        document.body.classList.remove('chat-open');
      }
    },
    selectQuickQuestion(question) {
      // Extract the text without emoji for processing
      const cleanQuestion = question.replace(/^[🌤️👕✈️💨☀️⛈️]\s*/, '');
      this.navbarChatInput = cleanQuestion;
      // Send the question after a short delay
      this.$nextTick(() => {
        this.sendNavbarChat();
      });
    },
    sendNavbarChat() {
      const input = this.navbarChatInput.trim();
      
      // Require question - validate input
      if (!input) {
        return;
      }
      
      // Check if input is a valid question or statement (at least 3 characters)
      if (input.length < 3) {
        this.chatMessages.push({
          type: 'bot',
          text: '❓ Please ask a longer question! I need at least 3 characters to understand.'
        });
        this.navbarChatInput = '';
        return;
      }
      
      // Add user message
      this.chatMessages.push({
        type: 'user',
        text: input
      });
      
      const userInput = input.toLowerCase();
      this.navbarChatInput = '';
      
      // Simulate AI response with timeout
      setTimeout(() => {
        let response = '';
        
        // Weather condition questions
        if (userInput.includes('cloud') || userInput.includes('cloudy') || userInput.includes('clouds')) {
          response = '☁️ **Cloud Coverage**: Shows the percentage of sky covered by clouds.\n\n**Cloud Types:**\n• Clear (0-10%): Sunny skies\n• Few clouds (11-25%): Mostly sunny\n• Scattered (26-50%): Partly cloudy\n• Broken (51-90%): Mostly cloudy\n• Overcast (91-100%): Completely cloudy\n\nCheck the current weather card for live cloud details!';
        } else if (userInput.includes('today') && (userInput.includes('weather') || userInput.includes('like'))) {
          response = '🌤️ **Today\'s Weather**: Check the current weather card at the top of the page! It shows:\n• Current temperature & feels like\n• Weather conditions\n• High/Low temperatures\n• Wind speed & humidity\n• Visibility & pressure\n\nFor hour-by-hour details, see the Hourly Forecast section!';
        } 
        
        // Air quality and pollution
        else if (userInput.includes('air quality') || userInput.includes('pollution') || userInput.includes('pm2.5') || userInput.includes('aqi')) {
          response = '💨 **Air Quality Index (AQI)**: Measures air pollution levels.\n\n**AQI Scale:**\n• 0-50 (Good): 🟢 Safe, perfect for outdoor activities\n• 51-100 (Moderate): 🟡 Acceptable for most people\n• 101-150 (Unhealthy for Sensitive): 🟠 May affect sensitive groups\n• 151-200 (Unhealthy): 🔴 Everyone may experience effects\n• 201-300 (Very Unhealthy): 🟣 Health warnings\n• 301+ (Hazardous): 🟤 Emergency conditions\n\nCheck the Air Quality section for your location!';
        } 
        
        // UV Index questions
        else if (userInput.includes('uv') || userInput.includes('sunscreen') || userInput.includes('ultraviolet') || userInput.includes('sun protection')) {
          response = '☀️ **UV Index**: Measures sun intensity and burn risk.\n\n**Protection Guide:**\n• 0-2 (Low): 😊 Safe, no protection needed\n• 3-5 (Moderate): 😐 SPF 30+, wear a hat\n• 6-7 (High): 😟 SPF 50+, seek shade 10am-4pm\n• 8-10 (Very High): 😰 Extra protection, limit sun time\n• 11+ (Extreme): 🚨 Avoid sun, stay indoors midday\n\n**Tip**: UV is strongest at solar noon! Check the UV Index section.';
        } 
        
        // Time-based questions
        else if (userInput.includes('sunrise') || userInput.includes('sunset') || userInput.includes('sun time') || userInput.includes('dawn') || userInput.includes('dusk')) {
          response = '🌅 **Sunrise & Sunset Times**: Plan your day with precise sun timing!\n\n**Perfect for:**\n• 📸 Photography golden hour\n• 🏃 Morning/evening exercise\n• 🎣 Fishing trips\n• ⛺ Camping & hiking\n• 🌆 Sunset watching\n\nThe Sunrise & Sunset section shows exact times plus civil twilight periods!';
        } 
        
        // Forecast questions
        else if (userInput.includes('hourly') || userInput.includes('hour-by-hour') || userInput.includes('next few hours')) {
          response = '⏰ **Hourly Forecast**: Detailed predictions for the next 24-48 hours!\n\n**Includes:**\n• 🌡️ Temperature changes\n• 💧 Precipitation probability\n• 🌬️ Wind speed & direction\n• 🌤️ Weather conditions\n• ☁️ Cloud coverage\n\n**Perfect for:**\n• Planning your commute\n• Scheduling outdoor activities\n• Timing exercise routines\n• Event planning';
        } else if (userInput.includes('5-day') || userInput.includes('5 day') || userInput.includes('week') || userInput.includes('next few days')) {
          response = '📅 **5-Day Extended Forecast**: Plan ahead with confidence!\n\n**Shows:**\n• 📈 Daily high/low temperatures\n• ⛅ Weather conditions\n• 💧 Precipitation chance\n• 🌬️ Wind forecasts\n• 📊 Trend analysis\n\n**Great for:**\n• Weekend trip planning\n• Work schedules\n• Outdoor event prep\n• Travel decisions';
        } 
        
        // Weather highlights
        else if (userInput.includes('highlight') || userInput.includes('feels like') || userInput.includes('pressure') || userInput.includes('dew point')) {
          response = '⭐ **Weather Highlights**: Important metrics explained!\n\n• **Feels Like**: Apparent temperature considering wind & humidity\n• **Dew Point**: Comfort level (<10°C dry, >20°C humid)\n• **Pressure**: Atmospheric pressure (rising = improving weather)\n• **Wind Chill**: How cold it feels with wind\n• **Heat Index**: How hot it feels with humidity\n\nCheck Weather Highlights for detailed readings!';
        } 
        
        // Rain and precipitation
        else if (userInput.includes('rain') || userInput.includes('will it rain') || userInput.includes('precipitation')) {
          response = '🌧️ **Rain & Precipitation**: Stay dry with accurate forecasts!\n\n**Check these sections:**\n• ⏰ Hourly Forecast - shows rain probability per hour\n• 📅 5-Day Forecast - daily rain chances\n• 🗺️ Weather Map - precipitation layer for visual tracking\n\n**Rain Probability:**\n• 0-20%: Unlikely, safe to skip umbrella\n• 30-50%: Possible, bring just in case\n• 60-70%: Likely, plan for rain\n• 80-100%: Very likely, definitely raining';
        } else if (userInput.includes('storm') || userInput.includes('thunderstorm') || userInput.includes('thunder') || userInput.includes('lightning')) {
          response = '⛈️ **Storms & Severe Weather**: Stay safe with alerts!\n\n**Safety Tips:**\n• 🏠 Stay indoors during thunderstorms\n• ⚡ Avoid tall objects & open areas\n• 📱 Check weather alerts banner\n• 🚗 Pull over if driving in severe weather\n\n**Track storms using:**\n• Weather Alerts banner (top of page)\n• Hourly Forecast for timing\n• Weather Map precipitation layer\n• 5-Day Forecast for advance warning';
        } else if (userInput.includes('snow') || userInput.includes('snowing') || userInput.includes('winter') || userInput.includes('blizzard')) {
          response = '❄️ **Snow & Winter Weather**: Winter preparedness info!\n\n**Check:**\n• Current temperature (below 0°C = snow possible)\n• Precipitation type in forecasts\n• Weather alerts for winter storms\n\n**Snow Indicators:**\n• Temperature ≤ 0°C (32°F)\n• High precipitation probability\n• Weather description mentions snow\n\n**Winter Tips:** Dress in layers, check road conditions!';
        } 
        
        // Wind questions
        else if (userInput.includes('wind') || userInput.includes('windy') || userInput.includes('breeze') || userInput.includes('gust')) {
          response = '💨 **Wind Information**: Stay informed about wind conditions!\n\n**Wind Speed Scale:**\n• 0-5 km/h: Calm 🍃\n• 6-20 km/h: Light breeze 🌿\n• 21-40 km/h: Moderate wind 🌾\n• 41-60 km/h: Strong wind 🌳\n• 61+ km/h: Very strong/Gale 🌪️\n\n**Find wind data in:**\n• Current Weather card\n• Weather Highlights (with wind chill)\n• Hourly Forecast\n• Weather Map wind layer';
        } 
        
        // Humidity questions
        else if (userInput.includes('humid') || userInput.includes('humidity') || userInput.includes('moisture')) {
          response = '💧 **Humidity Levels**: Understand comfort & health!\n\n**Comfort Scale:**\n• 0-30%: 😓 Very dry, static electricity\n• 30-50%: 😊 Comfortable, ideal range\n• 50-70%: 😐 Slightly humid\n• 70-85%: 😰 Humid & uncomfortable\n• 85-100%: 🥵 Very humid, oppressive\n\n**Effects:**\n• High humidity makes heat feel worse\n• Low humidity causes dry skin\n• Affects respiratory comfort\n\nCheck Weather Highlights for current humidity!';
        } 
        
        // Temperature questions
        else if (userInput.includes('hot') || userInput.includes('cold') || userInput.includes('warm') || userInput.includes('cool') || userInput.includes('temperature')) {
          response = '🌡️ **Temperature Guide**: Dress appropriately!\n\n**What to Wear:**\n• Below 0°C: 🧥 Heavy winter coat, layers\n• 0-10°C: 🧥 Jacket, long sleeves\n• 10-20°C: 👔 Light jacket or sweater\n• 20-25°C: 👕 T-shirt, comfortable clothes\n• 25-30°C: 🩳 Shorts, light clothing\n• Above 30°C: 👙 Minimal, breathable fabrics\n\n**Remember:** Check "Feels Like" temp for better accuracy!';
        } 
        
        // Clothing/What to wear
        else if (userInput.includes('wear') || userInput.includes('dress') || userInput.includes('clothing') || userInput.includes('outfit')) {
          response = '👕 **What to Wear Today**: Dress for the weather!\n\n**Consider:**\n1. 🌡️ Current temperature & feels like\n2. 🌧️ Rain probability (bring umbrella?)\n3. 💨 Wind speed (windbreaker needed?)\n4. ☀️ UV index (sunscreen & hat?)\n5. 💧 Humidity (breathable fabrics?)\n\n**Quick Guide:**\n• Cold + Wind = Extra layers\n• Hot + Humid = Light, breathable\n• Rain likely = Waterproof jacket\n• High UV = Hat & sunglasses\n\nCheck current weather for all these factors!';
        } 
        
        // Outdoor activities
        else if (userInput.includes('outdoor') || userInput.includes('activities') || userInput.includes('exercise') || userInput.includes('run') || userInput.includes('bike')) {
          response = '🏃 **Outdoor Activities Guide**: Perfect timing for your plans!\n\n**Best Conditions:**\n✅ Temperature: 15-25°C\n✅ Low wind (<20 km/h)\n✅ No rain expected\n✅ Good air quality (AQI <100)\n✅ Moderate UV (3-6)\n\n**Check These:**\n• 💨 Air Quality (breathing matters!)\n• ☀️ UV Index (skin protection)\n• 🌧️ Hourly rain chance\n• 💨 Wind conditions\n• 🌡️ Temperature comfort\n\n**Safety First**: Stay hydrated, use sunscreen!';
        } 
        
        // Travel questions
        else if (userInput.includes('travel') || userInput.includes('trip') || userInput.includes('driving') || userInput.includes('flight')) {
          response = '✈️ **Travel Weather Advisory**: Plan safe journeys!\n\n**Check Before Travel:**\n• 📅 5-Day Forecast for destination\n• ⛈️ Weather alerts & warnings\n• 👁️ Visibility conditions\n• 💨 Wind speed (especially for flights)\n• 🌧️ Precipitation forecasts\n\n**Travel Tips:**\n• Pack for forecast conditions\n• Monitor weather alerts\n• Check road/flight conditions\n• Plan alternative routes\n• Travel insurance for severe weather\n\nStay safe and informed!';
        } 
        
        // Visibility
        else if (userInput.includes('visibility') || userInput.includes('see') || userInput.includes('fog') || userInput.includes('haze')) {
          response = '👁️ **Visibility Information**: How far you can see!\n\n**Visibility Scale:**\n• >10 km: 🌟 Excellent visibility\n• 5-10 km: 😊 Good visibility\n• 2-5 km: 😐 Moderate, be cautious\n• 1-2 km: 😟 Poor, fog/haze present\n• <1 km: 🚨 Very poor, hazardous driving\n\n**Affects:**\n• Driving safety\n• Flight operations\n• Outdoor photography\n• Scenic views\n\nCheck Current Weather card for visibility!';
        } 
        
        // Alerts and warnings
        else if (userInput.includes('alert') || userInput.includes('warning') || userInput.includes('danger') || userInput.includes('severe')) {
          response = '⚠️ **Weather Alerts**: Stay safe with warnings!\n\n**Alert Types:**\n• 🟡 Watch: Conditions possible\n• 🟠 Advisory: Expect impacts\n• 🔴 Warning: Take action now\n• 🟣 Emergency: Severe threat\n\n**Check:**\n• Red banner at top (active alerts)\n• Click banner for full details\n• Monitor regularly during storms\n\n**If alerts show:** Follow local emergency guidelines!';
        } 
        
        // Map questions
        else if (userInput.includes('map') || userInput.includes('radar') || userInput.includes('satellite')) {
          response = '🗺️ **Weather Map Features**: Visual weather tracking!\n\n**Available Layers:**\n• 🌡️ Temperature - see heat patterns\n• 🌧️ Precipitation - track rain/snow\n• ☁️ Clouds - cloud movement\n• 💨 Wind - wind patterns & speed\n\n**How to Use:**\n1. Click layer buttons to switch views\n2. Zoom in/out for detail\n3. Pan around to see other areas\n4. Watch weather systems move\n\n**Pro Tip**: Use precipitation layer to track incoming rain!';
        } 
        
        // Comparison questions
        else if (userInput.includes('vs') || userInput.includes('difference') || userInput.includes('compare')) {
          response = '🔄 **Weather Comparisons**: Understanding the differences!\n\n**Common Questions:**\n• **Temp vs Feels Like**: Actual vs apparent temp with wind/humidity\n• **Humidity vs Dew Point**: Relative vs absolute moisture\n• **Wind Speed vs Gust**: Average vs peak wind\n• **UV Index vs Temperature**: Sun intensity vs heat\n\n**Pro Tip**: Always check "Feels Like" for true comfort level!';
        } 
        
        // Greetings
        else if (userInput.includes('hello') || userInput.includes('hi') || userInput.includes('hey') || userInput.includes('good morning') || userInput.includes('good afternoon')) {
          response = '👋 Hello! I\'m your Weather AI Assistant! ☀️🌧️\n\nI can help you with:\n• Current weather conditions\n• Forecasts (hourly & 5-day)\n• Air quality & UV index\n• Weather alerts\n• Activity recommendations\n• What to wear advice\n• And much more!\n\nWhat would you like to know? 😊';
        } 
        
        // Help
        else if (userInput.includes('help') || userInput.includes('what can') || userInput.includes('commands')) {
          response = '🆘 **I can help you with:**\n\n**Current Conditions:**\n• ☁️ Cloud coverage\n• 🌡️ Temperature & feels like\n• 💧 Humidity levels\n• 💨 Wind speed & air quality\n• 👁️ Visibility\n\n**Forecasts:**\n• ⏰ Hourly predictions\n• 📅 5-day outlook\n• 🌧️ Rain probability\n\n**Special Info:**\n• ☀️ UV index & sun times\n• ⚠️ Weather alerts\n• 👕 What to wear\n• 🏃 Activity recommendations\n• 🗺️ Weather maps\n\nJust ask me anything!';
        } 
        
        // Thanks
        else if (userInput.includes('thank') || userInput.includes('thanks') || userInput.includes('appreciate')) {
          response = '😊 You\'re very welcome! \n\nI\'m always here to help you stay informed about the weather! Feel free to ask me anything anytime. Stay safe! 🌤️';
        } 
        
        // Goodbye
        else if (userInput.includes('bye') || userInput.includes('goodbye') || userInput.includes('see you')) {
          response = '👋 Goodbye! Stay safe and have a wonderful day! Check back anytime for weather updates! ☀️🌈';
        } 
        
        // Default response
        else {
          response = '🤔 I\'m not sure about that specific question, but I can help with:\n\n• 🌤️ Current weather\n• 📅 Forecasts (hourly/5-day)\n• 💨 Air quality\n• ☀️ UV index\n• 🌧️ Rain predictions\n• 👕 What to wear\n• 🏃 Outdoor activities\n• 🗺️ Weather maps\n• ⚠️ Alerts & warnings\n\nTry asking about any of these topics!';
        }
        
        this.chatMessages.push({
          type: 'bot',
          text: response
        });
        
        // Auto-scroll to latest message
        this.$nextTick(() => {
          const chatBody = document.querySelector('.navbar-chat-body');
          if (chatBody) {
            chatBody.scrollTop = chatBody.scrollHeight;
          }
        });
      }, 600);
    }
  },
  mounted() {
    // Add Font Awesome CDN
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';
    document.head.appendChild(fontAwesome);
    
    // Add Google Fonts for premium look
    const googleFonts = document.createElement('link');
    googleFonts.rel = 'stylesheet';
    googleFonts.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(googleFonts);
    
    // Add scroll listener for navbar effects
    window.addEventListener('scroll', this.handleScroll);
    
    // Initialize theme
    this.initTheme();
    
    // Auto-update theme based on time of day every minute
    this.themeInterval = setInterval(() => {
      this.autoUpdateTheme();
    }, 60000);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    if (this.themeInterval) {
      clearInterval(this.themeInterval);
    }
  }
}
</script>

<style lang="scss">
/* Reset and base styles */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', 'Segoe UI', Roboto, -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  color: var(--text-primary);
  background: var(--bg-gradient);
  transition: background 0.3s ease, color 0.3s ease;
  min-height: 100vh;
}

/* App Container */
.app-container {
  min-height: 100vh;
}

/* Premium Navbar Styles */
.premium-navbar {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.4s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 768px) {
    padding: 12px 0;
  }
  
  @media (max-width: 480px) {
    padding: 10px 0;
  }
}

.premium-navbar.scrolled {
  padding: 12px 0;
  background: rgba(79, 70, 229, 0.95);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.navbar-container {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.navbar-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  font-family: 'Poppins', sans-serif;
  position: relative;
  z-index: 2;
}

.brand-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 12px;
  margin-right: 15px;
  box-shadow: 0 5px 15px rgba(99, 102, 241, 0.4);
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
  
  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    margin-right: 8px;
  }
}

.premium-navbar.scrolled .brand-icon-wrapper {
  transform: scale(0.9);
  box-shadow: 0 3px 10px rgba(99, 102, 241, 0.3);
}

.navbar-logo {
  font-size: 1.6rem;
  color: #fff;
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
}

.brand-text {
  display: flex;
  flex-direction: column;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  line-height: 1.2;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    letter-spacing: 0.3px;
  }
}

.premium-navbar.scrolled .brand-text {
  transform: translateX(5px);
}

.brand-accent {
  color: #fcd34d; /* Yellow accent */
  position: relative;
  z-index: 1;
}

.brand-tagline {
  font-size: 0.7rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-top: 4px;
  opacity: 0.85;
}

/* Fancy hamburger menu */
.navbar-toggler {
  display: none;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  position: relative;
  z-index: 2;
}

.hamburger {
  width: 30px;
  height: 24px;
  position: relative;
  transition: 0.5s ease-in-out;
}

.hamburger span {
  display: block;
  position: absolute;
  height: 2px;
  width: 100%;
  background: white;
  border-radius: 2px;
  opacity: 1;
  left: 0;
  transform: rotate(0deg);
  transition: 0.25s ease-in-out;
}

.hamburger span:nth-child(1) { top: 0px; }
.hamburger span:nth-child(2) { top: 10px; }
.hamburger span:nth-child(3) { top: 20px; }

.hamburger.is-active span:nth-child(1) {
  top: 10px;
  transform: rotate(135deg);
}

.hamburger.is-active span:nth-child(2) {
  opacity: 0;
  transform: translateX(-20px);
}

.hamburger.is-active span:nth-child(3) {
  top: 10px;
  transform: rotate(-135deg);
}

/* Navigation menu */
.navbar-nav {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  align-items: center;
}

.nav-item {
  margin-left: 40px;
  position: relative;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 1.05rem;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  padding: 8px 0;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.nav-link:hover, .router-link-active {
  color: #fcd34d; /* Yellow accent */
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fcd34d;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  opacity: 0;
}

.nav-link:hover::after, .router-link-active::after {
  opacity: 1;
  width: 25px;
  border-radius: 3px;
}

/* Premium accent line */
.navbar-accent-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, 
    rgba(255,255,255,0) 0%, 
    rgba(252,211,77,0.8) 50%, 
    rgba(255,255,255,0) 100%);
  opacity: 0.7;
  transform: translateY(1px);
}

/* ===== NAVBAR CHATBOT STYLES ===== */
.navbar-chatbot-center {
  display: flex;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1001;
}

.navbar-chatbot-btn {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  cursor: pointer;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
  position: relative;
  
  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
  
  @media (max-width: 480px) {
    width: 44px;
    height: 44px;
    font-size: 18px;
  }
}

.navbar-chatbot-btn::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.navbar-chatbot-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 30px rgba(99, 102, 241, 0.5);
}

.navbar-chatbot-btn:hover::before {
  opacity: 1;
}

.navbar-chatbot-btn:active {
  transform: translateY(-1px) scale(1.02);
}

.navbar-chatbot-btn i {
  font-size: 24px;
  animation: pulse-chat 2s ease-in-out infinite;
}

@keyframes pulse-chat {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.9; }
}

.navbar-chatbot-label {
  display: none;
}


.navbar-chat-window {
  position: fixed !important;
  top: 0 !important;
  right: 0 !important;
  left: auto !important;
  bottom: 0 !important;
  width: 420px;
  height: 100vh;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.98) 100%);
  backdrop-filter: blur(20px);
  box-shadow: -8px 0 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 10000 !important;
  overflow: hidden;
  animation: slideInRight 0.3s ease-out;
  border-left: 2px solid rgba(99, 102, 241, 0.1);
  transform: none !important;
  margin: 0 !important;
  
  @media (max-width: 768px) {
    width: 85vw;
    max-width: 360px;
  }
  
  @media (max-width: 480px) {
    width: 100vw;
    left: 0 !important;
    border-left: none;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Backdrop overlay for side panel */
.navbar-chat-window::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 420px;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
  z-index: -1;
  animation: fadeIn 0.3s ease-out;
  
  @media (max-width: 768px) {
    right: 15vw;
  }
  
  @media (max-width: 480px) {
    right: 0;
    background: rgba(0, 0, 0, 0.5);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.navbar-chat-header {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  padding: 24px 24px;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    padding: 18px 16px;
    font-size: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 16px 14px;
    font-size: 15px;
  }
}

.navbar-chat-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 22px;
  cursor: pointer;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 18px;
  }
}

.navbar-chat-close:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: rotate(90deg) scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.navbar-chat-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
  background: #f8f9fb;
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  @media (max-width: 768px) {
    padding: 16px;
    gap: 10px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    gap: 8px;
  }
}

/* Chat Messages */
.chat-msg {
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

.chat-msg.bot {
  justify-content: flex-start;
}

.chat-msg.user {
  justify-content: flex-end;
}

.chat-msg p {
  background: white;
  padding: 11px 14px;
  border-radius: 12px;
  margin: 0;
  font-size: 13px;
  color: #333;
  line-height: 1.4;
  max-width: 85%;
  word-wrap: break-word;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  
  @media (max-width: 480px) {
    padding: 9px 11px;
    font-size: 12px;
    border-radius: 10px;
    max-width: 90%;
  }
}

.chat-msg.bot p {
  background: #fff;
  border-left: 3px solid #ff6b6b;
}

.chat-msg.user p {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  border: none;
}

/* Quick Questions Section */
.quick-questions-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: white;
  border-radius: 10px;
  margin: 8px 0;
  
  @media (max-width: 480px) {
    gap: 8px;
    padding: 10px;
    border-radius: 8px;
    margin: 6px 0;
  }
}

.quick-questions-label {
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
  
  @media (max-width: 480px) {
    font-size: 10px;
    margin-bottom: 4px;
  }
}

.quick-questions-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-question-btn {
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  border: 1px solid #ddd;
  color: #333;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  font-weight: 500;
  font-family: inherit;
  
  @media (max-width: 480px) {
    padding: 8px 10px;
    font-size: 11.5px;
    border-radius: 6px;
  }
}

.quick-question-btn:hover {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  border-color: #4f46e5;
  transform: translateX(4px);
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.2);
}

.quick-question-btn:active {
  transform: translateX(2px);
}

/* Chat Input Wrapper */
.chat-input-wrapper {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid #e0e0e0;
  
  @media (max-width: 480px) {
    gap: 8px;
    padding-top: 10px;
    margin-top: 6px;
  }
}

.navbar-chat-input {
  flex: 1;
  padding: 10px 13px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 12px;
  font-family: inherit;
  background: white;
  transition: all 0.2s;
  color: #333;
  
  @media (max-width: 480px) {
    padding: 8px 10px;
    font-size: 11px;
    border-radius: 6px;
  }
}

.navbar-chat-input:focus {
  outline: none;
  border-color: #ff6b6b;
  box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.1);
  background: #fffafb;
}

.navbar-chat-input::placeholder {
  color: #999;
}

.chat-send-btn {
  background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
  color: white;
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-send-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #ff5252, #ee4444);
  transform: scale(1.08);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.chat-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Scrollbar styling */
.navbar-chat-body::-webkit-scrollbar {
  width: 6px;
}

.navbar-chat-body::-webkit-scrollbar-track {
  background: transparent;
}

.navbar-chat-body::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;
}

.navbar-chat-body::-webkit-scrollbar-thumb:hover {
  background: #ff6b6b;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Common utility classes */
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }
.mb-5 { margin-bottom: 3rem; }

.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 1rem; }
.mt-4 { margin-top: 1.5rem; }
.mt-5 { margin-top: 3rem; }

.ms-1 { margin-left: 0.25rem; }
.ms-2 { margin-left: 0.5rem; }
.me-1 { margin-right: 0.25rem; }
.me-2 { margin-right: 0.5rem; }

.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 1rem; }
.p-4 { padding: 1.5rem; }
.p-5 { padding: 3rem; }

.d-flex { display: flex; }
.flex-column { flex-direction: column; }
.align-items-center { align-items: center; }
.justify-content-center { justify-content: center; }
.justify-content-between { justify-content: space-between; }

.text-center { text-align: center; }
.text-primary { color: var(--accent-color); }
.text-secondary { color: var(--text-secondary); }

/* Responsive Styles for Chatbot */
@media (max-width: 1024px) {
  .navbar-chatbot-btn {
    padding: 12px 24px;
    font-size: 14px;
  }
  
  .navbar-chatbot-label {
    display: inline;
  }
  
  .navbar-chat-window {
    width: 340px;
  }
}

/* Tablets and Mobile */
@media (max-width: 768px) {
  .navbar-chatbot-center {
    position: static;
    transform: none;
    margin-left: auto;
    margin-right: 10px;
  }
  
  .navbar-chatbot-btn {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
  
  .navbar-chatbot-btn i {
    font-size: 20px;
  }
  
  .navbar-chat-window {
    width: 100vw;
    right: 0;
  }
  
  .navbar-chat-window::before {
    right: 100vw;
  }
  
  .navbar-chat-body {
    padding: 16px;
  }
  
  .navbar-chat-header {
    padding: 20px;
    font-size: 16px;
  }
  
  .quick-questions-buttons {
    grid-template-columns: 1fr;
  }
  
  .quick-question-btn {
    font-size: 13px;
    padding: 10px 14px;
  }
}

/* Small Mobile Devices */
@media (max-width: 480px) {
  .navbar-chatbot-btn {
    width: 44px;
    height: 44px;
    font-size: 18px;
  }
  
  .navbar-chat-header {
    padding: 16px;
    font-size: 15px;
  }
  
  .navbar-chat-body {
    padding: 12px;
  }
  
  .chat-msg {
    font-size: 13px;
    padding: 10px 12px;
  }
  
  .navbar-chat-input {
    font-size: 14px;
  }
}

/* Responsive Styles */
@media (max-width: 768px) {
  .navbar-container {
    padding: 0 15px;
  }
  
  .navbar-toggler {
    display: none;
  }
  
  .brand-tagline {
    display: none;
  }

  .navbar-menu {
    display: none !important;
  }

  .menu-active {
    right: 0;
  }
  
  .navbar-nav {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-item {
    margin: 0 0 20px;
    width: 100%;
  }
  
  .nav-link {
    font-size: 1.1rem;
    padding: 12px 0;
    width: 100%;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .nav-link::after {
    bottom: -1px;
    left: 0;
    transform: none;
    height: 2px;
    width: 0;
    border-radius: 0;
  }
  
  .nav-link:hover::after, .router-link-active::after {
    width: 30px;
    border-radius: 0;
  }
  
  /* Add overlay when menu is open */
  .menu-active::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: -1;
    animation: fadeIn 0.3s forwards;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}

/* CSS Variables for Theme Toggle */
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

/* Dark theme variables */
body.dark-theme {
  --bg-gradient: linear-gradient(135deg, #0f172a, #1e293b, #334155);
  --header-bg: rgba(15, 23, 42, 0.85);
  --card-bg: rgba(30, 41, 59, 0.9);
  --footer-bg: rgba(15, 23, 42, 0.7);
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --accent-color: #818cf8;
  --border-color: rgba(51, 65, 85, 0.5);
  --card-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  --card-shadow-hover: 0 10px 25px rgba(0, 0, 0, 0.3);
  --btn-hover-bg: rgba(129, 140, 248, 0.1);
  
  /* Chat panel dark theme */
  .navbar-chat-window {
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%);
    border-left-color: rgba(129, 140, 248, 0.2);
  }
  
  .navbar-chat-window::before {
    background: rgba(0, 0, 0, 0.5);
  }
  
  .navbar-chat-header {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  }
  
  .chat-msg.user {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: white;
  }
  
  .chat-msg.bot {
    background: rgba(51, 65, 85, 0.5);
    color: #e2e8f0;
    border: 1px solid rgba(129, 140, 248, 0.2);
  }
  
  .navbar-chat-input {
    background: rgba(51, 65, 85, 0.5);
    border-color: rgba(129, 140, 248, 0.3);
    color: #e2e8f0;
  }
  
  .navbar-chat-input:focus {
    background: rgba(51, 65, 85, 0.7);
    border-color: #818cf8;
    box-shadow: 0 0 0 2px rgba(129, 140, 248, 0.2);
  }
  
  .navbar-chat-input::placeholder {
    color: #94a3b8;
  }
  
  .chat-send-btn {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  }
  
  .chat-send-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
  }
  
  .quick-question-btn {
    background: rgba(51, 65, 85, 0.5);
    color: #e2e8f0;
    border: 1px solid rgba(129, 140, 248, 0.3);
  }
  
  .quick-question-btn:hover {
    background: rgba(79, 70, 229, 0.3);
    border-color: #818cf8;
  }
  
  .quick-questions-label {
    color: #94a3b8;
  }
}

/* Body adjustments when chat is open on larger screens */
@media (min-width: 769px) {
  body.chat-open {
    padding-right: 420px;
    transition: padding-right 0.3s ease;
  }
  
  body.chat-open .weather-dashboard {
    transition: all 0.3s ease;
  }
}

@media (min-width: 1440px) {
  body.chat-open {
    padding-right: 480px;
  }
}

@media (min-width: 1025px) and (max-width: 1440px) {
  body.chat-open {
    padding-right: 420px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  body.chat-open {
    padding-right: 380px;
  }
}

/* Ensure smooth transitions for all interactive elements */
* {
  -webkit-tap-highlight-color: transparent;
}

button, a, input, textarea {
  touch-action: manipulation;
}

/* Improve scrollbar appearance on all devices */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.3);
  border-radius: 4px;
  transition: background 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.5);
}

body.dark-theme ::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

body.dark-theme ::-webkit-scrollbar-thumb {
  background: rgba(129, 140, 248, 0.3);
}

body.dark-theme ::-webkit-scrollbar-thumb:hover {
  background: rgba(129, 140, 248, 0.5);
}

/* Enhanced Light Theme Styles */
body:not(.dark-theme) .premium-navbar {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(249, 250, 251, 0.98));
  box-shadow: 0 4px 24px rgba(99, 102, 241, 0.12);
  border-bottom-color: rgba(99, 102, 241, 0.15);
}

body:not(.dark-theme) .premium-navbar.scrolled {
  background: rgba(99, 102, 241, 0.98);
}

body:not(.dark-theme) .navbar-brand .brand-text {
  color: #1e293b;
}

body:not(.dark-theme) .brand-accent {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

body:not(.dark-theme) .nav-link {
  color: #475569;
}

body:not(.dark-theme) .nav-link:hover {
  color: #6366f1;
  background: rgba(99, 102, 241, 0.08);
}

body:not(.dark-theme) .navbar-chatbot-btn {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
}

body:not(.dark-theme) .navbar-chatbot-btn:hover {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

body:not(.dark-theme) .navbar-chat-window {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(249, 250, 251, 0.98));
  box-shadow: -4px 0 30px rgba(99, 102, 241, 0.15);
}

body:not(.dark-theme) .navbar-chat-header {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
}

body:not(.dark-theme) .chat-msg.bot p {
  background: linear-gradient(135deg, #f0f4ff, #e8ecff);
  color: #1e293b;
  border-left: 4px solid #6366f1;
}

body:not(.dark-theme) .chat-msg.user p {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
}

body:not(.dark-theme) .quick-questions-section {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(99, 102, 241, 0.1);
}

body:not(.dark-theme) .quick-question-btn {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  color: #1e293b;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

body:not(.dark-theme) .quick-question-btn:hover {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border-color: #6366f1;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
}

body:not(.dark-theme) .navbar-chat-input {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(99, 102, 241, 0.2);
  color: #1e293b;
}

body:not(.dark-theme) .navbar-chat-input:focus {
  background: white;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

body:not(.dark-theme) .chat-send-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
}

body:not(.dark-theme) .chat-send-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
}
</style>