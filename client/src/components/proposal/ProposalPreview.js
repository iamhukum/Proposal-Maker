import React from 'react';

export default function ProposalPreview({ proposal, onExport, exporting }) {
  const pd = proposal?.proposal_data || {};
  const pricing = proposal?.pricing_data || {};
  const timeline = proposal?.timeline_data || {};

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-1">Proposal Preview</h2>
          <p className="text-sm text-neutral-500">Review your proposal before exporting</p>
        </div>
        <button
          onClick={onExport}
          disabled={exporting}
          className="px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
        >
          {exporting ? 'Exporting...' : 'Export PDF'}
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Cover Section */}
        <div className="bg-neutral-950 text-white p-16 md:p-20">
          <p className="text-[11px] uppercase tracking-[6px] text-neutral-500 mb-10">
            Project Proposal
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-5">
            {proposal?.project_title}
          </h1>
          <p className="text-xl font-light text-neutral-400 mb-12">
            Prepared for {proposal?.client_name}
          </p>
          <div className="flex gap-10 text-[11px] uppercase tracking-[3px] text-neutral-600">
            <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>Confidential</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="p-16 md:p-20 border-b border-neutral-100">
          <p className="text-[11px] uppercase tracking-[4px] text-neutral-400 font-semibold mb-4">
            01 &mdash; Overview
          </p>
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight mb-6">
            Executive Summary
          </h2>
          <div className="w-14 h-0.5 bg-neutral-900 mb-8" />
          <p className="text-base text-neutral-600 leading-relaxed max-w-2xl whitespace-pre-wrap">
            {pd.executive_summary}
          </p>
        </div>

        {/* Problem Understanding */}
        <div className="p-16 md:p-20 border-b border-neutral-100">
          <p className="text-[11px] uppercase tracking-[4px] text-neutral-400 font-semibold mb-4">
            02 &mdash; Understanding
          </p>
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight mb-6">
            Problem Understanding
          </h2>
          <div className="w-14 h-0.5 bg-neutral-900 mb-8" />
          <p className="text-base text-neutral-600 leading-relaxed max-w-2xl whitespace-pre-wrap">
            {pd.problem_understanding}
          </p>
        </div>

        {/* Proposed Solution */}
        <div className="p-16 md:p-20 border-b border-neutral-100">
          <p className="text-[11px] uppercase tracking-[4px] text-neutral-400 font-semibold mb-4">
            03 &mdash; Approach
          </p>
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight mb-6">
            Proposed Solution
          </h2>
          <div className="w-14 h-0.5 bg-neutral-900 mb-8" />
          <p className="text-base text-neutral-600 leading-relaxed max-w-2xl whitespace-pre-wrap">
            {pd.proposed_solution}
          </p>
        </div>

        {/* Scope of Work */}
        <div className="p-16 md:p-20 border-b border-neutral-100">
          <p className="text-[11px] uppercase tracking-[4px] text-neutral-400 font-semibold mb-4">
            04 &mdash; Scope
          </p>
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight mb-6">
            Scope of Work
          </h2>
          <div className="w-14 h-0.5 bg-neutral-900 mb-8" />
          <p className="text-base text-neutral-600 leading-relaxed max-w-2xl whitespace-pre-wrap">
            {pd.scope_of_work}
          </p>
        </div>

        {/* Deliverables */}
        {pd.deliverables && pd.deliverables.length > 0 && (
          <div className="p-16 md:p-20 border-b border-neutral-100">
            <p className="text-[11px] uppercase tracking-[4px] text-neutral-400 font-semibold mb-4">
              05 &mdash; Deliverables
            </p>
            <h2 className="text-3xl font-bold text-neutral-900 tracking-tight mb-6">
              What You'll Receive
            </h2>
            <div className="w-14 h-0.5 bg-neutral-900 mb-8" />
            <ul className="space-y-0">
              {pd.deliverables.map((d, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 py-5 border-b border-neutral-100 last:border-0"
                >
                  <div className="w-2 h-2 bg-neutral-900 rounded-full flex-shrink-0" />
                  <span className="text-base text-neutral-700">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pricing */}
        {pricing.basic && (
          <div className="p-16 md:p-20 border-b border-neutral-100">
            <p className="text-[11px] uppercase tracking-[4px] text-neutral-400 font-semibold mb-4">
              06 &mdash; Investment
            </p>
            <h2 className="text-3xl font-bold text-neutral-900 tracking-tight mb-6">
              Pricing
            </h2>
            <div className="w-14 h-0.5 bg-neutral-900 mb-10" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['basic', 'standard', 'premium'].map((tier) => {
                const t = pricing[tier];
                if (!t) return null;
                const isStandard = tier === 'standard';
                return (
                  <div
                    key={tier}
                    className={`border rounded-2xl p-8 relative ${
                      isStandard
                        ? 'border-neutral-900 bg-neutral-50'
                        : 'border-neutral-200'
                    }`}
                  >
                    {isStandard && (
                      <div className="absolute -top-3 left-8 bg-neutral-900 text-white text-[10px] font-semibold uppercase tracking-[3px] px-4 py-1 rounded-full">
                        Recommended
                      </div>
                    )}
                    <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-3">
                      {t.name}
                    </h3>
                    <div className="text-4xl font-bold text-neutral-900 tracking-tight mb-3">
                      {t.price}
                    </div>
                    <p className="text-sm text-neutral-500 mb-6">{t.description}</p>
                    <ul className="space-y-3">
                      {(t.features || []).map((f, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-neutral-700">
                          <svg
                            className="w-4 h-4 text-neutral-900 mt-0.5 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Timeline */}
        {timeline.phases && timeline.phases.length > 0 && (
          <div className="p-16 md:p-20 border-b border-neutral-100">
            <p className="text-[11px] uppercase tracking-[4px] text-neutral-400 font-semibold mb-4">
              07 &mdash; Timeline
            </p>
            <h2 className="text-3xl font-bold text-neutral-900 tracking-tight mb-6">
              Project Timeline
            </h2>
            <div className="w-14 h-0.5 bg-neutral-900 mb-10" />

            <div className="space-y-0">
              {timeline.phases.map((phase, i) => (
                <div
                  key={i}
                  className="flex gap-7 py-8 border-b border-neutral-100 last:border-0"
                >
                  <div className="text-5xl font-bold text-neutral-100 leading-none min-w-[64px]">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-neutral-900 mb-1">
                      {phase.name}
                    </h4>
                    <span className="text-[11px] uppercase tracking-[3px] text-neutral-400 font-medium">
                      {phase.duration}
                    </span>
                    <p className="text-sm text-neutral-600 leading-relaxed mt-3">
                      {phase.description}
                    </p>
                    {phase.milestones && phase.milestones.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {phase.milestones.map((m, mi) => (
                          <span
                            key={mi}
                            className="text-[11px] bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full font-medium"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-10 text-center">
          <p className="text-xs text-neutral-400">
            {proposal?.project_title} &mdash; Prepared for {proposal?.client_name} &mdash;{' '}
            {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
