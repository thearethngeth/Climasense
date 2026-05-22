<template>
  <div class="precipitation-card">

    <div class="card-header">
      <div class="header-title">
        <i class="fas fa-cloud-rain"></i>
        <h3>Precipitation</h3>
      </div>
      <div class="header-badge" :class="precipitationClass">
        {{ precipitationStatus }}
      </div>
    </div>

    <div class="card-content">

      <!-- Circular gauge with stats underneath -->
      <div class="precip-top">

        <!-- SVG ring gauge -->
        <div class="ring-wrap">
          <svg class="ring-svg" viewBox="0 0 120 120" fill="none">
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stop-color="#3b82f6"/>
                <stop offset="100%" stop-color="#93c5fd"/>
              </linearGradient>
              <filter id="rGlow">
                <feGaussianBlur stdDeviation="2.5" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            <!-- Track -->
            <circle cx="60" cy="60" r="50"
              stroke="var(--border)" stroke-width="9" fill="none"/>
            <!-- Progress — rotated so it starts at top -->
            <circle cx="60" cy="60" r="50"
              stroke="url(#ringGrad)"
              stroke-width="9"
              fill="none"
              stroke-linecap="round"
              :stroke-dasharray="ringCircumference"
              :stroke-dashoffset="ringOffset"
              transform="rotate(-90 60 60)"
              filter="url(#rGlow)"
              style="transition: stroke-dashoffset 1.1s cubic-bezier(.34,1.56,.64,1)"
            />
            <!-- Center -->
            <text x="60" y="55" text-anchor="middle" class="ring-val">{{ precipitationAmount }}</text>
            <text x="60" y="68" text-anchor="middle" class="ring-unit">mm / hr</text>
          </svg>
        </div>

        <!-- 4 stat pills -->
        <div class="stat-grid">
          <div class="stat-item">
            <div class="stat-icon blue"><i class="fas fa-clock"></i></div>
            <div class="stat-body">
              <span class="stat-label">Last 1h</span>
              <span class="stat-value">{{ lastHourPrecip }}<span class="stat-u"> mm</span></span>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon blue"><i class="fas fa-calendar-day"></i></div>
            <div class="stat-body">
              <span class="stat-label">Last 3h</span>
              <span class="stat-value">{{ last3HoursPrecip }}<span class="stat-u"> mm</span></span>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon teal"><i class="fas fa-droplet"></i></div>
            <div class="stat-body">
              <span class="stat-label">Humidity</span>
              <span class="stat-value">{{ humidity }}<span class="stat-u">%</span></span>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon grey"><i class="fas fa-cloud"></i></div>
            <div class="stat-body">
              <span class="stat-label">Cloud</span>
              <span class="stat-value">{{ cloudCover }}<span class="stat-u">%</span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Rain chance banner (only if >0) -->
      <div class="rain-chance-bar" v-if="nextRainChance > 0">
        <div class="rcb-left">
          <i class="fas fa-umbrella"></i>
          <span>Rain chance next hours</span>
        </div>
        <div class="rcb-right">
          <div class="rcb-track">
            <div class="rcb-fill" :style="{ width: nextRainChance + '%' }"></div>
          </div>
          <span class="rcb-pct">{{ nextRainChance }}%</span>
        </div>
      </div>

      <!-- 24h forecast bars -->
      <div class="forecast-section">
        <div class="forecast-header">
          <i class="fas fa-chart-bar"></i>
          Next 24 Hours
        </div>
        <div class="forecast-bars">
          <div v-for="(hour, i) in next24Hours" :key="i" class="bar-item">
            <div class="bar-track">
              <div class="bar-fill"
                :style="{ height: getBarHeight(hour.precipitation) }"
                :class="{ 'bar-active': parseFloat(hour.precipitation) > 0 }">
              </div>
            </div>
            <span class="bar-time">{{ hour.time }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: "Precipitation",
  setup() {
    const store = useStore();

    const weatherData  = computed(() => store.state.weather);
    const forecastData = computed(() => store.state.forecast);

    const lastHourPrecip = computed(() => {
      if (weatherData.value?.rain?.['1h']) return weatherData.value.rain['1h'].toFixed(1);
      if (weatherData.value?.snow?.['1h']) return weatherData.value.snow['1h'].toFixed(1);
      return '0.0';
    });

    const last3HoursPrecip = computed(() => {
      if (weatherData.value?.rain?.['3h']) return weatherData.value.rain['3h'].toFixed(1);
      if (weatherData.value?.snow?.['3h']) return weatherData.value.snow['3h'].toFixed(1);
      return '0.0';
    });

    const precipitationAmount = computed(() => parseFloat(lastHourPrecip.value).toFixed(1));

    const precipitationStatus = computed(() => {
      const v = parseFloat(precipitationAmount.value);
      if (v === 0)   return 'None';
      if (v < 2.5)   return 'Light';
      if (v < 7.5)   return 'Moderate';
      if (v < 50)    return 'Heavy';
      return 'Extreme';
    });

    const precipitationClass = computed(() => {
      const v = parseFloat(precipitationAmount.value);
      if (v === 0) return 'none';
      if (v < 2.5) return 'light';
      if (v < 7.5) return 'moderate';
      if (v < 50)  return 'heavy';
      return 'extreme';
    });

    const ringCircumference = computed(() => 2 * Math.PI * 50);
    const ringOffset = computed(() => {
      const pct = Math.min(parseFloat(precipitationAmount.value) / 10, 1);
      return ringCircumference.value * (1 - pct);
    });

    const humidity   = computed(() => weatherData.value?.main?.humidity ?? 0);
    const cloudCover = computed(() => weatherData.value?.clouds?.all ?? 0);

    const nextRainChance = computed(() => {
      if (!forecastData.value?.list?.length) return 0;
      let max = 0;
      for (let i = 0; i < Math.min(4, forecastData.value.list.length); i++) {
        max = Math.max(max, forecastData.value.list[i]?.pop ?? 0);
      }
      return Math.round(max * 100);
    });

    const next24Hours = computed(() => {
      if (!forecastData.value?.list) return [];
      return forecastData.value.list.slice(0, 8).map(item => {
        const h = new Date(item.dt * 1000).getHours();
        const precip = item.rain?.['3h'] ?? item.snow?.['3h'] ?? 0;
        return { time: `${h}h`, precipitation: precip.toFixed(1) };
      });
    });

    const getBarHeight = p => {
      const pct = Math.min((parseFloat(p) / 10) * 100, 100);
      return pct < 2 ? '4px' : `${pct}%`;
    };

    return {
      precipitationAmount, lastHourPrecip, last3HoursPrecip,
      precipitationStatus, precipitationClass,
      ringCircumference, ringOffset,
      humidity, cloudCover, nextRainChance,
      next24Hours, getBarHeight,
    };
  }
};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px 12px;
  border-bottom: 1px solid var(--border, rgba(52,116,140,0.1));
}

