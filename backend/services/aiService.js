/**
 * WeatherGPT - Conversational AI Query Processing Layer
 * Ministry of Earth Sciences (MoES) / India Meteorological Department (IMD)
 * Natural Language Understanding, Intent Extraction, Multilingual Response Synthesis & Responsible AI Guardrails.
 */

const { resolveLocation, getWeatherData, getHistoricalClimate } = require('./weatherService');

// Indian language response translation maps & natural phrasing templates
const LOCALIZED_TEMPLATES = {
  hi: {
    greeting: 'नमस्ते! मैं WeatherGPT हूँ, आपका मौसम और जलवायु सहायक।',
    currentPrefix: 'वर्तमान में',
    tempIs: 'में तापमान',
    feelsLike: 'महसूस होता है',
    humidity: 'आर्द्रता (Humidity)',
    wind: 'हवा की गति',
    condition: 'मौसम की स्थिति',
    rainProb: 'बारिश की संभावना',
    forecastHeader: 'का आगामी पूर्वानुमान:',
    alertNone: 'के लिए कोई चरम मौसम चेतावनी सक्रिय नहीं है। सामान्य स्थितियां बनी हुई हैं।',
    alertActive: 'चेतावनी: सक्रिय मौसम चेतावनी!',
    agriFavorable: 'कृषि सलाह: वर्तमान मौसम खेती कार्यों के लिए अनुकूल है।',
    agriRain: 'कृषि सलाह: आगामी वर्षा के कारण सिंचाई स्थगित करें और जल निकासी सुनिश्चित करें।',
    outOfDomain: 'मैं WeatherGPT हूँ, भारत मौसम विज्ञान विभाग (IMD) आधारित मौसम एवं जलवायु सहायक। कृपया मौसम, पूर्वानुमान, वर्षा, अलर्ट या कृषि सलाह से जुड़े प्रश्न पूछें।',
    disclaimer: 'सूचना: यह पूर्वानुमान स्वचालित संख्यात्मक मॉडल पर आधारित है।'
  },
  ta: {
    greeting: 'வணக்கம்! நான் WeatherGPT, உங்களின் வானிலை மற்றும் காலநிலை உதவியாளர்.',
    currentPrefix: 'தற்போது',
    tempIs: 'இல் வெப்பநிலை',
    feelsLike: 'உணரப்படும் வெப்பநிலை',
    humidity: 'ஈரப்பதம்',
    wind: 'காற்றின் வேகம்',
    condition: 'வானிலை நிலை',
    rainProb: 'மழைக்கான வாய்ப்பு',
    forecastHeader: 'இன் வானிலை முன்னறிவிப்பு:',
    alertNone: 'தீவிர வானிலை எச்சரிக்கைகள் எதுவும் தற்போது இல்லை. இயல்பு நிலை தொடர்கிறது.',
    alertActive: 'எச்சரிக்கை: தீவிர வானிலை அறிவிப்பு!',
    agriFavorable: 'விவசாய ஆலோசனை: தற்போதைய வானிலை விவசாய பணிகளுக்கு உகந்தது.',
    agriRain: 'விவசாய ஆலோசனை: எதிர்பார்க்கப்படும் மழையால் பாசனத்தை ஒத்திவைக்கவும்.',
    outOfDomain: 'நான் WeatherGPT, இந்திய வானிலை ஆய்வுத் துறை (IMD) அடிப்படையிலான வானிலை உதவியாளர். தயவுசெய்து வானிலை, மழை, புயல் அல்லது விவசாயம் தொடர்பான கேள்விகளைக் கேட்கவும்.',
    disclaimer: 'பொறுப்புத் துறப்பு: இந்த முன்னறிவிப்பு தானியங்கி வானிலை மாதிரிகளை அடிப்படையாகக் கொண்டது.'
  },
  te: {
    greeting: 'నమస్కారం! నేను WeatherGPT, మీ వాతావరణ మరియు శీతోష్ణస్థితి సహాయకుడిని.',
    currentPrefix: 'ప్రస్తుతం',
    tempIs: 'లో ఉష్ణోగ్రత',
    feelsLike: 'అనిపించే ఉష్ణోగ్రత',
    humidity: 'తేమ శాతం',
    wind: 'గాలి వేగం',
    condition: 'వాతావరణ స్థితి',
    rainProb: 'వర్షం పడే అవకాశం',
    forecastHeader: 'రాబోయే వాతావరణ సూచన:',
    alertNone: 'ప్రస్తుతానికి ఎటువంటి తీవ్ర వాతావరణ హెచ్చరికలు లేవు. సాధారణ పరిస్థితులు ఉన్నాయి.',
    alertActive: 'హెచ్చరిక: తీవ్ర వాతావరణ హెచ్చరిక జారీ చేయబడింది!',
    agriFavorable: 'వ్యవసాయ సలహా: ప్రస్తుత వాతావరణం సాగు పనులకు అనుకూలంగా ఉంది.',
    agriRain: 'వ్యవసాయ సలహా: వర్ష సూచన ఉన్నందున నీటిపారుదల నిలిపివేయండి.',
    outOfDomain: 'నేను WeatherGPT, భారత వాతావరణ శాఖ (IMD) ఆధారిత వాతావరణ సహాయకుడిని. దయచేసి వాతావరణం, వర్షపాతం, తుఫాను లేదా వ్యవసాయ సలహాలకు సంబంధించిన ప్రశ్నలు అడగండి.',
    disclaimer: 'గమనిక: ఈ సమాచారం ఆటోమేటెడ్ న్యూమరికల్ వెదర్ మోడల్స్ పై ఆధారపడి ఉంటుంది.'
  },
  en: {
    greeting: 'Hello! I am WeatherGPT, your conversational weather and climate intelligence assistant.',
    currentPrefix: 'Currently in',
    tempIs: 'the temperature is',
    feelsLike: 'feels like',
    humidity: 'Humidity',
    wind: 'Wind speed',
    condition: 'Condition',
    rainProb: 'Precipitation Probability',
    forecastHeader: 'Weather Forecast Overview for',
    alertNone: 'No extreme weather alerts are currently active. Meteorological parameters are within normal seasonal range.',
    alertActive: 'Active Weather Hazard Alert!',
    agriFavorable: 'Agro Advisory: Conditions are favorable for normal farm operations.',
    agriRain: 'Agro Advisory: Suspend irrigation and clear field drainage due to expected precipitation.',
    outOfDomain: "I am WeatherGPT, an AI system focused on weather forecasting, alerts, and climate intelligence under IMD/MoES. Please ask me about current weather, forecasts, rain, severe alerts, or agricultural advisories.",
    disclaimer: 'Note: Weather advisories are based on automated numerical meteorological models.'
  }
};

