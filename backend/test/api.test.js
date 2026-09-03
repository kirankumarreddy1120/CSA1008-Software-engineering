/**
 * WeatherGPT Automated Backend Test Suite
 * Validates REST APIs, Open-Meteo Integration, Hazard Detection, AI Processing & Multilingual Synthesis.
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000';

async function makeRequest(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, options);
  const data = await response.json();
  return { status: response.status, data };
}

async function runTests() {
  console.log('===============================================================');
  console.log('🧪 Starting WeatherGPT Comprehensive Automated API Verification');
  console.log('===============================================================');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ FAIL: ${name} -> ${err.message}`);
      failed++;
    }
  }

  // 1. Health Check
  await test('TC01 - System Health & Diagnostics Endpoint', async () => {
    const res = await makeRequest('/api/health');
    if (res.status !== 200 || res.data.status !== 'ONLINE') {
      throw new Error(`Unexpected health response: ${JSON.stringify(res)}`);
    }
  });

  // 2. Current Weather Search
  await test('TC02 - Current Weather Retrieval (Chennai)', async () => {
    const res = await makeRequest('/api/weather/current?city=Chennai');
    if (res.status !== 200 || !res.data.success || !res.data.data.current) {
      throw new Error(`Failed to retrieve current weather for Chennai`);
    }
    const current = res.data.data.current;
    if (typeof current.temperature !== 'number' || typeof current.humidity !== 'number') {
      throw new Error(`Invalid weather data structure: temp=${current.temperature}`);
    }
  });

  // 3. Multi-Day Forecast
  await test('TC03 - 5-Day Forecast Retrieval (Bengaluru)', async () => {
    const res = await makeRequest('/api/weather/forecast?city=Bengaluru&days=5');
    if (res.status !== 200 || !res.data.daily || res.data.daily.length < 5) {
      throw new Error(`Forecast daily array length is less than 5`);
    }
  });

  // 4. Extreme Weather Alerts
  await test('TC04 - Extreme Weather Hazard Alert Analysis (Mumbai)', async () => {
    const res = await makeRequest('/api/weather/alerts?city=Mumbai');
    if (res.status !== 200 || !res.data.alerts || !Array.isArray(res.data.alerts)) {
      throw new Error(`Alerts response does not contain valid array`);
    }
  });

  // 5. Climate / History Records
  await test('TC05 - Historical Climate & Reanalysis Trends (New Delhi)', async () => {
    const res = await makeRequest('/api/weather/history?city=New%20Delhi');
    if (res.status !== 200 || !res.data.data.yearlyTrends || !res.data.data.monthlyBreakdown) {
      throw new Error(`Historical climate data is missing yearly/monthly trends`);
    }
  });

  // 6. Agricultural Advisory
  await test('TC06 - Agro-Meteorological Advisory Bulletin (Pune)', async () => {
    const res = await makeRequest('/api/weather/agriculture?city=Pune');
    if (res.status !== 200 || !res.data.data.advisories || !res.data.data.disclaimer) {
      throw new Error(`Agricultural advisory lacks advisories or required disclaimer`);
    }
  });

  // 7. Location Search Autocomplete
  await test('TC07 - Location Autocomplete & Geocoding Search (Kolkata)', async () => {
    const res = await makeRequest('/api/weather/locations?search=kolkata');
    if (res.status !== 200 || !res.data.locations || res.data.locations.length === 0) {
      throw new Error(`No locations returned for 'kolkata' query`);
    }
  });

  // 8. Natural Language Weather Query (English)
  await test('TC08 - Conversational AI Weather Query (English - "Will it rain tomorrow in Delhi?")', async () => {
    const res = await makeRequest('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Will it rain tomorrow in Delhi?', language: 'en', location: 'Delhi' })
    });
    if (res.status !== 200 || !res.data.data.response || res.data.data.intent !== 'RAIN_QUERY') {
      throw new Error(`Unexpected chat response intent: ${res.data.data?.intent}`);
    }
  });

  // 9. Multilingual Query (Hindi)
  await test('TC09 - Conversational AI Query (Hindi - "चेन्नई में मौसम कैसा है?")', async () => {
    const res = await makeRequest('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'चेन्नई में मौसम कैसा है?', language: 'hi', location: 'Chennai' })
    });
    if (res.status !== 200 || !res.data.data.response || res.data.data.language !== 'hi') {
      throw new Error(`Hindi query did not return Hindi localized response`);
    }
  });

  // 10. Multilingual Query (Tamil)
  await test('TC10 - Conversational AI Query (Tamil - "சென்னையில் மழை பெய்யுமா?")', async () => {
    const res = await makeRequest('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'சென்னையில் மழை பெய்யுமா?', language: 'ta', location: 'Chennai' })
    });
    if (res.status !== 200 || !res.data.data.response || res.data.data.language !== 'ta') {
      throw new Error(`Tamil query did not return Tamil localized response`);
    }
  });

  // 11. Multilingual Query (Telugu)
  await test('TC11 - Conversational AI Query (Telugu - "హైదరాబాద్ లో ఉష్ణోగ్రత ఎంత?")', async () => {
    const res = await makeRequest('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'హైదరాబాద్ లో ఉష్ణోగ్రత ఎంత?', language: 'te', location: 'Hyderabad' })
    });
    if (res.status !== 200 || !res.data.data.response || res.data.data.language !== 'te') {
      throw new Error(`Telugu query did not return Telugu localized response`);
    }
  });

  // 12. Empty Query Validation Handling
  await test('TC12 - Empty Chat Query Error Handling', async () => {
    const res = await makeRequest('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '   ', language: 'en' })
    });
    if (res.status !== 400 || res.data.success !== false) {
      throw new Error(`Empty query did not return HTTP 400 Bad Request`);
    }
  });

  // 13. Saved Locations CRUD
  await test('TC13 - Saved Locations Bookmark Workflow', async () => {
    // Add saved location
    const addRes = await makeRequest('/api/saved-locations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cityName: 'Jaipur', sessionId: 'test_session', notes: 'Desert Station' })
    });
    if (addRes.status !== 201) throw new Error(`Failed to add saved location`);

    // List saved locations
    const listRes = await makeRequest('/api/saved-locations?sessionId=test_session');
    if (listRes.status !== 200 || listRes.data.locations.length === 0) {
      throw new Error(`Failed to list saved locations for test_session`);
    }
  });

  console.log('===============================================================');
  console.log(`📊 Test Results Summary: Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

// Allow time for server startup if launched independently
setTimeout(runTests, 1000);
