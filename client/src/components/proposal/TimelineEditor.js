import React, { useState, useEffect } from 'react';

export default function TimelineEditor({ timelineData, onUpdate, onNext }) {
  const [phases, setPhases] = useState(timelineData?.phases || []);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    if (timelineData?.phases) setPhases(timelineData.phases);
  }, [timelineData]);

  const handlePhaseChange = (index, field, value) => {
    const updated = [...phases];
    updated[index] = { ...updated[index], [field]: value };
    setPhases(updated);
  };

  const handleMilestoneChange = (phaseIndex, milestoneIndex, value) => {
    const updated = [...phases];
    const milestones = [...(updated[phaseIndex].milestones || [])];
    milestones[milestoneIndex] = value;
    updated[phaseIndex] = { ...updated[phaseIndex], milestones };
    setPhases(updated);
  };

  const addMilestone = (phaseIndex) => {
    const updated = [...phases];
    const milestones = [...(updated[phaseIndex].milestones || []), ''];
    updated[phaseIndex] = { ...updated[phaseIndex], milestones };
    setPhases(updated);
  };

  const removeMilestone = (phaseIndex, milestoneIndex) => {
    const updated = [...phases];
    const milestones = (updated[phaseIndex].milestones || []).filter((_, i) => i !== milestoneIndex);
    updated[phaseIndex] = { ...updated[phaseIndex], milestones };
    setPhases(updated);
  };

  const handleSave = () => {
    onUpdate({ phases });
    setEditingIndex(null);
  };

  const addPhase = () => {
    setPhases([...phases, { name: '', duration: '', description: '', milestones: [] }]);
    setEditingIndex(phases.length);
  };

  const removePhase = (index) => {
    setPhases(phases.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-1">Project Timeline</h2>
          <p className="text-sm text-neutral-500">Review and edit phases and milestones</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={addPhase}
            className="px-4 py-2.5 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Add Phase
          </button>
          <button
            onClick={onNext}
            className="px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Preview Proposal
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {phases.map((phase, index) => (
          <div key={index} className="bg-white border border-neutral-200 rounded-xl p-6">
            {editingIndex === index ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={phase.name}
                    onChange={(e) => handlePhaseChange(index, 'name', e.target.value)}
                    className="px-3 py-2 border border-neutral-200 rounded-lg text-sm font-medium"
                    placeholder="Phase name"
                  />
                  <input
                    value={phase.duration}
                    onChange={(e) => handlePhaseChange(index, 'duration', e.target.value)}
                    className="px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                    placeholder="Duration (e.g., 2 weeks)"
                  />
                </div>
                <textarea
                  value={phase.description}
                  onChange={(e) => handlePhaseChange(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm resize-none"
                  placeholder="Description"
                />
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Milestones</p>
                  {(phase.milestones || []).map((m, mi) => (
                    <div key={mi} className="flex gap-1.5">
                      <input
                        value={m}
                        onChange={(e) => handleMilestoneChange(index, mi, e.target.value)}
                        className="flex-1 px-2 py-1.5 border border-neutral-200 rounded text-sm"
                      />
                      <button
                        onClick={() => removeMilestone(index, mi)}
                        className="text-neutral-400 hover:text-red-500 px-1"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addMilestone(index)}
                    className="text-xs text-neutral-500 hover:text-neutral-900"
                  >
                    + Add milestone
                  </button>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-neutral-900 text-white text-sm rounded-lg hover:bg-neutral-800"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => removePhase(index)}
                    className="px-4 py-2 text-red-600 text-sm hover:bg-red-50 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="flex gap-5 cursor-pointer"
                onClick={() => setEditingIndex(index)}
              >
                <div className="text-3xl font-bold text-neutral-200 leading-none min-w-[48px]">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-neutral-900">{phase.name}</h3>
                    <span className="text-xs text-neutral-400 uppercase tracking-wider">
                      {phase.duration}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500 mb-2">{phase.description}</p>
                  {phase.milestones && phase.milestones.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {phase.milestones.map((m, mi) => (
                        <span
                          key={mi}
                          className="text-xs bg-neutral-100 text-neutral-600 px-2.5 py-0.5 rounded-full"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
