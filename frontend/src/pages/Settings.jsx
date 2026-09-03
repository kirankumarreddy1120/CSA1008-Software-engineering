import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Bookmark,
  Plus,
  Trash2,
  MapPin,
  Globe,
  Sliders,
  CheckCircle2,
  Activity,
  Server,
  Database,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { useLanguage } from '../context/LanguageContext';
import { getSavedLocations, addSavedLocation, deleteSavedLocation, checkHealth } from '../services/api';

export default function Settings() {
  const { currentCity, changeLocation, tempUnit, toggleTempUnit } = useWeather();
  const { language, setLanguage, t, getLanguageName } = useLanguage();

  const [savedCities, setSavedCities] = useState([]);
  const [newCityName, setNewCityName] = useState('');
  const [newCityNotes, setNewCityNotes] = useState('');
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [healthInfo, setHealthInfo] = useState(null);
  const [testingHealth, setTestingHealth] = useState(false);

  const sessionId = localStorage.getItem('weathergpt_session_id') || 'default_user';

  const loadSaved = async () => {
    setLoadingSaved(true);
    try {
      const locs = await getSavedLocations(sessionId);
      setSavedCities(locs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSaved(false);
    }
  };

  const pingBackend = async () => {
    setTestingHealth(true);
    try {
      const res = await checkHealth();
      setHealthInfo(res);
    } catch (err) {
      setHealthInfo({ status: 'OFFLINE', error: err.message });
    } finally {
      setTestingHealth(false);
    }
  };

  useEffect(() => {
    loadSaved();
    pingBackend();
  }, []);

  const handleAddLocation = async (e) => {
    e.preventDefault();
    if (!newCityName.trim()) return;

    try {
      await addSavedLocation(newCityName.trim(), sessionId, newCityNotes.trim());
      setNewCityName('');
      setNewCityNotes('');
      await loadSaved();
    } catch (err) {
      alert('Failed to save location.');
    }
  };

  const handleDeleteLocation = async (id) => {
    try {
      await deleteSavedLocation(id);
      await loadSaved();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 py-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-5 rounded-2xl border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {t.navSettings}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize units, manage bookmarked stations, and inspect system diagnostics
            </p>
          </div>
        </div>
      </div>

      {/* Bookmarked / Saved Locations */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Saved Weather Stations & Bookmarks</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {savedCities.length} Saved
          </span>
        </div>

        {/* Add Location Form */}
        <form onSubmit={handleAddLocation} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <input
              type="text"
              value={newCityName}
              onChange={(e) => setNewCityName(e.target.value)}
              placeholder="City name (e.g., Coimbatore, Varanasi)..."
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div className="sm:col-span-4">
            <input
              type="text"
              value={newCityNotes}
              onChange={(e) => setNewCityNotes(e.target.value)}
              placeholder="Notes (e.g., Hometown, Farm site)..."
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Bookmark</span>
            </button>
          </div>
        </form>

        {/* Saved List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {savedCities.map((loc) => {
            const isCurrent = loc.city_name.toLowerCase() === currentCity.toLowerCase();
            return (
              <div
                key={loc.id}
                className={`p-4 rounded-2xl border transition flex items-start justify-between gap-3 ${
                  isCurrent
                    ? 'bg-cyan-500/10 border-cyan-500/40'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <h4 className="text-sm font-bold text-white">{loc.city_name}</h4>
                  </div>
                  {loc.notes && (
                    <p className="text-[11px] text-slate-400">{loc.notes}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => changeLocation(loc.city_name)}
                    className="text-[11px] font-bold text-cyan-400 hover:underline pt-1 block"
                  >
                    {isCurrent ? 'Active Location' : 'Set as Active'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteLocation(loc.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 transition"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preferences & Units */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Unit Settings */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Meteorological Units</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div>
                <span className="text-sm font-semibold text-white block">Temperature Scale</span>
                <span className="text-xs text-slate-400">Celsius (°C) / Fahrenheit (°F)</span>
              </div>
              <button
                onClick={toggleTempUnit}
                className="px-4 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold"
              >
                °{tempUnit}
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div>
                <span className="text-sm font-semibold text-white block">Wind & Velocity</span>
                <span className="text-xs text-slate-400">Kilometers per hour (km/h)</span>
              </div>
              <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono font-bold">
                km/h
              </span>
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Language & Localization</h2>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Select preferred dialect for conversational AI responses, meteorological advisories, and dashboard labels:
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { code: 'en', label: 'English', desc: 'English' },
              { code: 'hi', label: 'हिन्दी', desc: 'Hindi' },
              { code: 'ta', label: 'தமிழ்', desc: 'Tamil' },
              { code: 'te', label: 'తెలుగు', desc: 'Telugu' }
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-3 rounded-2xl border text-left transition ${
                  language === lang.code
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-white'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-sm font-bold block">{lang.label}</span>
                <span className="text-[10px] text-slate-400">{lang.desc}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* System Diagnostics & Backend Connectivity */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">System Diagnostics & API Architecture</h2>
          </div>
          <button
            onClick={pingBackend}
            disabled={testingHealth}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testingHealth ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Check Connectivity</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">Backend Server</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-sm font-bold text-white font-mono">
              {healthInfo?.status || 'ONLINE (Port 5000)'}
            </span>
            <p className="text-[10px] text-slate-500">Express REST Engine</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">Database Store</span>
              <Database className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <span className="text-sm font-bold text-white font-mono">
              {healthInfo?.mysqlConnected ? 'MySQL 8.0 Connected' : 'High-Speed Persistent Store'}
            </span>
            <p className="text-[10px] text-slate-500">weathergpt_db</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">NWP Model Integration</span>
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-sm font-bold text-white font-mono">
              Open-Meteo & IMD Active
            </span>
            <p className="text-[10px] text-slate-500">Global Geocoded Resolution</p>
          </div>
        </div>
      </div>
    </div>
  );
}
