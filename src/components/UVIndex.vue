<template>
  <div class="uv-index-card">

    <div class="card-header">
      <div class="header-title">
        <i class="fas fa-sun"></i>
        <h3>UV Index</h3>
      </div>
      <div class="header-badge" :class="uvIndexClass">
        {{ uvIndexText }}
      </div>
    </div>

    <div class="card-content">

      <!-- Gauge -->
      <div class="uv-gauge-section">
        <svg class="uv-svg" viewBox="0 0 220 125" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="uvArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stop-color="#22c55e"/>
              <stop offset="28%"  stop-color="#eab308"/>
              <stop offset="52%"  stop-color="#f97316"/>
              <stop offset="76%"  stop-color="#ef4444"/>
              <stop offset="100%" stop-color="#a855f7"/>
            </linearGradient>
            <filter id="uvGlow">
              <feGaussianBlur stdDeviation="2.5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          <!-- Track -->
          <path d="M18 112 A92 92 0 0 1 202 112"
            stroke="var(--border)" stroke-width="10" stroke-linecap="round" fill="none"/>

          <!-- Colored arc -->
          <path d="M18 112 A92 92 0 0 1 202 112"
            stroke="url(#uvArcGrad)"
            stroke-width="10"
            stroke-linecap="round"
            fill="none"
            :stroke-dasharray="arcLength"
            :stroke-dashoffset="arcOffset"
            style="transition: stroke-dashoffset 1.2s cubic-bezier(.34,1.56,.64,1)"
          />

          <!-- Ticks -->
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
              fill="var(--text-primary)" opacity="0.85" filter="url(#uvGlow)"/>
            <circle cx="110" cy="112" r="8" fill="var(--bg-card)" stroke="var(--border-strong)" stroke-width="1.5"/>
            <circle cx="110" cy="112" r="3.5" :fill="needleAccent"/>
          </g>

          <!-- Scale labels -->
          <text x="12"  y="124" class="uv-tick-lbl">0</text>
          <text x="49"  y="62"  class="uv-tick-lbl">3</text>
          <text x="110" y="42"  class="uv-tick-lbl" text-anchor="middle">6</text>
          <text x="168" y="62"  class="uv-tick-lbl">8</text>
          <text x="202" y="124" class="uv-tick-lbl">11</text>
        </svg>

        <!-- Readout -->
        <div class="uv-readout">
          <span class="uv-number" :class="uvIndexClass">{{ uvIndex }}</span>
          <div class="uv-labels">
            <span class="uv-text-badge" :class="uvIndexClass">{{ uvIndexText }}</span>
            <span class="uv-index-label">UV Index</span>
          </div>
        </div>
      </div>

      <!-- Protection card -->
      <div class="uv-protection" :class="uvIndexClass">
        <div class="protection-icon-wrap">
          <i :class="protectionIcon"></i>
        </div>
        <div class="protection-body">
          <div class="protection-title">{{ protectionTitle }}</div>
          <ul class="protection-list">
            <li v-for="(item, i) in protectionItems" :key="i">
              <i class="fas fa-circle-dot"></i>
              {{ item }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Details row -->
      <div class="uv-details">
        <div class="detail-item">
          <div class="detail-icon"><i class="fas fa-clock"></i></div>
          <div class="detail-body">
            <span class="detail-label">Peak Hours</span>
            <span class="detail-value">10 AM – 4 PM</span>
          </div>
        </div>
        <div class="detail-item">
          <div class="detail-icon"><i class="fas fa-rotate"></i></div>
          <div class="detail-body">
            <span class="detail-label">Updates</span>
            <span class="detail-value">Hourly</span>
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
  name: "UVIndex",
  setup() {
    const store = useStore();

    const arcLength = 289;

    const uvIndex = computed(() =>
      store.getters.uvIndex !== null ? store.getters.uvIndex : 0
    );

    const uvIndexClass = computed(() => {
      const v = uvIndex.value;
      if (v <= 2)  return 'low';
      if (v <= 5)  return 'moderate';
      if (v <= 7)  return 'high';
      if (v <= 10) return 'very-high';
      return 'extreme';
    });

    const uvIndexText = computed(() => {
      const v = uvIndex.value;
      if (v <= 2)  return 'Low';
      if (v <= 5)  return 'Moderate';
      if (v <= 7)  return 'High';
      if (v <= 10) return 'Very High';
      return 'Extreme';
    });

    const needleAccent = computed(() => {
      const v = uvIndex.value;
      if (v <= 2)  return '#22c55e';
      if (v <= 5)  return '#eab308';
      if (v <= 7)  return '#f97316';
      if (v <= 10) return '#ef4444';
      return '#a855f7';
    });

    // needle: -90deg (left) → +90deg (right) over 0–12
    const needleDeg = computed(() =>
      -90 + (Math.min(uvIndex.value, 12) / 12) * 180
    );

    const arcOffset = computed(() =>
      arcLength * (1 - Math.min(uvIndex.value, 12) / 12)
    );

    const ticks = computed(() => {
      const items = [];
      const cx = 110, cy = 112, r = 92;
      for (let i = 0; i <= 24; i++) {
        const angle = -180 + (i / 24) * 180;
        const rad = angle * Math.PI / 180;
        const major = i % 6 === 0;
        const r1 = r - (major ? 18 : 12);
        const r2 = r - (major ? 9  : 5);
        items.push({
          x1: cx + r1 * Math.cos(rad), y1: cy + r1 * Math.sin(rad),
          x2: cx + r2 * Math.cos(rad), y2: cy + r2 * Math.sin(rad),
          major,
        });
      }
      return items;
    });

    const protectionTitle = computed(() => {
      const v = uvIndex.value;
      if (v <= 2)  return 'Minimal Risk';
      if (v <= 5)  return 'Moderate Protection';
      if (v <= 7)  return 'High Protection Required';
      if (v <= 10) return 'Very High Protection';
      return 'Extreme — Stay Protected';
    });

    const protectionIcon = computed(() => {
      const v = uvIndex.value;
      if (v <= 2)  return 'fas fa-circle-check';
      if (v <= 5)  return 'fas fa-shield-halved';
      if (v <= 7)  return 'fas fa-triangle-exclamation';
      return 'fas fa-circle-exclamation';
    });

    const protectionItems = computed(() => {
      const v = uvIndex.value;
      if (v <= 2)  return ['Minimal sun protection needed', 'Safe for extended outdoor time'];
      if (v <= 5)  return ['Wear sunscreen SPF 30+', 'Seek shade during midday', 'Wear sunglasses outdoors'];
      if (v <= 7)  return ['Apply SPF 30+ sunscreen', 'Wear protective clothing & hat', 'Reduce exposure 10AM–4PM', 'UV-blocking sunglasses'];
      if (v <= 10) return ['Use SPF 50+ broad spectrum', 'Long sleeves & wide-brim hat', 'Minimize sun 10AM–4PM', 'Seek shade whenever possible'];
      return ['SPF 50+ every 2 hours', 'Full protective clothing essential', 'Avoid outdoors 10AM–4PM', 'Stay in shade or indoors'];
    });

    return {
      uvIndex, uvIndexClass, uvIndexText,
      needleDeg, needleAccent,
      arcLength, arcOffset, ticks,
      protectionTitle, protectionIcon, protectionItems,
    };
  }
};
</script>

