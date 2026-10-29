import React, { useState } from 'react';
import {
  User,
  Cpu,
  FolderGit2,
  GraduationCap,
  Briefcase,
  Award,
  Link2,
  FileText,
  MessageSquare,
  LogOut,
  ArrowLeft,
  Database,
  Sparkles,
  CheckCircle,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_EMAIL } from '../../constants/initialData';
import { Profile, SkillGroup, Project, Education, Training, Certification } from '../../types/portfolio';
import { seedAllInitialData } from '../../services/portfolioService';

import { ProfileEditor } from './ProfileEditor';
import { SkillsEditor } from './SkillsEditor';
import { ProjectsEditor } from './ProjectsEditor';
import { EducationEditor } from './EducationEditor';
import { TrainingEditor } from './TrainingEditor';
import { CertificationsEditor } from './CertificationsEditor';
import { ResumeEditor } from './ResumeEditor';
import { MessagesViewer } from './MessagesViewer';

interface AdminLayoutProps {
  profile: Profile;
  skills: SkillGroup[];
  projects: Project[];
  education: Education[];
  trainings: Training[];
  certifications: Certification[];
  onBackToPortfolio: () => void;
  onRefreshData: () => Promise<void>;
  onProfileUpdated: (p: Profile) => void;
  onSkillsUpdated: (s: SkillGroup[]) => void;
  onProjectsUpdated: (p: Project[]) => void;
  onEducationUpdated: (e: Education[]) => void;
  onTrainingsUpdated: (t: Training[]) => void;
  onCertificationsUpdated: (c: Certification[]) => void;
  onPreviewResume: () => void;
}

type TabType =
  | 'profile'
  | 'skills'
  | 'projects'
  | 'education'
  | 'training'
  | 'certifications'
  | 'resume'
  | 'messages';

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  profile,
  skills,
  projects,
  education,
  trainings,
  certifications,
  onBackToPortfolio,
  onRefreshData,
  onProfileUpdated,
  onSkillsUpdated,
  onProjectsUpdated,
  onEducationUpdated,
  onTrainingsUpdated,
  onCertificationsUpdated,
  onPreviewResume,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState<string | null>(null);

  const { currentUser, logout } = useAuth();

  const handleSeedDatabase = async () => {
    if (!confirm('This will populate Firestore collections with Riya Singh’s authentic initial portfolio records. Proceed?')) {
      return;
    }
    setSeeding(true);
    setSeedSuccess(null);
    try {
      const res = await seedAllInitialData();
      await onRefreshData();
      setSeedSuccess(`Database seeded successfully! Created ${res?.count || 'all'} records.`);
      setTimeout(() => setSeedSuccess(null), 5000);
    } catch (err: unknown) {
      console.error('Seed error:', err);
      alert('Failed to seed database. Verify your admin session.');
    } finally {
      setSeeding(false);
    }
  };

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile / Bio', icon: <User className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills & Tech', icon: <Cpu className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'training', label: 'Training', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'certifications', label: 'Certifications', icon: <Award className="w-4 h-4" /> },
    { id: 'resume', label: 'Resume Settings', icon: <FileText className="w-4 h-4" /> },
    { id: 'messages', label: 'Inquiries', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-100">
      
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span className="font-bold text-sm text-white">Admin Dashboard</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-base tracking-tight">
              <ShieldCheck className="w-5 h-5" />
              <span>Admin Console</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-0.5">
              <span className="text-slate-400 block">Logged in as:</span>
              <span className="font-mono text-emerald-400 font-medium truncate block">
                {currentUser?.email || ADMIN_EMAIL}
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Actions: Seed Database, Back to Portfolio, Logout */}
        <div className="pt-6 border-t border-slate-800 space-y-2.5">
          {/* Seed initial data button */}
          <button
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-slate-700 text-xs font-semibold cursor-pointer disabled:opacity-50"
            title="Populate Firestore with Riya Singh's default records"
          >
            <Database className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
            <span>{seeding ? 'Seeding Firestore...' : 'Seed / Reset Data'}</span>
          </button>

          {/* Back to Portfolio */}
          <button
            onClick={onBackToPortfolio}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-200 border border-slate-800 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span>Back to Portfolio</span>
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border border-rose-800/40 text-xs font-semibold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 p-6 sm:p-10 max-w-5xl overflow-y-auto">
        {seedSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-3">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{seedSuccess}</span>
          </div>
        )}

        {activeTab === 'profile' && (
          <ProfileEditor initialProfile={profile} onProfileUpdated={onProfileUpdated} />
        )}
        {activeTab === 'skills' && (
          <SkillsEditor skills={skills} onSkillsUpdated={onSkillsUpdated} />
        )}
        {activeTab === 'projects' && (
          <ProjectsEditor projects={projects} onProjectsUpdated={onProjectsUpdated} />
        )}
        {activeTab === 'education' && (
          <EducationEditor education={education} onEducationUpdated={onEducationUpdated} />
        )}
        {activeTab === 'training' && (
          <TrainingEditor trainings={trainings} onTrainingsUpdated={onTrainingsUpdated} />
        )}
        {activeTab === 'certifications' && (
          <CertificationsEditor certifications={certifications} onCertificationsUpdated={onCertificationsUpdated} />
        )}
        {activeTab === 'resume' && (
          <ResumeEditor profile={profile} onProfileUpdated={onProfileUpdated} onPreviewResume={onPreviewResume} />
        )}
        {activeTab === 'messages' && <MessagesViewer />}
      </main>

    </div>
  );
};
