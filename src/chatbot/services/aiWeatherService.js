// src/chatbot/services/aiWeatherService.js

export const aiWeatherService = {
  // Analyze weather data and generate intelligent responses
  async generateWeatherInsight(currentWeather, forecast, airQuality, location) {
    try {
      const insights = [];
      
      // Temperature analysis
      if (currentWeather) {
        const temp = currentWeather.main.temp;
        const feelsLike = currentWeather.main.feels_like;
        const tempDiff = Math.abs(temp - feelsLike);
        
        if (tempDiff > 5) {
          insights.push(`It feels ${tempDiff > 10 ? 'significantly' : ''} ${feelsLike < temp ? 'colder' : 'warmer'} than the actual temperature of ${temp}°C due to ${currentWeather.wind.speed > 5 ? 'strong winds' : 'humidity levels'}.`);
        }
      }
      
      // Weather condition analysis
      if (currentWeather && currentWeather.weather && currentWeather.weather[0]) {
        const condition = currentWeather.weather[0].main;
        
        switch (condition) {
          case 'Thunderstorm':
            insights.push('⚡ Thunderstorms detected! Stay indoors and avoid outdoor activities.');
            break;
          case 'Rain':
            insights.push('🌧️ Rain is expected. Remember to carry an umbrella and be cautious on wet surfaces.');
            break;
          case 'Snow':
            insights.push('❄️ Snow conditions detected. Roads may be slippery - exercise caution if driving.');
            break;
          case 'Clear':
            insights.push('☀️ Clear skies ahead! Perfect time for outdoor activities.');
            break;
          case 'Clouds':
            insights.push('☁️ Cloudy conditions. Humidity levels are moderate.');
            break;
          default:
            insights.push(`Current weather: ${condition}`);
        }
      }
      
      // Humidity analysis
      if (currentWeather && currentWeather.main && currentWeather.main.humidity) {
        const humidity = currentWeather.main.humidity;
        if (humidity > 80) {
          insights.push(`💧 High humidity (${humidity}%) - you may feel more uncomfortable in this weather.`);
        } else if (humidity < 30) {
          insights.push(`💨 Low humidity (${humidity}%) - stay hydrated and apply moisturizer.`);
        }
      }
      
      // Wind analysis
      if (currentWeather && currentWeather.wind) {
        const windSpeed = currentWeather.wind.speed;
        if (windSpeed > 10) {
          insights.push(`💨 Strong winds (${windSpeed.toFixed(1)} m/s) - secure loose objects and be cautious outdoors.`);
        } else if (windSpeed < 2) {
          insights.push(`🌬️ Very calm conditions with minimal wind.`);
        }
      }
      
      // Air quality analysis
      if (airQuality && airQuality.list && airQuality.list[0]) {
        const aqi = airQuality.list[0].main.aqi;
        const aqiText = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'][aqi - 1];
        
        if (aqi > 3) {
          insights.push(`🌫️ Air quality is ${aqiText}. People with respiratory issues should limit outdoor activities.`);
        } else {
          insights.push(`🌱 Air quality is ${aqiText}. Good conditions for outdoor activities.`);
        }
      }
      
      // Forecast analysis
      if (forecast && forecast.list && forecast.list.length > 0) {
        const nextDay = forecast.list[8];
        if (nextDay && currentWeather) {
          const tempChange = nextDay.main.temp - currentWeather.main.temp;
          if (Math.abs(tempChange) > 5) {
            insights.push(`📈 Temperature will ${tempChange > 0 ? 'increase' : 'decrease'} by ${Math.abs(tempChange).toFixed(1)}°C tomorrow.`);
          }
        }
      }
      
      return insights;
    } catch (error) {
      console.error('Error generating weather insights:', error);
      return ['Unable to generate weather insights at this time.'];
    }
  },

  // Answer common weather questions
  async answerWeatherQuestion(question, weatherData) {
    try {
      const q = question.toLowerCase();
      const current = weatherData.current;
      const forecast = weatherData.forecast;
      const airQuality = weatherData.airQuality;
      
      // If no weather data, return error
      if (!current) {
        return 'I don\'t have weather data available yet. Please search for a location first.';
      }
      
      // Temperature questions
      if (q.includes('temperature') || q.includes('temp') || q.includes('how hot') || q.includes('how cold') || q.includes('warm')) {
        return `The current temperature is ${current.main.temp}°C and it feels like ${current.main.feels_like}°C.`;
      }
      
      // Rain questions
      if (q.includes('rain') || q.includes('precipitation') || q.includes('wet') || q.includes('umbrella') || q.includes('raining')) {
        if (current.weather[0].main.toLowerCase().includes('rain')) {
          return `Yes, it's currently raining. Current conditions: ${current.weather[0].description}.`;
        } else {
          return `No rain expected right now. Current conditions: ${current.weather[0].description}.`;
        }
      }
      
      // Wind questions
      if (q.includes('wind') || q.includes('breeze') || q.includes('windy')) {
        const windDir = this.getWindDirection(current.wind.deg);
        const windKmh = (current.wind.speed * 3.6).toFixed(1);
        return `Current wind speed: ${current.wind.speed} m/s (${windKmh} km/h) from ${windDir}. ${current.wind.gust ? `Wind gust: ${current.wind.gust} m/s.` : ''}`;
      }
      
      // Humidity questions
      if (q.includes('humidity') || q.includes('moisture') || q.includes('dry')) {
        const humidity = current.main.humidity;
        const humidityLevel = humidity > 70 ? 'high' : humidity > 40 ? 'moderate' : 'low';
        return `Humidity is at ${humidity}%, which is ${humidityLevel}. ${humidity > 70 ? 'Air feels damp.' : humidity < 30 ? 'Air feels dry.' : 'Humidity is comfortable.'}`;
      }
      
      // Air quality questions
      if (q.includes('air quality') || q.includes('pollution') || q.includes('pollutant') || q.includes('aqi')) {
        if (airQuality && airQuality.list && airQuality.list[0]) {
          const aqi = airQuality.list[0].main.aqi;
          const aqiText = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'][aqi - 1];
          return `Air quality index: ${aqiText} (${aqi}/5). ${aqi > 3 ? 'Air pollution is high - limit outdoor activities.' : 'Air quality is good for outdoor activities.'}`;
        }
        return 'Air quality data is not available.';
      }
      
      // Sunrise/Sunset questions
      if (q.includes('sunrise') || q.includes('sunset') || q.includes('daylight')) {
        if (current.sys) {
          const sunrise = new Date(current.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
          const sunset = new Date(current.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
          return `Sunrise: ${sunrise}, Sunset: ${sunset}.`;
        }
      }
      
      // Forecast questions
      if (q.includes('forecast') || q.includes('tomorrow') || q.includes('next') || q.includes('upcoming') || q.includes('future')) {
        if (forecast && forecast.list && forecast.list[8]) {
          const tomorrow = forecast.list[8];
          return `Tomorrow's forecast: ${tomorrow.weather[0].description}, Temperature: ${tomorrow.main.temp}°C, Humidity: ${tomorrow.main.humidity}%.`;
        }
        return 'Forecast data is not available.';
      }
      
      // Pressure questions
      if (q.includes('pressure') || q.includes('barometric')) {
        const pressure = current.main.pressure;
        const trend = pressure > 1013 ? 'rising (fair weather expected)' : 'falling (potential rain coming)';
        return `Atmospheric pressure: ${pressure} hPa (${trend}).`;
      }
      
      // Visibility questions
      if (q.includes('visibility')) {
        const visibility = (current.visibility / 1000).toFixed(1);
        return `Visibility: ${visibility} km.`;
      }
      
      // Cloud questions
      if (q.includes('cloud') || q.includes('cloudy') || q.includes('clear')) {
        const cloudiness = current.clouds.all;
        const cloudStatus = cloudiness < 20 ? 'Clear skies' : cloudiness < 50 ? 'Partly cloudy' : cloudiness < 80 ? 'Mostly cloudy' : 'Overcast';
        return `Cloud coverage: ${cloudiness}%. Status: ${cloudStatus}.`;
      }
      
      // Weather condition questions
      if (q.includes('weather') || q.includes('condition') || q.includes('outside')) {
        return `Current weather in the area: ${current.weather[0].description}. Temperature: ${current.main.temp}°C, Feels like: ${current.main.feels_like}°C.`;
      }
      
      // Default response
      return `I'm not sure about that specific question. Try asking about: temperature, rain, wind, humidity, air quality, forecast, pressure, visibility, or cloud cover!`;
    } catch (error) {
      console.error('Error in answerWeatherQuestion:', error);
      return 'Sorry, I encountered an error processing your question. Please try again.';
    }
  },

  // Helper function to convert wind degree to direction
  getWindDirection(degree) {
    const directions = ['North', 'NNE', 'NE', 'ENE', 'East', 'ESE', 'SE', 'SSE', 'South', 'SSW', 'SW', 'WSW', 'West', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degree / 22.5) % 16;
    return directions[index];
  },

  // Generate weather recommendations
  getWeatherRecommendations(weatherData) {
    const recommendations = [];
    const current = weatherData.current;
    
    if (!current) return recommendations;
    
    // Clothing recommendations
    const temp = current.main.temp;
    if (temp < 0) {
      recommendations.push('🧥 Wear heavy winter clothing including coat, gloves, and hat.');
    } else if (temp < 10) {
      recommendations.push('🧥 Wear a jacket and layers.');
    } else if (temp < 20) {
      recommendations.push('👕 A light jacket or sweater should be sufficient.');
    } else if (temp > 30) {
      recommendations.push('👕 Wear light, breathable clothing and apply sunscreen.');
    }
    
    // Activity recommendations
    if (current.weather && current.weather[0]) {
      if (current.weather[0].main === 'Clear' && current.wind.speed < 5) {
        recommendations.push('🚴 Perfect weather for outdoor activities!');
      } else if (current.weather[0].main.includes('Rain')) {
        recommendations.push('🏠 Stay indoors or bring an umbrella for outdoor activities.');
      } else if (current.wind.speed > 10) {
        recommendations.push('⛵ Great conditions for wind-related activities.');
      }
    }
    
    // Health recommendations
    if (current.main.humidity > 80) {
      recommendations.push('💧 Stay hydrated in this humid weather.');
    }
    
    return recommendations;
  }
};