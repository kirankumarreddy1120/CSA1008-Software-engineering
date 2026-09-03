import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  CalendarDays,
  AlertOctagon,
  TrendingUp,
  Sprout,
  Settings,
  Home,
  CloudSun,
  ShieldAlert,
  Wind
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useWeather } from '../context/WeatherContext';

export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen }) {
  const { t } = useLanguage();
  const { weatherData, currentCity, formatTemp } = useWeather();

  const activeAlertsCount = weatherData?.alerts?.filter(a => a.severity !== 'Normal').length || 0;

  const navItems = [
    { path: '/', label: t.navHome, icon: Home },
    { path: '/dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { path: '/chat', label: t.navChat, icon: Bot, highlight: true },
    { path: '/forecast', label: t.navForecast, icon: CalendarDays },
    { path: '/alerts', label: t.navAlerts, icon: AlertOctagon, badge: activeAlertsCount > 0 ? activeAlertsCount : null },
    { path: '/climate', label: t.navClimate, icon: TrendingUp },
    { path: '/agriculture', label: t.navAgri, icon: Sprout },
    { path: '/settings', label: t.navSettings, icon: Settings }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 glass-panel border-r border-slate-800/80 bg-slate-950/95 lg:bg-slate-950/80 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between p-4 overflow-y-auto`}
      >
        {/* Nav Links */}
        <div className="space-y-6">
          <div className="px-3 pt-2">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Meteorological Portal
            </span>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition group ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
                        : item.highlight
                        ? 'text-cyan-300 hover:bg-slate-900/90 hover:text-white'
                        : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 transition group-hover:scale-110" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Live Weather Mini Status Card */}
        <div className="pt-4 mt-auto">
          {weatherData?.current && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-slate-800/80 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CloudSun className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white truncate max-w-[120px]">
                    {currentCity}
                  </span>
                </div>
                <span className="text-sm font-extrabold text-cyan-300">
                  {formatTemp(weatherData.current.temperature)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>{weatherData.current.condition.label}</span>
                <span className="flex items-center gap-1">
                  <Wind className="w-3 h-3 text-slate-400" />
                  {weatherData.current.windSpeed} km/h
                </span>
              </div>
            </div>
          )}

          {/* Academic Attribution Badge */}
          <div className="mt-3 px-2 py-1.5 rounded-lg bg-slate-900/40 text-[10px] text-slate-400 text-center border border-slate-800/40">
            <span>MoES / IMD Project • WeatherGPT v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}
