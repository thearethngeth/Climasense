// src/chatbot/services/conversationService.js

export const conversationService = {
  // Track conversation context
  conversationHistory: [],
  
  // Add message to history
  addToHistory(role, message) {
    this.conversationHistory.push({
      role,
      message,
      timestamp: new Date()
    });
  },
  
  // Clear conversation history
  clearHistory() {
    this.conversationHistory = [];
  },
  
  // Get last user message
  getLastUserMessage() {
    const messages = this.conversationHistory.filter(m => m.role === 'user');
    return messages.length > 0 ? messages[messages.length - 1].message : null;
  },

  // Intelligent multi-turn conversation handler
  async handleConversation(question, weatherData) {
    try {
      this.addToHistory('user', question);
      const q = question.toLowerCase();
      
      // Check intent and generate contextual follow-up questions
      let response = '';
      let followUpQuestions = [];
      
      // Temperature-related conversation
      if (q.includes('temperature') || q.includes('temp') || q.includes('hot') || q.includes('cold')) {
        const temp = weatherData.current?.main.temp;
        const feelsLike = weatherData.current?.main.feels_like;
        
        response = `The current temperature is ${temp}°C and it feels like ${feelsLike}°C.`;
        
        followUpQuestions = [
          'What should I wear for this temperature?',
          'Is it cold enough for snow?',
          'Will it get warmer or colder today?',
          'How does this compare to yesterday?'
        ];
      }
      
      // Planning/Activity conversation
      else if (q.includes('plan') || q.includes('do') || q.includes('activity') || q.includes('go out') || q.includes('outside')) {
        const weather = weatherData.current?.weather[0]?.main;
        const temp = weatherData.current?.main.temp;
        const wind = weatherData.current?.wind.speed;
        
        response = `Based on the weather today (${weather}, ${temp}°C, wind ${wind} m/s), here are my recommendations:`;
        
        if (weather.includes('Rain')) {
          response += '\n- Indoor activities would be safer\n- Bring an umbrella if going outside\n- Avoid outdoor sports';
          followUpQuestions = [
            'How long will it rain?',
            'What indoor activities do you recommend?',
            'Will it stop raining later today?'
          ];
        } else if (weather.includes('Clear') && temp > 15) {
          response += '\n- Perfect time for outdoor activities!\n- Great for sports and hiking\n- Bring sunscreen for protection';
          followUpQuestions = [
            'What outdoor sports would be good?',
            'Should I bring water?',
            'How long can I stay outside safely?'
          ];
        } else {
          followUpQuestions = [
            'What type of activity are you interested in?',
            'Do you prefer indoor or outdoor?',
            'What\'s your comfort level with these conditions?'
          ];
        }
      }
      
      // Clothing conversation
      else if (q.includes('wear') || q.includes('cloth') || q.includes('dress') || q.includes('outfit')) {
        const temp = weatherData.current?.main.temp;
        const humidity = weatherData.current?.main.humidity;
        const wind = weatherData.current?.wind.speed;
        
        let clothing = this.getClothingAdvice(temp, humidity, wind);
        response = `Based on current conditions (${temp}°C, ${humidity}% humidity, ${wind} m/s wind):\n\n${clothing}`;
        
        followUpQuestions = [
          'Do you have any of these items?',
          'Are you going out for a long time?',
          'Will you be active or staying still?',
          'Do you get cold easily?'
        ];
      }
      
      // Health/Safety conversation
      else if (q.includes('health') || q.includes('safe') || q.includes('sick') || q.includes('allergies') || q.includes('asthma')) {
        const aqi = weatherData.airQuality?.list?.[0]?.main.aqi;
        const temp = weatherData.current?.main.temp;
        
        response = this.getHealthAdvice(temp, aqi);
        
        followUpQuestions = [
          'Do you have respiratory issues?',
          'Are you taking any precautions?',
          'Should you avoid outdoor activities?',
          'Do you need medication recommendations?'
        ];
      }
      
      // Travel/Commute conversation
      else if (q.includes('travel') || q.includes('drive') || q.includes('commute') || q.includes('go') || q.includes('trip')) {
        const weather = weatherData.current?.weather[0]?.main;
        const visibility = weatherData.current?.visibility;
        const wind = weatherData.current?.wind.speed;
        
        response = this.getTravelAdvice(weather, visibility, wind);
        
        followUpQuestions = [
          'How long is your trip?',
          'Are you driving or using public transport?',
          'Will you be traveling at night?',
          'Do you have any vehicle concerns?'
        ];
      }
      
      // Allergy/Pollen conversation
      else if (q.includes('allerg') || q.includes('pollen') || q.includes('hay fever')) {
        response = 'Pollen levels can significantly affect allergies. The current weather conditions might impact pollen distribution:\n';
        response += this.getPollenAdvice(weatherData.current);
        
        followUpQuestions = [
          'What type of allergies do you have?',
          'Are you currently experiencing symptoms?',
          'Have you taken your medication?',
          'Should you stay indoors?'
        ];
      }
      
      // Fitness/Exercise conversation
      else if (q.includes('exercise') || q.includes('workout') || q.includes('run') || q.includes('gym') || q.includes('sport')) {
        const temp = weatherData.current?.main.temp;
        const humidity = weatherData.current?.main.humidity;
        const weather = weatherData.current?.weather[0]?.main;
        
        response = this.getFitnessAdvice(temp, humidity, weather);
        
        followUpQuestions = [
          'How intense is your workout?',
          'How long do you plan to exercise?',
          'Are you exercising indoors or outdoors?',
          'Do you have hydration supplies?'
        ];
      }
      
      // Event/Party planning
      else if (q.includes('event') || q.includes('party') || q.includes('picnic') || q.includes('beach') || q.includes('wedding')) {
        const weather = weatherData.current?.weather[0]?.main;
        const temp = weatherData.current?.main.temp;
        const forecast = weatherData.forecast?.list;
        
        response = this.getEventAdvice(weather, temp, forecast);
        
        followUpQuestions = [
          'How many people are attending?',
          'What type of event is it?',
          'Do you have backup indoor plans?',
          'What time of day is it?'
        ];
      }
      
      // General weather inquiry
      else if (q.includes('weather') || q.includes('condition') || q.includes('outside') || q.includes('today')) {
        const current = weatherData.current;
        response = `Current weather: ${current?.weather[0]?.description}\n`;
        response += `Temperature: ${current?.main.temp}°C (feels like ${current?.main.feels_like}°C)\n`;
        response += `Humidity: ${current?.main.humidity}%\n`;
        response += `Wind: ${current?.wind.speed} m/s\n`;
        response += `Pressure: ${current?.main.pressure} hPa`;
        
        followUpQuestions = [
          'What would you like to do today?',
          'Do you need outfit suggestions?',
          'Are you planning to go out?',
          'Are you concerned about any specific condition?'
        ];
      }
      
      // Air quality
      else if (q.includes('air quality') || q.includes('pollution') || q.includes('aqi')) {
        const aqi = weatherData.airQuality?.list?.[0]?.main.aqi;
        const aqiText = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'][aqi - 1];
        
        response = `Air quality is currently ${aqiText} (${aqi}/5).\n`;
        if (aqi > 3) {
          response += 'This is unhealthy - limit outdoor activities, especially for vulnerable groups.';
        } else {
          response += 'Air quality is good for outdoor activities.';
        }
        
        followUpQuestions = [
          'Do you have respiratory problems?',
          'Should you wear a mask?',
          'Will air quality improve later?',
          'How does this affect your plans?'
        ];
      }
      
      // Default response
      else {
        response = 'I can help you with various weather-related topics. What specific information would you like?';
        followUpQuestions = [
          'Tell me about the weather today',
          'What should I wear?',
          'Is it good for outdoor activities?',
          'How\'s the air quality?'
        ];
      }
      
      this.addToHistory('assistant', response);
      
      return {
        response,
        followUpQuestions,
        confidence: 0.95
      };
      
    } catch (error) {
      console.error('Error in conversation handler:', error);
      return {
        response: 'I encountered an error. Please try again.',
        followUpQuestions: [],
        confidence: 0
      };
    }
  },

  // Get clothing advice based on weather
  getClothingAdvice(temp, humidity, wind) {
    let advice = '👕 **Recommended Outfit:**\n';
    
    if (temp < 0) {
      advice += '• Heavy winter coat\n• Thermal layers\n• Warm hat and gloves\n• Warm socks and boots\n• Scarf for wind protection';
    } else if (temp < 10) {
      advice += '• Winter jacket or sweater\n• Long pants\n• Warm shoes\n• Hat and gloves (optional)\n• Thermal base layer';
    } else if (temp < 20) {
      advice += '• Light jacket or cardigan\n• Long pants or jeans\n• Comfortable shoes\n• Optional: light scarf';
    } else if (temp < 25) {
      advice += '• T-shirt or light blouse\n• Shorts or light pants\n• Comfortable shoes\n• Sunglasses recommended';
    } else {
      advice += '• Light, breathable clothing\n• Shorts or skirt\n• Hat for sun protection\n• Sunscreen (SPF 30+)\n• Light shoes or sandals';
    }
    
    if (humidity > 75) {
      advice += '\n\n💧 **Note:** High humidity - choose breathable fabrics';
    }
    
    if (wind > 15) {
      advice += '\n\n💨 **Note:** Strong winds - secure your outfit/accessories';
    }
    
    return advice;
  },

  // Get health advice
  getHealthAdvice(temp, aqi) {
    let advice = '⚕️ **Health & Safety Advice:**\n';
    
    if (temp < -10) {
      advice += '⚠️ Extreme cold alert! Risk of frostbite within 30 minutes.\n• Limit outdoor exposure\n• Cover all exposed skin\n• Seek shelter immediately if you feel numb';
    } else if (temp < 0) {
      advice += '• Be cautious of ice and slippery surfaces\n• Watch for hypothermia symptoms\n• Keep dry and warm';
    } else if (temp > 35) {
      advice += '☀️ Extreme heat alert!\n• Stay hydrated (drink water frequently)\n• Avoid outdoor activity during peak hours (11 AM - 4 PM)\n• Watch for heat exhaustion symptoms\n• Wear light-colored clothing';
    }
    
    if (aqi > 3) {
      advice += '\n🌫️ Air quality is poor:\n• People with respiratory issues should stay indoors\n• Wear N95 mask if going outside\n• Avoid strenuous outdoor activities';
    }
    
    return advice;
  },

  // Get travel advice
  getTravelAdvice(weather, visibility, wind) {
    let advice = '🚗 **Travel Advice:**\n';
    
    if (weather.includes('Rain') || weather.includes('Storm')) {
      advice += '⚠️ Wet conditions ahead:\n• Reduce speed\n• Increase following distance\n• Use headlights\n• Be extra cautious on curves';
    } else if (weather.includes('Snow')) {
      advice += '⚠️ Snow/ice possible:\n• Use winter tires\n• Go slowly and carefully\n• Avoid sudden movements\n• Have emergency supplies';
    } else if (weather.includes('Fog')) {
      advice += '⚠️ Poor visibility:\n• Use low-beam headlights\n• Reduce speed\n• Increase following distance';
    } else {
      advice += '✓ Road conditions appear favorable\n• Still exercise normal caution\n• Check traffic conditions';
    }
    
    if (wind > 20) {
      advice += '\n💨 Strong winds may affect driving:\n• Hold steering wheel firmly\n• Watch for crosswind gusts\n• Be careful with high-profile vehicles';
    }
    
    return advice;
  },

  // Get pollen advice
  getPollenAdvice(current) {
    let advice = '';
    
    const windSpeed = current?.wind.speed;
    const humidity = current?.main.humidity;
    
    if (windSpeed > 15) {
      advice += '💨 High wind speeds increase pollen dispersal\n';
    }
    
    if (humidity < 40) {
      advice += '💧 Low humidity makes pollen more active\n';
    }
    
    if (humidity > 75) {
      advice += '💧 High humidity reduces pollen in air\n';
    }
    
    advice += '\n📋 **Allergy Prevention:**\n• Keep windows closed\n• Use air purifier if available\n• Change clothes after being outside\n• Shower to wash off pollen';
    
    return advice;
  },

  // Get fitness advice
  getFitnessAdvice(temp, humidity, weather) {
    let advice = '💪 **Fitness Recommendations:**\n';
    
    if (temp < 0) {
      advice += '❄️ Cold weather exercise:\n• Warm up thoroughly first\n• Wear layers\n• Protect extremities\n• Stay hydrated (even in cold)';
    } else if (temp < 10) {
      advice += '• Wear warm but breathable clothing\n• Warm up well before exercising\n• Stay properly hydrated';
    } else if (temp > 30) {
      advice += '☀️ Hot weather exercise:\n• Exercise early morning or evening\n• Drink water constantly (every 15-20 min)\n• Wear light colors and breathable fabric\n• Reduce intensity\n• Watch for heat exhaustion';
    } else {
      advice += '✓ Good conditions for exercise\n• Still stay hydrated\n• Use sunscreen\n• Adjust clothing as needed';
    }
    
    if (weather.includes('Rain')) {
      advice += '\n🌧️ Wet conditions:\n• Be careful of slippery surfaces\n• Wear reflective gear for visibility\n• Consider indoor alternative';
    }
    
    if (humidity > 80) {
      advice += '\n💧 High humidity:\n• Take frequent breaks\n• Drink extra water\n• Exercise at lower intensity';
    }
    
    return advice;
  },

  // Get event advice
  getEventAdvice(weather, temp, forecast) {
    let advice = '🎉 **Event Planning Advice:**\n';
    
    if (weather.includes('Rain') || weather.includes('Storm')) {
      advice += '⚠️ Rain expected:\n• Have tent/canopy ready\n• Plan for indoor backup\n• Waterproof decorations\n• Check weather updates frequently';
    } else if (weather.includes('Clear')) {
      advice += '☀️ Clear skies expected:\n• Perfect outdoor conditions!\n• Provide shade/umbrella areas\n• Sunscreen for guests\n• Still monitor forecast';
    } else {
      advice += '✓ Moderate conditions\n• Have contingency plans\n• Check updates before event\n• Prepare for temperature changes';
    }
    
    if (temp > 30) {
      advice += '\n☀️ Hot weather:\n• Provide plenty of water\n• Set up shaded areas\n• Lighter food options\n• Start early to avoid peak heat';
    } else if (temp < 10) {
      advice += '\n❄️ Cold weather:\n• Provide blankets/heaters\n• Hot beverages\n• Consider time duration\n• Have warm shelter available';
    }
    
    return advice;
  },

  // Get contextual next question based on last exchange
  getSmartFollowUp(lastQuestion, weatherData) {
    const q = lastQuestion.toLowerCase();
    
    if (q.includes('temperature')) {
      return 'Would you like clothing recommendations or activity suggestions?';
    } else if (q.includes('wear') || q.includes('cloth')) {
      return 'Do you have allergies or health concerns I should consider?';
    } else if (q.includes('outdoor')) {
      return 'How long do you plan to be outside?';
    } else if (q.includes('travel') || q.includes('drive')) {
      return 'What time are you traveling?';
    }
    
    return 'Is there anything else you\'d like to know?';
  }
};
