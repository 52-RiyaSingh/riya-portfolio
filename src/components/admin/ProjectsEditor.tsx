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
  FolderGit2,
  Image,
  Upload,
  ExternalLink,
  Star,
  Github
} from 'lucide-react';
import { Project } from '../../types/portfolio';
import { saveProject, deleteProject } from '../../services/portfolioService';
import { generateSafeId, reorderItems, validateProject } from '../../utils/portfolioLogic';

interface ProjectsEditorProps {
  projects: Project[];
  onProjectsUpdated: (updated: Project[]) => void;
}

export const ProjectsEditor: React.FC<ProjectsEditorProps> = ({ projects, onProjectsUpdated }) => {
  const [projectList, setProjectList] = useState<Project[]>(projects);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Project>>({});
  const [techInput, setTechInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const startNew = () => {
    const newProj: Project = {
      id: generateSafeId('proj'),
      title: '',
      category: 'Academic Project',
      technologies: [],
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      githubUrl: 'https://github.com/52-RiyaSingh',
      liveUrl: '',
      isFeatured: false,
      order: projectList.length + 1,
      published: true,
    };
    setForm(newProj);
    setEditingId(newProj.id);
    setTechInput('');
  };

  const startEdit = (proj: Project) => {
    setForm({ ...proj });
    setEditingId(proj.id);
    setTechInput('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({});
  };

  const addTechTag = () => {
    const trimmed = techInput.trim();
    if (!trimmed) return;
    const current = form.technologies || [];
    if (!current.includes(trimmed)) {
      setForm({ ...form, technologies: [...current, trimmed] });
    }
    setTechInput('');
  };

  const removeTechTag = (tag: string) => {
    const current = form.technologies || [];
    setForm({ ...form, technologies: current.filter((t) => t !== tag) });
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 800000) {
      alert('File size exceeds 800KB. For Firestore document size efficiency, please use a compressed image or image URL.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const validation = validateProject(form);
    if (!validation.isValid) {
      setFeedback({ type: 'error', message: validation.error || 'Please fill in required fields.' });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      const itemToSave: Project = {
        id: form.id || generateSafeId('proj'),
        title: form.title!.trim(),
        category: form.category!.trim(),
        technologies: form.technologies || [],
        description: form.description!.trim(),
        imageUrl: form.imageUrl || '',
        githubUrl: form.githubUrl || '',
        liveUrl: form.liveUrl || '',
        isFeatured: form.isFeatured ?? false,
        order: form.order ?? projectList.length + 1,
        published: form.published ?? true,
      };

      await saveProject(itemToSave);

      const exists = projectList.some((p) => p.id === itemToSave.id);
      const nextList = exists
        ? projectList.map((p) => (p.id === itemToSave.id ? itemToSave : p))
        : [...projectList, itemToSave];

      setProjectList(nextList);
      onProjectsUpdated(nextList);
      setEditingId(null);
      setForm({});
      setFeedback({ type: 'success', message: 'Project saved successfully in Firestore!' });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to save project.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setSaving(true);
    try {
      await deleteProject(id);
      const nextList = projectList.filter((p) => p.id !== id);
      setProjectList(nextList);
      onProjectsUpdated(nextList);
      setFeedback({ type: 'success', message: 'Project deleted successfully.' });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete project.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= projectList.length) return;

    const reordered = reorderItems(projectList, index, target);
    setProjectList(reordered);
    onProjectsUpdated(reordered);

    for (const item of reordered) {
      await saveProject(item);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-cyan-400" />
            <span>Projects Showcase</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage projects, upload preview graphics, specify GitHub/Live links, and feature top builds.
          </p>
        </div>

        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
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

      {/* Project Editor Form */}
      {editingId && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-xl space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              {projectList.some((p) => p.id === editingId) ? 'Edit Project' : 'New Project'}
            </h3>
            <button onClick={cancelEdit} className="text-slate-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                value={form.title || ''}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. EventVerse"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Category *
              </label>
              <input
                type="text"
                value={form.category || ''}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Academic Project / Mini Project"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Project Description *
              </label>
              <textarea
                rows={3}
                value={form.description || ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Detailed project summary, objectives, and problem solved..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            {/* Image Preview & Upload / URL */}
            <div className="md:col-span-2 space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <label className="block text-xs font-mono text-slate-300">
                Project Preview Image (URL or Upload)
              </label>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <input
                  type="text"
                  value={form.imageUrl || ''}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer border border-slate-700">
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Upload File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {form.imageUrl && (
                <div className="w-36 h-20 rounded-lg overflow-hidden border border-slate-800 mt-2">
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                GitHub Repository URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={form.githubUrl || ''}
                  onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                  placeholder="https://github.com/52-RiyaSingh/..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
                <Github className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Live Demo / Preview URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={form.liveUrl || ''}
                  onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
                <ExternalLink className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            {/* Technologies Chip Manager */}
            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Technologies Used (e.g. Java, JSP, MySQL, HTML)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTechTag();
                    }
                  }}
                  placeholder="Type technology name and press Enter..."
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={addTechTag}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  Add Tech
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                {(form.technologies || []).map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-slate-900 text-cyan-300 border border-slate-700"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => removeTechTag(t)}
                      className="text-slate-400 hover:text-rose-400 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6 pt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured ?? false}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded bg-slate-950 border-slate-800"
                />
                <span className="text-xs text-slate-300 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400" /> Featured Project
                </span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published ?? true}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="w-4 h-4 text-cyan-500 rounded bg-slate-950 border-slate-800"
                />
                <span className="text-xs text-slate-300">Published</span>
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
              <span>Save Project</span>
            </button>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {projectList.map((proj, index) => (
          <div
            key={proj.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-12 rounded-lg bg-slate-950 overflow-hidden border border-slate-800 flex-shrink-0">
                <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{proj.title}</h3>
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                    {proj.category}
                  </span>
                  {proj.isFeatured && (
                    <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
                      ★ Featured
                    </span>
                  )}
                  {!proj.published && (
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">{proj.description}</p>
                <div className="flex flex-wrap gap-1">
                  {proj.technologies.map((t, idx) => (
                    <span key={idx} className="text-[10px] font-mono text-slate-400">
                      {t}{idx < proj.technologies.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-center">
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
                disabled={index === projectList.length - 1}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Move Down"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => startEdit(proj)}
                className="p-1.5 text-cyan-400 hover:text-cyan-300 cursor-pointer"
                title="Edit Project"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(proj.id)}
                className="p-1.5 text-rose-400 hover:text-rose-300 cursor-pointer"
                title="Delete Project"
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