.header-title {
  display: flex;
  align-items: center;
  gap: 9px;
}

.header-title i {
  font-size: 15px;
  color: #3b82f6;
  filter: drop-shadow(0 1px 4px rgba(59,130,246,0.4));
}

.header-title h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary, #17242b);
  letter-spacing: -0.2px;
}

.header-badge {
  padding: 4px 11px;
  border-radius: 100px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.header-badge.none     { background: rgba(16,185,129,0.12); color: #065f46; }
.header-badge.light    { background: rgba(59,130,246,0.12); color: #1d4ed8; }
.header-badge.moderate { background: rgba(245,158,11,0.12); color: #92400e; }
.header-badge.heavy    { background: rgba(239,68,68,0.12);  color: #991b1b; }
.header-badge.extreme  { background: rgba(124,58,237,0.12); color: #5b21b6; }

.card-content {
  padding: 16px 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Top: gauge + stats ── */
.precip-top {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 18px;
}

.ring-wrap {
  align-self: center;
  flex-shrink: 0;
  width: min(178px, 62%);
}

.ring-svg { width: 100%; overflow: visible; }

.ring-val {
  font-size: 26px;
  font-weight: 800;
  fill: var(--text-primary, #17242b);
  letter-spacing: -1px;
  font-family: inherit;
}

.ring-unit {
  font-size: 9.5px;
  font-weight: 600;
  fill: var(--text-muted, #899aa3);
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ── Stat grid ── */
.stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-card-alt, #f7fbfc);
  border: 1px solid var(--border, rgba(52,116,140,0.1));
  border-radius: 12px;
  padding: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(23,36,43,0.07);
}

.stat-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  i { font-size: 13px; }
}

.stat-icon.blue { background: rgba(59,130,246,0.12); color: #3b82f6; }
.stat-icon.teal { background: rgba(6,182,212,0.12);  color: #0891b2; }
.stat-icon.grey { background: var(--accent-light, #e4f1f5); color: var(--accent, #34748c); }

.stat-body {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.stat-label {
  font-size: 10.5px;
  color: var(--text-muted, #899aa3);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.stat-value {
  font-size: 16px;
  font-weight: 800;
  color: var(--text-primary, #17242b);
  letter-spacing: -0.3px;
  line-height: 1;
}

.stat-u {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted, #899aa3);
  letter-spacing: 0;
}

/* ── Rain chance bar ── */
.rain-chance-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 13px;
  background: rgba(59,130,246,0.05);
  border: 1px solid rgba(59,130,246,0.18);
  border-radius: 11px;
}

.rcb-left {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary, #50646f);
  white-space: nowrap;
  i { font-size: 12px; color: #3b82f6; }
}

.rcb-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: flex-end;
}

.rcb-track {
  flex: 1;
  max-width: 100px;
  height: 5px;
  border-radius: 100px;
  background: var(--border, rgba(52,116,140,0.12));
  overflow: hidden;
}

.rcb-fill {
  height: 100%;
  border-radius: 100px;
  background: linear-gradient(90deg, #3b82f6, #93c5fd);
  transition: width 1.1s cubic-bezier(.34,1.56,.64,1);
  min-width: 4px;
}

.rcb-pct {
  font-size: 13px;
  font-weight: 800;
  color: #3b82f6;
  letter-spacing: -0.3px;
  white-space: nowrap;
}

/* ── Forecast bars ── */
.forecast-section { display: flex; flex-direction: column; gap: 10px; }

.forecast-header {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text-secondary, #50646f);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  i { font-size: 11px; color: var(--text-muted, #899aa3); }
}

.forecast-bars {
  display: flex;
  gap: 5px;
  align-items: flex-end;
  height: 72px;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  height: 100%;
}

.bar-track {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: var(--bg-card-alt, #f7fbfc);
  border: 1px solid var(--border, rgba(52,116,140,0.08));
  border-radius: 5px;
  overflow: hidden;
}

.bar-fill {
  width: 100%;
  border-radius: 4px 4px 0 0;
  background: rgba(148,197,253,0.35);
  transition: height 1s cubic-bezier(.34,1.56,.64,1);
}

.bar-fill.bar-active {
  background: linear-gradient(180deg, #3b82f6, #93c5fd);
  box-shadow: 0 -2px 8px rgba(59,130,246,0.3);
}

.bar-time {
  font-size: 9.5px;
  font-weight: 600;
  color: var(--text-muted, #899aa3);
  white-space: nowrap;
}

@media (max-width: 480px) {
  .ring-wrap {
    width: min(160px, 70%);
  }

  .stat-grid {
    grid-template-columns: 1fr;
  }
}
</style>
