// Weather Data Service - Handles historical weather data analysis
import Papa from 'papaparse';
import moment from 'moment';

class WeatherDataService {
  constructor() {
    this.historicalData = [];
    this.isLoaded = false;
  }

  // Load CSV data
  async loadHistoricalData(csvFile) {
    return new Promise((resolve, reject) => {
      Papa.parse(csvFile, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          this.historicalData = results.data.map(row => ({
            date: moment(row['Formatted Date']),
            summary: row['Summary'],
            precipType: row['Precip Type'],
            temperature: row['Temperature (C)'],
            apparentTemp: row['Apparent Temperature (C)'],
            humidity: row['Humidity'],
            windSpeed: row['Wind Speed (km/h)'],
            windBearing: row['Wind Bearing (degrees)'],
            visibility: row['Visibility (km)'],
            cloudCover: row['Loud Cover'],
            pressure: row['Pressure (millibars)'],
            dailySummary: row['Daily Summary']
          }));
          this.isLoaded = true;
          resolve(this.historicalData);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  // Get data for specific month
  getMonthData(month, year = null) {
    return this.historicalData.filter(record => {
      const recordMonth = record.date.month() + 1;
      const recordYear = record.date.year();
      
      if (year) {
        return recordMonth === month && recordYear === year;
      }
      return recordMonth === month;
    });
  }

  // Get data for specific date
  getDateData(date) {
    const targetDate = moment(date);
    return this.historicalData.filter(record => {
      return record.date.format('YYYY-MM-DD') === targetDate.format('YYYY-MM-DD');
    });
  }

  // Get average temperature for a month
  getMonthlyAverage(month, year = null) {
    const monthData = this.getMonthData(month, year);
    if (monthData.length === 0) return null;

    const temps = monthData.map(d => d.temperature).filter(t => t != null);
    const avg = temps.reduce((sum, t) => sum + t, 0) / temps.length;
    const max = Math.max(...temps);
    const min = Math.min(...temps);

    return {
      average: avg.toFixed(1),
      max: max.toFixed(1),
      min: min.toFixed(1),
      records: monthData.length
    };
  }

  // Get weather patterns for a specific month/day combination
  getHistoricalPattern(month, day) {
    const patterns = this.historicalData.filter(record => {
      return record.date.month() + 1 === month && record.date.date() === day;
    });

    if (patterns.length === 0) return null;

    const temps = patterns.map(p => p.temperature).filter(t => t != null);
    const conditions = patterns.map(p => p.summary).filter(s => s);
    const precipitation = patterns.filter(p => p.precipType === 'rain').length;

    // Count condition occurrences
    const conditionCounts = {};
    conditions.forEach(c => {
      conditionCounts[c] = (conditionCounts[c] || 0) + 1;
    });

    const mostCommon = Object.entries(conditionCounts)
      .sort((a, b) => b[1] - a[1])[0];

    return {
      avgTemp: (temps.reduce((sum, t) => sum + t, 0) / temps.length).toFixed(1),
      maxTemp: Math.max(...temps).toFixed(1),
      minTemp: Math.min(...temps).toFixed(1),
      mostCommonCondition: mostCommon ? mostCommon[0] : 'Unknown',
      rainProbability: ((precipitation / patterns.length) * 100).toFixed(0),
      yearsAnalyzed: new Set(patterns.map(p => p.date.year())).size,
      totalRecords: patterns.length
    };
  }

  // Get temperature trends
  getTemperatureTrend(days = 30) {
    const recentData = this.historicalData.slice(-days * 24);
    if (recentData.length === 0) return null;

    const dailyAvgs = {};
    recentData.forEach(record => {
      const day = record.date.format('YYYY-MM-DD');
      if (!dailyAvgs[day]) {
        dailyAvgs[day] = [];
      }
      if (record.temperature != null) {
        dailyAvgs[day].push(record.temperature);
      }
    });

    return Object.entries(dailyAvgs).map(([date, temps]) => ({
      date,
      avgTemp: (temps.reduce((sum, t) => sum + t, 0) / temps.length).toFixed(1)
    }));
  }

  // Get extreme weather events
  getExtremeEvents(type = 'all') {
    if (!this.historicalData.length) return [];

    const temps = this.historicalData.map(d => d.temperature).filter(t => t != null);
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);

    const extremes = {
      hottestDay: this.historicalData.find(d => d.temperature === maxTemp),
      coldestDay: this.historicalData.find(d => d.temperature === minTemp),
      highestWind: this.historicalData.reduce((max, d) => 
        d.windSpeed > (max?.windSpeed || 0) ? d : max, {}),
      lowestVisibility: this.historicalData.reduce((min, d) => 
        d.visibility && d.visibility < (min?.visibility || Infinity) ? d : min, {})
    };

    return extremes;
  }

  // Get seasonal statistics
  getSeasonalStats() {
    const seasons = {
      winter: [12, 1, 2],
      spring: [3, 4, 5],
      summer: [6, 7, 8],
      fall: [9, 10, 11]
    };

    const stats = {};
    
    Object.entries(seasons).forEach(([season, months]) => {
      const seasonData = this.historicalData.filter(record => 
        months.includes(record.date.month() + 1)
      );

      if (seasonData.length > 0) {
        const temps = seasonData.map(d => d.temperature).filter(t => t != null);
        const rainDays = seasonData.filter(d => d.precipType === 'rain').length;

        stats[season] = {
          avgTemp: (temps.reduce((sum, t) => sum + t, 0) / temps.length).toFixed(1),
          maxTemp: Math.max(...temps).toFixed(1),
          minTemp: Math.min(...temps).toFixed(1),
          rainProbability: ((rainDays / seasonData.length) * 100).toFixed(0),
          records: seasonData.length
        };
      }
    });

    return stats;
  }

  // Compare current conditions with historical average
  compareWithHistory(currentTemp, currentDate) {
    const month = moment(currentDate).month() + 1;
    const day = moment(currentDate).date();
    
    const historical = this.getHistoricalPattern(month, day);
    
    if (!historical) return null;

    const diff = currentTemp - parseFloat(historical.avgTemp);
    const percentage = ((diff / parseFloat(historical.avgTemp)) * 100).toFixed(1);

    return {
      currentTemp: currentTemp.toFixed(1),
      historicalAvg: historical.avgTemp,
      difference: diff.toFixed(1),
      percentageDiff: percentage,
      comparison: diff > 0 ? 'warmer' : diff < 0 ? 'cooler' : 'average',
      yearsAnalyzed: historical.yearsAnalyzed
    };
  }

  // Get weather recommendations based on historical data
  getSmartRecommendations(month, day) {
    const pattern = this.getHistoricalPattern(month, day);
    if (!pattern) return null;

    const recommendations = [];
    const temp = parseFloat(pattern.avgTemp);
    const rainProb = parseFloat(pattern.rainProbability);

    // Temperature-based recommendations
    if (temp > 30) {
      recommendations.push({
        type: 'heat',
        icon: '🔥',
        message: 'Historically hot day! Stay hydrated and avoid midday sun.',
        priority: 'high'
      });
    } else if (temp < 10) {
      recommendations.push({
        type: 'cold',
        icon: '❄️',
        message: 'Typically cold on this date. Wear warm layers.',
        priority: 'medium'
      });
    }

    // Rain-based recommendations
    if (rainProb > 60) {
      recommendations.push({
        type: 'rain',
        icon: '☂️',
        message: `${rainProb}% historical chance of rain. Bring an umbrella!`,
        priority: 'high'
      });
    } else if (rainProb > 30) {
      recommendations.push({
        type: 'rain',
        icon: '🌦️',
        message: `Moderate rain chance (${rainProb}%). Keep an umbrella handy.`,
        priority: 'medium'
      });
    }

    // Condition-based recommendations
    if (pattern.mostCommonCondition.toLowerCase().includes('clear')) {
      recommendations.push({
        type: 'sun',
        icon: '😎',
        message: 'Usually clear skies! Great for outdoor activities.',
        priority: 'low'
      });
    }

    return {
      pattern,
      recommendations
    };
  }

  // Search for similar weather days
  findSimilarDays(targetTemp, targetCondition, limit = 5) {
    const similar = this.historicalData
      .filter(d => d.temperature != null)
      .map(record => ({
        ...record,
        tempDiff: Math.abs(record.temperature - targetTemp),
        conditionMatch: record.summary?.toLowerCase().includes(targetCondition.toLowerCase())
      }))
      .sort((a, b) => {
        if (a.conditionMatch && !b.conditionMatch) return -1;
        if (!a.conditionMatch && b.conditionMatch) return 1;
        return a.tempDiff - b.tempDiff;
      })
      .slice(0, limit);

    return similar;
  }
}

export default new WeatherDataService();
