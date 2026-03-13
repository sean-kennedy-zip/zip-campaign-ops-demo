import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { PipelineTimeline } from '../components/PipelineTimeline';
import { EnrichmentDiff } from '../components/EnrichmentDiff';
import { DryRunBanner } from '../components/DryRunBanner';
import { templateMappings } from '../data/campaignTypes';

export function ExecutionView() {
  const { id } = useParams<{ id: string }>();
  const { campaigns, dryRun } = useApp();
  const campaign = campaigns.find((c) => c.id === id);

  const [showDiff, setShowDiff] = useState(false);
  const [pipelineComplete, setPipelineComplete] = useState(false);

  const isNewCampaign = campaign?.status === 'running';

  const handlePipelineComplete = useCallback(() => {
    setPipelineComplete(true);
  }, []);

  if (!campaign) {
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Campaign not found</h2>
        <Link to="/" className="text-sm text-zip-600 hover:text-zip-700">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const typeLabel = templateMappings.find((m) => m.type === campaign.formData.type)?.label ?? campaign.formData.type;
  const finalStatus = isNewCampaign && !pipelineComplete ? 'running' : campaign.status;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {dryRun && <DryRunBanner />}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold text-gray-900">
              {campaign.enrichedData.programName}
            </h1>
            <StatusBadge status={finalStatus} />
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{typeLabel}</span>
            <span>&middot;</span>
            <span>{campaign.formData.owner}</span>
            <span>&middot;</span>
            <span>{new Date(campaign.createdAt).toLocaleString()}</span>
            {campaign.totalDuration > 0 && (
              <>
                <span>&middot;</span>
                <span>{campaign.totalDuration.toFixed(1)}s total</span>
              </>
            )}
          </div>
        </div>
        <Link
          to="/"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Back to dashboard
        </Link>
      </div>

      {/* Warnings */}
      {campaign.enrichedData.warnings.length > 0 && (
        <div className="space-y-2">
          {campaign.enrichedData.warnings.map((w, i) => (
            <div
              key={i}
              className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm text-amber-800 flex items-center gap-2"
            >
              <span className="text-amber-500 font-bold text-base">!</span>
              {w}
            </div>
          ))}
        </div>
      )}

      {/* Enrichment Diff Toggle */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            AI Enrichment
          </h2>
          <button
            onClick={() => setShowDiff(!showDiff)}
            className="text-sm text-zip-600 hover:text-zip-700 font-medium transition-colors"
          >
            {showDiff ? 'Hide' : 'View'} enrichment diff
          </button>
        </div>
        {showDiff && (
          <EnrichmentDiff formData={campaign.formData} enrichedData={campaign.enrichedData} />
        )}
        {!showDiff && (
          <p className="text-sm text-gray-500">
            Claude enriched {Object.keys(campaign.enrichedData).length} fields and generated{' '}
            {campaign.enrichedData.marketoTokens.length} Marketo tokens.
            {campaign.enrichedData.warnings.length > 0 &&
              ` ${campaign.enrichedData.warnings.length} warning(s) flagged.`}
          </p>
        )}
      </div>

      {/* Pipeline Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">
          Pipeline Execution
        </h2>
        <PipelineTimeline
          steps={campaign.pipelineSteps}
          animate={isNewCampaign}
          dryRun={dryRun}
          onComplete={handlePipelineComplete}
        />
      </div>

      {/* Linked Records */}
      {(campaign.sfdcId || campaign.marketoId) && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            Linked Records
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {campaign.sfdcId && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                  SF
                </div>
                <div>
                  <div className="text-xs text-gray-500">Salesforce Campaign</div>
                  <div className="font-mono text-sm text-gray-900">{campaign.sfdcId}</div>
                </div>
              </div>
            )}
            {campaign.marketoId && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold">
                  MK
                </div>
                <div>
                  <div className="text-xs text-gray-500">Marketo Program</div>
                  <div className="font-mono text-sm text-gray-900">{campaign.marketoId}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
