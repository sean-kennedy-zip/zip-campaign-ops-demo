import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Campaign, CampaignFormData, PipelineStep } from '../types';
import { demoCampaigns } from '../data/campaigns';
import { simulateEnrichment } from '../data/enrichment';

interface AppState {
  campaigns: Campaign[];
  dryRun: boolean;
  setDryRun: (v: boolean) => void;
  submitCampaign: (form: CampaignFormData) => Campaign;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(demoCampaigns);
  const [dryRun, setDryRun] = useState(false);

  const submitCampaign = useCallback(
    (form: CampaignFormData): Campaign => {
      const enriched = simulateEnrichment(form);
      const id = `camp-${String(Date.now()).slice(-6)}`;

      const steps: PipelineStep[] = [
        {
          id: 'enrich',
          name: 'AI Enrichment',
          description: 'Claude analyzing campaign brief and generating structured data',
          status: 'pending',
          duration: 1.8,
          requestPayload: { model: 'claude-sonnet-4-20250514', type: form.type, name: form.name, fields: Object.keys(form).length },
          responsePayload: { programName: enriched.programName, tokensGenerated: enriched.marketoTokens.length, warnings: enriched.warnings.length },
        },
        {
          id: 'sfdc',
          name: 'SFDC Campaign',
          description: `Creating Salesforce campaign: ${enriched.programName}`,
          status: 'pending',
          duration: 1.2,
          requestPayload: { object: 'Campaign', name: enriched.programName, status: 'Planned', isActive: false, type: form.type },
          responsePayload: { id: `7011R000002k${id.slice(-3).toUpperCase()}`, success: true },
        },
        {
          id: 'marketo-clone',
          name: 'Marketo Clone',
          description: `Cloning program template ${enriched.templateId} into folder ${enriched.folderId}`,
          status: 'pending',
          duration: 0.9,
          requestPayload: { templateId: enriched.templateId, folderId: enriched.folderId, name: enriched.programName },
          responsePayload: { id: 1900 + Math.floor(Math.random() * 100), success: true },
        },
        {
          id: 'marketo-tokens',
          name: 'Marketo Tokens',
          description: `Setting ${enriched.marketoTokens.length} program tokens`,
          status: 'pending',
          duration: 0.7,
          requestPayload: { programId: 1900, tokenCount: enriched.marketoTokens.length, tokens: enriched.marketoTokens.map((t) => t.name) },
          responsePayload: { success: true, tokensSet: enriched.marketoTokens.length },
        },
        {
          id: 'crosslink',
          name: 'Cross-link',
          description: 'Linking SFDC campaign to Marketo program',
          status: 'pending',
          duration: 0.6,
          requestPayload: { sfdcId: `7011R000002k${id.slice(-3).toUpperCase()}`, marketoId: 1900 },
          responsePayload: { linked: true },
        },
        {
          id: 'slack',
          name: 'Slack Notification',
          description: 'Posting to #marketing-ops channel',
          status: 'pending',
          duration: 0.4,
          requestPayload: { channel: '#marketing-ops', type: 'campaign_created', campaignName: enriched.programName },
          responsePayload: { ok: true, ts: String(Date.now()) },
        },
        {
          id: 'asana',
          name: 'Asana Task',
          description: 'Creating task in Marketing Ops Pipeline project',
          status: 'pending',
          duration: 0.6,
          requestPayload: { project: 'Marketing Ops Pipeline', assignee: form.ownerEmail, name: `Review: ${enriched.programName}` },
          responsePayload: { gid: String(1200000000000 + Math.floor(Math.random() * 9999999)), permalink_url: 'https://app.asana.com/0/...' },
        },
      ];

      const campaign: Campaign = {
        id,
        formData: form,
        enrichedData: enriched,
        status: 'running',
        pipelineSteps: steps,
        sfdcId: dryRun ? null : `7011R000002k${id.slice(-3).toUpperCase()}`,
        marketoId: dryRun ? null : String(1900 + Math.floor(Math.random() * 100)),
        createdAt: new Date().toISOString(),
        completedAt: null,
        totalDuration: 0,
        warningCount: enriched.warnings.length,
      };

      setCampaigns((prev) => [campaign, ...prev]);
      return campaign;
    },
    [dryRun],
  );

  return (
    <AppContext.Provider value={{ campaigns, dryRun, setDryRun, submitCampaign }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
