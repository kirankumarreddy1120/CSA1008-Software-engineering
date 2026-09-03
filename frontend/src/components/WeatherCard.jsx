import React from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  Compass,
  Eye,
  Gauge,
  Sun,
  Sunset,
  Sunrise,
  Activity,
  CloudRain
} from 'lucide-react';

const iconMap = {
  thermometer: Thermometer,
  droplets: Droplets,
  wind: Wind,
  compass: Compass,
  eye: Eye,
  gauge: Gauge,
  sun: Sun,
  sunrise: Sunrise,
  sunset: Sunset,
  activity: Activity,
  rain: CloudRain
};

export default function WeatherCard({
  title,
  value,
  subtext,
  icon = 'thermometer',
  accent = 'cyan',
  trend = null
}) {
  const IconComponent = iconMap[icon] || Activity;

  const accentStyles = {
    cyan: 'from-cyan-500/10 to-blue-500/5 text-cyan-400 border-cyan-500/20 group-hover:border-cyan-500/40',
    amber: 'from-amber-500/10 to-orange-500/5 text-amber-400 border-amber-500/20 group-hover:border-amber-500/40',
    emerald: 'from-emerald-500/10 to-teal-500/5 text-emerald-400 border-emerald-500/20 group-hover:border-emerald-500/40',
    purple: 'from-purple-500/10 to-indigo-500/5 text-purple-400 border-purple-500/20 group-hover:border-purple-500/40',
    rose: 'from-rose-500/10 to-pink-500/5 text-rose-400 border-rose-500/20 group-hover:border-rose-500/40',
    blue: 'from-blue-500/10 to-sky-500/5 text-blue-400 border-blue-500/20 group-hover:border-blue-500/40'
  };

  const currentAccent = accentStyles[accent] || accentStyles.cyan;

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-4 sm:p-5 flex flex-col justify-between group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
          {title}
        </span>
        <div className={`p-2 rounded-xl bg-gradient-to-br ${currentAccent} border transition group-hover:scale-110`}>
          <IconComponent className="w-4 h-4" />
        </div>
      </div>

      <div>
        <div className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-baseline gap-1.5">
          <span>{value}</span>
        </div>
        {subtext && (
          <p className="text-xs text-slate-400 mt-1 font-medium truncate">
            {subtext}
          </p>
        )}
      </div>

      {trend && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] font-semibold text-slate-300 flex items-center justify-between">
          <span>Trend</span>
          <span className={trend.positive ? 'text-emerald-400' : 'text-amber-400'}>
            {trend.text}
          </span>
        </div>
      )}
    </div>
  );
}
