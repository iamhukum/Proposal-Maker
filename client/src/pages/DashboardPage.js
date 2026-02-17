import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { proposalAPI } from '../services/api';

const STATUS_STYLES = {
  draft: 'bg-neutral-100 text-neutral-600',
  generated: 'bg-blue-50 text-blue-700',
  complete: 'bg-green-50 text-green-700',
};

export default function DashboardPage() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ client_name: '', project_title: '' });
  const navigate = useNavigate();

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    try {
      const { data } = await proposalAPI.getAll();
      setProposals(data.proposals);
    } catch (err) {
      console.error('Failed to load proposals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const { data } = await proposalAPI.create(form);
      navigate(`/proposal/${data.proposal.id}`);
    } catch (err) {
      console.error('Failed to create proposal:', err);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Proposals</h1>
          <p className="text-neutral-500 text-sm mt-1">
            {proposals.length} proposal{proposals.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
        >
          New Proposal
        </button>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Create New Proposal</h2>
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Client Name
                </label>
                <input
                  type="text"
                  value={form.client_name}
                  onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Project Title
                </label>
                <input
                  type="text"
                  value={form.project_title}
                  onChange={(e) => setForm({ ...form, project_title: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  placeholder="Website Redesign"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-2.5 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {proposals.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-1">No proposals yet</h3>
          <p className="text-neutral-500 text-sm">Create your first AI-powered proposal</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {proposals.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/proposal/${p.id}`)}
              className="bg-white border border-neutral-200 rounded-xl p-6 hover:border-neutral-300 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-neutral-900">{p.project_title}</h3>
                  <p className="text-sm text-neutral-500 mt-1">{p.client_name}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_STYLES[p.status] || STATUS_STYLES.draft}`}
                  >
                    {p.status}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {new Date(p.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
