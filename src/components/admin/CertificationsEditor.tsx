import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Award
} from 'lucide-react';
import { Certification } from '../../types/portfolio';
import { saveCertification, deleteCertification } from '../../services/portfolioService';
import { generateSafeId, reorderItems } from '../../utils/portfolioLogic';

interface CertificationsEditorProps {
  certifications: Certification[];
  onCertificationsUpdated: (updated: Certification[]) => void;
}

export const CertificationsEditor: React.FC<CertificationsEditorProps> = ({
  certifications,
  onCertificationsUpdated,
}) => {
  const [certList, setCertList] = useState<Certification[]>(certifications);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Certification>>({});
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const startNew = () => {
    const item: Certification = {
      id: generateSafeId('cert'),
      title: '',
      issuer: 'Infosys Springboard',
      details: 'Course Certificate',
      credentialUrl: '',
      order: certList.length + 1,
      published: true,
    };
    setForm(item);
    setEditingId(item.id);
  };

  const startEdit = (item: Certification) => {
    setForm({ ...item });
    setEditingId(item.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({});
  };

  const handleSave = async () => {
    if (!form.title || !form.title.trim() || !form.issuer || !form.issuer.trim()) {
      setFeedback({ type: 'error', message: 'Title and Issuer are required.' });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      const itemToSave: Certification = {
        id: form.id || generateSafeId('cert'),
        title: form.title.trim(),
        issuer: form.issuer.trim(),
        details: form.details || '',
        credentialUrl: form.credentialUrl || '',
        order: form.order ?? certList.length + 1,
        published: form.published ?? true,
      };

      await saveCertification(itemToSave);

      const exists = certList.some((c) => c.id === itemToSave.id);
      const nextList = exists
        ? certList.map((c) => (c.id === itemToSave.id ? itemToSave : c))
        : [...certList, itemToSave];

      setCertList(nextList);
      onCertificationsUpdated(nextList);
      setEditingId(null);
      setForm({});
      setFeedback({ type: 'success', message: 'Certification saved in Firestore!' });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to save certification.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    setSaving(true);
    try {
      await deleteCertification(id);
      const nextList = certList.filter((c) => c.id !== id);
      setCertList(nextList);
      onCertificationsUpdated(nextList);
      setFeedback({ type: 'success', message: 'Certification deleted.' });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete certification.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= certList.length) return;

    const reordered = reorderItems(certList, index, target);
    setCertList(reordered);
    onCertificationsUpdated(reordered);

    for (const item of reordered) {
      await saveCertification(item);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400" />
            <span>Certifications & Courses</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Maintain your list of verified courses from Infosys, Cisco, Skill India, HP, and more.
          </p>
        </div>

        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certificate</span>
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

      {/* Inline Form */}
      {editingId && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              {certList.some((c) => c.id === editingId) ? 'Edit Certificate' : 'New Certificate'}
            </h3>
            <button onClick={cancelEdit} className="text-slate-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Certificate Title *
              </label>
              <input
                type="text"
                value={form.title || ''}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Java Programming Fundamentals"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Issuer / Platform *
              </label>
              <input
                type="text"
                value={form.issuer || ''}
                onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                placeholder="e.g. Infosys Springboard or Cisco Networking Academy"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Details / Hours / Status
              </label>
              <input
                type="text"
                value={form.details || ''}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                placeholder="e.g. 36 hours or 40 lessons, final exam passed"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Credential Verification URL
              </label>
              <input
                type="url"
                value={form.credentialUrl || ''}
                onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-2 pt-2 md:col-span-2">
              <input
                id="cert-pub"
                type="checkbox"
                checked={form.published ?? true}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="w-4 h-4 text-cyan-500 rounded bg-slate-950 border-slate-800"
              />
              <label htmlFor="cert-pub" className="text-xs text-slate-300">
                Published & Visible on public website
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Certificate</span>
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {certList.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{item.title}</span>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {item.issuer}
                </span>
                {!item.published && (
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                    Draft
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">{item.details}</p>
            </div>

            <div className="flex items-center gap-1.5 ml-4">
              <button
                onClick={() => handleMove(index, 'up')}
                disabled={index === 0}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Move Up"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleMove(index, 'down')}
                disabled={index === certList.length - 1}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Move Down"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => startEdit(item)}
                className="p-1.5 text-cyan-400 hover:text-cyan-300 cursor-pointer"
                title="Edit Certificate"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 text-rose-400 hover:text-rose-300 cursor-pointer"
                title="Delete Certificate"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
