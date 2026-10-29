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
  GraduationCap
} from 'lucide-react';
import { Education } from '../../types/portfolio';
import { saveEducation, deleteEducation } from '../../services/portfolioService';
import { generateSafeId, reorderItems } from '../../utils/portfolioLogic';

interface EducationEditorProps {
  education: Education[];
  onEducationUpdated: (updated: Education[]) => void;
}

export const EducationEditor: React.FC<EducationEditorProps> = ({ education, onEducationUpdated }) => {
  const [eduList, setEduList] = useState<Education[]>(education);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Education>>({});
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const startNew = () => {
    const item: Education = {
      id: generateSafeId('edu'),
      degree: '',
      institution: '',
      period: '',
      score: '',
      order: eduList.length + 1,
      published: true,
    };
    setForm(item);
    setEditingId(item.id);
  };

  const startEdit = (item: Education) => {
    setForm({ ...item });
    setEditingId(item.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({});
  };

  const handleSave = async () => {
    if (!form.degree || !form.degree.trim() || !form.institution || !form.institution.trim()) {
      setFeedback({ type: 'error', message: 'Degree and Institution are required.' });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      const itemToSave: Education = {
        id: form.id || generateSafeId('edu'),
        degree: form.degree.trim(),
        institution: form.institution.trim(),
        period: form.period || '',
        score: form.score || '',
        order: form.order ?? eduList.length + 1,
        published: form.published ?? true,
      };

      await saveEducation(itemToSave);

      const exists = eduList.some((e) => e.id === itemToSave.id);
      const nextList = exists
        ? eduList.map((e) => (e.id === itemToSave.id ? itemToSave : e))
        : [...eduList, itemToSave];

      setEduList(nextList);
      onEducationUpdated(nextList);
      setEditingId(null);
      setForm({});
      setFeedback({ type: 'success', message: 'Education record saved in Firestore!' });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to save education record.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return;
    setSaving(true);
    try {
      await deleteEducation(id);
      const nextList = eduList.filter((e) => e.id !== id);
      setEduList(nextList);
      onEducationUpdated(nextList);
      setFeedback({ type: 'success', message: 'Education record deleted.' });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete education record.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= eduList.length) return;

    const reordered = reorderItems(eduList, index, target);
    setEduList(reordered);
    onEducationUpdated(reordered);

    for (const item of reordered) {
      await saveEducation(item);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            <span>Education Credentials</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your academic history, institutions, percentages/status, and display order.
          </p>
        </div>

        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
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
              {eduList.some((e) => e.id === editingId) ? 'Edit Education' : 'New Education Entry'}
            </h3>
            <button onClick={cancelEdit} className="text-slate-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Degree / Qualification *
              </label>
              <input
                type="text"
                value={form.degree || ''}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
                placeholder="e.g. Diploma in Computer Science Engineering"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Institution Name *
              </label>
              <input
                type="text"
                value={form.institution || ''}
                onChange={(e) => setForm({ ...form, institution: e.target.value })}
                placeholder="e.g. Government Girls' Polytechnic, Amethi"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Session / Period
              </label>
              <input
                type="text"
                value={form.period || ''}
                onChange={(e) => setForm({ ...form, period: e.target.value })}
                placeholder="e.g. 2024 - 2027 or 2024"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Grade / Percentage / Status
              </label>
              <input
                type="text"
                value={form.score || ''}
                onChange={(e) => setForm({ ...form, score: e.target.value })}
                placeholder="e.g. Pursuing or 68% or 74%"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-2 pt-2 md:col-span-2">
              <input
                id="edu-pub"
                type="checkbox"
                checked={form.published ?? true}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="w-4 h-4 text-cyan-500 rounded bg-slate-950 border-slate-800"
              />
              <label htmlFor="edu-pub" className="text-xs text-slate-300">
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
              <span>Save Entry</span>
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {eduList.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{item.degree}</span>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {item.score}
                </span>
                {!item.published && (
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                    Draft
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">{item.institution} ({item.period})</p>
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
                disabled={index === eduList.length - 1}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Move Down"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => startEdit(item)}
                className="p-1.5 text-cyan-400 hover:text-cyan-300 cursor-pointer"
                title="Edit Education"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 text-rose-400 hover:text-rose-300 cursor-pointer"
                title="Delete Education"
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
