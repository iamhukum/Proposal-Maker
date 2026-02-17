import React, { useState, useEffect } from 'react';

const SECTIONS = [
  { key: 'executive_summary', label: 'Executive Summary' },
  { key: 'problem_understanding', label: 'Problem Understanding' },
  { key: 'proposed_solution', label: 'Proposed Solution' },
  { key: 'scope_of_work', label: 'Scope of Work' },
];

export default function ProposalEditor({ proposalData, onUpdate, onRegenerateSection, onNext, generating }) {
  const [data, setData] = useState(proposalData || {});
  const [editingSection, setEditingSection] = useState(null);
  const [regenerating, setRegenerating] = useState(null);
  const [deliverables, setDeliverables] = useState(proposalData?.deliverables || []);

  useEffect(() => {
    if (proposalData) {
      setData(proposalData);
      setDeliverables(proposalData.deliverables || []);
    }
  }, [proposalData]);

  const handleSectionChange = (key, value) => {
    const updated = { ...data, [key]: value };
    setData(updated);
  };

  const handleSave = () => {
    const updated = { ...data, deliverables };
    onUpdate(updated);
    setEditingSection(null);
  };

  const handleRegenerate = async (key) => {
    setRegenerating(key);
    const newContent = await onRegenerateSection(key, data[key]);
    if (newContent) {
      const updated = { ...data, [key]: newContent };
      setData(updated);
      onUpdate({ ...updated, deliverables });
    }
    setRegenerating(null);
  };

  const handleDeliverableChange = (index, value) => {
    const updated = [...deliverables];
    updated[index] = value;
    setDeliverables(updated);
  };

  const addDeliverable = () => {
    setDeliverables([...deliverables, '']);
  };

  const removeDeliverable = (index) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-1">Proposal Content</h2>
          <p className="text-sm text-neutral-500">Edit sections or regenerate with AI</p>
        </div>
        <button
          onClick={onNext}
          disabled={generating}
          className="px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
        >
          {generating ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating Pricing...
            </span>
          ) : (
            'Generate Pricing'
          )}
        </button>
      </div>

      <div className="space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.key} className="bg-white border border-neutral-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-neutral-900">{section.label}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRegenerate(section.key)}
                  disabled={regenerating === section.key}
                  className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors px-3 py-1 border border-neutral-200 rounded-md disabled:opacity-50"
                >
                  {regenerating === section.key ? 'Regenerating...' : 'Regenerate'}
                </button>
                {editingSection === section.key ? (
                  <button
                    onClick={handleSave}
                    className="text-xs text-white bg-neutral-900 px-3 py-1 rounded-md hover:bg-neutral-800"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingSection(section.key)}
                    className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors px-3 py-1 border border-neutral-200 rounded-md"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
            {editingSection === section.key ? (
              <textarea
                value={data[section.key] || ''}
                onChange={(e) => handleSectionChange(section.key, e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
              />
            ) : (
              <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">
                {data[section.key] || 'No content'}
              </p>
            )}
          </div>
        ))}

        <div className="bg-white border border-neutral-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-neutral-900">Deliverables</h3>
            <button
              onClick={addDeliverable}
              className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors px-3 py-1 border border-neutral-200 rounded-md"
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {deliverables.map((d, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={d}
                  onChange={(e) => handleDeliverableChange(i, e.target.value)}
                  className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
                <button
                  onClick={() => removeDeliverable(i)}
                  className="text-neutral-400 hover:text-red-500 px-2 transition-colors"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleSave}
            className="mt-3 text-xs text-white bg-neutral-900 px-3 py-1 rounded-md hover:bg-neutral-800"
          >
            Save Deliverables
          </button>
        </div>
      </div>
    </div>
  );
}
