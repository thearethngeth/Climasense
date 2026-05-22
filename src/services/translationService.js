import axios from 'axios';

const KHMER_UNICODE_REGEX = /[\u1780-\u17FF\u19E0-\u19FF]/;

export const LanguageCode = {
  ENGLISH: 'en',
  KHMER: 'km'
};

const UI_COPY = {
  en: {
    assistantName: 'WeatherWise AI',
    assistantSubtitle: 'Your intelligent weather companion',
    welcomeTitle: "Hello, I'm WeatherWise AI",
    welcomeText: 'Ask me anything about the weather – in English or Khmer!',
    tryPrompt: 'Try asking:',
    quickActions: 'Quick Actions',
    inputPlaceholder: 'Ask about weather, clothing, activities...',
    clearConfirm: 'Clear conversation history?',
    languageLabel: 'Switch language',
    sendError: 'Sorry, I encountered an error. Please try again.',
    outOfScopeHistorical: "I can't provide historical weather data, but I can tell you today's and future forecasts! 🌤️"
  },
  km: {
    assistantName: 'អាកាសធាតុវិសេស AI',
    assistantSubtitle: 'ដៃគូអាកាសធាតុឆ្លាតវៃ',
    welcomeTitle: 'សួស្តី! ខ្ញុំ WeatherWise AI',
    welcomeText: 'សួរខ្ញុំអំពីអាកាសធាតុជាភាសាខ្មែរ ឬអង់គ្លេស',
    tryPrompt: 'សាកសួរ៖',
    quickActions: 'សកម្មភាពរហ័ស',
    inputPlaceholder: 'សួរអំពីអាកាសធាតុ, សម្លៀកបំពាក់, សកម្មភាព...',
    clearConfirm: 'លុបប្រវត្តិការសន្ទនា?',
    languageLabel: 'ប្តូរភាសា',
    sendError: 'សូមទោស មានបញ្ហា។ សាកល្បងម្តងទៀត',
    outOfScopeHistorical: 'ខ្ញុំមិនអាចផ្តល់ទិន្នន័យអាកាសធាតុកន្លងទេ ប៉ុន្តែអាចប្រាប់ថ្ងៃនេះ និងថ្ងៃខាងមុខ!'
  }
};

export const detectLanguage = (text = '') => {
  if (KHMER_UNICODE_REGEX.test(text)) {
    return LanguageCode.KHMER;
  }
  return LanguageCode.ENGLISH;
};

export const getUICopy = (language = LanguageCode.ENGLISH) => {
  if (language === LanguageCode.KHMER) {
    return UI_COPY.km;
  }
  return UI_COPY.en;
};

export const isHistoricalQuery = (text = '') => {
  const query = text.toLowerCase();
  return /historical|history|past weather|last year|seasonal statistics|temperature trend/.test(query);
};

/**
 * Translate text using MyMemory (free, reliable for Khmer)
 * @param {string} text - Text to translate
 * @param {string} sourceLang - 'en' or 'km'
 * @param {string} targetLang - 'en' or 'km'
 */
export async function translateText(text, sourceLang, targetLang) {
  if (sourceLang === targetLang) return text;
  if (!text.trim()) return '';

  try {
    // Use MyMemory API (no key required)
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
    const response = await axios.get(url);
    if (response.data && response.data.responseData && response.data.responseData.translatedText) {
      let translated = response.data.responseData.translatedText;
      // MyMemory sometimes returns HTML entities, decode basic ones
      translated = translated.replace(/&#39;/g, "'").replace(/&quot;/g, '"');
      return translated;
    }
    return text;
  } catch (error) {
    console.warn('Translation failed, using original text', error);
    return text;
  }
}
