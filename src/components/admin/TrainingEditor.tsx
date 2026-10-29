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
  Briefcase
} from 'lucide-react';
import { Training } from '../../types/portfolio';
import { saveTraining, deleteTraining } from '../../services/portfolioService';
import { generateSafeId, reorderItems } from '../../utils/portfolioLogic';

interface TrainingEditorProps {
  trainings: Training[];
  onTrainingsUpdated: (updated: Training[]) => void;
}

export const TrainingEditor: React.FC<TrainingEditorProps> = ({ trainings, onTrainingsUpdated }) => {
  const [trainingList, setTrainingList] = useState<Training[]>(trainings);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Training>>({});
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const startNew = () => {
    const item: Training = {
      id: generateSafeId('trn'),
      title: 'Summer Training',
      organization: '',
      location: 'Lucknow',
      topic: 'Java with JSP',
      duration: '30 days',
      year: 'First Year',
      order: trainingList.length + 1,
      published: true,
    };
    setForm(item);
    setEditingId(item.id);
  };

  const startEdit = (item: Training) => {
    setForm({ ...item });
    setEditingId(item.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({});
  };

  const handleSave = async () => {
    if (!form.title || !form.title.trim() || !form.organization || !form.organization.trim()) {
      setFeedback({ type: 'error', message: 'Training title and organization are required.' });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      const itemToSave: Training = {
        id: form.id || generateSafeId('trn'),
        title: form.title.trim(),
        organization: form.organization.trim(),
        location: form.location || 'Lucknow',
        topic: form.topic || 'Java with JSP',
        duration: form.duration || '',
        year: form.year || '',
        order: form.order ?? trainingList.length + 1,
        published: form.published ?? true,
      };

      await saveTraining(itemToSave);

      const exists = trainingList.some((t) => t.id === itemToSave.id);
      const nextList = exists
        ? trainingList.map((t) => (t.id === itemToSave.id ? itemToSave : t))
        : [...trainingList, itemToSave];

      setTrainingList(nextList);
      onTrainingsUpdated(nextList);
      setEditingId(null);
      setForm({});
      setFeedback({ type: 'success', message: 'Training record saved in Firestore!' });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to save training record.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this training record?')) return;
    setSaving(true);
    try {
      await deleteTraining(id);
      const nextList = trainingList.filter((t) => t.id !== id);
      setTrainingList(nextList);
      onTrainingsUpdated(nextList);
      setFeedback({ type: 'success', message: 'Training record deleted.' });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete training record.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= trainingList.length) return;

    const reordered = reorderItems(trainingList, index, target);
    setTrainingList(reordered);
    onTrainingsUpdated(reordered);

    for (const item of reordered) {
      await saveTraining(item);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-cyan-400" />
            <span>Industrial & Technical Trainings</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage summer training programs, companies, topics, and durations.
          </p>
        </div>

        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Training</span>
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
              {trainingList.some((t) => t.id === editingId) ? 'Edit Training' : 'New Training'}
            </h3>
            <button onClick={cancelEdit} className="text-slate-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Training Title *
              </label>
              <input
                type="text"
                value={form.title || ''}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Summer Training or Technical Training"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Organization / Company *
              </label>
              <input
                type="text"
                value={form.organization || ''}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                placeholder="e.g. Arcane Infotech Pvt Ltd"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Topic / Tech Stack
              </label>
              <input
                type="text"
                value={form.topic || ''}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                placeholder="e.g. Java with JSP"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={form.location || ''}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Lucknow"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Duration
              </label>
              <input
                type="text"
                value={form.duration || ''}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                placeholder="e.g. 28 days or 45 days"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Year / Phase
              </label>
              <input
                type="text"
                value={form.year || ''}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                placeholder="e.g. First Year or Second Year"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-2 pt-2 md:col-span-2">
              <input
                id="trn-pub"
                type="checkbox"
                checked={form.published ?? true}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="w-4 h-4 text-cyan-500 rounded bg-slate-950 border-slate-800"
              />
              <label htmlFor="trn-pub" className="text-xs text-slate-300">
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
              <span>Save Training</span>
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {trainingList.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{item.title}</span>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {item.topic}
                </span>
                {!item.published && (
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                    Draft
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {item.organization}, {item.location} • {item.duration} ({item.year})
              </p>
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
                disabled={index === trainingList.length - 1}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Move Down"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => startEdit(item)}
                className="p-1.5 text-cyan-400 hover:text-cyan-300 cursor-pointer"
                title="Edit Training"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 text-rose-400 hover:text-rose-300 cursor-pointer"
                title="Delete Training"
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