/**
 * Natural Language Query Parser & Intent Classifier
 */
function analyzeIntent(query) {
  const q = (query || '').toLowerCase().trim();

  // Out of domain checks
  const outOfDomainKeywords = ['poem', 'joke', 'cricket score', 'movie', 'song', 'recipe', 'code a', 'write a python', 'essay', 'who is the president', 'politics'];
  const hasWeatherTerms = ['weather', 'temp', 'temperature', 'rain', 'rainy', 'forecast', 'wind', 'humid', 'cloud', 'hot', 'cold', 'storm', 'cyclone', 'alert', 'farming', 'farm', 'crop', 'climate', 'sun', 'umbrella', 'heatwave', 'barometer', 'uv', 'monsoon', 'mausam', 'varsham', 'mazhai'];

  const isExplicitOutOfDomain = outOfDomainKeywords.some(k => q.includes(k)) && !hasWeatherTerms.some(k => q.includes(k));
  if (isExplicitOutOfDomain) {
    return { intent: 'OUT_OF_DOMAIN', timeframe: 'none', isWeatherRelated: false };
  }

  // 1. Extreme Alerts & Disaster Intent
  if (q.includes('alert') || q.includes('warning') || q.includes('cyclone') || q.includes('storm') || q.includes('flood') || q.includes('heatwave') || q.includes('coldwave') || q.includes('hazard') || q.includes('emergency') || q.includes('safe to go out')) {
    return { intent: 'EXTREME_ALERT', timeframe: 'current', isWeatherRelated: true };
  }

  // 2. Agricultural & Farming Intent
  if (q.includes('farm') || q.includes('farming') || q.includes('crop') || q.includes('irrigation') || q.includes('spray') || q.includes('pesticide') || q.includes('paddy') || q.includes('wheat') || q.includes('agriculture') || q.includes('kisan') || q.includes('vyavasayam') || q.includes('vivasayam')) {
    return { intent: 'AGRICULTURAL_ADVISORY', timeframe: 'current_and_forecast', isWeatherRelated: true };
  }

  // 3. Climate & Historical Trends Intent
  if (q.includes('climate') || q.includes('history') || q.includes('historical') || q.includes('past years') || q.includes('trend') || q.includes('global warming') || q.includes('last year') || q.includes('annual rain')) {
    return { intent: 'CLIMATE_HISTORY', timeframe: 'historical', isWeatherRelated: true };
  }

  // 4. Rain & Precipitation Probability Intent
  if (q.includes('rain') || q.includes('raining') || q.includes('umbrella') || q.includes('precipitation') || q.includes('drizzle') || q.includes('downpour') || q.includes('baarish') || q.includes('varsham') || q.includes('mazhai')) {
    const isTomorrow = q.includes('tomorrow') || q.includes('kal') || q.includes('naalai') || q.includes('repu');
    const isWeekend = q.includes('weekend') || q.includes('saturday') || q.includes('sunday');
    return { intent: 'RAIN_QUERY', timeframe: isTomorrow ? 'tomorrow' : isWeekend ? 'weekend' : 'current_today', isWeatherRelated: true };
  }

  // 5. Extended Forecast Intent
  if (q.includes('forecast') || q.includes('5-day') || q.includes('5 day') || q.includes('7 day') || q.includes('week') || q.includes('tomorrow') || q.includes('upcoming') || q.includes('next days') || q.includes('weekend')) {
    const isTomorrow = q.includes('tomorrow') || q.includes('kal');
    return { intent: 'FORECAST_REQUEST', timeframe: isTomorrow ? 'tomorrow' : '5day', isWeatherRelated: true };
  }

  // 6. Wind & Pressure Intent
  if (q.includes('wind') || q.includes('breeze') || q.includes('gust') || q.includes('pressure') || q.includes('uv') || q.includes('air quality')) {
    return { intent: 'WIND_PRESSURE_QUERY', timeframe: 'current', isWeatherRelated: true };
  }

  // 7. Temperature Intent
  if (q.includes('temperature') || q.includes('temp') || q.includes('how hot') || q.includes('how cold') || q.includes('degrees') || q.includes('celcius') || q.includes('celsius')) {
    return { intent: 'TEMPERATURE_QUERY', timeframe: 'current', isWeatherRelated: true };
  }

  // Default: General Weather Inquiry
  return { intent: 'CURRENT_WEATHER', timeframe: 'current', isWeatherRelated: true };
}

