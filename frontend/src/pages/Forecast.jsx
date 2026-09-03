import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  CalendarDays,
  CloudSun,
  Droplets,
  Wind,
  Sun,
  Sunrise,
  Sunset,
  ArrowUpRight,
  TrendingUp,
  CloudRain
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { useLanguage } from '../context/LanguageContext';

export default function Forecast() {
  const { weatherData, currentCity, formatTemp, tempUnit } = useWeather();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('temp'); // 'temp' | 'rain' | 'wind'

  const daily = weatherData?.daily || [];

  const chartData = daily.map((d) => ({
    name: d.dayName,
    date: d.dateFormatted,
    MaxTemp: d.tempMax,
    MinTemp: d.tempMin,
    PrecipProb: d.precipitationProbability,
    PrecipMm: d.precipitationSum,
    WindSpeed: d.maxWindSpeed,
    uvIndex: d.uvIndexMax
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3 rounded-xl border border-slate-700 bg-slate-900/95 shadow-xl text-xs space-y-1">
          <p className="font-bold text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="font-semibold">
              {entry.name}: {entry.value} {entry.name.includes('Temp') ? `°${tempUnit}` : entry.name.includes('Prob') ? '%' : entry.name.includes('Mm') ? 'mm' : 'km/h'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="glass-panel p-5 rounded-2xl border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <CalendarDays className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              7-Day Meteorological Outlook for {currentCity}
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Numerical Weather Prediction (NWP) multi-parameter trajectory analysis
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('temp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'temp' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Temperature
          </button>
          <button
            onClick={() => setActiveTab('rain')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'rain' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Precipitation
          </button>
          <button
            onClick={() => setActiveTab('wind')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'wind' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Wind & Gusts
          </button>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>
              {activeTab === 'temp' && '7-Day Temperature Range Trajectory'}
              {activeTab === 'rain' && 'Precipitation Probability & Estimated Accumulation'}
              {activeTab === 'wind' && 'Max Sustained Wind Speed Trends'}
            </span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Open-Meteo NWP Grids</span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'temp' && (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="maxTempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="minTempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="MaxTemp" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#maxTempGrad)" name="Max Temp" />
                <Area type="monotone" dataKey="MinTemp" stroke="#0ea5e9" strokeWidth={2.5} fillOpacity={1} fill="url(#minTempGrad)" name="Min Temp" />
              </AreaChart>
            )}

            {activeTab === 'rain' && (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="PrecipProb" fill="#38bdf8" radius={[6, 6, 0, 0]} name="Rain Probability (%)" />
                <Bar dataKey="PrecipMm" fill="#0284c7" radius={[6, 6, 0, 0]} name="Rainfall (mm)" />
              </BarChart>
            )}

            {activeTab === 'wind' && (
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="WindSpeed" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} name="Wind Speed (km/h)" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Day by Day Cards List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">Daily Detailed Meteorological Breakdown</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {daily.map((day, idx) => (
            <div
              key={idx}
              className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <CloudSun className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{day.dayName}</h3>
                    <p className="text-xs text-slate-400">{day.dateFormatted} • {day.condition.label}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black text-rose-400">
                    {formatTemp(day.tempMax)}
                  </span>
                  <span className="text-xs text-slate-400 ml-1.5">
                    / {formatTemp(day.tempMin)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                <div className="p-2 rounded-xl bg-slate-900/60 flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Rain Prob</span>
                    <span className="font-bold text-white">{day.precipitationProbability}% ({day.precipitationSum}mm)</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/60 flex items-center gap-2">
                  <Wind className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Max Wind</span>
                    <span className="font-bold text-white">{day.maxWindSpeed} km/h</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/60 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">UV Index</span>
                    <span className="font-bold text-white">{day.uvIndexMax}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
