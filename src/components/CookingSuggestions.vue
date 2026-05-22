<template>
  <div class="cooking-suggestions">
    <div class="cooking-header">
      <h3><i class="fas fa-utensils"></i> Weather-Perfect Meals</h3>
      <p class="weather-info">{{ currentWeather }} • {{ currentTemp }}°{{ tempUnit }}</p>
    </div>

    <div class="suggestions-grid">
      <div 
        v-for="(recipe, index) in suggestions" 
        :key="index"
        class="recipe-card"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="recipe-icon">{{ recipe.icon }}</div>
        <div class="recipe-content">
          <h4 class="recipe-name">{{ recipe.name }}</h4>
          <p class="recipe-description">{{ recipe.description }}</p>
          <div class="recipe-tags">
            <span 
              v-for="tag in recipe.tags" 
              :key="tag"
              class="recipe-tag"
            >{{ tag }}</span>
          </div>
        </div>
        <div class="recipe-match">
          <div class="match-score">{{ recipe.matchScore }}%</div>
          <div class="match-label">Perfect Match</div>
        </div>
      </div>
    </div>

    <div class="cooking-tips">
      <h4><i class="fas fa-lightbulb"></i> Weather Cooking Tip</h4>
      <p>{{ cookingTip }}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'CookingSuggestions',
  data() {
    return {
      recipeDatabase: {
        cold: [
          { name: 'Creamy Tomato Soup', icon: '🍲', description: 'Warm up with this hearty classic', tags: ['Comfort', 'Quick'], matchScore: 95 },
          { name: 'Beef Stew', icon: '🥘', description: 'Rich and savory slow-cooked perfection', tags: ['Hearty', 'Dinner'], matchScore: 98 },
          { name: 'Hot Chocolate', icon: '☕', description: 'Cozy beverage with marshmallows', tags: ['Dessert', 'Drink'], matchScore: 92 },
          { name: 'Chicken Noodle Soup', icon: '🍜', description: 'Classic comfort in a bowl', tags: ['Comfort', 'Healthy'], matchScore: 94 }
        ],
        hot: [
          { name: 'Greek Salad', icon: '🥗', description: 'Fresh and crisp with feta cheese', tags: ['Light', 'Healthy'], matchScore: 96 },
          { name: 'Gazpacho', icon: '🍅', description: 'Chilled Spanish tomato soup', tags: ['Refreshing', 'Cold'], matchScore: 98 },
          { name: 'Fruit Smoothie Bowl', icon: '🍓', description: 'Cool and nutritious breakfast', tags: ['Breakfast', 'Fresh'], matchScore: 94 },
          { name: 'Iced Coffee', icon: '🧊', description: 'Cold brew perfection', tags: ['Drink', 'Energizing'], matchScore: 90 }
        ],
        rainy: [
          { name: 'Mac & Cheese', icon: '🧀', description: 'Ultimate comfort food', tags: ['Comfort', 'Indulgent'], matchScore: 97 },
          { name: 'Vegetable Curry', icon: '🍛', description: 'Warm spices and coconut milk', tags: ['Spicy', 'Vegan'], matchScore: 95 },
          { name: 'Grilled Cheese & Tomato Soup', icon: '🥪', description: 'The perfect rainy day duo', tags: ['Classic', 'Comfort'], matchScore: 99 },
          { name: 'Baked Pasta', icon: '🍝', description: 'Cheesy baked goodness', tags: ['Dinner', 'Family'], matchScore: 93 }
        ],
        mild: [
          { name: 'Grilled Chicken Caesar', icon: '🥙', description: 'Light yet satisfying', tags: ['Lunch', 'Balanced'], matchScore: 88 },
          { name: 'Veggie Stir Fry', icon: '🥢', description: 'Quick and colorful', tags: ['Healthy', 'Quick'], matchScore: 90 },
          { name: 'Sandwich Platter', icon: '🥖', description: 'Perfect for any occasion', tags: ['Versatile', 'Easy'], matchScore: 85 },
          { name: 'Quinoa Bowl', icon: '🥣', description: 'Nutritious and filling', tags: ['Healthy', 'Vegan'], matchScore: 87 }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      weatherData: state => state.weatherData,
      units: state => state.units
    }),
    currentTemp() {
      return this.weatherData?.main?.temp 
        ? Math.round(this.weatherData.main.temp) 
        : null;
    },
    tempUnit() {
      return this.units === 'metric' ? 'C' : 'F';
    },
    currentWeather() {
      return this.weatherData?.weather?.[0]?.main || 'Clear';
    },
    weatherCondition() {
      const temp = this.currentTemp;
      const weather = this.currentWeather.toLowerCase();
      
      if (weather.includes('rain') || weather.includes('drizzle')) {
        return 'rainy';
      }
      
      if (this.units === 'metric') {
        if (temp < 10) return 'cold';
        if (temp > 28) return 'hot';
      } else {
        if (temp < 50) return 'cold';
        if (temp > 82) return 'hot';
      }
      
      return 'mild';
    },
    suggestions() {
      return this.recipeDatabase[this.weatherCondition] || this.recipeDatabase.mild;
    },
    cookingTip() {
      const tips = {
        cold: '🔥 Cold weather is perfect for slow-cooking! Let your stews and soups simmer for maximum flavor.',
        hot: '🌊 Keep the kitchen cool with no-cook meals and cold dishes. Your AC will thank you!',
        rainy: '☔ Rainy days call for comfort food! Bake something delicious and fill your home with warmth.',
        mild: '🌤️ Perfect weather for outdoor grilling or a light meal on the patio!'
      };
      return tips[this.weatherCondition] || tips.mild;
    }
  }
};
</script>

<style scoped>
.cooking-suggestions {
  padding: 20px;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.cooking-header {
  text-align: center;
  margin-bottom: 24px;
}

.cooking-header h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.weather-info {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  font-weight: 500;
}

.suggestions-grid {
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
}

.recipe-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  animation: slideIn 0.5s ease forwards;
  opacity: 0;
  cursor: pointer;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
  border-color: rgba(255, 255, 255, 0.2);
}

.recipe-icon {
  font-size: 3rem;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.recipe-card:hover .recipe-icon {
  transform: scale(1.2) rotate(5deg);
}

.recipe-content {
  flex: 1;
}

.recipe-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 6px;
}

.recipe-description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 10px;
  line-height: 1.4;
}

.recipe-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.recipe-tag {
  padding: 4px 12px;
  background: rgba(102, 126, 234, 0.3);
  border-radius: 20px;
  font-size: 0.75rem;
  color: #fff;
  font-weight: 500;
  border: 1px solid rgba(102, 126, 234, 0.4);
}

.recipe-match {
  text-align: center;
  padding: 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.match-score {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  line-height: 1;
}

.match-label {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 4px;
  font-weight: 500;
}

.cooking-tips {
  padding: 20px;
  background: linear-gradient(135deg, rgba(52, 211, 153, 0.2), rgba(16, 185, 129, 0.2));
  border-radius: 12px;
  border: 1px solid rgba(52, 211, 153, 0.3);
}

.cooking-tips h4 {
  color: #fff;
  font-size: 1rem;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.cooking-tips p {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .recipe-card {
    flex-direction: column;
    text-align: center;
  }
  
  .recipe-icon {
    font-size: 2.5rem;
  }
  
  .recipe-tags {
    justify-content: center;
  }
}
</style>
