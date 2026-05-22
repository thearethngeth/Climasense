# WeatherWise AI - Setup & Troubleshooting Guide

## ✅ What's Working

1. **Chat Widget UI** - Fully functional floating button and chat window
2. **Bilingual Interface** - English/Khmer language toggle
3. **Example Questions** - All buttons responsive and sending messages
4. **Message Display** - User messages and AI responses showing properly
5. **Timestamps** - Messages timestamped correctly
6. **Error Handling** - Graceful error messages displayed

## ❌ What Needs Configuration

### OpenAI API Key Missing

The chat is attempting to use OpenAI but failing due to:
1. Missing or invalid API key
2. CORS policy restrictions (browser security)

**Error Message:** `CORS policy: No 'Access-Control-Allow-Origin'`

## 🔧 How to Fix It

### Option 1: Add OpenAI API Key (Recommended)

1. **Get API Key:**
   - Visit https://platform.openai.com/api-keys
   - Create a new API key (or copy existing one)
   - Key starts with `sk-`

2. **Add to .env file:**
   ```bash
   VUE_APP_OPENAI_API_KEY=sk-your-actual-key-here
   ```

3. **Restart Dev Server:**
   ```bash
   npm run serve
   ```

4. **Clear Browser Cache:**
   - Press `Ctrl+Shift+Delete` or clear cache in DevTools

### Option 2: Use Backend Proxy (For Production)

For production, you should NOT expose the API key to the frontend. Instead:

1. Create a backend endpoint that calls OpenAI
2. Update `aiAssistantService.js` to call your backend instead
3. Backend keeps the API key secure

## 📋 Current Status

| Feature | Status | Notes |
|---------|--------|-------|
| UI Components | ✅ Working | Chat widget displays correctly |
| Language Toggle | ✅ Working | Can switch EN/ខ្មែរ |
| Message Sending | ✅ Working | Messages submit properly |
| Translation (MyMemory) | ⏳ Ready | Will work once OpenAI is configured |
| OpenAI API | ❌ Blocked | Needs API key + CORS handling |
| Weather Data | ✅ Working | App can fetch weather from Vuex store |

## 🚀 Quick Fix Steps

1. Go to https://platform.openai.com/api-keys
2. Copy your API key
3. Edit `d:\weather-app\weather-app\.env`:
   ```
   VUE_APP_WEATHER_API_KEY = 16d7ffb7b81c1a8b609196ddd5bc6470
   VUE_APP_OPENAI_API_KEY = sk-paste-your-key-here
   ```
4. Restart terminal:
   ```bash
   npm run serve
   ```
5. Refresh browser
6. Test chat again

## 💡 Alternative: Test Without API Key

To test the UI without spending API credits:

1. Comment out the OpenAI call in `aiAssistantService.js`
2. Return a mock response for testing
3. Uncomment when you have API key

## 📞 Support

If you're getting different errors:
- Check browser DevTools (F12) → Console tab
- Look for specific error messages
- Verify .env file is saved
- Make sure no spaces around the `=` sign in .env
