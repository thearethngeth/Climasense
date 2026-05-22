<template>
  <main class="about-page">
    <section class="about-hero">
      <div class="hero-copy">
        <span class="eyebrow">Project overview</span>
        <h1>About ClimaSense</h1>
        <p class="hero-lede">
          A minimalist weather intelligence dashboard built for clear, everyday
          decisions around current conditions, forecasts, air quality, UV,
          precipitation, visibility, and local planning.
        </p>

        <div class="hero-actions" aria-label="Project highlights">
          <span><i class="fas fa-cloud-sun"></i> Live weather system</span>
          <span><i class="fas fa-map-marker-alt"></i> Location based</span>
          <span><i class="fas fa-graduation-cap"></i> RUPP practicum</span>
        </div>
      </div>

      <aside class="station-card" aria-label="Weather station summary">
        <div class="station-orbit">
          <i class="fas fa-cloud-sun-rain"></i>
        </div>
        <div class="station-reading">
          <span>System focus</span>
          <strong>Weather clarity</strong>
        </div>
        <div class="station-meter">
          <span></span>
        </div>
      </aside>
    </section>

    <section class="team-section">
      <div class="section-heading">
        <span class="eyebrow">Student team</span>
        <h2>Built by two Year 4 students</h2>
        <p>
          Developed at Royal University of Phnom Penh (RUPP), Cambodia, as a
          project practicum focused on practical web development, API
          integration, and user-centered weather visualization.
        </p>
      </div>

      <div class="team-grid">
        <article
          v-for="student in students"
          :key="student.name"
          class="student-card"
        >
          <div class="student-mark">
            <i :class="student.icon"></i>
          </div>
          <div>
            <span class="student-kicker">{{ student.kicker }}</span>
            <h3>{{ student.name }}</h3>
            <p>{{ student.role }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="feature-section">
      <div class="section-heading compact">
        <span class="eyebrow">What it does</span>
        <h2>Weather tools in one clean dashboard</h2>
      </div>

      <div class="feature-grid">
        <article v-for="feature in features" :key="feature.title" class="info-card">
          <div class="info-icon"><i :class="feature.icon"></i></div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </article>
      </div>
    </section>

    <section class="stack-section">
      <div class="section-heading compact">
        <span class="eyebrow">Technology</span>
        <h2>Project stack</h2>
      </div>

      <div class="stack-grid">
        <article v-for="item in stack" :key="item.name" class="stack-card">
          <i :class="item.icon"></i>
          <div>
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="data-section">
      <div class="data-panel">
        <div class="section-heading compact align-left">
          <span class="eyebrow">Data source</span>
          <h2>Powered by weather API data</h2>
        </div>
        <p>
          The app uses OpenWeather data to present current conditions,
          forecasts, air quality, sunrise and sunset timing, weather maps, and
          other environmental indicators. The goal is to turn raw weather data
          into a readable interface that supports fast decisions.
        </p>

        <div class="source-list">
          <div class="source-item">
            <i class="fas fa-broadcast-tower"></i>
            <span>Weather stations and observations</span>
          </div>
          <div class="source-item">
            <i class="fas fa-satellite"></i>
            <span>Satellite and atmospheric data</span>
          </div>
          <div class="source-item">
            <i class="fas fa-chart-line"></i>
            <span>Forecast models and trend indicators</span>
          </div>
        </div>
      </div>
    </section>

    <section class="closing-card">
      <div>
        <span class="eyebrow">Presentation note</span>
        <h2>Designed for research defense clarity</h2>
        <p>
          The interface is intentionally minimal, readable, and structured so
          the project can be explained clearly during a university report
          defense: what data is used, how it is processed, and how users read it.
        </p>
      </div>
      <a
        class="github-link"
        href="https://github.com/SeavThek168/pp-y3-weatherapp"
        target="_blank"
        rel="noopener"
      >
        <i class="fab fa-github"></i>
        View repository
      </a>
    </section>
  </main>
</template>

<script>
export default {
  name: "AboutView",
  data() {
    return {
      students: [
        {
          name: "Chhem Seavthek",
          role: "Lead Coder & UI/UX Designer",
          kicker: "Student 01",
          icon: "fas fa-laptop-code",
        },
        {
          name: "Ngeth Theareth",
          role: "Co-developer",
          kicker: "Student 02",
          icon: "fas fa-code-branch",
        },
      ],
      features: [
        {
          title: "Live Conditions",
          description: "Current temperature, humidity, pressure, wind, visibility, and comfort indicators.",
          icon: "fas fa-tachometer-alt",
        },
        {
          title: "Forecast Views",
          description: "Hourly and 5-day forecasts for short-term planning and weather trend reading.",
          icon: "fas fa-calendar-week",
        },
        {
          title: "Environmental Metrics",
          description: "Air quality, UV index, precipitation, and visibility cards with readable visual summaries.",
          icon: "fas fa-leaf",
        },
        {
          title: "Weather Map",
          description: "Map-based weather context for exploring conditions beyond the selected city.",
          icon: "fas fa-map-marked-alt",
        },
        {
          title: "Daily Planner",
          description: "Time-of-day guidance that helps turn weather data into useful daily decisions.",
          icon: "fas fa-calendar-check",
        },
        {
          title: "Responsive UI",
          description: "A dashboard layout designed to stay clear on desktop and mobile screens.",
          icon: "fas fa-mobile-alt",
        },
      ],
      stack: [
        {
          name: "Vue.js 3",
          description: "Frontend framework for component-based views and reactive UI state.",
          icon: "fab fa-vuejs",
        },
        {
          name: "Vuex",
          description: "Centralized state management for weather, forecast, unit, and location data.",
          icon: "fas fa-database",
        },
        {
          name: "OpenWeather API",
          description: "External weather data provider for live conditions, forecasts, maps, and air quality.",
          icon: "fas fa-cloud-download-alt",
        },
        {
          name: "Bootstrap & SCSS",
          description: "Responsive structure and custom styling for a polished dashboard experience.",
          icon: "fab fa-bootstrap",
        },
      ],
    };
  },
};
</script>

<style scoped>
.about-page {
  max-width: 1360px;
  margin: 0 auto;
  padding: 34px 28px 92px;
  color: var(--text-primary);
}

.about-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
  gap: 22px;
  align-items: stretch;
  margin-bottom: 28px;
}

