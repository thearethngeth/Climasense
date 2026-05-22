<template>
  <div class="visibility-card">
    <div class="card-header">
      <div class="header-title">
        <i class="fas fa-eye"></i>
        <h3>Visibility</h3>
      </div>
      <div class="header-badge" :class="visibilityClass">
        {{ visibilityStatus }}
      </div>
    </div>

    <div class="card-content">
      <div class="visibility-gauge-section">
        <svg class="visibility-svg" viewBox="0 0 220 125" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient :id="gradientId" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ef4444"/>
              <stop offset="30%" stop-color="#f59e0b"/>
              <stop offset="62%" stop-color="#34748c"/>
              <stop offset="100%" stop-color="#16a34a"/>
            </linearGradient>
            <filter :id="glowId">
              <feGaussianBlur stdDeviation="2.5" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <path
            d="M18 112 A92 92 0 0 1 202 112"
            stroke="var(--border)"
            stroke-width="10"
            stroke-linecap="round"
            fill="none"
          />

          <path
            d="M18 112 A92 92 0 0 1 202 112"
            :stroke="`url(#${gradientId})`"
            stroke-width="10"
            stroke-linecap="round"
            fill="none"
            :stroke-dasharray="arcLength"
            :stroke-dashoffset="arcOffset"
            class="active-arc"
          />

          <g v-for="(tick, i) in ticks" :key="i">
            <line
              :x1="tick.x1"
              :y1="tick.y1"
              :x2="tick.x2"
              :y2="tick.y2"
              stroke="var(--text-muted)"
              :stroke-width="tick.major ? 1.5 : 1"
              stroke-linecap="round"
              :opacity="tick.major ? 0.5 : 0.2"
            />
          </g>

          <g
            :style="{
              transform: `rotate(${needleDeg}deg)`,
              transformOrigin: '110px 112px',
              transition: 'transform 1.2s cubic-bezier(.34,1.56,.64,1)'
            }"
          >
            <polygon
              points="110,28 107.5,108 112.5,108"
              fill="var(--text-primary)"
              opacity="0.85"
              :filter="`url(#${glowId})`"
            />
            <circle cx="110" cy="112" r="8" fill="var(--bg-card)" stroke="var(--border-strong)" stroke-width="1.5"/>
            <circle cx="110" cy="112" r="3.5" :fill="needleAccent"/>
          </g>

          <text x="12" y="124" class="visibility-tick-lbl">0</text>
          <text x="49" y="62" class="visibility-tick-lbl">2.5</text>
          <text x="110" y="42" class="visibility-tick-lbl" text-anchor="middle">5</text>
          <text x="165" y="62" class="visibility-tick-lbl">7.5</text>
          <text x="199" y="124" class="visibility-tick-lbl">10</text>
        </svg>

        <div class="visibility-readout">
          <span class="visibility-number" :class="visibilityClass">{{ visibilityKm }}</span>
          <div class="visibility-labels">
            <span class="visibility-text-badge" :class="visibilityClass">{{ visibilityStatus }}</span>
            <span class="visibility-index-label">kilometers</span>
          </div>
        </div>
      </div>

      <div class="visibility-summary" :class="visibilityClass">
        <div class="summary-icon-wrap">
          <i :class="visibilityIcon"></i>
        </div>
        <div class="summary-body">
          <div class="summary-title">{{ visibilityTitle }}</div>
          <p>{{ visibilityDescription }}</p>
        </div>
      </div>

      <div class="visibility-bottom-grid">
        <div class="visibility-details">
          <div class="detail-item">
            <div class="detail-icon"><i class="fas fa-car"></i></div>
            <div class="detail-body">
              <span class="detail-label">Driving</span>
              <span class="detail-value">{{ drivingConditions }}</span>
            </div>
          </div>
          <div class="detail-item">
            <div class="detail-icon"><i class="fas fa-ruler-horizontal"></i></div>
            <div class="detail-body">
              <span class="detail-label">Miles</span>
              <span class="detail-value">{{ visibilityMiles }}</span>
            </div>
          </div>
        </div>

        <div class="visibility-tips">
          <div class="tips-title">
            <i class="fas fa-lightbulb"></i>
            Safety Tips
          </div>
          <ul class="tips-list">
            <li v-for="(tip, index) in safetyTips" :key="index">
              <i class="fas fa-circle"></i>
              {{ tip }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';

export default {
  name: "Visibility",
  setup() {
    const store = useStore();
    const arcLength = 289;
    const uid = getCurrentInstance()?.uid ?? "fallback";
    const gradientId = `visibilityArcGrad-${uid}`;
    const glowId = `visibilityGlow-${uid}`;

    const weatherData = computed(() => store.state.weather);

    const visibilityMeters = computed(() => weatherData.value?.visibility || 10000);

    const visibilityKm = computed(() => (visibilityMeters.value / 1000).toFixed(1));

    const visibilityMiles = computed(() => {
      const miles = visibilityMeters.value / 1609.34;
      return miles.toFixed(1);
    });

    const visibilityStatus = computed(() => {
      const km = parseFloat(visibilityKm.value);
      if (km >= 10) return 'Excellent';
      if (km >= 5) return 'Good';
      if (km >= 2) return 'Moderate';
      if (km >= 1) return 'Poor';
      return 'Very Poor';
    });

    const visibilityClass = computed(() => {
      const km = parseFloat(visibilityKm.value);
      if (km >= 10) return 'excellent';
      if (km >= 5) return 'good';
      if (km >= 2) return 'moderate';
      if (km >= 1) return 'poor';
      return 'very-poor';
    });

    const needleAccent = computed(() => {
      const km = parseFloat(visibilityKm.value);
      if (km >= 10) return '#16a34a';
      if (km >= 5) return '#34748c';
      if (km >= 2) return '#a16207';
      return '#b91c1c';
    });

    const needleDeg = computed(() => {
      const km = Math.min(parseFloat(visibilityKm.value), 10);
      return -90 + (km / 10) * 180;
    });

    const arcOffset = computed(() => {
      const km = Math.min(parseFloat(visibilityKm.value), 10);
      return arcLength * (1 - km / 10);
    });

    const visibilityIcon = computed(() => {
      const km = parseFloat(visibilityKm.value);
      if (km >= 10) return 'fas fa-check-circle';
      if (km >= 5) return 'fas fa-eye';
      if (km >= 2) return 'fas fa-low-vision';
      return 'fas fa-exclamation-triangle';
    });

    const visibilityTitle = computed(() => {
      const km = parseFloat(visibilityKm.value);
      if (km >= 10) return 'Excellent Visibility';
      if (km >= 5) return 'Good Visibility';
      if (km >= 2) return 'Moderate Visibility';
      if (km >= 1) return 'Poor Visibility';
      return 'Very Poor Visibility';
    });

    const visibilityDescription = computed(() => {
      const km = parseFloat(visibilityKm.value);
      if (km >= 10) return 'Clear atmospheric conditions with maximum visibility.';
      if (km >= 5) return 'Good visibility for outdoor activity and routine travel.';
      if (km >= 2) return 'Reduced visibility. Use more caution while driving.';
      if (km >= 1) return 'Poor visibility. Slow down and stay alert.';
      return 'Very poor visibility. Avoid unnecessary travel.';
    });

    const drivingConditions = computed(() => {
      const km = parseFloat(visibilityKm.value);
      if (km >= 10) return 'Safe';
      if (km >= 5) return 'Normal';
      if (km >= 2) return 'Cautious';
      if (km >= 1) return 'Hazardous';
      return 'Dangerous';
    });

    const safetyTips = computed(() => {
      const km = parseFloat(visibilityKm.value);

      if (km >= 10) {
        return ['Ideal visibility for outdoor activity', 'Normal driving conditions'];
      }
      if (km >= 5) {
        return ['Good visibility overall', 'Keep normal road awareness'];
      }
      if (km >= 2) {
        return ['Use headlights when driving', 'Increase following distance'];
      }
      if (km >= 1) {
        return ['Use low-beam headlights', 'Drive slowly and carefully', 'Avoid unnecessary travel'];
      }
      return ['Avoid driving if possible', 'Use fog lights and hazard lights', 'Stay indoors if conditions worsen'];
    });

    const ticks = computed(() => {
      const items = [];
      const cx = 110, cy = 112, r = 92;
      for (let i = 0; i <= 20; i++) {
        const angle = -180 + (i / 20) * 180;
        const rad = angle * Math.PI / 180;
        const major = i % 5 === 0;
        const r1 = r - (major ? 18 : 12);
        const r2 = r - (major ? 9 : 5);
        items.push({
          x1: cx + r1 * Math.cos(rad),
          y1: cy + r1 * Math.sin(rad),
          x2: cx + r2 * Math.cos(rad),
          y2: cy + r2 * Math.sin(rad),
          major,
        });
      }
      return items;
    });

    return {
      visibilityKm,
      visibilityMiles,
      visibilityStatus,
      visibilityClass,
      visibilityIcon,
      visibilityTitle,
      visibilityDescription,
      drivingConditions,
      safetyTips,
      arcLength,
      arcOffset,
      needleDeg,
      needleAccent,
      gradientId,
      glowId,
      ticks,
    };
  }
};
</script>

<style scoped>
.visibility-card {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--text-primary, #17242b);
}

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
  font-size: 16px;
  color: var(--accent, #34748c);
}

.header-title h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary, #17242b);
}

