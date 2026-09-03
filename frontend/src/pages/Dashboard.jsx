import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CloudSun,
  MapPin,
  RefreshCw,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Sun,
  Sunrise,
  Sunset,
  Bot,
  AlertTriangle,
  ArrowRight,
  Sprout,
  Compass,
  Activity,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { useLanguage } from '../context/LanguageContext';
import WeatherCard from '../components/WeatherCard';
import AlertBanner from '../components/AlertBanner';

export default function Dashboard() {
  const { currentCity, weatherData, loading, error, formatTemp, refreshWeather } = useWeather();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (loading && !weatherData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Loading live meteorological data for {currentCity}...</p>
      </div>
    );
  }

  if (error && !weatherData) {
    return (
      <div className="glass-panel rounded-3xl p-8 max-w-lg mx-auto text-center space-y-4 my-12 border-rose-500/30">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Weather Retrieval Error</h3>
        <p className="text-xs text-slate-400">{error}</p>
        <button
          onClick={refreshWeather}
          className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const cur = weatherData?.current;
  const hourly = weatherData?.hourly || [];
  const daily = weatherData?.daily || [];
  const alerts = weatherData?.alerts || [];
  const agri = weatherData?.agriculture;

  const quickPrompts = [
    `Will it rain tomorrow in ${currentCity}?`,
    `What is the 5-day forecast for ${currentCity}?`,
    `Is there any extreme weather alert?`,
    `Is the weather suitable for farming in ${currentCity}?`
  ];

  const handlePromptClick = (prompt) => {
    navigate('/chat', { state: { initialPrompt: prompt } });
  };

  return (
    <div className="space-y-8 py-4">
      {/* Location Header & Meta bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-4 sm:p-5 rounded-2xl border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{currentCity}</h1>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {t.liveBadge}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Coordinates: {weatherData?.location?.lat?.toFixed(2)}°N, {weatherData?.location?.lon?.toFixed(2)}°E • Elevation: {weatherData?.location?.elevation}m
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Updated: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button
            onClick={refreshWeather}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{t.refresh}</span>
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      <AlertBanner alerts={alerts} />

      {/* Hero Weather Display Card */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 lg:p-10 border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-sky-950/40 to-slate-950 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Main Temp & Condition */}
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
              <Sun className="w-3.5 h-3.5" />
              <span>{cur?.condition?.label || 'Clear Sky'}</span>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter">
                {formatTemp(cur?.temperature)}
              </span>
              <div className="space-y-1">
                <span className="text-sm font-semibold text-slate-400 block">
                  {t.feelsLike} <strong className="text-cyan-300">{formatTemp(cur?.feelsLike)}</strong>
                </span>
                <span className="text-xs text-slate-400 block">
                  High: <strong className="text-rose-400">{formatTemp(cur?.tempMax)}</strong> • Low: <strong className="text-blue-400">{formatTemp(cur?.tempMin)}</strong>
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
              {cur?.condition?.description || 'Stable meteorological conditions observed across the region.'}
            </p>

            <div className="flex items-center gap-4 pt-2 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Sunrise className="w-4 h-4 text-amber-400" />
                <span>{t.sunrise}: {cur?.sunrise}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Sunset className="w-4 h-4 text-orange-400" />
                <span>{t.sunset}: {cur?.sunset}</span>
              </span>
            </div>
          </div>

          {/* Quick AI Conversational Box */}
          <div className="md:col-span-5 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">WeatherGPT Assistant</h4>
                  <p className="text-[10px] text-slate-400">Ask natural weather questions</p>
                </div>
              </div>
              <Link
                to="/chat"
                className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Full Chat</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400">Quick Inquiries:</span>
              {quickPrompts.slice(0, 3).map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePromptClick(prompt)}
                  className="w-full px-3 py-2 text-left rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-medium border border-slate-700/60 transition truncate flex items-center justify-between group"
                >
                  <span className="truncate">{prompt}</span>
                  <Sparkles className="w-3 h-3 text-cyan-400 shrink-0 opacity-0 group-hover:opacity-100 transition" />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 8 Primary Meteorological Metrics Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Atmospheric Observations</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Sensors & NWP Feed</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <WeatherCard
            title={t.humidity}
            value={`${cur?.humidity}%`}
            subtext="Relative atmospheric moisture"
            icon="droplets"
            accent="cyan"
          />

          <WeatherCard
            title={t.windSpeed}
            value={`${cur?.windSpeed} km/h`}
            subtext={`Direction: ${cur?.windDirection} (${cur?.windDirectionDeg}°)`}
            icon="wind"
            accent="blue"
          />

          <WeatherCard
            title={t.gusts}
            value={`${cur?.windGusts} km/h`}
            subtext="Peak instantaneous wind blast"
            icon="compass"
            accent="amber"
          />

          <WeatherCard
            title={t.pressure}
            value={`${cur?.pressure} hPa`}
            subtext="Mean sea-level barometric force"
            icon="gauge"
            accent="emerald"
          />

          <WeatherCard
            title={t.visibility}
            value={`${cur?.visibility} km`}
            subtext="Horizontal clear sight distance"
            icon="eye"
            accent="purple"
          />

          <WeatherCard
            title={t.uvIndex}
            value={cur?.uvIndex}
            subtext={cur?.uvIndex >= 8 ? 'Very High UV Hazard' : cur?.uvIndex >= 6 ? 'High UV Radiation' : 'Moderate / Safe UV'}
            icon="sun"
            accent={cur?.uvIndex >= 8 ? 'rose' : 'amber'}
          />

          <WeatherCard
            title={t.dewPoint}
            value={formatTemp(cur?.dewPoint)}
            subtext="Moisture condensation threshold"
            icon="thermometer"
            accent="cyan"
          />

          <WeatherCard
            title={t.rainProbability}
            value={`${daily[0]?.precipitationProbability || 0}%`}
            subtext={`Expected rainfall: ${daily[0]?.precipitationSum || 0} mm`}
            icon="rain"
            accent="blue"
          />
        </div>
      </div>

      {/* 24-Hour Hourly Timeline */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>24-Hour Hourly Trajectory</span>
          </h2>
          <span className="text-xs text-slate-400">Hourly Progression</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1">
          {hourly.slice(0, 16).map((item, idx) => (
            <div
              key={idx}
              className={`shrink-0 w-24 p-3 rounded-2xl text-center space-y-2 border transition ${
                idx === 0
                  ? 'bg-gradient-to-b from-cyan-500/20 to-blue-500/10 border-cyan-500/40'
                  : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60'
              }`}
            >
              <span className="text-[11px] font-bold text-slate-400 block">
                {idx === 0 ? 'Now' : item.hourLabel}
              </span>
              <div className="w-8 h-8 mx-auto flex items-center justify-center text-cyan-400">
                <CloudSun className="w-5 h-5" />
              </div>
              <span className="text-sm font-black text-white block">
                {formatTemp(item.temperature)}
              </span>
              <div className="flex items-center justify-center gap-1 text-[10px] text-sky-400 font-semibold">
                <Droplets className="w-3 h-3" />
                <span>{item.precipitationProbability}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5-Day Extended Forecast Preview Deck */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight">
            5-Day Extended Meteorological Outlook
          </h2>
          <Link
            to="/forecast"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Detailed Charts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {daily.slice(0, 5).map((d, idx) => (
            <div
              key={idx}
              className="glass-panel glass-panel-hover rounded-2xl p-4 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{d.dayName}</span>
                <span className="text-[10px] text-slate-400 font-mono">{d.dateFormatted}</span>
              </div>
              <div className="flex items-center gap-3">
                <CloudSun className="w-8 h-8 text-cyan-400" />
                <div>
                  <span className="text-lg font-black text-white block">
                    {formatTemp(d.tempMax)}
                  </span>
                  <span className="text-xs text-slate-400">
                    Min: {formatTemp(d.tempMin)}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Condition</span>
                  <span className="font-semibold text-slate-300 truncate max-w-[100px]">{d.condition.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Rain Prob</span>
                  <span className="font-semibold text-cyan-400">{d.precipitationProbability}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agro-Meteorological Advisory Quick Callout */}
      {agri && (
        <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-slate-900/60 to-emerald-950/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <Sprout className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">Farmer Weather Advisory: {agri.status}</h4>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-300">
                  Agro-Met
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                {agri.advisories.irrigation}
              </p>
            </div>
          </div>
          <Link
            to="/agriculture"
            className="shrink-0 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
          >
            Open Agro-Advisory
          </Link>
        </div>
      )}
    </div>
  );
}
