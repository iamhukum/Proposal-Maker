import React, { useState, useEffect } from 'react';

const TIERS = ['basic', 'standard', 'premium'];

export default function PricingEditor({ pricingData, onUpdate, onNext, generating }) {
  const [data, setData] = useState(pricingData || {});
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    if (pricingData) setData(pricingData);
  }, [pricingData]);

  const handleTierChange = (tier, field, value) => {
    const updated = {
      ...data,
      [tier]: { ...data[tier], [field]: value },
    };
    setData(updated);
  };

  const handleFeatureChange = (tier, index, value) => {
    const features = [...(data[tier]?.features || [])];
    features[index] = value;
    const updated = {
      ...data,
      [tier]: { ...data[tier], features },
    };
    setData(updated);
  };

  const addFeature = (tier) => {
    const features = [...(data[tier]?.features || []), ''];
    const updated = {
      ...data,
      [tier]: { ...data[tier], features },
    };
    setData(updated);
  };

  const removeFeature = (tier, index) => {
    const features = (data[tier]?.features || []).filter((_, i) => i !== index);
    const updated = {
      ...data,
      [tier]: { ...data[tier], features },
    };
    setData(updated);
  };

  const handleSave = () => {
    onUpdate(data);
    setEditing(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-1">Pricing Tiers</h2>
          <p className="text-sm text-neutral-500">Review and edit your pricing structure</p>
        </div>
        <button
          onClick={onNext}
          disabled={generating}
          className="px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
        >
          {generating ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating Timeline...
            </span>
          ) : (
            'Generate Timeline'
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TIERS.map((tier) => {
          const t = data[tier] || {};
          const isEditing = editing === tier;
          const isStandard = tier === 'standard';

          return (
            <div
              key={tier}
              className={`bg-white border rounded-xl p-6 relative ${
                isStandard ? 'border-neutral-900 ring-1 ring-neutral-900' : 'border-neutral-200'
              }`}
            >
              {isStandard && (
                <div className="absolute -top-3 left-6 bg-neutral-900 text-white text-[10px] font-semibold uppercase tracking-widest px-4 py-1 rounded-full">
                  Recommended
                </div>
              )}

              {isEditing ? (
                <div className="space-y-3">
                  <input
                    value={t.name || ''}
                    onChange={(e) => handleTierChange(tier, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm font-medium"
                    placeholder="Tier name"
                  />
                  <input
                    value={t.price || ''}
                    onChange={(e) => handleTierChange(tier, 'price', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-2xl font-bold"
                    placeholder="$0,000"
                  />
                  <textarea
                    value={t.description || ''}
                    onChange={(e) => handleTierChange(tier, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm resize-none"
                    placeholder="Description"
                  />
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Features</p>
                    {(t.features || []).map((f, i) => (
                      <div key={i} className="flex gap-1.5">
                        <input
                          value={f}
                          onChange={(e) => handleFeatureChange(tier, i, e.target.value)}
                          className="flex-1 px-2 py-1.5 border border-neutral-200 rounded text-sm"
                        />
                        <button
                          onClick={() => removeFeature(tier, i)}
                          className="text-neutral-400 hover:text-red-500 px-1"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addFeature(tier)}
                      className="text-xs text-neutral-500 hover:text-neutral-900"
                    >
                      + Add feature
                    </button>
                  </div>
                  <button
                    onClick={handleSave}
                    className="w-full mt-2 py-2 bg-neutral-900 text-white text-sm rounded-lg hover:bg-neutral-800"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">
                    {t.name || tier}
                  </h3>
                  <div className="text-3xl font-bold text-neutral-900 mb-2">{t.price || '$0'}</div>
                  <p className="text-sm text-neutral-500 mb-5">{t.description || ''}</p>
                  <ul className="space-y-2.5 mb-5">
                    {(t.features || []).map((f, i) => (
                      <li key={i} className="text-sm text-neutral-700 flex items-start gap-2">
                        <svg className="w-4 h-4 text-neutral-900 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setEditing(tier)}
                    className="w-full py-2 border border-neutral-200 text-sm text-neutral-600 rounded-lg hover:border-neutral-300 hover:text-neutral-900 transition-colors"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
