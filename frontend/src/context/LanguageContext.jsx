import React, { createContext, useContext, useState, useEffect } from 'react';

const TRANSLATIONS = {
  en: {
    appTitle: 'WeatherGPT',
    subTitle: 'Conversational Weather & Climate Intelligence',
    orgName: 'Ministry of Earth Sciences (MoES) | India Meteorological Department (IMD)',
    themeBadge: 'Disaster Management & Climate Resilience',
    
    // Navigation
    navHome: 'Overview',
    navDashboard: 'Dashboard',
    navChat: 'AI Weather Chat',
    navForecast: '7-Day Forecast',
    navAlerts: 'Hazard & Alerts',
    navClimate: 'Climate & History',
    navAgri: 'Agro-Advisory',
    navSettings: 'Settings & Saved',

    // Common labels
    searchPlaceholder: 'Search city (e.g., Chennai, Delhi, Mumbai)...',
    useGps: 'Current Location',
    refresh: 'Refresh',
    liveBadge: 'LIVE METEOROLOGY',
    sourceIMD: 'Data grounded in Open-Meteo NWP & IMD Gridded Observations',
    
    // Weather Metrics
    temp: 'Temperature',
    feelsLike: 'Feels Like',
    maxMin: 'High / Low',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    windDirection: 'Wind Direction',
    gusts: 'Wind Gusts',
    pressure: 'Surface Pressure',
    visibility: 'Visibility',
    uvIndex: 'UV Index',
    dewPoint: 'Dew Point',
    rainProbability: 'Rain Probability',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    precipitationSum: 'Rainfall Amount',

    // Alert Severities
    alertWarning: 'Severe Warning',
    alertAdvisory: 'Weather Advisory',
    alertNormal: 'Normal Conditions',
    alertTitle: 'Extreme Weather Hazard Monitor',
    alertSubtitle: 'Real-time hazard detection & disaster management advisories',

    // Agro-Advisory
    agriTitle: 'Agro-Meteorological Advisory Bulletin',
    agriSubtitle: 'Intelligent crop-weather guidance, irrigation scheduling & spraying window',
    irrigationAdvice: 'Irrigation Guidance',
    sprayAdvice: 'Pesticide & Spray Window',
    cropProtection: 'Crop Protection Alert',
    fieldOperations: 'Field Operations',

    // Chat
    chatTitle: 'Conversational AI Meteorologist',
    chatSubtitle: 'Ask natural-language questions in English, Hindi, Tamil or Telugu',
    chatPlaceholder: 'Ask anything (e.g., "Will it rain tomorrow in Chennai?", "5-day forecast for Delhi")...',
    voiceInput: 'Voice Input',
    send: 'Send',
    clearChat: 'Clear History',
    disclaimer: 'WeatherGPT uses automated meteorological models. Disasters & critical decisions should follow official IMD/NDMA bulletins.'
  },
  hi: {
    appTitle: 'WeatherGPT',
    subTitle: 'संवादात्मक मौसम एवं जलवायु सूचना प्रणाली',
    orgName: 'पृथ्वी विज्ञान मंत्रालय (MoES) | भारत मौसम विज्ञान विभाग (IMD)',
    themeBadge: 'आपदा प्रबंधन एवं जलवायु अनुकूलन',

    // Navigation
    navHome: 'मुख्य पृष्ठ',
    navDashboard: 'डैशबोर्ड',
    navChat: 'एआई मौसम चैट',
    navForecast: '7-दिवसीय पूर्वानुमान',
    navAlerts: 'आपदा एवं चेतावनियां',
    navClimate: 'जलवायु एवं इतिहास',
    navAgri: 'कृषि सलाह',
    navSettings: 'सेटिंग्स व सुरक्षित शहर',

    // Common labels
    searchPlaceholder: 'शहर खोजें (उदा. चेन्नई, दिल्ली, मुंबई)...',
    useGps: 'वर्तमान स्थान',
    refresh: 'ताज़ा करें',
    liveBadge: 'सजीव मौसम डेटा',
    sourceIMD: 'ओपन-मेटियो एनडब्ल्यूपी और आईएमडी ग्रिड डेटा पर आधारित',

    // Weather Metrics
    temp: 'तापमान',
    feelsLike: 'महसूस तापमान',
    maxMin: 'अधिकतम / न्यूनतम',
    humidity: 'आर्द्रता',
    windSpeed: 'हवा की गति',
    windDirection: 'हवा की दिशा',
    gusts: 'हवा के झोंके',
    pressure: 'वायुमंडलीय दबाव',
    visibility: 'दृश्यता (Visibility)',
    uvIndex: 'यूवी इंडेक्स',
    dewPoint: 'ओस बिंदु (Dew Point)',
    rainProbability: 'बारिश की संभावना',
    sunrise: 'सूर्योदय',
    sunset: 'सूर्यास्त',
    precipitationSum: 'वर्षा की मात्रा',

    // Alert Severities
    alertWarning: 'गंभीर चेतावनी',
    alertAdvisory: 'मौसम सलाह',
    alertNormal: 'सामान्य स्थिति',
    alertTitle: 'चरम मौसम चेतावनी केंद्र',
    alertSubtitle: 'वास्तविक समय आपदा प्रबंधन और मौसम जोखिम सूचना',

    // Agro-Advisory
    agriTitle: 'कृषि मौसम सलाह बुलेटिन',
    agriSubtitle: 'किसानों के लिए फसल मौसम सलाह, सिंचाई समय और छिड़काव मार्गदर्शन',
    irrigationAdvice: 'सिंचाई सलाह',
    sprayAdvice: 'कीटनाशक छिड़काव खिड़की',
    cropProtection: 'फसल सुरक्षा चेतावनी',
    fieldOperations: 'खेत कार्य',

    // Chat
    chatTitle: 'एआई मौसम संवाद सहायक',
    chatSubtitle: 'हिंदी, तमिल, तेलुगु या अंग्रेजी में प्राकृतिक भाषा में प्रश्न पूछें',
    chatPlaceholder: 'मौसम संबंधी प्रश्न पूछें (उदा. "क्या कल दिल्ली में बारिश होगी?", "चेन्नई का मौसम")...',
    voiceInput: 'आवाज इनपुट',
    send: 'भेजें',
    clearChat: 'इतिहास साफ करें',
    disclaimer: 'WeatherGPT स्वचालित मौसम मॉडल पर आधारित है। महत्वपूर्ण निर्णयों हेतु आधिकारिक IMD बुलेटिन देखें।'
  },
  ta: {
    appTitle: 'WeatherGPT',
    subTitle: 'உரையாடல் வானிலை மற்றும் காலநிலை தகவல் தளம்',
    orgName: 'புவி அறிவியல் அமைச்சகம் (MoES) | இந்திய வானிலை ஆய்வுத் துறை (IMD)',
    themeBadge: 'பேரிடர் மேலாண்மை & காலநிலை பின்னடைவு',

    // Navigation
    navHome: 'முகப்பு',
    navDashboard: 'டாஷ்போர்டு',
    navChat: 'AI வானிலை சாட்',
    navForecast: '7 நாள் முன்னறிவிப்பு',
    navAlerts: 'எச்சரிக்கைகள்',
    navClimate: 'காலநிலை & வரலாறு',
    navAgri: 'விவசாய ஆலோசனை',
    navSettings: 'அமைப்புகள்',

    // Common labels
    searchPlaceholder: 'நகரத்தைத் தேடுங்கள் (उदा. சென்னை, மதுரை, கோவை)...',
    useGps: 'தற்போதைய இடம்',
    refresh: 'புதுப்பி',
    liveBadge: 'நேரலை வானிலை',
    sourceIMD: 'Open-Meteo & IMD வானிலை மாதிரித் தரவு',

    // Weather Metrics
    temp: 'வெப்பநிலை',
    feelsLike: 'உணரப்படும் வெப்பநிலை',
    maxMin: 'அதிக / குறைந்த',
    humidity: 'ஈரப்பதம்',
    windSpeed: 'காற்றின் வேகம்',
    windDirection: 'காற்றின் திசை',
    gusts: 'காற்று வீச்சு',
    pressure: 'காற்றழுத்தம்',
    visibility: 'பார்வை தூரம்',
    uvIndex: 'புற ஊதா குறியீடு (UV)',
    dewPoint: 'பனி நிலை',
    rainProbability: 'மழைக்கான வாய்ப்பு',
    sunrise: 'சூரிய உதயம்',
    sunset: 'சூரிய அஸ்தமனம்',
    precipitationSum: 'மழை அளவு',

    // Alert Severities
    alertWarning: 'தீவிர எச்சரிக்கை',
    alertAdvisory: 'வானிலை ஆலோசனை',
    alertNormal: 'இயல்பு நிலை',
    alertTitle: 'தீவிர வானிலை எச்சரிக்கை மையம்',
    alertSubtitle: 'நிகழ்நேர பேரிடர் எச்சரிக்கை மற்றும் முன்னெச்சரிக்கை வழிகாட்டல்',

    // Agro-Advisory
    agriTitle: 'வேளாண் வானிலை ஆலோசனை அறிக்கை',
    agriSubtitle: 'விவசாயிகளுக்கான பயிர் வழிகாட்டல், பாசன அட்டவணை மற்றும் தெளிப்பு ஆலோசனை',
    irrigationAdvice: 'பாசன ஆலோசனை',
    sprayAdvice: 'மருந்து தெளிப்பு நேரம்',
    cropProtection: 'பயிர் பாதுகாப்பு',
    fieldOperations: 'வயல்வெளி பணிகள்',

    // Chat
    chatTitle: 'AI வானிலை உதவியாளர்',
    chatSubtitle: 'தமிழ், ஆங்கிலம், இந்தி அல்லது தெலுங்கில் வானிலை கேள்விகளைக் கேளுங்கள்',
    chatPlaceholder: 'கேள்விகளை தட்டச்சு செய்யவும் (எ.கா. "சென்னையில் நாளை மழை பெய்யுமா?")...',
    voiceInput: 'குரல் உள்ளீடு',
    send: 'அனுப்பு',
    clearChat: 'வரலாற்றை அழி',
    disclaimer: 'முக்கிய முடிவுகளுக்கு அதிகாரப்பூர்வ IMD அறிக்கைகளைப் பின்பற்றவும்.'
  },
  te: {
    appTitle: 'WeatherGPT',
    subTitle: 'సంభాషణాత్మక వాతావరణ మరియు శీతోష్ణస్థితి వేదిక',
    orgName: 'ఎర్త్ సైన్సెస్ మంత్రిత్వ శాఖ (MoES) | భారత వాతావరణ శాఖ (IMD)',
    themeBadge: 'విపత్తు నిర్వహణ & శీతోష్ణస్థితి తట్టుకోగల సామర్థ్యం',

    // Navigation
    navHome: 'హోమ్ పేజీ',
    navDashboard: 'డ్యాష్‌బోర్డ్',
    navChat: 'AI వాతావరణ చాట్',
    navForecast: '7-రోజుల సూచన',
    navAlerts: 'హెచ్చరికలు',
    navClimate: 'శీతోష్ణస్థితి & చరిత్ర',
    navAgri: 'వ్యవసాయ సలహా',
    navSettings: 'సెట్టింగ్‌లు',

    // Common labels
    searchPlaceholder: 'నగరాన్ని శోధించండి (ఉదా. హైదరాబాద్, విశాఖపట్నం, విజయవాడ)...',
    useGps: 'ప్రస్తుత ప్రాంతం',
    refresh: 'రిఫ్రెష్',
    liveBadge: 'లైవ్ వాతావరణం',
    sourceIMD: 'ఓపెన్-మెటియో & IMD గ్రిడ్ డేటా ఆధారంగా',

    // Weather Metrics
    temp: 'ఉష్ణోగ్రత',
    feelsLike: 'అనిపించే ఉష్ణోగ్రత',
    maxMin: 'గరిష్ట / కనిష్ట',
    humidity: 'తేమ శాతం',
    windSpeed: 'గాలి వేగం',
    windDirection: 'గాలి దిశ',
    gusts: 'గాలి వీచడం',
    pressure: 'పీడనం',
    visibility: 'విజిబిలిటీ',
    uvIndex: 'UV ఇండెక్స్',
    dewPoint: 'డ్యూ పాయింట్',
    rainProbability: 'వర్షం పడే అవకాశం',
    sunrise: 'సూర్యోదయం',
    sunset: 'సూర్యాస్తమయం',
    precipitationSum: 'వర్షపాతం మొత్తం',

    // Alert Severities
    alertWarning: 'తీవ్ర హెచ్చరిక',
    alertAdvisory: 'వాతావరణ సలహా',
    alertNormal: 'సాధారణ పరిస్థితులు',
    alertTitle: 'తీవ్ర వాతావరణ ప్రమాద మానిటర్',
    alertSubtitle: 'రియల్ టైమ్ విపత్తు హెచ్చరికలు మరియు భద్రతా సూచనలు',

    // Agro-Advisory
    agriTitle: 'వ్యవసాయ వాతావరణ సలహా బులెటిన్',
    agriSubtitle: 'రైతులకు పంట వాతావరణ సలహాలు, నీటిపారుదల మరియు మందుల పిచికారీ మార్గదర్శకాలు',
    irrigationAdvice: 'నీటిపారుదల సలహా',
    sprayAdvice: 'మందుల పిచికారీ విండో',
    cropProtection: 'పంట రక్షణ హెచ్చరిక',
    fieldOperations: 'క్షేత్ర పనులు',

    // Chat
    chatTitle: 'AI వాతావరణ సహాయకుడు',
    chatSubtitle: 'తెలుగు, హిందీ, తమిళం లేదా ఇంగ్లీషులో ప్రశ్నలు అడగండి',
    chatPlaceholder: 'ప్రశ్నను టైప్ చేయండి (ఉదా. "రేపు హైదరాబాద్‌లో వర్షం పడుతుందా?")...',
    voiceInput: 'వాయిస్ ఇన్‌పుట్',
    send: 'పంపు',
    clearChat: 'హిస్టరీ క్లియర్',
    disclaimer: 'ముఖ్యమైన నిర్ణయాలకు అధికారిక IMD బులెటిన్‌లను సంప్రదించండి.'
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('weathergpt_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('weathergpt_lang', language);
  }, [language]);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const getLanguageName = (code) => {
    switch (code) {
      case 'hi': return 'हिन्दी (Hindi)';
      case 'ta': return 'தமிழ் (Tamil)';
      case 'te': return 'తెలుగు (Telugu)';
      default: return 'English';
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getLanguageName }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