/**
 * Entity & Location Extraction
 */
function extractLocationEntity(query, fallbackCity = 'New Delhi') {
  if (!query) return fallbackCity;

  const q = query.toLowerCase();
  const knownCities = [
    'new delhi', 'delhi', 'mumbai', 'chennai', 'kolkata', 'bengaluru', 'bangalore',
    'hyderabad', 'ahmedabad', 'pune', 'jaipur', 'lucknow', 'kanpur', 'nagpur',
    'bhopal', 'indore', 'patna', 'bhubaneswar', 'guwahati', 'thiruvananthapuram',
    'trivandrum', 'kochi', 'coimbatore', 'madurai', 'visakhapatnam', 'vizag',
    'vijayawada', 'shimla', 'srinagar', 'dehradun', 'ranchi', 'chandigarh',
    'amritsar', 'varanasi', 'agra', 'surat', 'vadodara', 'london', 'new york',
    'tokyo', 'dubai', 'singapore'
  ];

  for (const city of knownCities) {
    // Look for exact word boundary match
    const regex = new RegExp(`\\b${city}\\b`, 'i');
    if (regex.test(q)) {
      return city.charAt(0).toUpperCase() + city.slice(1);
    }
  }

  // Check for prepositions: "in Chennai", "for Delhi", "at Mumbai"
  const prepMatch = query.match(/(?:in|at|for|around|near)\s+([A-Za-z\s]+?)(?:\?|\.|,|$|\s+tomorrow|\s+today|\s+next)/i);
  if (prepMatch && prepMatch[1]) {
    const candidate = prepMatch[1].trim();
    if (candidate.length >= 3 && !['tomorrow', 'today', 'the', 'my', 'this'].includes(candidate.toLowerCase())) {
      return candidate;
    }
  }

  return fallbackCity;
}

