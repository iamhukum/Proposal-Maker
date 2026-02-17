import React, { useState } from 'react';

export default function BriefInput({ proposal, onSubmit, generating }) {
  const [brief, setBrief] = useState({
    services: proposal?.brief_data?.services || '',
    budget: proposal?.brief_data?.budget || '',
    timeline: proposal?.brief_data?.timeline || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(brief);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-neutral-900 mb-1">Project Brief</h2>
        <p className="text-sm text-neutral-500">
          Describe the project. The more detail you provide, the better the generated proposal.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Services Required
          </label>
          <textarea
            value={brief.services}
            onChange={(e) => setBrief({ ...brief, services: e.target.value })}
            required
            rows={5}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
            placeholder="Describe the services needed... e.g., Brand identity redesign including logo, visual system, brand guidelines, website design, and marketing collateral."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Budget <span className="text-neutral-400">(optional)</span>
            </label>
            <input
              type="text"
              value={brief.budget}
              onChange={(e) => setBrief({ ...brief, budget: e.target.value })}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              placeholder="e.g., $10,000 - $25,000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Timeline <span className="text-neutral-400">(optional)</span>
            </label>
            <input
              type="text"
              value={brief.timeline}
              onChange={(e) => setBrief({ ...brief, timeline: e.target.value })}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              placeholder="e.g., 8-12 weeks"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={generating || !brief.services.trim()}
          className="px-6 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
        >
          {generating ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating Proposal...
            </span>
          ) : (
            'Generate Proposal'
          )}
        </button>
      </form>
    </div>
  );
}
