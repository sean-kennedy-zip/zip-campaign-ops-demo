export type CampaignType = 'email' | 'webinar' | 'event' | 'content_syndication';

export type PipelineStepStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped';

export type CampaignStatus = 'success' | 'failed' | 'running' | 'pending';

export interface CampaignFormData {
  name: string;
  type: CampaignType;
  description: string;
  owner: string;
  ownerEmail: string;
  startDate: string;
  endDate: string;
  budget: number;
  region: string;
  fromName: string;
  replyTo: string;
  emailSubject: string;
  registrationUrl?: string;
  webinarPlatform?: string;
}

export interface EnrichedData {
  programName: string;
  templateId: number;
  folderId: number;
  abbreviation: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  emailSubject: string;
  region: string;
  sfdcStatus: string;
  sfdcIsActive: boolean;
  marketoTokens: MarketoToken[];
  warnings: string[];
}

export interface MarketoToken {
  name: string;
  value: string;
  type: string;
}

export interface PipelineStep {
  id: string;
  name: string;
  description: string;
  status: PipelineStepStatus;
  duration: number;
  requestPayload?: Record<string, unknown>;
  responsePayload?: Record<string, unknown>;
}

export interface Campaign {
  id: string;
  formData: CampaignFormData;
  enrichedData: EnrichedData;
  status: CampaignStatus;
  pipelineSteps: PipelineStep[];
  sfdcId: string | null;
  marketoId: string | null;
  createdAt: string;
  completedAt: string | null;
  totalDuration: number;
  warningCount: number;
}

export interface TemplateMapping {
  type: CampaignType;
  label: string;
  templateId: number;
  folderId: number;
  abbreviation: string;
}

export interface ConnectionConfig {
  name: string;
  description: string;
  status: 'connected' | 'disconnected';
}
