import React from 'react';
import {
  MapPin,
  Sparkles,
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Mail,
  Terminal,
  Database,
  Layers,
  Code
} from 'lucide-react';
import { Profile } from '../../types/portfolio';

interface HeroProps {
  profile: Profile;
  onOpenResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ profile, onOpenResume }) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background ambient gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-indigo-600/15 blur-[120px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 blur-[90px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Status pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-medium backdrop-blur-sm shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>Available for Internships & Collaborations</span>
            </div>

            {/* Name & Title */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
                Hi, I'm{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                  {profile.name}
                </span>
              </h1>
              <p className="text-lg sm:text-xl font-medium text-slate-300 tracking-wide">
                {profile.role}
              </p>
              <div className="inline-flex items-center gap-1.5 text-sm text-slate-400 font-normal">
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>{profile.location}</span>
              </div>
            </div>

            {/* Introductory bio */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {profile.intro}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenResume}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold border border-slate-700/80 hover:border-cyan-500/40 hover:text-cyan-300 transition-all cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Download Resume</span>
              </button>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-950/80 text-slate-400 hover:text-slate-200 font-medium border border-slate-800 hover:border-slate-700 transition-all"
              >
                <span>Contact Me</span>
              </a>
            </div>

            {/* Social links row */}
            <div className="flex items-center justify-center lg:justify-start gap-5 pt-3">
              <span className="text-xs uppercase font-mono tracking-widest text-slate-400">
                Connect:
              </span>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-850 transition-all"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-slate-850 transition-all"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-slate-850 transition-all"
                aria-label="Email Riya Singh"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Developer Terminal Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl shadow-black/60 overflow-hidden backdrop-blur-xl">
              {/* Terminal titlebar */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400">RiyaSingh.java</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-800/50">
                  <Terminal className="w-3 h-3" />
                  <span>JDK 21</span>
                </div>
              </div>

              {/* Code editor view */}
              <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-slate-300 space-y-2">
                <div>
                  <span className="text-purple-400">public class</span>{' '}
                  <span className="text-yellow-300 font-bold">RiyaSingh</span>{' '}
                  <span className="text-purple-400">implements</span>{' '}
                  <span className="text-cyan-300">SoftwareDeveloper</span> {'{'}
                </div>
                <div className="pl-4">
                  <span className="text-purple-400">private final String</span> focus ={' '}
                  <span className="text-emerald-300">"Java, JSP, SQL & Web"</span>;
                </div>
                <div className="pl-4">
                  <span className="text-purple-400">private final String</span> education ={' '}
                  <span className="text-emerald-300">"CSE Diploma @ Amethi"</span>;
                </div>
                <div className="pl-4">
                  <span className="text-purple-400">private boolean</span> eagerToLearn ={' '}
                  <span className="text-sky-400">true</span>;
                </div>
                <div className="pl-4 pt-2">
                  <span className="text-purple-400">public void</span>{' '}
                  <span className="text-blue-400 font-medium">buildSolutions</span>() {'{'}
                </div>
                <div className="pl-8 text-slate-400">
                  // EventVerse, DBMS Learning Portal, Clean Code
                </div>
                <div className="pl-8">
                  <span className="text-yellow-300">System</span>.out.println(
                  <span className="text-emerald-300">"Building user-friendly applications!"</span>);
                </div>
                <div className="pl-4">{'}'}</div>
                <div>{'}'}</div>
              </div>

              {/* Tech stack badges at bottom of terminal */}
              <div className="px-5 py-3.5 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-cyan-400">
                    <Code className="w-3.5 h-3.5" /> Java
                  </span>
                  <span className="inline-flex items-center gap-1 text-sky-400">
                    <Layers className="w-3.5 h-3.5" /> JSP
                  </span>
                  <span className="inline-flex items-center gap-1 text-amber-400">
                    <Database className="w-3.5 h-3.5" /> MySQL
                  </span>
                </div>
                <span className="text-slate-500 font-sans text-[11px]">Ready to contribute</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
