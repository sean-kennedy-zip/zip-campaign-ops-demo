import type { CampaignFormData, EnrichedData, MarketoToken } from '../types';
import { getTemplateMapping } from './campaignTypes';

export function simulateEnrichment(form: CampaignFormData): EnrichedData {
  const mapping = getTemplateMapping(form.type);
  if (!mapping) throw new Error(`Unknown campaign type: ${form.type}`);

  const shortName = form.name
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('-')
    .slice(0, 40);

  const month = form.startDate
    ? form.startDate.slice(0, 7)
    : new Date().toISOString().slice(0, 7);

  const programName = `${month}-${mapping.abbreviation}-${shortName}`;

  const utmCampaign = programName.toLowerCase().replace(/[^a-z0-9-]/g, '-');

  const warnings: string[] = [];
  if (form.budget > 50000) {
    warnings.push('Budget exceeds $50k — requires VP approval');
  }

  const tokens: MarketoToken[] = [
    { name: '{{my.Campaign Name}}', value: form.name, type: 'text' },
    { name: '{{my.Campaign Description}}', value: form.description || 'N/A', type: 'text' },
    { name: '{{my.Campaign Owner}}', value: form.owner, type: 'text' },
    { name: '{{my.Owner Email}}', value: form.ownerEmail, type: 'text' },
    { name: '{{my.UTM Source}}', value: 'marketo', type: 'text' },
    { name: '{{my.UTM Medium}}', value: form.type === 'email' ? 'email' : form.type, type: 'text' },
    { name: '{{my.UTM Campaign}}', value: utmCampaign, type: 'text' },
    { name: '{{my.From Name}}', value: form.fromName || 'Zip', type: 'text' },
    { name: '{{my.Reply-To}}', value: form.replyTo || 'marketing@ziphq.com', type: 'text' },
    { name: '{{my.Email Subject}}', value: form.emailSubject || `You're invited: ${form.name}`, type: 'text' },
  ];

  if (form.type === 'webinar' || form.type === 'event') {
    tokens.push(
      { name: '{{my.Event Date}}', value: form.startDate, type: 'text' },
      { name: '{{my.Registration URL}}', value: form.registrationUrl || 'https://ziphq.com/events', type: 'text' },
    );
    if (form.type === 'webinar') {
      tokens.push(
        { name: '{{my.Webinar Title}}', value: form.name, type: 'text' },
        { name: '{{my.Webinar Platform}}', value: form.webinarPlatform || 'Zoom', type: 'text' },
      );
    }
  }

  return {
    programName,
    templateId: mapping.templateId,
    folderId: mapping.folderId,
    abbreviation: mapping.abbreviation,
    utmSource: 'marketo',
    utmMedium: form.type === 'email' ? 'email' : form.type,
    utmCampaign,
    utmContent: shortName.toLowerCase(),
    emailSubject: form.emailSubject || `You're invited: ${form.name}`,
    region: form.region || 'NA',
    sfdcStatus: 'Planned',
    sfdcIsActive: false,
    marketoTokens: tokens,
    warnings,
  };
}
