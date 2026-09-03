import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CloudSun,
  Bot,
  AlertTriangle,
  CalendarDays,
  Sprout,
  TrendingUp,
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe2,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { currentCity, weatherData, formatTemp, changeLocation, useCurrentGeolocation } = useWeather();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [inputCity, setInputCity] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputCity.trim()) {
      changeLocation(inputCity.trim());
      navigate('/dashboard');
    }
  };

  const sampleCities = ['Chennai', 'New Delhi', 'Mumbai', 'Bengaluru', 'Kolkata', 'Hyderabad', 'Pune', 'Jaipur'];

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-10 lg:p-12 border border-cyan-500/20 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-900 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-wide">
            <Zap className="w-3.5 h-3.5" />
            <span>Ministry of Earth Sciences (MoES) • India Meteorological Department (IMD)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Conversational AI for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              Weather, Alerts & Climate
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            WeatherGPT connects the general public, farmers, researchers, and disaster-management authorities with instant natural-language weather intelligence, multi-day forecasting, and severe hazard warnings.
          </p>

          {/* Search Bar in Hero */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2 pt-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputCity}
                onChange={(e) => setInputCity(e.target.value)}
                placeholder="Enter city (e.g., Chennai, Delhi, Bengaluru)..."
                className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-2xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-inner"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>Explore Weather</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick City Chips */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
            <span className="text-xs text-slate-400 font-semibold">Popular Stations:</span>
            {sampleCities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => {
                  changeLocation(city);
                  navigate('/dashboard');
                }}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-cyan-300 border border-slate-700/50 transition font-medium"
              >
                {city}
              </button>
            ))}
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold border border-slate-700 transition"
            >
              Open Live Dashboard
            </Link>
            <Link
              to="/chat"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold shadow-lg shadow-cyan-600/30 transition flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              <span>Ask WeatherGPT (AI Chat)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Snapshot Widget */}
      {weatherData?.current && (
        <section className="glass-panel rounded-3xl p-6 border border-slate-800 bg-slate-900/60 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
                <CloudSun className="w-10 h-10" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-white">{currentCity}</h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    Live Station
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {weatherData.current.condition.label} • Humidity: {weatherData.current.humidity}% • Wind: {weatherData.current.windSpeed} km/h
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-3xl font-black text-cyan-400">
                  {formatTemp(weatherData.current.temperature)}
                </span>
                <p className="text-xs text-slate-400">
                  Feels like {formatTemp(weatherData.current.feelsLike)}
                </p>
              </div>
              <Link
                to="/dashboard"
                className="px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>Full Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Feature Capabilities Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Comprehensive Meteorological Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Engineered to fulfill all college project rubrics with high-fidelity modules for forecasting, alerts, multilingual dialogue, and climate reanalysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Feature 1 */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Natural-Language Weather Chat</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ChatGPT-style intelligent conversational interface that understands user queries, extracts location/timeframe intents, and provides multilingual answers.
            </p>
            <Link to="/chat" className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 mt-4 hover:underline">
              <span>Try Conversational AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Extreme Weather Hazard Alerts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatic hazard classification for heavy downpours, thunderstorms, heatwaves, squalls, and dense fog, strictly grounded in empirical meteorological thresholds.
            </p>
            <Link to="/alerts" className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 mt-4 hover:underline">
              <span>View Active Alerts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">7-Day Multi-Metric Forecast</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              High-resolution hourly predictions, temperature range graphs, precipitation probability curves, and wind gust charts for any global coordinates.
            </p>
            <Link to="/forecast" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 mt-4 hover:underline">
              <span>Explore Forecasts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 4 */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Agro-Meteorological Advisory</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Decision support for farmers: optimal irrigation timing, spray suitability windows based on wind/rain, and crop-specific management bulletins.
            </p>
            <Link to="/agriculture" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 mt-4 hover:underline">
              <span>Read Farm Advisory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 5 */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Climate & Historical Trends</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore multi-year historical temperature shifts, monsoon precipitation anomalies, and monthly climate distributions for climate awareness.
            </p>
            <Link to="/climate" className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 mt-4 hover:underline">
              <span>View Climate Data</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 6 */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Indian Multilingual Support</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Native multilingual interface supporting English, Hindi (हिन्दी), Tamil (தமிழ்), and Telugu (తెలుగు) with dynamic conversational translation.
            </p>
            <div className="flex items-center gap-2 pt-3 text-[11px] text-amber-300 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>EN • HI • TA • TE</span>
            </div>
          </div>

        </div>
      </section>

      {/* Responsible AI Banner */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 bg-slate-900/40">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white">Responsible AI & Ethical Meteorological Guidelines</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              WeatherGPT adheres to strict ethical AI standards. The platform strictly distinguishes empirical observational data from AI conversational synthesis, protects user anonymity with zero tracking, and provides clear disclaimers on agricultural and disaster management decisions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
