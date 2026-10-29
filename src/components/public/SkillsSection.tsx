import React, { useState } from 'react';
import {
  Code,
  Globe,
  Database,
  Cpu,
  GitBranch,
  Terminal,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { SkillGroup } from '../../types/portfolio';

interface SkillsSectionProps {
  skills: SkillGroup[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const getCategoryIcon = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('web')) return <Globe className="w-5 h-5 text-cyan-400" />;
    if (lower.includes('program')) return <Code className="w-5 h-5 text-blue-400" />;
    if (lower.includes('data')) return <Database className="w-5 h-5 text-amber-400" />;
    if (lower.includes('tool') || lower.includes('ide')) return <Cpu className="w-5 h-5 text-emerald-400" />;
    if (lower.includes('git') || lower.includes('version')) return <GitBranch className="w-5 h-5 text-rose-400" />;
    return <Terminal className="w-5 h-5 text-indigo-400" />;
  };

  const categories = ['All', ...skills.map((s) => s.category)];

  const displayedSkills =
    selectedCategory === 'All'
      ? skills
      : skills.filter((s) => s.category === selectedCategory);

  return (
    <section id="skills" className="py-20 relative border-t border-slate-900 bg-slate-950/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TECHNICAL PROFICIENCIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Skills & Technologies
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Core programming languages, backend frameworks, database systems, and development tools.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 scale-105'
                  : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skill Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedSkills.map((group) => (
            <div
              key={group.id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all hover:shadow-xl hover:shadow-cyan-950/20 group backdrop-blur-sm"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform">
                  {getCategoryIcon(group.category)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {group.category}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {group.skills.length} skills listed
                  </span>
                </div>
              </div>

              {/* Skill Tags */}
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skillName, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-950/80 text-slate-200 border border-slate-800/80 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
                  >
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    <span>{skillName}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