/**
 * Natural Language Conversational Response Generator
 */
async function processConversationalQuery({ message, language = 'en', defaultLocation = 'New Delhi' }) {
  const lang = ['en', 'hi', 'ta', 'te'].includes(language) ? language : 'en';
  const t = LOCALIZED_TEMPLATES[lang] || LOCALIZED_TEMPLATES.en;

  if (!message || message.trim().length === 0) {
    return {
      success: true,
      intent: 'EMPTY',
      response: lang === 'hi' ? 'कृपया अपना मौसम संबंधी प्रश्न टाइप करें।' :
                lang === 'ta' ? 'தயவுசெய்து உங்கள் வானிலை கேள்வியை உள்ளிடவும்.' :
                lang === 'te' ? 'దయచేసి మీ వాతావరణ ప్రశ్నను టైప్ చేయండి.' :
                'Please enter a weather query (e.g., "What is the weather in Chennai?", "Will it rain tomorrow?", "Any extreme alerts?").',
      suggestedQueries: [
        'What is the weather in Chennai?',
        'Will it rain tomorrow in Delhi?',
        'Is there any extreme weather alert for Mumbai?',
        'Is the weather suitable for farming in Bangalore?'
      ]
    };
  }

  const { intent, timeframe, isWeatherRelated } = analyzeIntent(message);

  if (!isWeatherRelated) {
    return {
      success: true,
      intent: 'OUT_OF_DOMAIN',
      response: t.outOfDomain,
      suggestedQueries: [
        'What is the weather in Delhi today?',
        'Show 5-day forecast for Mumbai',
        'Is there any cyclone alert in Chennai?'
      ]
    };
  }

  // Extract location and retrieve real meteorological data
  const targetCity = extractLocationEntity(message, defaultLocation);
  const locationCoords = await resolveLocation(targetCity);
  const weatherData = await getWeatherData(locationCoords.lat, locationCoords.lon, locationCoords.name);

  const cityName = weatherData.location.name;
  const cur = weatherData.current;
  const daily = weatherData.daily;
  const tomorrow = daily[1] || daily[0];

  let naturalTextResponse = '';
  let keyMetrics = null;

  switch (intent) {
    case 'RAIN_QUERY': {
      if (timeframe === 'tomorrow') {
        const pProb = tomorrow.precipitationProbability;
        const pSum = tomorrow.precipitationSum;
        const rainState = pProb > 60 ? 'high chance' : pProb > 30 ? 'moderate chance' : 'low chance';

        if (lang === 'hi') {
          naturalTextResponse = `कल **${cityName}** में बारिश की **${pProb}% संभावना** है (${pSum} मिमी वर्षा अनुमानित)। ${pProb > 50 ? 'छाता साथ रखने की सलाह दी जाती है।' : 'मौसम मुख्य रूप से शुष्क रहने की संभावना है।'}`;
        } else if (lang === 'ta') {
          naturalTextResponse = `நாளை **${cityName}** இல் மழைக்கான வாய்ப்பு **${pProb}%** (${pSum} மிமீ மழை எதிர்பார்க்கப்படுகிறது). ${pProb > 50 ? 'குடை எடுத்துச் செல்வது நல்லது.' : 'வானிலை பெரும்பாலும் வறண்ட நிலையில் இருக்கும்.'}`;
        } else if (lang === 'te') {
          naturalTextResponse = `రేపు **${cityName}** లో వర్షం పడే అవకాశం **${pProb}%** (${pSum} మిమీ వర్షపాతం అంచనా). ${pProb > 50 ? 'గొడుగు తీసుకెళ్లడం మంచిది.' : 'వాతావరణం సాధారణంగా పొడిగా ఉంటుంది.'}`;
        } else {
          naturalTextResponse = `Tomorrow in **${cityName}**, there is a **${rainState} (${pProb}% probability)** of precipitation with estimated accumulation of **${pSum} mm**. Max temperature will be around **${tomorrow.tempMax}°C**.`;
        }
      } else {
        const pProb = daily[0]?.precipitationProbability || 0;
        const pSum = daily[0]?.precipitationSum || 0;
        if (lang === 'hi') {
          naturalTextResponse = `आज **${cityName}** में बारिश की संभावना **${pProb}%** है। वर्तमान स्थिति: **${cur.condition.label}**, आर्द्रता: **${cur.humidity}%**।`;
        } else if (lang === 'ta') {
          naturalTextResponse = `இன்று **${cityName}** இல் மழைக்கான வாய்ப்பு **${pProb}%**. தற்போதைய நிலை: **${cur.condition.label}**, ஈரப்பதம்: **${cur.humidity}%** ஆகும்.`;
        } else if (lang === 'te') {
          naturalTextResponse = `ఈరోజు **${cityName}** లో వర్షపాతం సంభావ్యత **${pProb}%**. ప్రస్తుత పరిస్థితి: **${cur.condition.label}**, తేమ శాతం: **${cur.humidity}%**.`;
        } else {
          naturalTextResponse = `Today in **${cityName}**, the precipitation probability is **${pProb}%** with current conditions described as **${cur.condition.label}** and humidity at **${cur.humidity}%**.`;
        }
      }
      keyMetrics = { rainProb: `${tomorrow?.precipitationProbability || 0}%`, condition: cur.condition.label, humidity: `${cur.humidity}%` };
      break;
    }

    case 'TEMPERATURE_QUERY': {
      if (lang === 'hi') {
        naturalTextResponse = `**${cityName}** में वर्तमान तापमान **${cur.temperature}°C** है (महसूस होता है: **${cur.feelsLike}°C**)। आज का अधिकतम तापमान **${cur.tempMax}°C** और न्यूनतम तापमान **${cur.tempMin}°C** रहने का अनुमान है।`;
      } else if (lang === 'ta') {
        naturalTextResponse = `**${cityName}** இல் தற்போதைய வெப்பநிலை **${cur.temperature}°C** (உணரப்படும் வெப்பநிலை: **${cur.feelsLike}°C**). இன்றைய அதிகபட்ச வெப்பநிலை **${cur.tempMax}°C** மற்றும் குறைந்தபட்சம் **${cur.tempMin}°C** ஆகும்.`;
      } else if (lang === 'te') {
        naturalTextResponse = `**${cityName}** లో ప్రస్తుత ఉష్ణోగ్రత **${cur.temperature}°C** (అనిపించే ఉష్ణోగ్రత: **${cur.feelsLike}°C**). నేటి గరిష్ట ఉష్ణోగ్రత **${cur.tempMax}°C**, కనిష్ట ఉష్ణోగ్రత **${cur.tempMin}°C**.`;
      } else {
        naturalTextResponse = `The current temperature in **${cityName}** is **${cur.temperature}°C** (feels like **${cur.feelsLike}°C**). The expected range today is between **${cur.tempMin}°C** and **${cur.tempMax}°C** with **${cur.condition.label}**.`;
      }
      keyMetrics = { temp: `${cur.temperature}°C`, feelsLike: `${cur.feelsLike}°C`, max: `${cur.tempMax}°C`, min: `${cur.tempMin}°C` };
      break;
    }

    case 'FORECAST_REQUEST': {
      const forecastDays = daily.slice(0, 5).map(d => `${d.dayName}: ${d.tempMax}°C / ${d.tempMin}°C (${d.condition.label}, Rain: ${d.precipitationProbability}%)`).join('\n• ');
      if (lang === 'hi') {
        naturalTextResponse = `**${cityName}** के लिए 5-दिवसीय मौसम पूर्वानुमान:\n\n• ${forecastDays}\n\nमौसम में उतार-चढ़ाव पर नज़र रखने के लिए विस्तृत पूर्वानुमान चार्ट देखें।`;
      } else if (lang === 'ta') {
        naturalTextResponse = `**${cityName}** க்கான 5 நாள் வானிலை முன்னறிவிப்பு:\n\n• ${forecastDays}\n\nமேலும் விவரங்களுக்கு விரிவான முன்னறிவிப்பு வரைபடத்தைப் பார்க்கவும்.`;
      } else if (lang === 'te') {
        naturalTextResponse = `**${cityName}** కోసం 5 రోజుల వాతావరణ సూచన:\n\n• ${forecastDays}\n\nమరిన్ని వివరాలకు ఫోర్‌కాస్ట్ చార్టులను పరిశీలించండి.`;
      } else {
        naturalTextResponse = `Here is the **5-day meteorological forecast for ${cityName}**:\n\n• ${forecastDays}\n\nExpect peak daytime temperature around **${daily[0]?.tempMax}°C** with prevailing ${cur.condition.label}.`;
      }
      keyMetrics = { forecastDays: daily.slice(0, 5) };
      break;
    }

    case 'EXTREME_ALERT': {
      const activeAlerts = weatherData.alerts;
      const hasWarning = activeAlerts.some(a => a.severity === 'Warning' || a.severity === 'Severe');
      const hasAdvisory = activeAlerts.some(a => a.severity === 'Advisory');

      if (hasWarning || hasAdvisory) {
        const alertList = activeAlerts.filter(a => a.severity !== 'Normal').map(a => `**[${a.badge}] ${a.title}**\n${a.description}\n*Advisory:* ${a.advisory}`).join('\n\n');
        if (lang === 'hi') {
          naturalTextResponse = `⚠️ **${cityName} के लिए सक्रिय मौसम चेतावनी:**\n\n${alertList}`;
        } else if (lang === 'ta') {
          naturalTextResponse = `⚠️ **${cityName} க்கான தீவிர வானிலை எச்சரிக்கை:**\n\n${alertList}`;
        } else if (lang === 'te') {
          naturalTextResponse = `⚠️ **${cityName} కోసం వాతావరణ హెచ్చరికలు:**\n\n${alertList}`;
        } else {
          naturalTextResponse = `⚠️ **Active Meteorological Alerts for ${cityName}:**\n\n${alertList}`;
        }
      } else {
        if (lang === 'hi') {
          naturalTextResponse = `✅ **${cityName}** के लिए कोई गंभीर मौसम चेतावनी नहीं है। सभी मानक मौसमी सीमा के भीतर हैं।`;
        } else if (lang === 'ta') {
          naturalTextResponse = `✅ **${cityName}** இல் தீவிர வானிலை எச்சரிக்கைகள் எதுவும் இல்லை. இயல்பான வானிலை நிலவுகிறது.`;
        } else if (lang === 'te') {
          naturalTextResponse = `✅ **${cityName}** లో ఎటువంటి తీవ్ర హెచ్చరికలు లేవు. సాధారణ వాతావరణం ఉంది.`;
        } else {
          naturalTextResponse = `✅ **${cityName}** currently has **No Active Extreme Weather Alerts**. Meteorological indicators (Wind: ${cur.windSpeed} km/h, Rain Prob: ${daily[0]?.precipitationProbability}%, UV: ${cur.uvIndex}) remain within standard safety thresholds.`;
        }
      }
      keyMetrics = { activeAlertsCount: activeAlerts.filter(a => a.severity !== 'Normal').length, alerts: activeAlerts };
      break;
    }

    case 'AGRICULTURAL_ADVISORY': {
      const agri = weatherData.agriculture;
      if (lang === 'hi') {
        naturalTextResponse = `🌾 **${cityName} के लिए कृषि मौसम सलाह:**\n\n• **स्थिति:** ${agri.status}\n• **सिंचाई सलाह:** ${agri.advisories.irrigation}\n• **कीटनाशक छिड़काव:** ${agri.advisories.spraying}\n• **फसल सुरक्षा:** ${agri.advisories.cropProtection}\n\n*${agri.disclaimer}*`;
      } else if (lang === 'ta') {
        naturalTextResponse = `🌾 **${cityName} க்கான வேளாண் வானிலை ஆலோசனை:**\n\n• **நிலை:** ${agri.status}\n• **பாசன ஆலோசனை:** ${agri.advisories.irrigation}\n• **மருந்து தெளித்தல்:** ${agri.advisories.spraying}\n• **பயிர் பாதுகாப்பு:** ${agri.advisories.cropProtection}\n\n*${agri.disclaimer}*`;
      } else if (lang === 'te') {
        naturalTextResponse = `🌾 **${cityName} కోసం వ్యవసాయ వాతావరణ సలహా:**\n\n• **స్థితి:** ${agri.status}\n• **నీటిపారుదల సలహా:** ${agri.advisories.irrigation}\n• **మందుల పిచికారీ:** ${agri.advisories.spraying}\n• **పంట సంరక్షణ:** ${agri.advisories.cropProtection}\n\n*${agri.disclaimer}*`;
      } else {
        naturalTextResponse = `🌾 **Agro-Meteorological Advisory for ${cityName}:**\n\n• **Status:** ${agri.status}\n• **Irrigation Guidance:** ${agri.advisories.irrigation}\n• **Pesticide Spray Window:** ${agri.advisories.spraying}\n• **Field Protection:** ${agri.advisories.cropProtection}\n\n*${agri.disclaimer}*`;
      }
      keyMetrics = { status: agri.status, advisories: agri.advisories };
      break;
    }

    case 'CLIMATE_HISTORY': {
      const history = await getHistoricalClimate(cityName, locationCoords.lat, locationCoords.lon);
      const latestTrend = history.yearlyTrends[history.yearlyTrends.length - 1];
      if (lang === 'hi') {
        naturalTextResponse = `📊 **${cityName} का जलवायु विश्लेषण (${history.timeframe}):**\n\n${history.climateInsight}\n• हालिया वार्षिक औसत तापमान: **${latestTrend?.avgTemp}°C**\n• वार्षिक वर्षा: **${latestTrend?.totalRainfall} मिमी**\n• तापमान विचलन (Anomaly): **${latestTrend?.anomaly > 0 ? '+' : ''}${latestTrend?.anomaly}°C**`;
      } else if (lang === 'ta') {
        naturalTextResponse = `📊 **${cityName} காலநிலை பகுப்பாய்வு (${history.timeframe}):**\n\n${history.climateInsight}\n• சமீபத்திய சராசரி வெப்பநிலை: **${latestTrend?.avgTemp}°C**\n• ஆண்டு மழைப்பொழிவு: **${latestTrend?.totalRainfall} மிமீ**\n• வெப்பநிலை மாற்றம் (Anomaly): **${latestTrend?.anomaly > 0 ? '+' : ''}${latestTrend?.anomaly}°C**`;
      } else if (lang === 'te') {
        naturalTextResponse = `📊 **${cityName} వాతావరణ ధోరణి విశ్లేషణ (${history.timeframe}):**\n\n${history.climateInsight}\n• ఇటీవలి సగటు ఉష్ణోగ్రత: **${latestTrend?.avgTemp}°C**\n• వార్షిక వర్షపాతం: **${latestTrend?.totalRainfall} మిమీ**\n• ఉష్ణోగ్రత మార్పు: **${latestTrend?.anomaly > 0 ? '+' : ''}${latestTrend?.anomaly}°C**`;
      } else {
        naturalTextResponse = `📊 **Climate & Historical Trend Analysis for ${cityName} (${history.timeframe}):**\n\n${history.climateInsight}\n\n• **Recent Annual Mean Temperature:** ${latestTrend?.avgTemp}°C\n• **Annual Rainfall Accumulation:** ${latestTrend?.totalRainfall} mm\n• **Observed Thermal Anomaly:** ${latestTrend?.anomaly > 0 ? '+' : ''}${latestTrend?.anomaly}°C against long-term baseline.`;
      }
      keyMetrics = { timeframe: history.timeframe, yearlyTrends: history.yearlyTrends };
      break;
    }

    case 'WIND_PRESSURE_QUERY': {
      if (lang === 'hi') {
        naturalTextResponse = `**${cityName}** में हवा की गति **${cur.windSpeed} किमी/घंटा** (${cur.windDirection} दिशा) है और झोंके (Gusts) **${cur.windGusts} किमी/घंटा** तक हैं। वायुमंडलीय दबाव **${cur.pressure} hPa** और पराबैंगनी सूचकांक (UV Index) **${cur.uvIndex}** है।`;
      } else if (lang === 'ta') {
        naturalTextResponse = `**${cityName}** இல் காற்றின் வேகம் **${cur.windSpeed} கிமீ/மணி** (${cur.windDirection} திசை). காற்றின் அழுத்தம் **${cur.pressure} hPa** மற்றும் புற ஊதா குறியீடு (UV Index) **${cur.uvIndex}** ஆகும்.`;
      } else if (lang === 'te') {
        naturalTextResponse = `**${cityName}** లో గాలి వేగం **${cur.windSpeed} km/h** (${cur.windDirection} దిశ). వాతావరణ పీడనం **${cur.pressure} hPa** మరియు UV ఇండెక్స్ **${cur.uvIndex}**.`;
      } else {
        naturalTextResponse = `In **${cityName}**, sustained wind speed is **${cur.windSpeed} km/h** from **${cur.windDirection}** (${cur.windDirectionDeg}°) with gusts up to **${cur.windGusts} km/h**. Barometric pressure is **${cur.pressure} hPa** and UV Index is **${cur.uvIndex}**.`;
      }
      keyMetrics = { windSpeed: `${cur.windSpeed} km/h`, gusts: `${cur.windGusts} km/h`, pressure: `${cur.pressure} hPa`, uvIndex: cur.uvIndex };
      break;
    }

    case 'CURRENT_WEATHER':
    default: {
      if (lang === 'hi') {
        naturalTextResponse = `**${cityName}** में मौसम: **${cur.condition.label}**, तापमान **${cur.temperature}°C** (महसूस होता है **${cur.feelsLike}°C**)।\n• आर्द्रता: **${cur.humidity}%**\n• हवा: **${cur.windSpeed} किमी/घंटा (${cur.windDirection})**\n• दृश्यता: **${cur.visibility} किमी**\n• वर्षा की संभावना: **${daily[0]?.precipitationProbability || 0}%**`;
      } else if (lang === 'ta') {
        naturalTextResponse = `**${cityName}** வானிலை: **${cur.condition.label}**, வெப்பநிலை **${cur.temperature}°C** (உணரப்படும் வெப்பநிலை **${cur.feelsLike}°C**).\n• ஈரப்பதம்: **${cur.humidity}%**\n• காற்று: **${cur.windSpeed} கிமீ/மணி (${cur.windDirection})**\n• பார்வை தூரம்: **${cur.visibility} கிமீ**\n• மழை வாய்ப்பு: **${daily[0]?.precipitationProbability || 0}%**`;
      } else if (lang === 'te') {
        naturalTextResponse = `**${cityName}** వాతావరణం: **${cur.condition.label}**, ఉష్ణోగ్రత **${cur.temperature}°C** (అనిపించే ఉష్ణోగ్రత **${cur.feelsLike}°C**).\n• తేమ: **${cur.humidity}%**\n• గాలి: **${cur.windSpeed} km/h (${cur.windDirection})**\n• విజిబిలిటీ: **${cur.visibility} km**\n• వర్షం పడే అవకాశం: **${daily[0]?.precipitationProbability || 0}%**`;
      } else {
        naturalTextResponse = `In **${cityName}**, it is currently **${cur.condition.label}** with a temperature of **${cur.temperature}°C** (feels like **${cur.feelsLike}°C**).\n\n• **Humidity:** ${cur.humidity}%\n• **Wind:** ${cur.windSpeed} km/h ${cur.windDirection}\n• **Visibility:** ${cur.visibility} km | **Pressure:** ${cur.pressure} hPa\n• **Today's Range:** ${cur.tempMin}°C - ${cur.tempMax}°C (Rain Prob: ${daily[0]?.precipitationProbability || 0}%)`;
      }
      keyMetrics = {
        temperature: `${cur.temperature}°C`,
        feelsLike: `${cur.feelsLike}°C`,
        condition: cur.condition.label,
        humidity: `${cur.humidity}%`,
        wind: `${cur.windSpeed} km/h ${cur.windDirection}`
      };
      break;
    }
  }

  // Generate dynamic contextual follow-up query suggestions
  const suggestedQueries = [
    `Will it rain tomorrow in ${cityName}?`,
    `5-day forecast for ${cityName}`,
    `Is there any extreme alert in ${cityName}?`,
    `Farming & crop advisory for ${cityName}`
  ];

  return {
    success: true,
    intent,
    location: cityName,
    language: lang,
    response: naturalTextResponse,
    keyMetrics,
    weatherSnapshot: {
      temperature: cur.temperature,
      feelsLike: cur.feelsLike,
      condition: cur.condition,
      humidity: cur.humidity,
      windSpeed: cur.windSpeed,
      windDirection: cur.windDirection,
      rainProb: daily[0]?.precipitationProbability || 0,
      tempMax: cur.tempMax,
      tempMin: cur.tempMin
    },
    suggestedQueries
  };
}

module.exports = {
  analyzeIntent,
  extractLocationEntity,
  processConversationalQuery
};
