import type { TemplateMapping, ConnectionConfig } from '../types';

export const templateMappings: TemplateMapping[] = [
  { type: 'email', label: 'Email', templateId: 2041, folderId: 887, abbreviation: 'EM' },
  { type: 'webinar', label: 'Webinar', templateId: 2045, folderId: 891, abbreviation: 'WBN' },
  { type: 'event', label: 'Event', templateId: 2048, folderId: 894, abbreviation: 'EVT' },
  { type: 'content_syndication', label: 'Content Syndication', templateId: 2052, folderId: 898, abbreviation: 'CS' },
];

export const connections: ConnectionConfig[] = [
  { name: 'Salesforce', description: 'OAuth 2.0 via Okta SSO', status: 'connected' },
  { name: 'Marketo', description: 'Client credentials REST API', status: 'connected' },
  { name: 'Slack', description: '#marketing-ops channel', status: 'connected' },
  { name: 'Asana', description: 'Marketing Ops Pipeline project', status: 'connected' },
  { name: 'Claude API', description: 'claude-sonnet-4-20250514', status: 'connected' },
];

export const enrichmentPrompt = `You are a marketing operations assistant at Zip (ziphq.com), an agentic procurement orchestration platform.

Given a campaign brief, enrich it with:
1. A standardized Marketo program name following convention: YYYY-MM-TYPE-Short-Name
2. The correct Marketo template ID and folder ID based on campaign type
3. UTM parameters derived from campaign metadata
4. An email subject line if not provided
5. Default region (NA) if not specified
6. SFDC campaign defaults (Status: Planned, IsActive: false)
7. Marketo program tokens including type-specific tokens
8. Budget warnings if applicable (>$50k requires VP approval)

Return structured JSON matching the EnrichedData schema.`;

export function getTemplateMapping(type: string): TemplateMapping | undefined {
  return templateMappings.find((m) => m.type === type);
}
