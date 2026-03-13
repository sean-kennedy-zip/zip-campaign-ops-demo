import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { templateMappings } from '../data/campaignTypes';

export function Dashboard() {
  const { campaigns } = useApp();
  const navigate = useNavigate();

  const thisMonth = campaigns.filter((c) => {
    const d = new Date(c.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const successRate =
    campaigns.length > 0
      ? Math.round((campaigns.filter((c) => c.status === 'success').length / campaigns.length) * 100)
      : 0;

  const avgDuration =
    campaigns.length > 0
      ? (
          campaigns.reduce((sum, c) => sum + c.totalDuration, 0) / campaigns.length
        ).toFixed(1)
      : '0';

  const typeLabel = (type: string) =>
    templateMappings.find((m) => m.type === type)?.label ?? type;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Campaign Dashboard</h1>
          <p className="text-sm text-gray-500">Automated campaign creation pipeline</p>
        </div>
        <Link
          to="/new"
          className="inline-flex items-center gap-2 bg-zip-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-zip-700 transition-colors"
        >
          <span className="text-lg leading-none">+</span>
          New Campaign
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Campaigns this month" value={thisMonth.length} subtitle="March 2026" />
        <MetricCard label="Success rate" value={`${successRate}%`} subtitle={`${campaigns.length} total campaigns`} />
        <MetricCard label="Avg pipeline time" value={`${avgDuration}s`} subtitle="Across all campaigns" />
        <MetricCard label="Time saved per campaign" value="~25 min" subtitle="vs. manual process" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-[80px_1fr_120px_140px_100px_100px] px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div>Status</div>
          <div>Campaign Name</div>
          <div>Type</div>
          <div>Owner</div>
          <div>SFDC</div>
          <div>Marketo</div>
        </div>
        {campaigns.map((c) => (
          <div
            key={c.id}
            onClick={() => navigate(`/campaign/${c.id}`)}
            className="grid grid-cols-[80px_1fr_120px_140px_100px_100px] px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors items-center"
          >
            <div>
              <StatusBadge status={c.status} />
            </div>
            <div className="font-mono text-sm text-gray-900 truncate pr-4">
              {c.enrichedData.programName}
            </div>
            <div className="text-sm text-gray-600">{typeLabel(c.formData.type)}</div>
            <div className="text-sm text-gray-600">{c.formData.owner}</div>
            <div>
              {c.sfdcId ? (
                <span className="font-mono text-xs text-blue-600">{c.sfdcId.slice(-7)}</span>
              ) : (
                <span className="text-gray-300">&mdash;</span>
              )}
            </div>
            <div>
              {c.marketoId ? (
                <span className="font-mono text-xs text-blue-600">{c.marketoId}</span>
              ) : (
                <span className="text-gray-300">&mdash;</span>
              )}
            </div>
          </div>
        ))}
        {campaigns.length === 0 && (
          <div className="px-4 py-12 text-center text-gray-400 text-sm">
            No campaigns yet. Create your first campaign to get started.
          </div>
        )}
      </div>
    </div>
  );
}
