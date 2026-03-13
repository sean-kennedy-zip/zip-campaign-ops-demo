export function DryRunBanner() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 flex items-center gap-2 text-sm text-amber-800">
      <span className="font-medium">Dry Run Mode</span>
      <span className="text-amber-600">
        — Pipeline steps after AI enrichment will be simulated but not executed.
      </span>
    </div>
  );
}
