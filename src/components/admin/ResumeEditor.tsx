import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Link,
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
  FileCheck
} from 'lucide-react';
import { Profile } from '../../types/portfolio';
import { saveProfile } from '../../services/portfolioService';

interface ResumeEditorProps {
  profile: Profile;
  onProfileUpdated: (updated: Profile) => void;
  onPreviewResume: () => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({
  profile,
  onProfileUpdated,
  onPreviewResume,
}) => {
  const [resumeUrl, setResumeUrl] = useState(profile.resumeUrl || '');
  const [resumeFilename, setResumeFilename] = useState(profile.resumeFilename || 'Riya_Singh_Resume.pdf');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 800000) {
      alert('File size exceeds 800KB. For Firestore document safety, please host the PDF on Google Drive / GitHub and paste the link below, or upload a smaller file.');
      return;
    }

    setResumeFilename(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setResumeUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const updatedProfile: Profile = {
        ...profile,
        resumeUrl: resumeUrl.trim(),
        resumeFilename: resumeFilename.trim(),
      };
      await saveProfile(updatedProfile);
      onProfileUpdated(updatedProfile);
      setFeedback({ type: 'success', message: 'Resume configuration updated successfully!' });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update resume settings.',
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
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>Resume & Document Settings</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure the public "Download Resume" action, direct PDF links, or upload a file.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPreviewResume}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>Preview Resume View</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
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

      <form onSubmit={handleSave} className="space-y-6">
        {/* Info card */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm">
            <FileCheck className="w-4 h-4 text-cyan-400" />
            <span>How Resume Delivery Works</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            By default, the portfolio includes a high-fidelity digital resume view formatted with your verified
            education, skills, projects, and industrial trainings that visitors can preview and print to PDF with one click.
            If you also have a custom PDF (e.g. hosted on Google Drive or GitHub), you can specify its direct link below.
          </p>
        </div>

        {/* Link input */}
        <div className="space-y-2">
          <label className="block text-xs font-mono text-slate-300">
            External Resume PDF URL (Optional)
          </label>
          <div className="relative">
            <input
              type="text"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="e.g. https://drive.google.com/file/d/.../view or raw GitHub PDF link"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
            />
            <Link className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          </div>
        </div>

        {/* Filename input */}
        <div className="space-y-2">
          <label className="block text-xs font-mono text-slate-300">
            Download File Name
          </label>
          <input
            type="text"
            value={resumeFilename}
            onChange={(e) => setResumeFilename(e.target.value)}
            placeholder="e.g. Riya_Singh_Resume.pdf"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Direct upload option */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <label className="block text-xs font-mono text-slate-300">
            Or Upload PDF Directly (Base64 data URI):
          </label>
          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer">
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Select PDF File</span>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          {resumeUrl.startsWith('data:') && (
            <span className="text-xs text-emerald-400 block font-mono">
              ✓ PDF document loaded into state ({resumeFilename})
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
