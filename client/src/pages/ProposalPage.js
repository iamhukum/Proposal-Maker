import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { proposalAPI, aiAPI, exportAPI } from '../services/api';
import BriefInput from '../components/proposal/BriefInput';
import ProposalEditor from '../components/proposal/ProposalEditor';
import PricingEditor from '../components/proposal/PricingEditor';
import TimelineEditor from '../components/proposal/TimelineEditor';
import ProposalPreview from '../components/proposal/ProposalPreview';

const STEPS = [
  { key: 'brief', label: 'Brief' },
  { key: 'proposal', label: 'Proposal' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'preview', label: 'Preview' },
];

export default function ProposalPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  const loadProposal = useCallback(async () => {
    try {
      const { data } = await proposalAPI.getById(id);
      setProposal(data.proposal);

      if (data.proposal.timeline_data) setStep(4);
      else if (data.proposal.pricing_data) setStep(3);
      else if (data.proposal.proposal_data) setStep(2);
    } catch (err) {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadProposal();
  }, [loadProposal]);

  const handleBriefSubmit = async (briefData) => {
    setGenerating(true);
    setError('');
    try {
      await proposalAPI.update(id, { brief_data: briefData });
      const { data } = await aiAPI.generateProposal(id);
      setProposal((prev) => ({ ...prev, proposal_data: data.proposal_data, brief_data: briefData }));
      setStep(1);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate proposal');
    } finally {
      setGenerating(false);
    }
  };

  const handleProposalUpdate = async (proposalData) => {
    try {
      await proposalAPI.update(id, { proposal_data: proposalData });
      setProposal((prev) => ({ ...prev, proposal_data: proposalData }));
    } catch (err) {
      setError('Failed to save changes');
    }
  };

  const handleGeneratePricing = async () => {
    setGenerating(true);
    setError('');
    try {
      const { data } = await aiAPI.generatePricing(id);
      setProposal((prev) => ({ ...prev, pricing_data: data.pricing_data }));
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate pricing');
    } finally {
      setGenerating(false);
    }
  };

  const handlePricingUpdate = async (pricingData) => {
    try {
      await proposalAPI.update(id, { pricing_data: pricingData });
      setProposal((prev) => ({ ...prev, pricing_data: pricingData }));
    } catch (err) {
      setError('Failed to save pricing');
    }
  };

  const handleGenerateTimeline = async () => {
    setGenerating(true);
    setError('');
    try {
      const { data } = await aiAPI.generateTimeline(id);
      setProposal((prev) => ({ ...prev, timeline_data: data.timeline_data }));
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate timeline');
    } finally {
      setGenerating(false);
    }
  };

  const handleTimelineUpdate = async (timelineData) => {
    try {
      await proposalAPI.update(id, { timeline_data: timelineData });
      setProposal((prev) => ({ ...prev, timeline_data: timelineData }));
    } catch (err) {
      setError('Failed to save timeline');
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    setError('');
    try {
      const response = await exportAPI.exportPDF(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${proposal.project_title}_Proposal.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };

  const handleRegenerateSection = async (sectionName, currentContent) => {
    try {
      const { data } = await aiAPI.regenerateSection(id, sectionName, currentContent);
      return data.content;
    } catch {
      return null;
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-2 block"
          >
            &larr; Back to Dashboard
          </button>
          <h1 className="text-xl font-semibold text-neutral-900">{proposal?.project_title}</h1>
          <p className="text-sm text-neutral-500">{proposal?.client_name}</p>
        </div>
        {step === 4 && (
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            {exporting ? 'Exporting...' : 'Export PDF'}
          </button>
        )}
      </div>

      <div className="flex gap-1 mb-8 bg-neutral-100 rounded-lg p-1">
        {STEPS.map((s, i) => (
          <button
            key={s.key}
            onClick={() => {
              if (i <= step || (i === step + 1 && canAdvance(step, proposal))) {
                setStep(i);
              }
            }}
            className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${
              i === step
                ? 'bg-white text-neutral-900 shadow-sm'
                : i <= step
                  ? 'text-neutral-600 hover:text-neutral-900'
                  : 'text-neutral-400'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
          <button onClick={() => setError('')} className="ml-2 font-medium hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {step === 0 && (
        <BriefInput
          proposal={proposal}
          onSubmit={handleBriefSubmit}
          generating={generating}
        />
      )}

      {step === 1 && (
        <ProposalEditor
          proposalData={proposal?.proposal_data}
          onUpdate={handleProposalUpdate}
          onRegenerateSection={handleRegenerateSection}
          onNext={handleGeneratePricing}
          generating={generating}
        />
      )}

      {step === 2 && (
        <PricingEditor
          pricingData={proposal?.pricing_data}
          onUpdate={handlePricingUpdate}
          onNext={handleGenerateTimeline}
          generating={generating}
        />
      )}

      {step === 3 && (
        <TimelineEditor
          timelineData={proposal?.timeline_data}
          onUpdate={handleTimelineUpdate}
          onNext={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <ProposalPreview proposal={proposal} onExport={handleExportPDF} exporting={exporting} />
      )}
    </div>
  );
}

function canAdvance(currentStep, proposal) {
  switch (currentStep) {
    case 0:
      return !!proposal?.proposal_data;
    case 1:
      return !!proposal?.pricing_data;
    case 2:
      return !!proposal?.timeline_data;
    case 3:
      return true;
    default:
      return false;
  }
}
