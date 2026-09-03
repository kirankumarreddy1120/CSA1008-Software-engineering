import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Droplets,
  Wind,
  Sun,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Info,
  RefreshCw,
  PhoneCall
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { useLanguage } from '../context/LanguageContext';
import { getAgroAdvisory } from '../services/api';

export default function Agriculture() {
  const { currentCity, coordinates, weatherData } = useWeather();
  const { t } = useLanguage();

  const [agroData, setAgroData] = useState(weatherData?.agriculture || null);
  const [loading, setLoading] = useState(!weatherData?.agriculture);

  useEffect(() => {
    async function loadData() {
      if (!weatherData?.agriculture) {
        setLoading(true);
        try {
          const data = await getAgroAdvisory(currentCity, coordinates?.lat, coordinates?.lon);
          setAgroData(data);
        } catch (e) {
          console.error('Failed to load agricultural advisory:', e);
        } finally {
          setLoading(false);
        }
      } else {
        setAgroData(weatherData.agriculture);
      }
    }
    loadData();
  }, [currentCity, coordinates, weatherData]);

  const advisories = agroData?.advisories || {};
  const crops = agroData?.cropRecommendations || [];

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="glass-panel p-5 rounded-2xl border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sprout className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {t.agriTitle} - {currentCity}
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t.agriSubtitle} (Gramin Krishi Mausam Sewa & IMD Model Feeds)
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
          SDG 2 • Zero Hunger
        </span>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-xs text-slate-400">Synthesizing agro-meteorological advisory...</p>
        </div>
      ) : (
        <>
          {/* Status & Summary Banner */}
          <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-slate-900/80 to-emerald-950/10 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-xs font-extrabold rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                  {agroData?.status || 'Favorable Agronomic Window'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Bulletin Date: {agroData?.bulletinDate || new Date().toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kisan Helpline: <strong>1800-180-1551</strong></span>
              </div>
            </div>

            {/* Current Agronomic Micro-Climate Parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Temperature</span>
                <span className="text-base font-bold text-white">{agroData?.parameters?.temperature || '--'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Relative Humidity</span>
                <span className="text-base font-bold text-cyan-400">{agroData?.parameters?.humidity || '--'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Wind Speed</span>
                <span className="text-base font-bold text-blue-400">{agroData?.parameters?.windSpeed || '--'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">3-Day Rain Forecast</span>
                <span className="text-base font-bold text-sky-400">{agroData?.parameters?.estimated3DayRain || '--'}</span>
              </div>
            </div>
          </div>

          {/* 4 Core Action Advisory Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* 1. Irrigation */}
            <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{t.irrigationAdvice}</h3>
                  <span className="text-[10px] text-slate-400">Soil moisture & watering protocol</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {advisories.irrigation || 'Maintain regular irrigation based on crop growth stage.'}
              </p>
            </div>

            {/* 2. Spraying Window */}
            <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{t.sprayAdvice}</h3>
                  <span className="text-[10px] text-slate-400">Wind drift & washout risk assessment</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {advisories.spraying || 'Optimal spray window available during early morning calm hours.'}
              </p>
            </div>

            {/* 3. Crop Protection */}
            <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{t.cropProtection}</h3>
                  <span className="text-[10px] text-slate-400">Pest, fungal disease & heat stress</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {advisories.cropProtection || 'Scout standing crops for early pest incidence.'}
              </p>
            </div>

            {/* 4. Field Operations */}
            <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{t.fieldOperations}</h3>
                  <span className="text-[10px] text-slate-400">Harvesting, tilling & fertilizer broadcast</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {advisories.fieldOperations || 'Favorable conditions for routine weeding, tilling, and intercultural operations.'}
              </p>
            </div>

          </div>

          {/* Crop Specific Guidance Table */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Major Crop-Weather Status & Recommendations</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {crops.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{item.crop}</h4>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {item.stage}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Responsible AI Farm Advisory Disclaimer */}
          <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-amber-500/30 bg-amber-950/10 flex items-start gap-3.5">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Informational Farming Guidance Notice
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {agroData?.disclaimer || 'This agro-meteorological guidance is generated based on automated numerical weather prediction models and standard agricultural meteorology principles. Farmers are advised to confirm with their local Krishi Vigyan Kendra (KVK) or State Agriculture Department before making critical operational investments.'}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
