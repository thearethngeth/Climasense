<template>
  <div class="sun-card p-4">
    <div class="card-content">

      <!-- SVG Arc Path -->
      <div class="sun-arc-wrap">
        <svg class="sun-arc-svg" viewBox="0 0 280 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stop-color="#fb923c" stop-opacity="0.5"/>
              <stop offset="50%"  stop-color="#fbbf24" stop-opacity="0.7"/>
              <stop offset="100%" stop-color="#818cf8" stop-opacity="0.5"/>
            </linearGradient>
            <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stop-color="#f97316"/>
              <stop offset="100%" stop-color="#fbbf24"/>
            </linearGradient>
            <filter id="sunGlow">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="moonGlow">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          <!-- Ground fill -->
          <rect x="0" y="130" width="280" height="20" fill="var(--bg-card-alt)" rx="2"/>

          <!-- Sky fill under arc (subtle) -->
          <path d="M 24 130 A 116 116 0 0 1 256 130" fill="url(#skyGrad)" opacity="0.15"/>

          <!-- Arc track (dashed) -->
          <path d="M 24 130 A 116 116 0 0 1 256 130"
            stroke="var(--border-strong)" stroke-width="1.5" stroke-dasharray="4 5"
            stroke-linecap="round" fill="none" opacity="0.5"/>

          <!-- Elapsed arc -->
          <path d="M 24 130 A 116 116 0 0 1 256 130"
            stroke="url(#progressGrad)"
            stroke-width="2.5"
            stroke-linecap="round"
            fill="none"
            :stroke-dasharray="arcLen"
            :stroke-dashoffset="arcOffset"
            style="transition: stroke-dashoffset 1.2s cubic-bezier(.34,1.56,.64,1)"
          />

          <!-- Horizon line -->
          <line x1="14" y1="130" x2="266" y2="130"
            stroke="var(--border-strong)" stroke-width="1" opacity="0.6"/>

          <!-- Sunrise pin -->
          <g>
            <circle cx="24" cy="130" r="5" fill="#f97316" opacity="0.25"/>
            <circle cx="24" cy="130" r="3" fill="#f97316"/>
          </g>

          <!-- Sunset pin -->
          <g>
            <circle cx="256" cy="130" r="5" fill="#818cf8" opacity="0.25"/>
            <circle cx="256" cy="130" r="3" fill="#818cf8"/>
          </g>

          <!-- Sun / Moon icon on arc -->
          <g
            :style="{
              transform: `translate(${sunX - 140}px, ${sunY - 75}px)`,
              transition: 'transform 1.2s cubic-bezier(.34,1.56,.64,1)'
            }"
          >
            <!-- Sun rays (only when daytime) -->
            <g v-if="!isNight" filter="url(#sunGlow)">
              <circle cx="140" cy="75" r="10" fill="#fbbf24"/>
              <circle cx="140" cy="75" r="6"  fill="#fde68a"/>
              <!-- rays -->
              <line x1="140" y1="60" x2="140" y2="56" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
              <line x1="140" y1="90" x2="140" y2="94" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
              <line x1="125" y1="75" x2="121" y2="75" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
              <line x1="155" y1="75" x2="159" y2="75" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
              <line x1="129.4" y1="64.4" x2="126.6" y2="61.6" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
              <line x1="150.6" y1="85.6" x2="153.4" y2="88.4" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
              <line x1="150.6" y1="64.4" x2="153.4" y2="61.6" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
              <line x1="129.4" y1="85.6" x2="126.6" y2="88.4" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
            </g>
            <!-- Moon (night) -->
            <g v-else filter="url(#moonGlow)">
              <path d="M 146 68 A 10 10 0 1 1 134 80 A 7 7 0 0 0 146 68 Z"
                fill="#818cf8"/>
              <circle cx="143" cy="70" r="1.5" fill="#c7d2fe" opacity="0.8"/>
              <circle cx="138" cy="77" r="1"   fill="#c7d2fe" opacity="0.6"/>
            </g>
          </g>

          <!-- Sunrise label -->
          <text x="24" y="145" text-anchor="middle" class="arc-label sunrise-label">{{ formattedSunrise }}</text>

          <!-- Sunset label -->
          <text x="256" y="145" text-anchor="middle" class="arc-label sunset-label">{{ formattedSunset }}</text>
        </svg>
      </div>

      <!-- Time boxes -->
      <div class="sun-times">
        <!-- Sunrise -->
        <div class="time-box sunrise-box">
          <div class="tbox-icon"><i class="fas fa-sun"></i></div>
          <div class="tbox-label">Sunrise</div>
          <div class="tbox-value">{{ formattedSunrise }}</div>
        </div>

        <!-- Day progress -->
        <div class="time-box center-box">
          <div class="tbox-label">{{ isNight ? 'Local Time' : 'Current Time' }}</div>
          <div class="tbox-value center-time">{{ currentTime }}</div>
          <div class="day-prog-track">
            <div class="day-prog-fill" :style="{ width: dayProgressPercentage + '%' }"></div>
          </div>
          <div class="day-length-row">
            <i class="fas fa-hourglass-half"></i>
            {{ dayLength }} daylight
          </div>
        </div>

        <!-- Sunset -->
        <div class="time-box sunset-box">
          <div class="tbox-icon"><i class="fas fa-moon"></i></div>
          <div class="tbox-label">Sunset</div>
          <div class="tbox-value">{{ formattedSunset }}</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "SunriseSunset",
  data() {
    return {
      now: moment.utc(),
      intervalId: null,
      arcLen: 365, // approx half-ellipse length for viewBox arc
    };
  },
  created() {
    this.intervalId = setInterval(() => { this.now = moment.utc(); }, 60000);
  },
  beforeUnmount() {
    if (this.intervalId) clearInterval(this.intervalId);
  },
  computed: {
    weather() { return this.$store.state.weather; },
    hasSunData() {
      return Boolean(this.weather?.sys?.sunrise && this.weather?.sys?.sunset);
    },
    formattedSunrise() {
      if (!this.hasSunData) return "--";
      return this.formatTime(this.weather.sys.sunrise);
    },
    formattedSunset() {
      if (!this.hasSunData) return "--";
      return this.formatTime(this.weather.sys.sunset);
    },
    currentTime() {
      if (!this.weather) return this.now.clone().local().format("hh:mm A");
      return this.now.clone().add(this.weather.timezone, "seconds").format("hh:mm A");
    },
    cityNow() {
      if (!this.weather) return this.now;
      return this.now.clone().add(this.weather.timezone, "seconds");
    },
    sunriseTime() {
      if (!this.hasSunData) return null;
      return moment.unix(this.weather.sys.sunrise).add(this.weather.timezone, "seconds");
    },
    sunsetTime() {
      if (!this.hasSunData) return null;
      return moment.unix(this.weather.sys.sunset).add(this.weather.timezone, "seconds");
    },
    isNight() {
      if (!this.sunriseTime || !this.sunsetTime) return false;
      return this.cityNow.isBefore(this.sunriseTime) || this.cityNow.isAfter(this.sunsetTime);
    },
    // 0–1 progress along the arc (daytime only)
    arcProgress() {
      if (!this.sunriseTime || !this.sunsetTime) return 0;
      const now = this.cityNow;
      if (now.isBefore(this.sunriseTime)) return 0;
      if (now.isAfter(this.sunsetTime))   return 1;
      return now.diff(this.sunriseTime) / this.sunsetTime.diff(this.sunriseTime);
    },
    arcOffset() {
      return this.arcLen * (1 - this.arcProgress);
    },
    dayProgressPercentage() {
      return Math.round(this.arcProgress * 100);
    },
    // Sun/moon XY position along the SVG semicircle arc
    // Arc goes from (24,130) to (256,130) centered at (140,130) radius ~116
    sunX() {
      const t = this.arcProgress; // 0=sunrise, 1=sunset
      const angle = Math.PI - t * Math.PI; // π → 0 (left to right)
      return 140 + 116 * Math.cos(angle);
    },
    sunY() {
      const t = this.arcProgress;
      const angle = Math.PI - t * Math.PI;
      return 130 - 116 * Math.abs(Math.sin(angle));
    },
    dayLength() {
      if (!this.hasSunData) return "--";
      const dur = moment.duration(this.sunsetTime.diff(this.sunriseTime));
      return `${Math.floor(dur.asHours())}h ${Math.floor(dur.asMinutes() % 60)}m`;
    },
  },
  methods: {
    formatTime(ts) {
      if (!this.weather || !ts) return "--";
      return moment.unix(ts).add(this.weather.timezone, "seconds").format("hh:mm A");
    },
  },
};
</script>

