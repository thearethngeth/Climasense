<template>
  <div class="air-quality-card" data-aos="fade-up">

    <div class="card-content">

      <!-- AQI Gauge -->
      <div class="aqi-gauge-section">
        <svg class="aqi-svg" viewBox="0 0 220 125" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="aqiArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stop-color="#22c55e"/>
              <stop offset="25%"  stop-color="#eab308"/>
              <stop offset="50%"  stop-color="#f97316"/>
              <stop offset="75%"  stop-color="#ef4444"/>
              <stop offset="100%" stop-color="#a855f7"/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          <!-- Track -->
          <path d="M18 112 A92 92 0 0 1 202 112"
            stroke="var(--border)" stroke-width="10" stroke-linecap="round" fill="none"/>

          <!-- Colored arc -->
          <path d="M18 112 A92 92 0 0 1 202 112"
            stroke="url(#aqiArcGrad)"
            stroke-width="10"
            stroke-linecap="round"
            fill="none"
            :stroke-dasharray="arcLength"
            :stroke-dashoffset="arcOffset"
            style="transition: stroke-dashoffset 1.2s cubic-bezier(.34,1.56,.64,1)"
          />

          <!-- Tick marks -->
          <g v-for="(t, i) in ticks" :key="i">
            <line :x1="t.x1" :y1="t.y1" :x2="t.x2" :y2="t.y2"
              stroke="var(--text-muted)" :stroke-width="t.major ? 1.5 : 1"
              stroke-linecap="round" :opacity="t.major ? 0.5 : 0.2"/>
          </g>

          <!-- Needle -->
          <g :style="{
            transform: `rotate(${needleDeg}deg)`,
            transformOrigin: '110px 112px',
            transition: 'transform 1.2s cubic-bezier(.34,1.56,.64,1)'
          }">
            <polygon points="110,28 107.5,108 112.5,108"
              fill="var(--text-primary)" opacity="0.85" filter="url(#glow)"/>
            <circle cx="110" cy="112" r="8" fill="var(--bg-card)" stroke="var(--border-strong)" stroke-width="1.5"/>
            <circle cx="110" cy="112" r="3.5" fill="var(--accent)"/>
          </g>

          <!-- Level labels -->
          <text x="12"  y="124" class="aqi-tick-lbl">1</text>
          <text x="53"  y="62"  class="aqi-tick-lbl">2</text>
          <text x="110" y="42"  class="aqi-tick-lbl" text-anchor="middle">3</text>
          <text x="167" y="62"  class="aqi-tick-lbl">4</text>
          <text x="204" y="124" class="aqi-tick-lbl">5</text>
        </svg>

        <!-- Value readout -->
        <div class="aqi-readout">
          <span class="aqi-number" :class="`lvl-${aqiLevel}`">{{ aqiLevel }}</span>
          <div class="aqi-labels">
            <span class="aqi-text-badge" :class="`lvl-${aqiLevel}`">{{ aqiText }}</span>
            <span class="aqi-index-label">AQI Index</span>
          </div>
        </div>
      </div>

      <!-- Components grid -->
      <div class="air-components">
        <div
          v-for="(item, i) in componentItems"
          :key="item.key"
          class="component-item"
          :style="{ animationDelay: `${i * 70}ms` }"
        >
          <div class="comp-header">
            <span class="component-name">{{ item.label }}</span>
            <span class="component-value">{{ item.value }}<span class="comp-unit"> μg/m³</span></span>
          </div>
          <div class="comp-bar-track">
            <div class="comp-bar-fill" :style="{ width: item.pct + '%', background: item.color }"></div>
          </div>
        </div>
      </div>

    </div>

    <!-- Footer -->
    <div class="card-footer">
      <div class="aqi-info">
        <i class="fas fa-info-circle me-2"></i>
        <span>Based on WHO air quality guidelines</span>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "AirQuality",
  data() {
    return {
      aqiList: ["Good", "Fair", "Moderate", "Unhealthy", "Poor"],
      componentMeta: {
        pm2_5: { label: "PM2.5",  max: 75,  color: "#f97316" },
        pm10:  { label: "PM10",   max: 150, color: "#eab308" },
        o3:    { label: "Ozone",  max: 180, color: "#06b6d4" },
        no2:   { label: "NO₂",    max: 200, color: "#a855f7" },
      },
      arcLength: 289,
    };
  },
  computed: {
    airQuality() {
      return this.$store.state.airQuality;
    },
    aqiLevel() {
      return this.airQuality?.list?.[0]?.main?.aqi ?? 1;
    },
    aqiText() {
      return this.aqiList[this.aqiLevel - 1] ?? "Good";
    },
    needleDeg() {
      return -90 + ((this.aqiLevel - 1) / 4) * 180;
    },
    arcOffset() {
      return this.arcLength * (1 - (this.aqiLevel - 1) / 4);
    },
    airComponents() {
      return this.airQuality?.list?.[0]?.components ?? {};
    },
    componentItems() {
      return Object.entries(this.componentMeta).map(([key, meta]) => {
        const raw = this.airComponents[key];
        const value = raw !== undefined ? Math.round(raw) : "--";
        const pct   = raw !== undefined ? Math.min((raw / meta.max) * 100, 100) : 0;
        return { key, label: meta.label, value, pct, color: meta.color };
      });
    },
    ticks() {
      const items = [];
      const cx = 110, cy = 112, r = 92;
      for (let i = 0; i <= 20; i++) {
        const angle = -180 + (i / 20) * 180;
        const rad = angle * Math.PI / 180;
        const major = i % 4 === 0;
        const r1 = r - (major ? 18 : 12);
        const r2 = r - (major ? 9  : 5);
        items.push({
          x1: cx + r1 * Math.cos(rad), y1: cy + r1 * Math.sin(rad),
          x2: cx + r2 * Math.cos(rad), y2: cy + r2 * Math.sin(rad),
          major,
        });
      }
      return items;
    },
  },
};
</script>

