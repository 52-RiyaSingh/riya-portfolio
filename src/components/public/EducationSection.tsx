import React from 'react';
import { GraduationCap, Calendar, Award, Sparkles, Building2 } from 'lucide-react';
import { Education } from '../../types/portfolio';

interface EducationSectionProps {
  educationList: Education[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({ educationList }) => {
  return (
    <section id="education" className="py-20 relative border-t border-slate-900 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACADEMIC BACKGROUND</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Education
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Academic milestones and educational qualifications shaping technical competence.
          </p>
        </div>

        {/* Education Timeline */}
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Connecting Line */}
          <div className="hidden sm:block absolute left-8 top-6 bottom-6 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-slate-800" />

          <div className="space-y-8">
            {educationList.map((edu, idx) => (
              <div
                key={edu.id}
                className="relative flex flex-col sm:flex-row items-start gap-6 group"
              >
                {/* Timeline node icon */}
                <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 group-hover:border-cyan-500/50 shadow-lg group-hover:shadow-cyan-500/10 transition-all z-10 flex-shrink-0">
                  <GraduationCap className="w-7 h-7 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>

                {/* Card */}
                <div className="w-full flex-1 p-6 sm:p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all backdrop-blur-sm shadow-xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2.5 py-1 rounded-md border border-cyan-800/40">
                      <Calendar className="w-3 h-3" />
                      <span>{edu.period}</span>
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border ${
                        edu.score.toLowerCase().includes('pursuing')
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                          : 'bg-blue-950/60 text-blue-300 border-blue-500/40'
                      }`}
                    >
                      <Award className="w-3 h-3" />
                      <span>{edu.score}</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {edu.degree}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>{edu.institution}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
