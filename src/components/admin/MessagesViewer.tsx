import React, { useState, useEffect } from 'react';
import {
  Mail,
  Trash2,
  CheckCircle2,
  Clock,
  RefreshCw,
  ExternalLink,
  Search,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { ContactMessage } from '../../types/portfolio';
import { getContactMessages, markMessageRead, deleteContactMessage } from '../../services/portfolioService';

export const MessagesViewer: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const msgs = await getContactMessages();
      // sort latest first
      const sorted = (msgs || []).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setMessages(sorted);
    } catch (err: unknown) {
      console.error('Fetch messages error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load inquiries from Firestore.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (msg: ContactMessage) => {
    try {
      await markMessageRead(msg.id, !msg.read);
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: !m.read } : m))
      );
    } catch (err) {
      console.error('Update message error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message permanently?')) return;
    try {
      await deleteContactMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Delete message error:', err);
    }
  };

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(filterText.toLowerCase()) ||
      m.email.toLowerCase().includes(filterText.toLowerCase()) ||
      m.message.toLowerCase().includes(filterText.toLowerCase()) ||
      (m.subject && m.subject.toLowerCase().includes(filterText.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            <span>Visitor Inquiries & Messages</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Submissions sent through the public portfolio contact form.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer border border-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Search by sender name, email, or message keyword..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
        />
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
      </div>

      {/* Message List */}
      <div className="space-y-4">
        {filtered.map((msg) => (
          <div
            key={msg.id}
            className={`p-5 rounded-2xl border transition-all ${
              msg.read
                ? 'bg-slate-900/50 border-slate-800/80 opacity-80'
                : 'bg-slate-900 border-cyan-500/30 shadow-md'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{msg.name}</span>
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}`}
                  className="text-xs text-cyan-400 hover:underline inline-flex items-center gap-1 font-mono"
                >
                  <span>{msg.email}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {new Date(msg.createdAt).toLocaleDateString()} {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>

                <button
                  onClick={() => handleToggleRead(msg)}
                  className="p-1 text-slate-400 hover:text-cyan-400 cursor-pointer"
                  title={msg.read ? 'Mark as Unread' : 'Mark as Read'}
                >
                  <CheckCircle2 className={`w-4 h-4 ${msg.read ? 'text-emerald-400' : 'text-slate-500'}`} />
                </button>

                <button
                  onClick={() => handleDelete(msg.id)}
                  className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {msg.subject && (
              <div className="pt-2 text-xs font-semibold text-slate-200">
                Subject: {msg.subject}
              </div>
            )}

            <p className="pt-2 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {msg.message}
            </p>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 rounded-2xl bg-slate-900/30 border border-slate-800/60 text-slate-400 text-xs space-y-2">
            <Mail className="w-8 h-8 mx-auto text-slate-600" />
            <p>No contact messages found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
