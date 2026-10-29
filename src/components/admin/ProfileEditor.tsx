import React, { useState } from 'react';
import {
  Save,
  CheckCircle,
  AlertCircle,
  User,
  MapPin,
  Mail,
  Linkedin,
  Github,
  Globe,
  FileText
} from 'lucide-react';
import { Profile } from '../../types/portfolio';
import { saveProfile } from '../../services/portfolioService';

interface ProfileEditorProps {
  initialProfile: Profile;
  onProfileUpdated: (updated: Profile) => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ initialProfile, onProfileUpdated }) => {
  const [formData, setFormData] = useState<Profile>(initialProfile);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      await saveProfile(formData);
      onProfileUpdated(formData);
      setFeedback({ type: 'success', message: 'Profile updated successfully in Cloud Firestore!' });
      setTimeout(() => setFeedback(null), 5000);
    } catch (err: unknown) {
      console.error('Save profile error:', err);
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to save profile. Please check permissions.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            <span>Profile & Bio Information</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Update your public name, tagline, about narrative, location, and social profile links.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Profile'}</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/60 border border-rose-500/40 text-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Professional Role / Title *
            </label>
            <input
              type="text"
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Public Contact Email *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              LinkedIn Profile URL
            </label>
            <div className="relative">
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
              <Linkedin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* GitHub */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              GitHub Profile URL
            </label>
            <div className="relative">
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
              <Github className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>
        </div>

        {/* Intro */}
        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5">
            Hero Intro Tagline
          </label>
          <textarea
            rows={2}
            value={formData.intro}
            onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
          />
        </div>

        {/* About Biography */}
        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5">
            About Me Full Narrative
          </label>
          <textarea
            rows={4}
            value={formData.about}
            onChange={(e) => setFormData({ ...formData, about: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
          />
        </div>

        {/* Open to Work & Availability */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-white block">Availability Banner</span>
              <span className="text-xs text-slate-400">Display open to work status across public site</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.openToWork}
                onChange={(e) => setFormData({ ...formData, openToWork: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Availability Headline
            </label>
            <input
              type="text"
              value={formData.openToWorkText}
              onChange={(e) => setFormData({ ...formData, openToWorkText: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Published Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div>
            <span className="text-sm font-bold text-white block">Portfolio Publication Status</span>
            <span className="text-xs text-slate-400">When enabled, visitors can see your profile publicly</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>
      </form>
    </div>
  );
};
