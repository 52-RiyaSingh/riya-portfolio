import React from 'react';
import {
  GraduationCap,
  Sparkles,
  MapPin,
  Heart,
  Target,
  Award,
  BookOpen,
  Briefcase
} from 'lucide-react';
import { Profile } from '../../types/portfolio';

interface AboutSectionProps {
  profile: Profile;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  return (
    <section id="about" className="py-20 relative border-t border-slate-900 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BACKGROUND & ASPIRATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About Me
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Dedicated to software fundamentals, clean code, and practical problem solving.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Story & Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-5 shadow-xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>My Journey in Tech</span>
              </h3>

              <div className="text-slate-300 space-y-4 text-base leading-relaxed">
                <p>{profile.about}</p>
                <p>
                  My goal is to continually sharpen my programming foundations in object-oriented design,
                  backend web development with Java and JSP, and database management with MySQL. I enjoy
                  converting concepts learned in the classroom into functioning software applications like
                  event booking portals and learning management systems.
                </p>
              </div>

              {/* Core Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-800/80">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/60">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Focused Learner</h4>
                    <p className="text-xs text-slate-400">Committed to mastering core Java & DBMS architectures</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/60">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Practical Training</h4>
                    <p className="text-xs text-slate-400">Hands-on industrial exposure in Lucknow</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info & Highlight Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Education Summary Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/40 border border-slate-800 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Current Institute</h4>
                  <p className="text-xs text-slate-400">Diploma in CSE (2024 - 2027)</p>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-200">
                Government Girls' Polytechnic, Amethi
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-cyan-400 font-mono">
                <span>Status: Pursuing</span>
                <span>Branch: CSE</span>
              </div>
            </div>

            {/* Location & Contact Card */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Location</h4>
                  <p className="text-xs text-slate-400">Hometown & Residence</p>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-200">{profile.location}</p>
              <p className="text-xs text-slate-400 mt-1">Open to remote & on-site opportunities in tech</p>
            </div>

            {/* Opportunity Status Banner */}
            <div className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-200">
              <div className="flex items-center gap-2 font-semibold text-sm text-cyan-300 mb-1.5">
                <Heart className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                <span>Opportunity Availability</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {profile.openToWorkText || 'I am open to internships, learning opportunities, and collaborative projects.'}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
