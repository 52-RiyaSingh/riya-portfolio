/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  Profile,
  SkillGroup,
  Project,
  Education,
  Training,
  Certification,
} from './types/portfolio';
import {
  INITIAL_PROFILE,
  INITIAL_SKILLS,
  INITIAL_PROJECTS,
  INITIAL_EDUCATION,
  INITIAL_TRAINING,
  INITIAL_CERTIFICATIONS,
} from './constants/initialData';
import {
  getProfile,
  getSkills,
  getProjects,
  getEducation,
  getTrainings,
  getCertifications,
} from './services/portfolioService';
import { filterPublished, sortByOrder } from './utils/portfolioLogic';

// Public Components
import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { AboutSection } from './components/public/AboutSection';
import { SkillsSection } from './components/public/SkillsSection';
import { ProjectsSection } from './components/public/ProjectsSection';
import { EducationSection } from './components/public/EducationSection';
import { TrainingSection } from './components/public/TrainingSection';
import { CertificationsSection } from './components/public/CertificationsSection';
import { ContactSection } from './components/public/ContactSection';
import { Footer } from './components/public/Footer';
import { ResumeModal } from './components/public/ResumeModal';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';

function MainApp() {
  const { isAuthorizedAdmin, loading: authLoading } = useAuth();

  // App Routing state
  const [currentRoute, setCurrentRoute] = useState<'public' | 'admin'>(() => {
    return window.location.hash === '#admin' || window.location.pathname.startsWith('/admin')
      ? 'admin'
      : 'public';
  });

  // Portfolio State
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [skills, setSkills] = useState<SkillGroup[]>(INITIAL_SKILLS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [education, setEducation] = useState<Education[]>(INITIAL_EDUCATION);
  const [trainings, setTrainings] = useState<Training[]>(INITIAL_TRAINING);
  const [certifications, setCertifications] = useState<Certification[]>(INITIAL_CERTIFICATIONS);
  const [dataLoading, setDataLoading] = useState(true);

  // Resume Modal State
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  // Synchronize route with URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentRoute('admin');
      } else if (window.location.hash === '' || window.location.hash === '#') {
        setCurrentRoute('public');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch initial portfolio content from Cloud Firestore
  const loadPortfolioData = async () => {
    setDataLoading(true);
    try {
      const [p, s, prj, edu, trn, cert] = await Promise.all([
        getProfile(),
        getSkills(isAuthorizedAdmin),
        getProjects(isAuthorizedAdmin),
        getEducation(isAuthorizedAdmin),
        getTrainings(isAuthorizedAdmin),
        getCertifications(isAuthorizedAdmin),
      ]);
      setProfile(p);
      setSkills(sortByOrder(s));
      setProjects(sortByOrder(prj));
      setEducation(sortByOrder(edu));
      setTrainings(sortByOrder(trn));
      setCertifications(sortByOrder(cert));
    } catch (err) {
      console.warn('Using baseline initial data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolioData();
  }, [isAuthorizedAdmin]);

  const navigateToAdmin = () => {
    window.location.hash = 'admin';
    setCurrentRoute('admin');
  };

  const navigateToPublic = () => {
    window.location.hash = '';
    setCurrentRoute('public');
  };

  // Render Admin View
  if (currentRoute === 'admin') {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400 font-mono text-sm">
          Checking credentials...
        </div>
      );
    }

    if (!isAuthorizedAdmin) {
      return <AdminLogin onBackToPortfolio={navigateToPublic} />;
    }

    return (
      <AdminLayout
        profile={profile}
        skills={skills}
        projects={projects}
        education={education}
        trainings={trainings}
        certifications={certifications}
        onBackToPortfolio={navigateToPublic}
        onRefreshData={loadPortfolioData}
        onProfileUpdated={(updated) => setProfile(updated)}
        onSkillsUpdated={(updated) => setSkills(updated)}
        onProjectsUpdated={(updated) => setProjects(updated)}
        onEducationUpdated={(updated) => setEducation(updated)}
        onTrainingsUpdated={(updated) => setTrainings(updated)}
        onCertificationsUpdated={(updated) => setCertifications(updated)}
        onPreviewResume={() => setResumeModalOpen(true)}
      />
    );
  }

  // Filter published content for public visitors
  const publishedSkills = filterPublished(skills);
  const publishedProjects = filterPublished(projects);
  const publishedEducation = filterPublished(education);
  const publishedTrainings = filterPublished(trainings);
  const publishedCertifications = filterPublished(certifications);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/25 selection:text-cyan-300">
      {/* Top Navbar */}
      <Navbar
        profile={profile}
        onNavigateToAdmin={navigateToAdmin}
        onOpenResume={() => setResumeModalOpen(true)}
      />

      {/* Main sections */}
      <main className="flex-1">
        <Hero profile={profile} onOpenResume={() => setResumeModalOpen(true)} />
        <AboutSection profile={profile} />
        <SkillsSection skills={publishedSkills} />
        <ProjectsSection projects={publishedProjects} />
        <EducationSection educationList={publishedEducation} />
        <TrainingSection trainings={publishedTrainings} />
        <CertificationsSection certifications={publishedCertifications} />
        <ContactSection profile={profile} />
      </main>

      {/* Footer */}
      <Footer profile={profile} onNavigateToAdmin={navigateToAdmin} />

      {/* Resume Modal */}
      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        profile={profile}
        skills={publishedSkills}
        projects={publishedProjects}
        education={publishedEducation}
        trainings={publishedTrainings}
        certifications={publishedCertifications}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
