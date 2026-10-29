import React from 'react';
import {
  X,
  Download,
  Printer,
  ExternalLink,
  MapPin,
  Mail,
  Linkedin,
  Github,
  Award,
  GraduationCap,
  Briefcase,
  Code
} from 'lucide-react';
import {
  Profile,
  SkillGroup,
  Project,
  Education,
  Training,
  Certification
} from '../../types/portfolio';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  skills: SkillGroup[];
  projects: Project[];
  education: Education[];
  trainings: Training[];
  certifications: Certification[];
}

export const ResumeModal: React.FC<ResumeModalProps> = ({
  isOpen,
  onClose,
  profile,
  skills,
  projects,
  education,
  trainings,
  certifications,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (profile.resumeUrl && profile.resumeUrl.startsWith('http')) {
      window.open(profile.resumeUrl, '_blank');
    } else {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800/80 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white tracking-wide">
              Resume Preview
            </span>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              {profile.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 cursor-pointer ml-2"
              aria-label="Close resume preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Resume Canvas */}
        <div className="overflow-y-auto p-6 sm:p-10 space-y-8 bg-slate-900 text-slate-100 print:bg-white print:text-black">
          
          {/* Header */}
          <div className="border-b border-slate-800 print:border-slate-300 pb-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h1 className="text-3xl font-extrabold text-white print:text-black tracking-tight">
                {profile.name}
              </h1>
              <span className="text-sm font-semibold text-cyan-400 print:text-blue-700 font-mono">
                {profile.role}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-300 print:text-slate-700">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 print:text-blue-600" />
                {profile.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-cyan-400 print:text-blue-600" />
                {profile.email}
              </span>
              <span className="inline-flex items-center gap-1">
                <Linkedin className="w-3.5 h-3.5 text-cyan-400 print:text-blue-600" />
                {profile.linkedin}
              </span>
              <span className="inline-flex items-center gap-1">
                <Github className="w-3.5 h-3.5 text-cyan-400 print:text-blue-600" />
                {profile.github}
              </span>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 print:text-blue-800 border-b border-slate-800 print:border-slate-300 pb-1">
              Professional Summary
            </h2>
            <p className="text-sm leading-relaxed text-slate-300 print:text-slate-800">
              {profile.about}
            </p>
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 print:text-blue-800 border-b border-slate-800 print:border-slate-300 pb-1">
              Technical Proficiencies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {skills.map((s) => (
                <div key={s.id} className="p-2.5 rounded-lg bg-slate-950/60 print:bg-slate-50 border border-slate-800 print:border-slate-200">
                  <strong className="text-white print:text-black">{s.category}: </strong>
                  <span className="text-slate-300 print:text-slate-700">{s.skills.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 print:text-blue-800 border-b border-slate-800 print:border-slate-300 pb-1">
              Key Projects
            </h2>
            <div className="space-y-4">
              {projects.map((p) => (
                <div key={p.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white print:text-black">
                      {p.title}
                    </span>
                    <span className="text-xs font-mono text-cyan-400 print:text-blue-700">
                      {p.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
                    {p.description}
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 print:text-slate-600">
                    <strong>Tech: </strong>{p.technologies.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 print:text-blue-800 border-b border-slate-800 print:border-slate-300 pb-1">
              Education
            </h2>
            <div className="space-y-2.5">
              {education.map((edu) => (
                <div key={edu.id} className="flex items-start justify-between text-xs">
                  <div>
                    <h3 className="font-bold text-white print:text-black">{edu.degree}</h3>
                    <p className="text-slate-400 print:text-slate-600">{edu.institution}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-cyan-400 print:text-blue-700">{edu.period}</span>
                    <p className="text-slate-300 print:text-slate-700 font-semibold">{edu.score}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Training */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 print:text-blue-800 border-b border-slate-800 print:border-slate-300 pb-1">
              Industrial Training
            </h2>
            <div className="space-y-2">
              {trainings.map((trn) => (
                <div key={trn.id} className="text-xs space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white print:text-black">
                      {trn.title} — {trn.organization}, {trn.location}
                    </span>
                    <span className="text-cyan-400 print:text-blue-700 font-mono">{trn.year}</span>
                  </div>
                  <p className="text-slate-400 print:text-slate-600">
                    Topic: {trn.topic} | Duration: {trn.duration}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 print:text-blue-800 border-b border-slate-800 print:border-slate-300 pb-1">
              Certifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {certifications.map((c) => (
                <div key={c.id} className="flex items-baseline justify-between">
                  <span className="text-slate-300 print:text-slate-800">• {c.title} ({c.issuer})</span>
                  <span className="text-[11px] font-mono text-slate-400 print:text-slate-600 ml-2">{c.details}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
