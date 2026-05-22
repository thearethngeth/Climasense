// Custom Weather Icon System
// Beautiful SVG icons for all weather conditions

export const getWeatherIcon = (icon) => {
  // Map OpenWeather icon codes to custom icons
  const iconMap = {
    '01d': 'clear-day',
    '01n': 'clear-night',
    '02d': 'few-clouds-day',
    '02n': 'few-clouds-night',
    '03d': 'cloudy',
    '03n': 'cloudy',
    '04d': 'cloudy',
    '04n': 'cloudy',
    '09d': 'rain',
    '09n': 'rain',
    '10d': 'rain-day',
    '10n': 'rain-night',
    '11d': 'thunderstorm',
    '11n': 'thunderstorm',
    '13d': 'snow',
    '13n': 'snow',
    '50d': 'mist',
    '50n': 'mist'
  };
  
  const mappedIcon = iconMap[icon] || 'clear-day';
  return getCustomIconSVG(mappedIcon);
};

const getCustomIconSVG = (iconType) => {
  const icons = {
    'clear-day': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:#FDB813;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#F59E0B;stop-opacity:1" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="35" fill="url(#sunGradient)"/>
      <g stroke="#F59E0B" stroke-width="6" stroke-linecap="round">
        <line x1="100" y1="30" x2="100" y2="45"/>
        <line x1="100" y1="155" x2="100" y2="170"/>
        <line x1="30" y1="100" x2="45" y2="100"/>
        <line x1="155" y1="100" x2="170" y2="100"/>
        <line x1="51" y1="51" x2="62" y2="62"/>
        <line x1="138" y1="138" x2="149" y2="149"/>
        <line x1="149" y1="51" x2="138" y2="62"/>
        <line x1="62" y1="138" x2="51" y2="149"/>
      </g>
    </svg>`,
    
    'clear-night': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FCD34D;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FBBF24;stop-opacity:1" />
        </linearGradient>
      </defs>
      <path d="M 120 50 Q 150 70, 150 100 Q 150 130, 120 150 Q 140 140, 140 100 Q 140 60, 120 50 Z" 
            fill="url(#moonGradient)"/>
      <circle cx="90" cy="65" r="3" fill="#FFF" opacity="0.8"/>
      <circle cx="140" cy="80" r="2" fill="#FFF" opacity="0.6"/>
      <circle cx="75" cy="130" r="2.5" fill="#FFF" opacity="0.7"/>
    </svg>`,
    
    'few-clouds-day': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:#FDB813;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#F59E0B;stop-opacity:1" />
        </radialGradient>
      </defs>
      <circle cx="70" cy="60" r="25" fill="url(#sunGrad)"/>
      <g stroke="#F59E0B" stroke-width="4" stroke-linecap="round">
        <line x1="70" y1="25" x2="70" y2="35"/>
        <line x1="35" y1="60" x2="45" y2="60"/>
        <line x1="45" y1="40" x2="52" y2="47"/>
        <line x1="95" y1="40" x2="88" y2="47"/>
      </g>
      <ellipse cx="120" cy="110" rx="45" ry="35" fill="#E5E7EB"/>
      <ellipse cx="90" cy="120" rx="40" ry="30" fill="#F3F4F6"/>
      <ellipse cx="135" cy="125" rx="35" ry="28" fill="#F9FAFB"/>
    </svg>`,
    
    'few-clouds-night': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path d="M 80 40 Q 100 50, 100 70 Q 100 90, 80 100 Q 95 92, 95 70 Q 95 48, 80 40 Z" 
            fill="#FBBF24"/>
      <ellipse cx="120" cy="110" rx="45" ry="35" fill="#CBD5E1"/>
      <ellipse cx="90" cy="120" rx="40" ry="30" fill="#E5E7EB"/>
      <ellipse cx="135" cy="125" rx="35" ry="28" fill="#F3F4F6"/>
    </svg>`,
    
    'cloudy': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="90" rx="55" ry="40" fill="#CBD5E1"/>
      <ellipse cx="65" cy="105" rx="45" ry="35" fill="#D1D5DB"/>
      <ellipse cx="135" cy="105" rx="45" ry="35" fill="#D1D5DB"/>
      <ellipse cx="100" cy="120" rx="50" ry="38" fill="#E5E7EB"/>
      <ellipse cx="80" cy="130" rx="35" ry="28" fill="#F3F4F6"/>
      <ellipse cx="120" cy="130" rx="35" ry="28" fill="#F3F4F6"/>
    </svg>`,
    
    'rain': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="70" rx="50" ry="35" fill="#94A3B8"/>
      <ellipse cx="70" cy="80" rx="40" ry="30" fill="#A1A1AA"/>
      <ellipse cx="130" cy="80" rx="40" ry="30" fill="#A1A1AA"/>
      <g stroke="#60A5FA" stroke-width="4" stroke-linecap="round" opacity="0.8">
        <line x1="70" y1="110" x2="65" y2="140"/>
        <line x1="90" y1="115" x2="85" y2="145"/>
        <line x1="110" y1="115" x2="105" y2="145"/>
        <line x1="130" y1="110" x2="125" y2="140"/>
      </g>
    </svg>`,
    
    'rain-day': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="50" r="20" fill="#FDB813"/>
      <g stroke="#F59E0B" stroke-width="3" stroke-linecap="round">
        <line x1="60" y1="20" x2="60" y2="28"/>
        <line x1="30" y1="50" x2="38" y2="50"/>
      </g>
      <ellipse cx="110" cy="80" rx="45" ry="32" fill="#94A3B8"/>
      <ellipse cx="85" cy="90" rx="38" ry="28" fill="#A1A1AA"/>
      <ellipse cx="130" cy="90" rx="35" ry="26" fill="#A1A1AA"/>
      <g stroke="#60A5FA" stroke-width="3.5" stroke-linecap="round">
        <line x1="85" y1="115" x2="80" y2="140"/>
        <line x1="105" y1="120" x2="100" y2="145"/>
        <line x1="125" y1="115" x2="120" y2="140"/>
      </g>
    </svg>`,
    
    'rain-night': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path d="M 70 35 Q 85 42, 85 55 Q 85 68, 70 75 Q 80 68, 80 55 Q 80 42, 70 35 Z" fill="#FBBF24"/>
      <ellipse cx="110" cy="80" rx="45" ry="32" fill="#71717A"/>
      <ellipse cx="85" cy="90" rx="38" ry="28" fill="#94A3B8"/>
      <ellipse cx="130" cy="90" rx="35" ry="26" fill="#94A3B8"/>
      <g stroke="#60A5FA" stroke-width="3.5" stroke-linecap="round">
        <line x1="85" y1="115" x2="80" y2="140"/>
        <line x1="105" y1="120" x2="100" y2="145"/>
        <line x1="125" y1="115" x2="120" y2="140"/>
      </g>
    </svg>`,
    
    'thunderstorm': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="65" rx="50" ry="35" fill="#52525B"/>
      <ellipse cx="70" cy="75" rx="40" ry="30" fill="#71717A"/>
      <ellipse cx="130" cy="75" rx="40" ry="30" fill="#71717A"/>
      <path d="M 105 95 L 90 120 L 105 120 L 95 145 L 125 115 L 110 115 L 115 95 Z" 
            fill="#FCD34D" stroke="#F59E0B" stroke-width="2"/>
      <g stroke="#60A5FA" stroke-width="3" stroke-linecap="round" opacity="0.6">
        <line x1="70" y1="105" x2="65" y2="125"/>
        <line x1="130" y1="105" x2="125" y2="125"/>
      </g>
    </svg>`,
    
    'snow': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="70" rx="50" ry="35" fill="#E0E7FF"/>
      <ellipse cx="70" cy="80" rx="40" ry="30" fill="#E0E7FF"/>
      <ellipse cx="130" cy="80" rx="40" ry="30" fill="#E0E7FF"/>
      <g fill="#60A5FA">
        <circle cx="70" cy="115" r="4"/>
        <circle cx="90" cy="125" r="5"/>
        <circle cx="110" cy="120" r="4.5"/>
        <circle cx="130" cy="130" r="5"/>
        <circle cx="80" cy="140" r="4"/>
        <circle cx="120" cy="145" r="4.5"/>
      </g>
    </svg>`,
    
    'mist': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#94A3B8" stroke-width="8" stroke-linecap="round" opacity="0.6">
        <line x1="50" y1="70" x2="150" y2="70"/>
        <line x1="40" y1="90" x2="160" y2="90"/>
        <line x1="55" y1="110" x2="145" y2="110"/>
        <line x1="45" y1="130" x2="155" y2="130"/>
      </g>
      <g stroke="#CBD5E1" stroke-width="8" stroke-linecap="round" opacity="0.4">
        <line x1="60" y1="80" x2="140" y2="80"/>
        <line x1="50" y1="100" x2="150" y2="100"/>
        <line x1="65" y1="120" x2="135" y2="120"/>
      </g>
    </svg>`
  };
  
  return `data:image/svg+xml;base64,${btoa(icons[iconType] || icons['clear-day'])}`;
};

export default {
  getWeatherIcon
};
