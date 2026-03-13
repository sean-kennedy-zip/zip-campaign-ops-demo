import type { PipelineStepStatus, CampaignStatus } from '../types';

const styles: Record<PipelineStepStatus | CampaignStatus, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
  running: 'bg-blue-50 text-blue-700 border-blue-200',
  pending: 'bg-gray-50 text-gray-500 border-gray-200',
  skipped: 'bg-amber-50 text-amber-700 border-amber-200',
};

const icons: Record<PipelineStepStatus | CampaignStatus, string> = {
  success: '\u2713',
  failed: '\u2717',
  running: '\u25CF',
  pending: '\u25CB',
  skipped: '\u2014',
};

export function StatusBadge({ status }: { status: PipelineStepStatus | CampaignStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      <span className={status === 'running' ? 'animate-pulse-dot' : ''}>{icons[status]}</span>
      {status}
    </span>
  );
}
