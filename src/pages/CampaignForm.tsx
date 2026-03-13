import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DryRunBanner } from '../components/DryRunBanner';
import type { CampaignFormData, CampaignType } from '../types';

const typeOptions: { value: CampaignType; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'event', label: 'Event' },
  { value: 'content_syndication', label: 'Content Syndication' },
];

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-zip-500 focus:ring-1 focus:ring-zip-500 outline-none transition-colors';

export function CampaignForm() {
  const { dryRun, submitCampaign } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState<CampaignFormData>({
    name: '',
    type: 'email',
    description: '',
    owner: '',
    ownerEmail: '',
    startDate: '',
    endDate: '',
    budget: 0,
    region: 'NA',
    fromName: 'Zip',
    replyTo: 'marketing@ziphq.com',
    emailSubject: '',
    registrationUrl: '',
    webinarPlatform: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: keyof CampaignFormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const showEventFields = form.type === 'webinar' || form.type === 'event';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Campaign name is required';
    if (!form.owner.trim()) errs.owner = 'Owner name is required';
    if (!form.ownerEmail.trim()) errs.ownerEmail = 'Owner email is required';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const campaign = submitCampaign(form);
    navigate(`/campaign/${campaign.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">New Campaign</h1>
        <p className="text-sm text-gray-500">Fill out the brief — Claude will enrich and execute the pipeline.</p>
      </div>

      {dryRun && <DryRunBanner />}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Campaign Details */}
        <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Campaign Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field label="Campaign Name" required>
                <input
                  className={`${inputClass} ${errors.name ? 'border-red-400' : ''}`}
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g., Spring Product Launch 2026"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </Field>
            </div>
            <Field label="Campaign Type" required>
              <select
                className={inputClass}
                value={form.type}
                onChange={(e) => set('type', e.target.value)}
              >
                {typeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Budget ($)">
              <input
                type="number"
                className={inputClass}
                value={form.budget || ''}
                onChange={(e) => set('budget', Number(e.target.value))}
                placeholder="0"
              />
            </Field>
            <div className="col-span-2">
              <Field label="Description">
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={3}
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Brief campaign description..."
                />
              </Field>
            </div>
            <Field label="Start Date">
              <input
                type="date"
                className={inputClass}
                value={form.startDate}
                onChange={(e) => set('startDate', e.target.value)}
              />
            </Field>
            <Field label="End Date">
              <input
                type="date"
                className={inputClass}
                value={form.endDate}
                onChange={(e) => set('endDate', e.target.value)}
              />
            </Field>
            <Field label="Region">
              <select
                className={inputClass}
                value={form.region}
                onChange={(e) => set('region', e.target.value)}
              >
                <option value="NA">NA</option>
                <option value="EMEA">EMEA</option>
                <option value="APAC">APAC</option>
                <option value="Global">Global</option>
              </select>
            </Field>
          </div>
        </section>

        {/* Campaign Owner */}
        <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Campaign Owner</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Owner Name" required>
              <input
                className={`${inputClass} ${errors.owner ? 'border-red-400' : ''}`}
                value={form.owner}
                onChange={(e) => set('owner', e.target.value)}
                placeholder="e.g., Sarah Chen"
              />
              {errors.owner && <p className="text-xs text-red-500 mt-1">{errors.owner}</p>}
            </Field>
            <Field label="Owner Email" required>
              <input
                type="email"
                className={`${inputClass} ${errors.ownerEmail ? 'border-red-400' : ''}`}
                value={form.ownerEmail}
                onChange={(e) => set('ownerEmail', e.target.value)}
                placeholder="e.g., sarah.chen@ziphq.com"
              />
              {errors.ownerEmail && <p className="text-xs text-red-500 mt-1">{errors.ownerEmail}</p>}
            </Field>
          </div>
        </section>

        {/* Email Settings */}
        <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Email Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="From Name">
              <input
                className={inputClass}
                value={form.fromName}
                onChange={(e) => set('fromName', e.target.value)}
                placeholder="Zip"
              />
            </Field>
            <Field label="Reply-To">
              <input
                type="email"
                className={inputClass}
                value={form.replyTo}
                onChange={(e) => set('replyTo', e.target.value)}
                placeholder="marketing@ziphq.com"
              />
            </Field>
            <div className="col-span-2">
              <Field label="Email Subject">
                <input
                  className={inputClass}
                  value={form.emailSubject}
                  onChange={(e) => set('emailSubject', e.target.value)}
                  placeholder="Leave blank for Claude to generate"
                />
                <p className="text-xs text-gray-400 mt-1">
                  If left blank, Claude will generate a subject line from the campaign name.
                </p>
              </Field>
            </div>
          </div>
        </section>

        {/* Event-specific fields */}
        {showEventFields && (
          <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 animate-fade-in">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              {form.type === 'webinar' ? 'Webinar' : 'Event'} Settings
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Field label="Registration URL">
                  <input
                    className={inputClass}
                    value={form.registrationUrl}
                    onChange={(e) => set('registrationUrl', e.target.value)}
                    placeholder="https://ziphq.com/events/..."
                  />
                </Field>
              </div>
              {form.type === 'webinar' && (
                <Field label="Webinar Platform">
                  <select
                    className={inputClass}
                    value={form.webinarPlatform}
                    onChange={(e) => set('webinarPlatform', e.target.value)}
                  >
                    <option value="">Select platform</option>
                    <option value="Zoom">Zoom</option>
                    <option value="Webex">Webex</option>
                    <option value="GoTo Webinar">GoTo Webinar</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                  </select>
                </Field>
              )}
            </div>
          </section>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="bg-zip-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-zip-700 transition-colors"
          >
            {dryRun ? 'Run Pipeline (Dry Run)' : 'Create Campaign'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