<style scoped>
.card-content {
  flex: 1;
  padding: 18px 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* ── Gauge ── */
.aqi-gauge-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.aqi-svg {
  width: 100%;
  max-width: 232px;
  overflow: visible;
}

.aqi-tick-lbl {
  font-size: 9px;
  fill: var(--text-muted, #899aa3);
  font-family: inherit;
  font-weight: 600;
}

.aqi-readout {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: -4px;
}

.aqi-number {
  font-size: 48px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -3px;
}

.aqi-labels {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.aqi-text-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.aqi-index-label {
  font-size: 10.5px;
  color: var(--text-muted, #899aa3);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding-left: 2px;
}

.lvl-1 { color: #16a34a; }
.lvl-2 { color: #a16207; }
.lvl-3 { color: #c2410c; }
.lvl-4 { color: #b91c1c; }
.lvl-5 { color: #7e22ce; }

.aqi-text-badge.lvl-1 { background: rgba(34,197,94,0.12);  color: #16a34a; }
.aqi-text-badge.lvl-2 { background: rgba(234,179,8,0.12);  color: #a16207; }
.aqi-text-badge.lvl-3 { background: rgba(249,115,22,0.12); color: #c2410c; }
.aqi-text-badge.lvl-4 { background: rgba(239,68,68,0.12);  color: #b91c1c; }
.aqi-text-badge.lvl-5 { background: rgba(168,85,247,0.12); color: #7e22ce; }

/* ── Components grid ── */
.air-components {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.component-item {
  background: var(--bg-card-alt, #f7fbfc);
  border: 1px solid var(--border, rgba(52,116,140,0.1));
  border-radius: 12px;
  padding: 11px 12px 9px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: compIn 0.4s ease both;
  transition: transform 0.2s, box-shadow 0.2s;
}

.component-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(23,36,43,0.07);
}

@keyframes compIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.comp-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 4px;
}

.component-name {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--text-secondary, #50646f);
}

.component-value {
  font-size: 14px;
  font-weight: 800;
  color: var(--text-primary, #17242b);
  letter-spacing: -0.3px;
}

.comp-unit {
  font-size: 9px;
  font-weight: 500;
  color: var(--text-muted, #899aa3);
}

.comp-bar-track {
  height: 4px;
  border-radius: 100px;
  background: var(--border, rgba(52,116,140,0.12));
  overflow: hidden;
}

.comp-bar-fill {
  height: 100%;
  border-radius: 100px;
  min-width: 4px;
  transition: width 1.1s cubic-bezier(.34,1.56,.64,1);
}

/* ── Footer ── */
.card-footer {
  padding: 12px 20px;
  background: var(--footer-bg, rgba(248, 250, 252, 0.7));
  border-top: 1px solid var(--border-color, rgba(203, 213, 225, 0.5));
  margin-top: auto;
}

.aqi-info {
  font-size: 0.8rem;
  color: var(--text-secondary, #64748b);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>