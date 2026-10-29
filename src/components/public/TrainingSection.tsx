import React from 'react';
import {
  Briefcase,
  Clock,
  MapPin,
  Code2,
  Calendar,
  Sparkles,
  Building
} from 'lucide-react';
import { Training } from '../../types/portfolio';

interface TrainingSectionProps {
  trainings: Training[];
}

export const TrainingSection: React.FC<TrainingSectionProps> = ({ trainings }) => {
  return (
    <section id="training" className="py-20 relative border-t border-slate-900 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INDUSTRIAL EXPERIENCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Technical & Industrial Training
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Practical hands-on software development training completed with professional IT training organizations.
          </p>
        </div>

        {/* Training Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {trainings.map((t) => (
            <div
              key={t.id}
              className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 transition-all shadow-xl backdrop-blur-sm group flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Header row */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                    {t.title}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                    <Calendar className="w-3 h-3 text-cyan-400" />
                    <span>{t.year}</span>
                  </span>
                </div>

                {/* Organization & Location */}
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {t.organization}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{t.location}</span>
                  </div>
                </div>

                {/* Focus Topic */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/70 space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    Core Subject & Stack:
                  </span>
                  <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    <span>{t.topic}</span>
                  </div>
                </div>
              </div>

              {/* Duration Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Duration: <strong className="text-slate-200">{t.duration}</strong></span>
                </span>
                <span className="text-emerald-400 font-medium">Completed</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