.header-badge,
.visibility-text-badge {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 4px 11px;
  border-radius: 100px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.header-badge.excellent,
.visibility-text-badge.excellent { background: rgba(34,197,94,0.12); color: #16a34a; }
.header-badge.good,
.visibility-text-badge.good { background: rgba(52,116,140,0.12); color: var(--accent-dark, #24586d); }
.header-badge.moderate,
.visibility-text-badge.moderate { background: rgba(234,179,8,0.12); color: #a16207; }
.header-badge.poor,
.visibility-text-badge.poor,
.header-badge.very-poor,
.visibility-text-badge.very-poor { background: rgba(239,68,68,0.12); color: #b91c1c; }

.card-content {
  padding: 16px 18px 18px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 0;
}

.visibility-gauge-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.visibility-svg {
  width: 100%;
  max-width: 224px;
  overflow: visible;
}

.active-arc {
  transition: stroke-dashoffset 1.2s cubic-bezier(.34,1.56,.64,1);
}

.visibility-tick-lbl {
  font-size: 9px;
  fill: var(--text-muted, #899aa3);
  font-family: inherit;
  font-weight: 600;
}

.visibility-readout {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: -8px;
}

.visibility-number {
  font-size: 48px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -2px;
}

.visibility-number.excellent { color: #16a34a; }
.visibility-number.good { color: var(--accent-dark, #24586d); }
.visibility-number.moderate { color: #a16207; }
.visibility-number.poor,
.visibility-number.very-poor { color: #b91c1c; }

.visibility-labels {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.visibility-index-label {
  font-size: 10.5px;
  color: var(--text-muted, #899aa3);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding-left: 2px;
}

.visibility-summary {
  display: flex;
  gap: 12px;
  padding: 12px 13px;
  border-radius: 12px;
  border: 1px solid;
  animation: slideUp 0.4s ease both;
}

.visibility-summary.excellent { border-color: rgba(34,197,94,0.2); background: rgba(34,197,94,0.05); }
.visibility-summary.good { border-color: rgba(52,116,140,0.2); background: rgba(52,116,140,0.05); }
.visibility-summary.moderate { border-color: rgba(234,179,8,0.2); background: rgba(234,179,8,0.05); }
.visibility-summary.poor,
.visibility-summary.very-poor { border-color: rgba(239,68,68,0.2); background: rgba(239,68,68,0.05); }

.summary-icon-wrap {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: var(--bg-card, #fff);
  border: 1px solid var(--border, rgba(52,116,140,0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.summary-icon-wrap i {
  font-size: 15px;
}

.excellent .summary-icon-wrap i { color: #16a34a; }
.good .summary-icon-wrap i { color: var(--accent-dark, #24586d); }
.moderate .summary-icon-wrap i { color: #a16207; }
.poor .summary-icon-wrap i,
.very-poor .summary-icon-wrap i { color: #b91c1c; }

.summary-body {
  min-width: 0;
}

.summary-title {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--text-primary, #17242b);
  margin-bottom: 6px;
}

.summary-body p {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.38;
  color: var(--text-secondary, #50646f);
}

.visibility-bottom-grid {
  display: grid;
  grid-template-columns: minmax(132px, 0.92fr) minmax(0, 1.08fr);
  gap: 10px;
  align-items: stretch;
}

.visibility-details {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 11px;
  background: var(--bg-card-alt, #f7fbfc);
  border: 1px solid var(--border, rgba(52,116,140,0.1));
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.detail-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(23,36,43,0.07);
}

.detail-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--accent-light, #e4f1f5);
  color: var(--accent, #34748c);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.detail-icon i {
  font-size: 13px;
}

.detail-body {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.detail-label {
  font-size: 10.5px;
  color: var(--text-muted, #899aa3);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.detail-value {
  font-size: 15px;
  color: var(--text-primary, #17242b);
  font-weight: 700;
}

.visibility-tips {
  padding: 11px 12px;
  border: 1px solid var(--border, rgba(52,116,140,0.1));
  border-radius: 12px;
  background: var(--bg-card-alt, #f7fbfc);
}

.tips-title {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 7px;
  color: var(--text-primary, #17242b);
  font-size: 13.5px;
  font-weight: 700;
}

.tips-title i {
  color: var(--accent, #34748c);
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tips-list li {
  display: flex;
  align-items: baseline;
  gap: 6px;
  color: var(--text-secondary, #50646f);
  font-size: 12.5px;
  line-height: 1.34;
}

.tips-list li i {
  color: var(--text-muted, #899aa3);
  font-size: 6px;
  flex-shrink: 0;
  position: relative;
  top: -1px;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 480px) {
  .card-header,
  .card-content {
    padding-left: 16px;
    padding-right: 16px;
  }

  .visibility-bottom-grid,
  .visibility-details {
    grid-template-columns: 1fr;
  }
}
</style>