.hero-copy,
.station-card,
.team-section,
.feature-section,
.stack-section,
.data-panel,
.closing-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.82);
  box-shadow: var(--shadow-sm);
}

:global(body.dark-theme) .hero-copy,
:global(body.dark-theme) .station-card,
:global(body.dark-theme) .team-section,
:global(body.dark-theme) .feature-section,
:global(body.dark-theme) .stack-section,
:global(body.dark-theme) .data-panel,
:global(body.dark-theme) .closing-card {
  background: rgba(18, 31, 44, 0.82);
}

.hero-copy {
  padding: clamp(28px, 5vw, 58px);
  overflow: hidden;
  background:
    linear-gradient(135deg, rgba(232, 244, 253, 0.92), rgba(255, 255, 255, 0.86)),
    repeating-linear-gradient(135deg, rgba(74, 144, 196, 0.08) 0 1px, transparent 1px 18px);
}

:global(body.dark-theme) .hero-copy {
  background:
    linear-gradient(135deg, rgba(22, 38, 56, 0.96), rgba(18, 31, 44, 0.92)),
    repeating-linear-gradient(135deg, rgba(122, 184, 216, 0.08) 0 1px, transparent 1px 18px);
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--accent-dark);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.eyebrow::before {
  content: "";
  width: 18px;
  height: 2px;
  border-radius: 999px;
  background: var(--accent);
}

.hero-copy h1,
.section-heading h2,
.closing-card h2 {
  margin: 10px 0 0;
  color: var(--text-primary);
  font-family: "Space Grotesk", "Manrope", sans-serif;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.hero-copy h1 {
  max-width: 720px;
  font-size: clamp(42px, 7vw, 82px);
  line-height: 0.92;
}

.hero-lede {
  max-width: 720px;
  margin: 24px 0 0;
  color: var(--text-secondary);
  font-size: clamp(16px, 2vw, 20px);
  line-height: 1.65;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 28px;
}

.hero-actions span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 13px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.58);
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 800;
}