<style scoped>
/* card shell untouched — only inner content styled */

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
  color: #eab308;
  filter: drop-shadow(0 1px 4px rgba(234,179,8,0.45));
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

.header-badge.low       { background: rgba(34,197,94,0.12);  color: #16a34a; }
.header-badge.moderate  { background: rgba(234,179,8,0.12);  color: #a16207; }
.header-badge.high      { background: rgba(249,115,22,0.12); color: #c2410c; }
.header-badge.very-high { background: rgba(239,68,68,0.12);  color: #b91c1c; }
.header-badge.extreme   { background: rgba(168,85,247,0.12); color: #7e22ce; }

.card-content {
  padding: 16px 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Gauge ── */
.uv-gauge-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.uv-svg {
  width: 100%;
  max-width: 232px;
  overflow: visible;
}

.uv-tick-lbl {
  font-size: 9px;
  fill: var(--text-muted, #899aa3);
  font-family: inherit;
  font-weight: 600;
}

.uv-readout {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: -4px;
}

.uv-number {
  font-size: 48px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -3px;
}

.uv-number.low       { color: #16a34a; }
.uv-number.moderate  { color: #a16207; }
.uv-number.high      { color: #c2410c; }
.uv-number.very-high { color: #b91c1c; }
.uv-number.extreme   { color: #7e22ce; }

.uv-labels {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.uv-text-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 700;
}

.uv-text-badge.low       { background: rgba(34,197,94,0.12);  color: #16a34a; }
.uv-text-badge.moderate  { background: rgba(234,179,8,0.12);  color: #a16207; }
.uv-text-badge.high      { background: rgba(249,115,22,0.12); color: #c2410c; }
.uv-text-badge.very-high { background: rgba(239,68,68,0.12);  color: #b91c1c; }
.uv-text-badge.extreme   { background: rgba(168,85,247,0.12); color: #7e22ce; }

.uv-index-label {
  font-size: 10.5px;
  color: var(--text-muted, #899aa3);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding-left: 2px;
}

/* ── Protection card ── */
.uv-protection {
  display: flex;
  gap: 12px;
  padding: 13px 14px;
  border-radius: 12px;
  border: 1px solid;
  animation: slideUp 0.4s ease both;
}

.uv-protection.low       { border-color: rgba(34,197,94,0.2);  background: rgba(34,197,94,0.05); }
.uv-protection.moderate  { border-color: rgba(234,179,8,0.2);  background: rgba(234,179,8,0.05); }
.uv-protection.high      { border-color: rgba(249,115,22,0.2); background: rgba(249,115,22,0.05); }
.uv-protection.very-high { border-color: rgba(239,68,68,0.2);  background: rgba(239,68,68,0.05); }
.uv-protection.extreme   { border-color: rgba(168,85,247,0.2); background: rgba(168,85,247,0.05); }

.protection-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: var(--bg-card, #fff);
  border: 1px solid var(--border, rgba(52,116,140,0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.low       .protection-icon-wrap i { color: #16a34a; }
.moderate  .protection-icon-wrap i { color: #a16207; }
.high      .protection-icon-wrap i { color: #c2410c; }
.very-high .protection-icon-wrap i { color: #b91c1c; }
.extreme   .protection-icon-wrap i { color: #7e22ce; }

.protection-icon-wrap i { font-size: 15px; }

.protection-body { flex: 1; min-width: 0; }

.protection-title {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--text-primary, #17242b);
  margin-bottom: 7px;
  letter-spacing: -0.1px;
}

.protection-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.protection-list li {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary, #50646f);
  line-height: 1.4;
}

.protection-list li i {
  font-size: 7px;
  color: var(--text-muted, #899aa3);
  flex-shrink: 0;
  position: relative;
  top: -1px;
}

/* ── Details row ── */
.uv-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
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
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--accent-light, #e4f1f5);
  color: var(--accent, #34748c);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  i { font-size: 12px; }
}

.detail-body {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.detail-label {
  font-size: 10px;
  color: var(--text-muted, #899aa3);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.detail-value {
  font-size: 13px;
  color: var(--text-primary, #17242b);
  font-weight: 700;
  letter-spacing: -0.1px;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>