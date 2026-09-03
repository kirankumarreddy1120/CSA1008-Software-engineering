import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ShieldCheck, AlertOctagon, Info, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AlertBanner({ alerts = [] }) {
  const { t } = useLanguage();

  if (!alerts || alerts.length === 0) return null;

  const topAlert = alerts[0];
  const isWarning = topAlert.severity === 'Warning' || topAlert.severity === 'Severe';
  const isAdvisory = topAlert.severity === 'Advisory';

  if (!isWarning && !isAdvisory) {
    return (
      <div className="glass-panel rounded-2xl p-4 border-emerald-500/30 bg-emerald-950/20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-300">
              {topAlert.title}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {topAlert.description}
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex px-3 py-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          {t.alertNormal}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`glass-panel rounded-2xl p-4 sm:p-5 border transition ${
        isWarning
          ? 'border-rose-500/50 bg-gradient-to-r from-rose-950/40 via-slate-900/80 to-rose-950/20 shadow-lg shadow-rose-950/30'
          : 'border-amber-500/50 bg-gradient-to-r from-amber-950/30 via-slate-900/80 to-amber-950/10 shadow-lg shadow-amber-950/20'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
              isWarning ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-amber-500/20 text-amber-400'
            }`}
          >
            {isWarning ? <AlertOctagon className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-2 py-0.5 text-[11px] font-extrabold uppercase rounded-md tracking-wider ${
                  isWarning
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {topAlert.badge || (isWarning ? t.alertWarning : t.alertAdvisory)}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Validity: {topAlert.validity || 'Next 24h'}
              </span>
            </div>
            <h4 className="text-base font-bold text-white mt-1">
              {topAlert.title}
            </h4>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {topAlert.description}
            </p>
            {topAlert.advisory && (
              <p className="text-xs text-cyan-300 font-medium mt-1.5 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>Action: {topAlert.advisory}</span>
              </p>
            )}
          </div>
        </div>

        <Link
          to="/alerts"
          className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
            isWarning
              ? 'bg-rose-600 hover:bg-rose-500 text-white'
              : 'bg-amber-600 hover:bg-amber-500 text-white'
          }`}
        >
          <span>Disaster Hub</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
