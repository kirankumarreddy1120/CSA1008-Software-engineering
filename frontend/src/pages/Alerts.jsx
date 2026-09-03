import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  ShieldCheck,
  PhoneCall,
  Flame,
  CloudLightning,
  Waves,
  Wind,
  Sun,
  ShieldAlert,
  Info,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { useLanguage } from '../context/LanguageContext';

export default function Alerts() {
  const { weatherData, currentCity } = useWeather();
  const { t } = useLanguage();

  const alerts = weatherData?.alerts || [];

  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity === 'ALL') return true;
    return a.severity.toUpperCase() === filterSeverity;
  });

  const emergencyContacts = [
    { title: 'National Disaster Response Force (NDRF)', number: '1078 / 011-24363260', desc: 'Disaster rescue, evacuation & emergency flood ops' },
    { title: 'National Unified Emergency Number', number: '112', desc: 'Single pan-India emergency response system' },
    { title: 'IMD National Weather Forecasting Centre', number: '1800-180-1717', desc: 'Toll-free weather & severe hazard information' },
    { title: 'State Disaster Management Authority (SDMA)', number: '1070', desc: 'State-level disaster control room' },
    { title: 'Kisan Call Centre (Farmer Met Helpline)', number: '1800-180-1551', desc: 'Agricultural crop-weather advisories' }
  ];

  const disasterProtocols = [
    {
      title: 'Cyclone & High Gale Winds',
      icon: Wind,
      color: 'blue',
      steps: [
        'Inspect and secure loose roof sheets, solar panels, and outdoor signboards.',
        'Keep emergency battery lights, first-aid kits, and drinking water stored.',
        'Fishermen must strictly heed IMD advisories and suspend all deep-sea fishing activities.'
      ]
    },
    {
      title: 'Heavy Rainfall & Urban Inundation',
      icon: Waves,
      color: 'cyan',
      steps: [
        'Avoid driving through waterlogged underpasses or flooded causeways.',
        'Stay clear of fallen electric transmission cables and poles to avoid electrocution.',
        'Keep emergency drainage channels open around homes and farm fields.'
      ]
    },
    {
      title: 'Severe Thunderstorm & Lightning',
      icon: CloudLightning,
      color: 'purple',
      steps: [
        'Take immediate shelter inside sturdy concrete buildings; do NOT take shelter under tall trees.',
        'Disconnect sensitive electrical appliances and avoid metal structures.',
        'Avoid open agricultural fields or open bodies of water during active lightning.'
      ]
    },
    {
      title: 'Severe Heatwave',
      icon: Flame,
      color: 'rose',
      steps: [
        'Avoid direct sun exposure during peak thermal window (12:00 PM to 3:30 PM).',
        'Drink adequate fluids (water, ORS, coconut water, buttermilk) even if not feeling thirsty.',
        'Protect farm animals and pets by providing ample shade and cool drinking water.'
      ]
    }
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="glass-panel p-5 rounded-2xl border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {t.alertTitle} - {currentCity}
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t.alertSubtitle} (IMD Disaster Management Protocol)
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <button
            onClick={() => setFilterSeverity('ALL')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              filterSeverity === 'ALL' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setFilterSeverity('WARNING')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              filterSeverity === 'WARNING' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Warnings
          </button>
          <button
            onClick={() => setFilterSeverity('ADVISORY')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              filterSeverity === 'ADVISORY' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Advisories
          </button>
        </div>
      </div>

      {/* Active Alerts List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          <span>Active Meteorological Hazards & Warnings</span>
        </h2>

        {filteredAlerts.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center space-y-2 border-slate-800">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">No Matching Hazards Found</h3>
            <p className="text-xs text-slate-400">All observed parameters for this filter are normal.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredAlerts.map((alert) => {
              const isWarning = alert.severity === 'Warning' || alert.severity === 'Severe';
              const isAdvisory = alert.severity === 'Advisory';

              return (
                <div
                  key={alert.id}
                  className={`glass-panel rounded-2xl p-5 border transition ${
                    isWarning
                      ? 'border-rose-500/50 bg-rose-950/20 shadow-lg'
                      : isAdvisory
                      ? 'border-amber-500/50 bg-amber-950/20 shadow-lg'
                      : 'border-emerald-500/30 bg-emerald-950/10'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-2xl shrink-0 ${
                          isWarning
                            ? 'bg-rose-500/20 text-rose-400 animate-pulse'
                            : isAdvisory
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {isWarning ? <AlertOctagon className="w-6 h-6" /> : isAdvisory ? <AlertTriangle className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2.5 py-0.5 text-[11px] font-extrabold uppercase rounded-md ${
                              isWarning
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : isAdvisory
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {alert.badge || alert.severity}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            Type: {alert.type}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            Validity: {alert.validity || 'Current'}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-white">
                          {alert.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                          {alert.description}
                        </p>

                        {alert.advisory && (
                          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-cyan-300 flex items-start gap-2">
                            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-white block mb-0.5">Recommended Precautionary Action:</strong>
                              <span>{alert.advisory}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="text-xs text-slate-400 block font-mono">Station: {currentCity}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Disaster Preparedness Protocols */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <span>Standard IMD / NDMA Disaster Safety Protocols</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {disasterProtocols.map((proto, idx) => {
            const Icon = proto.icon;
            return (
              <div
                key={idx}
                className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">{proto.title}</h3>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  {proto.steps.map((step, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency Helplines Directory */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-emerald-400" />
          <span>Official Disaster Response & Emergency Contacts</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {emergencyContacts.map((contact, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <h4 className="text-xs font-bold text-white">{contact.title}</h4>
              <p className="text-sm font-black text-emerald-400 font-mono">{contact.number}</p>
              <p className="text-[11px] text-slate-400">{contact.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
