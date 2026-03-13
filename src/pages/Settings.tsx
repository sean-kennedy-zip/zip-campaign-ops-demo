import { useApp } from '../context/AppContext';
import { templateMappings, connections, enrichmentPrompt } from '../data/campaignTypes';

export function Settings() {
  const { dryRun, setDryRun } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">System configuration and connection status</p>
      </div>

      {/* System Mode */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
          System Mode
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-900">Dry Run Mode</div>
            <p className="text-xs text-gray-500 mt-0.5">
              When enabled, only AI enrichment runs. All downstream steps (SFDC, Marketo, Slack, Asana) are skipped.
            </p>
          </div>
          <button
            onClick={() => setDryRun(!dryRun)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              dryRun ? 'bg-amber-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                dryRun ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        {dryRun && (
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700">
            Dry run is active. Pipeline steps after AI enrichment will be simulated but not executed.
          </div>
        )}
      </div>

      {/* Template Mappings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
          Template Mappings
        </h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-[1fr_100px_100px_100px] bg-gray-50 border-b border-gray-200 px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div>Campaign Type</div>
            <div>Template ID</div>
            <div>Folder ID</div>
            <div>Abbreviation</div>
          </div>
          {templateMappings.map((m) => (
            <div
              key={m.type}
              className="grid grid-cols-[1fr_100px_100px_100px] px-4 py-2.5 border-b border-gray-100 last:border-b-0 text-sm"
            >
              <div className="font-medium text-gray-900">{m.label}</div>
              <div className="font-mono text-gray-600">{m.templateId}</div>
              <div className="font-mono text-gray-600">{m.folderId}</div>
              <div className="font-mono text-gray-600">{m.abbreviation}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Connections */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
          Connections
        </h2>
        <div className="space-y-3">
          {connections.map((c) => (
            <div
              key={c.name}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <div className="text-sm font-medium text-gray-900">{c.name}</div>
                <div className="text-xs text-gray-500">{c.description}</div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Connected
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Claude Enrichment Prompt */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Claude Enrichment Prompt
          </h2>
          <span className="text-xs text-gray-400">Read-only in demo &middot; editable in production</span>
        </div>
        <textarea
          readOnly
          className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs font-mono text-gray-700 resize-none leading-relaxed"
          rows={12}
          value={enrichmentPrompt}
        />
      </div>
    </div>
  );
}
