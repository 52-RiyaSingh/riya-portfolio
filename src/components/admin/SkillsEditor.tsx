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
  Cpu,
  Tag
} from 'lucide-react';
import { SkillGroup } from '../../types/portfolio';
import { saveSkill, deleteSkill } from '../../services/portfolioService';
import { generateSafeId, reorderItems } from '../../utils/portfolioLogic';

interface SkillsEditorProps {
  skills: SkillGroup[];
  onSkillsUpdated: (updated: SkillGroup[]) => void;
}

export const SkillsEditor: React.FC<SkillsEditorProps> = ({ skills, onSkillsUpdated }) => {
  const [skillList, setSkillList] = useState<SkillGroup[]>(skills);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<SkillGroup>>({});
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const startNew = () => {
    const newGroup: SkillGroup = {
      id: generateSafeId('skill'),
      category: '',
      skills: [],
      order: skillList.length + 1,
      published: true,
    };
    setEditForm(newGroup);
    setEditingId(newGroup.id);
    setTagInput('');
  };

  const startEdit = (group: SkillGroup) => {
    setEditForm({ ...group });
    setEditingId(group.id);
    setTagInput('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    const current = editForm.skills || [];
    if (!current.includes(trimmed)) {
      setEditForm({ ...editForm, skills: [...current, trimmed] });
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    const current = editForm.skills || [];
    setEditForm({ ...editForm, skills: current.filter((t) => t !== tagToRemove) });
  };

  const handleSaveItem = async () => {
    if (!editForm.category || !editForm.category.trim()) {
      setFeedback({ type: 'error', message: 'Category title is required.' });
      return;
    }
    if (!editForm.skills || editForm.skills.length === 0) {
      setFeedback({ type: 'error', message: 'Please add at least one skill tag.' });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      const updatedItem: SkillGroup = {
        id: editForm.id || generateSafeId('skill'),
        category: editForm.category.trim(),
        skills: editForm.skills,
        order: editForm.order ?? skillList.length + 1,
        published: editForm.published ?? true,
      };

      await saveSkill(updatedItem);

      const exists = skillList.some((s) => s.id === updatedItem.id);
      const nextList = exists
        ? skillList.map((s) => (s.id === updatedItem.id ? updatedItem : s))
        : [...skillList, updatedItem];

      setSkillList(nextList);
      onSkillsUpdated(nextList);
      setEditingId(null);
      setEditForm({});
      setFeedback({ type: 'success', message: 'Skill category saved successfully!' });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to save skill group.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill group?')) return;
    setSaving(true);
    try {
      await deleteSkill(id);
      const nextList = skillList.filter((s) => s.id !== id);
      setSkillList(nextList);
      onSkillsUpdated(nextList);
      setFeedback({ type: 'success', message: 'Skill group deleted.' });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete skill group.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= skillList.length) return;

    const reordered = reorderItems(skillList, index, targetIndex);
    setSkillList(reordered);
    onSkillsUpdated(reordered);

    // Save orders in background
    for (const item of reordered) {
      await saveSkill(item);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Skills & Technologies</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Organize skill groups, add technical badges, reorder categories, and toggle visibility.
          </p>
        </div>

        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill Group</span>
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

      {/* Editing Form Modal / Inline Card */}
      {editingId && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              {skillList.some((s) => s.id === editingId) ? 'Edit Skill Group' : 'New Skill Group'}
            </h3>
            <button onClick={cancelEdit} className="text-slate-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Category Title *
              </label>
              <input
                type="text"
                value={editForm.category || ''}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                placeholder="e.g. Programming / Web Development / Database"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Add Skills (type and press Enter or click Add)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="e.g. Java, JSP, MySQL, NetBeans..."
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  Add Tag
                </button>
              </div>

              {/* Tag Chips */}
              <div className="flex flex-wrap gap-2 mt-3 min-h-[40px] p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                {(editForm.skills || []).map((skillName, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-slate-900 text-cyan-300 border border-slate-700"
                  >
                    <span>{skillName}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(skillName)}
                      className="text-slate-400 hover:text-rose-400 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {(editForm.skills || []).length === 0 && (
                  <span className="text-xs text-slate-500 italic">No skill tags added yet.</span>
                )}
              </div>
            </div>

            {/* Published checkbox */}
            <div className="flex items-center gap-2 pt-2">
              <input
                id="skill-pub"
                type="checkbox"
                checked={editForm.published ?? true}
                onChange={(e) => setEditForm({ ...editForm, published: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-800"
              />
              <label htmlFor="skill-pub" className="text-xs text-slate-300">
                Published & Visible on public website
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveItem}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List of Skill Groups */}
      <div className="space-y-3">
        {skillList.map((group, index) => (
          <div
            key={group.id}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{group.category}</span>
                {!group.published && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800">
                    Draft
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {group.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800/80"
                  >
                    {s}
                  </span>
                ))}
              </div>
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
                disabled={index === skillList.length - 1}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Move Down"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => startEdit(group)}
                className="p-1.5 text-cyan-400 hover:text-cyan-300 cursor-pointer"
                title="Edit Group"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(group.id)}
                className="p-1.5 text-rose-400 hover:text-rose-300 cursor-pointer"
                title="Delete Group"
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
