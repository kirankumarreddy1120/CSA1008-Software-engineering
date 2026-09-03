import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CloudSun,
  Search,
  MapPin,
  Compass,
  Globe,
  RefreshCw,
  Sliders,
  Menu,
  X,
  AlertTriangle,
  Bot
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { useLanguage } from '../context/LanguageContext';
import { searchLocations } from '../services/api';

export default function Navbar({ mobileMenuOpen, setMobileMenuOpen }) {
  const { currentCity, weatherData, loading, formatTemp, tempUnit, toggleTempUnit, changeLocation, useCurrentGeolocation, refreshWeather } = useWeather();
  const { language, setLanguage, t, getLanguageName } = useLanguage();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const delayDebounce = setTimeout(async () => {
        try {
          const results = await searchLocations(searchQuery);
          setSuggestions(results);
          setShowDropdown(true);
        } catch (e) {
          console.error(e);
        }
      }, 300);
      return () => clearTimeout(delayDebounce);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, [searchQuery]);

  const handleSelectCity = (cityName) => {
    changeLocation(cityName);
    setSearchQuery('');
    setShowDropdown(false);
    navigate('/dashboard');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSelectCity(searchQuery.trim());
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & MoES / IMD Tag */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-sky-600 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition transform">
                <CloudSun className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                    WeatherGPT
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-md">
                    IMD • MoES
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium truncate max-w-[240px]">
                  Conversational Meteorology & Alerts
                </p>
              </div>
            </Link>
          </div>

          {/* Search Box with Autocomplete */}
          <div className="flex-1 max-w-md relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-10 py-2 text-sm bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Suggestions dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700/90 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800">
                {suggestions.map((loc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectCity(loc.name)}
                    className="w-full px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-slate-800 flex items-center justify-between group transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
                      <div>
                        <span className="font-semibold text-white">{loc.name}</span>
                        {loc.state && <span className="text-xs text-slate-400 ml-1.5">({loc.state}, {loc.country})</span>}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                      {loc.lat?.toFixed(2)}°, {loc.lon?.toFixed(2)}°
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions & Selectors */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* GPS Geolocation Button */}
            <button
              onClick={useCurrentGeolocation}
              title={t.useGps}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700/70 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-800/90 transition shadow-sm"
              aria-label="Detect GPS Location"
            >
              <Compass className="w-4 h-4" />
            </button>

            {/* Refresh Weather Data */}
            <button
              onClick={refreshWeather}
              title={t.refresh}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700/70 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-800/90 transition shadow-sm disabled:opacity-50"
              aria-label="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>

            {/* Temperature Unit Toggle (°C / °F) */}
            <button
              onClick={toggleTempUnit}
              title="Toggle °C / °F"
              className="hidden sm:flex items-center justify-center px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/70 text-xs font-bold text-cyan-400 hover:bg-slate-800 hover:border-cyan-500/50 transition shadow-sm"
            >
              °{tempUnit}
            </button>

            {/* Language Selector */}
            <div className="relative group">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/70 text-xs font-semibold text-slate-200 hover:border-cyan-500/50 hover:bg-slate-800 transition cursor-pointer shadow-sm">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span className="uppercase">{language}</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                aria-label="Select Language"
              >
                <option value="en">English (English)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
              </select>
            </div>

            {/* Direct AI Chat CTA Button */}
            <Link
              to="/chat"
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold text-xs shadow-md shadow-cyan-600/30 hover:from-cyan-500 hover:to-blue-500 transition transform hover:-translate-y-0.5"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI</span>
            </Link>

          </div>

        </div>
      </div>
    </header>
  );
}