<style scoped>
.card-content {
  flex: 1;
  padding: 16px 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* ── Arc ── */
.sun-arc-wrap {
  display: flex;
  justify-content: center;
}

.sun-arc-svg {
  width: 100%;
  max-width: 300px;
  overflow: visible;
}

.arc-label {
  font-size: 8.5px;
  font-family: inherit;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.sunrise-label { fill: #f97316; }
.sunset-label  { fill: #818cf8; }

/* ── Time boxes ── */
.sun-times {
  display: grid;
  grid-template-columns: 1fr 1.4fr 1fr;
  gap: 10px;
}

.time-box {
  background: var(--bg-card-alt, #f7fbfc);
  border: 1px solid var(--border, rgba(52,116,140,0.1));
  border-radius: 12px;
  padding: 11px 10px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.tbox-icon i {
  font-size: 14px;
}

.sunrise-box .tbox-icon i { color: #f97316; filter: drop-shadow(0 0 5px rgba(249,115,22,0.5)); }
.sunset-box  .tbox-icon i { color: #818cf8; filter: drop-shadow(0 0 5px rgba(129,140,248,0.5)); }

.tbox-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted, #899aa3);
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.tbox-value {
  font-size: 14px;
  font-weight: 800;
  color: var(--text-primary, #17242b);
  letter-spacing: -0.3px;
  line-height: 1;
}

.sunrise-box .tbox-value { color: #f97316; }
.sunset-box  .tbox-value { color: #818cf8; }

/* center box */
.center-box {
  border-color: rgba(251,191,36,0.25);
  background: rgba(251,191,36,0.04);
  padding: 11px 12px 10px;
}

.center-time {
  font-size: 16px !important;
  color: var(--text-primary, #17242b) !important;
}

.day-prog-track {
  width: 100%;
  height: 4px;
  border-radius: 100px;
  background: var(--border, rgba(52,116,140,0.12));
  overflow: hidden;
  margin-top: 2px;
}

.day-prog-fill {
  height: 100%;
  border-radius: 100px;
  background: linear-gradient(90deg, #f97316, #fbbf24);
  transition: width 1.1s cubic-bezier(.34,1.56,.64,1);
  min-width: 4px;
}

.day-length-row {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  color: var(--text-muted, #899aa3);
  font-weight: 500;
  white-space: nowrap;
}

.day-length-row i { font-size: 9px; color: #fbbf24; }

@media (max-width: 420px) {
  .sun-times { grid-template-columns: 1fr 1fr; }
  .center-box { grid-column: 1 / -1; }
}
</style>