:global(body.dark-theme) .hero-actions span {
  background: rgba(255, 255, 255, 0.05);
}

.hero-actions i,
.source-item i,
.stack-card i,
.info-icon i {
  color: var(--accent-dark);
}

.station-card {
  min-height: 390px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  background:
    radial-gradient(circle at 35% 28%, rgba(91, 196, 216, 0.22), transparent 32%),
    linear-gradient(145deg, var(--bg-card), var(--bg-card-alt));
}

.station-orbit {
  width: min(260px, 72%);
  aspect-ratio: 1;
  margin: 6px auto 0;
  display: grid;
  place-items: center;
  border: 18px solid rgba(52, 116, 140, 0.14);
  border-radius: 50%;
  color: var(--accent-dark);
  font-size: clamp(58px, 9vw, 112px);
  box-shadow: inset 0 0 0 1px var(--border);
}

.station-reading {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: end;
  margin-top: 30px;
}

.station-reading span {
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.station-reading strong {
  color: var(--text-primary);
  font-size: clamp(22px, 3vw, 34px);
  line-height: 1;
  text-align: right;
}

.station-meter {
  height: 8px;
  margin-top: 18px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--border);
}

.station-meter span {
  display: block;
  width: 78%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--accent), #5bc4d8);
}

.team-section,
.feature-section,
.stack-section,
.data-panel,
.closing-card {
  margin-top: 22px;
  padding: clamp(22px, 3vw, 34px);
}

.section-heading {
  max-width: 760px;
  margin-bottom: 22px;
}

.section-heading.compact {
  margin-bottom: 18px;
}

.section-heading.align-left {
  margin-bottom: 14px;
}

.section-heading h2,
.closing-card h2 {
  font-size: clamp(28px, 4vw, 42px);
  line-height: 1.05;
}

.section-heading p,
.data-panel p,
.closing-card p {
  margin: 14px 0 0;
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.7;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.student-card,
.info-card,
.stack-card,
.source-item {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--bg-card-alt);
}

.student-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: center;
  padding: 20px;
}

.student-mark,
.info-icon {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: var(--accent-light);
  color: var(--accent-dark);
  font-size: 20px;
}

.student-kicker {
  display: block;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.student-card h3,
.info-card h3,
.stack-card h3 {
  margin: 5px 0 0;
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 900;
}

.student-card p,
.info-card p,
.stack-card p {
  margin: 6px 0 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.55;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.info-card {
  padding: 20px;
  transition: transform 0.2s, border-color 0.2s;
}

.info-card:hover,
.stack-card:hover,
.student-card:hover {
  transform: translateY(-2px);
  border-color: var(--border-strong);
}

.stack-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.stack-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  padding: 18px;
}

.stack-card > i {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  background: var(--accent-light);
  font-size: 19px;
}

.source-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 22px;
}

.source-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  color: var(--text-secondary);
  font-weight: 800;
}

.source-item i {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: var(--accent-light);
  flex: 0 0 auto;
}

.closing-card {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
}

.github-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex: 0 0 auto;
  padding: 13px 18px;
  border-radius: 999px;
  background: var(--accent);
  color: var(--text-on-accent);
  font-weight: 900;
  text-decoration: none;
  transition: transform 0.2s, background 0.2s;
}

.github-link:hover {
  transform: translateY(-2px);
  background: var(--accent-dark);
}

@media (max-width: 1100px) {
  .about-hero,
  .team-grid,
  .feature-grid,
  .stack-grid,
  .source-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .about-page {
    padding: 24px 16px 82px;
  }

  .about-hero,
  .team-grid,
  .feature-grid,
  .stack-grid,
  .source-list {
    grid-template-columns: 1fr;
  }

  .station-card {
    min-height: 300px;
  }

  .closing-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .github-link {
    width: 100%;
  }
}
</style>
