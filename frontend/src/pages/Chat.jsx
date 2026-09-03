import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Bot,
  User,
  Send,
  Mic,
  MicOff,
  Trash2,
  Sparkles,
  MapPin,
  Globe,
  CloudRain,
  Thermometer,
  Wind,
  ShieldCheck,
  Info,
  RefreshCw
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { useLanguage } from '../context/LanguageContext';
import { sendChatMessage, getChatHistory, clearChatHistory } from '../services/api';

export default function Chat() {
  const { currentCity, formatTemp } = useWeather();
  const { language, setLanguage, t, getLanguageName } = useLanguage();
  const routeLocation = useLocation();

  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sessionId] = useState(() => {
    let sid = localStorage.getItem('weathergpt_session_id');
    if (!sid) {
      sid = 'session_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('weathergpt_session_id', sid);
    }
    return sid;
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load chat history or set initial welcome message
  useEffect(() => {
    async function loadHistory() {
      try {
        const history = await getChatHistory(sessionId);
        if (history && history.length > 0) {
          const formatted = history.map(h => ({
            id: h.id,
            role: h.role,
            text: h.message,
            intent: h.intent,
            metadata: typeof h.metadata === 'string' ? JSON.parse(h.metadata) : h.metadata,
            time: new Date(h.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
          }));
          setMessages(formatted);
        } else {
          setMessages([
            {
              id: 'welcome',
              role: 'assistant',
              text: `${t.chatTitle} - Welcome! I can answer natural-language questions about current weather, rain probability, 5-day forecasts, severe alerts, farming guidance, and climate trends.`,
              suggestedQueries: [
                `What is the weather in ${currentCity}?`,
                `Will it rain tomorrow in ${currentCity}?`,
                `5-day forecast for ${currentCity}`,
                `Is there any extreme weather alert?`,
                `Farming & irrigation advisory for ${currentCity}`
              ],
              time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadHistory();
  }, [sessionId, currentCity, language]);

  // Process initial prompt passed via React Router state (e.g. from Dashboard click)
  useEffect(() => {
    if (routeLocation.state?.initialPrompt) {
      handleSend(routeLocation.state.initialPrompt);
      window.history.replaceState({}, document.title);
    }
  }, [routeLocation.state]);

  const handleSend = async (messageText = inputQuery) => {
    const textToSend = messageText.trim();
    if (!textToSend || loading) return;

    setInputQuery('');

    // Add user message to state
    const userMsg = {
      id: 'user_' + Date.now(),
      role: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await sendChatMessage(textToSend, language, currentCity, sessionId);

      const botMsg = {
        id: 'bot_' + Date.now(),
        role: 'assistant',
        text: response.response,
        intent: response.intent,
        location: response.location,
        keyMetrics: response.keyMetrics,
        weatherSnapshot: response.weatherSnapshot,
        suggestedQueries: response.suggestedQueries,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg = {
        id: 'err_' + Date.now(),
        role: 'assistant',
        text: 'Sorry, I encountered an issue processing your meteorological request. Please try again.',
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear conversation history?')) {
      try {
        await clearChatHistory(sessionId);
        setMessages([
          {
            id: 'welcome_cleared',
            role: 'assistant',
            text: 'Conversation cleared. How can I assist you with weather forecasting today?',
            suggestedQueries: [
              `What is the weather in ${currentCity}?`,
              `Will it rain tomorrow in ${currentCity}?`
            ],
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Voice Input via Web Speech API
  const toggleVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const langCodes = { en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN' };
      recognition.lang = langCodes[language] || 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputQuery(transcript);
          handleSend(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto glass-panel rounded-3xl border border-slate-800 bg-slate-950/80 shadow-2xl overflow-hidden">
      
      {/* Chat Header */}
      <div className="p-4 sm:px-6 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white">WeatherGPT Assistant</h2>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                AI Online
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span>Target: {currentCity}</span>
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="relative">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="uppercase">{language}</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              aria-label="Chat Language"
            >
              <option value="en">English (English)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
            </select>
          </div>

          {/* Clear History */}
          <button
            onClick={handleClearHistory}
            title={t.clearChat}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3.5 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white shadow-md ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600'
                  : 'bg-gradient-to-br from-cyan-500 to-sky-600'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Content Bubble */}
            <div className={`space-y-3 max-w-[85%] sm:max-w-[75%]`}>
              <div
                className={`p-4 sm:p-5 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-md ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-tr-none'
                    : 'glass-panel bg-slate-900/90 border border-slate-800 text-slate-100 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>

              {/* Weather Snapshot Widget Embedded in bot response */}
              {msg.weatherSnapshot && (
                <div className="glass-panel p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60">
                    <Thermometer className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Temperature</span>
                      <span className="font-bold text-white">{formatTemp(msg.weatherSnapshot.temperature)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60">
                    <CloudRain className="w-4 h-4 text-sky-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Rain Prob</span>
                      <span className="font-bold text-white">{msg.weatherSnapshot.rainProb}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60">
                    <Wind className="w-4 h-4 text-blue-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Wind</span>
                      <span className="font-bold text-white">{msg.weatherSnapshot.windSpeed} km/h</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60">
                    <Info className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Condition</span>
                      <span className="font-bold text-white truncate max-w-[80px]">{msg.weatherSnapshot.condition?.label}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggested Follow-up Query Chips */}
              {msg.suggestedQueries && msg.suggestedQueries.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {msg.suggestedQueries.map((sug, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => handleSend(sug)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-cyan-300 hover:text-white text-xs transition flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>{sug}</span>
                    </button>
                  ))}
                </div>
              )}

              <span className="text-[10px] text-slate-500 font-mono block px-1">
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {/* Loading Bubble */}
        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-600 flex items-center justify-center text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl glass-panel bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>Analyzing meteorology models & synthesizing response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/90 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice dictation button */}
          <button
            type="button"
            onClick={toggleVoiceRecognition}
            title={t.voiceInput}
            className={`p-3 rounded-2xl border transition shadow-sm ${
              isListening
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-cyan-400 hover:border-cyan-500/40'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={isListening ? 'Listening to your voice...' : t.chatPlaceholder}
            className="flex-1 px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-inner"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span>{t.send}</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span>Target City: <strong>{currentCity}</strong> | Selected Language: <strong>{getLanguageName(language)}</strong></span>
          <span className="hidden sm:inline">Responsible AI Disclaimers Applied</span>
        </div>
      </div>

    </div>
  );
}
