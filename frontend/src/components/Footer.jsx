import React from 'react';
import { CloudSun, ShieldCheck, HeartHandshake, Leaf, Cpu, Building2, Flame } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md text-slate-400 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                <CloudSun className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white">
                WeatherGPT
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A full-stack Conversational AI meteorological platform developed for the Ministry of Earth Sciences (MoES) and India Meteorological Department (IMD) disaster management theme.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-cyan-400 font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>Responsible AI Guardrails • Open-Meteo NWP & IMD Grids</span>
            </div>
          </div>

          {/* UN SDG Connections */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              UN SDG Alignment
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 text-slate-300">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>SDG 2: Zero Hunger (Agro)</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
                <span>SDG 3: Health & Well-being</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                <span>SDG 9: Industry & AI Tech</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>SDG 11: Resilient Cities</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Flame className="w-3.5 h-3.5 text-cyan-400" />
                <span>SDG 13: Climate Action</span>
              </li>
            </ul>
          </div>

          {/* Emergency & Helpline Directory */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Disaster Helplines
            </h4>
            <div className="space-y-1.5 text-xs text-slate-300">
              <p><strong className="text-white">NDRF Helpline:</strong> 1078 / 011-24363260</p>
              <p><strong className="text-white">National Emergency:</strong> 112</p>
              <p><strong className="text-white">IMD Weather Enquiry:</strong> 1800-180-1717</p>
              <p><strong className="text-white">Kisan Call Centre:</strong> 1800-180-1551</p>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 WeatherGPT • Academic Software Engineering Demonstration</p>
          <p className="text-center sm:text-right text-[11px] max-w-xl">
            {t.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
