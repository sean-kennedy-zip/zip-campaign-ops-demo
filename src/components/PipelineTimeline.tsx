import { useState, useEffect, useCallback } from 'react';
import type { PipelineStep, PipelineStepStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { JsonViewer } from './JsonViewer';

const stepLabels: Record<string, string> = {
  enrich: 'AI',
  sfdc: 'SF',
  'marketo-clone': 'MK',
  'marketo-tokens': 'TK',
  crosslink: 'LK',
  slack: 'SL',
  asana: 'AS',
};

function StepIcon({ status, stepId }: { status: PipelineStepStatus; stepId: string }) {
  const label = stepLabels[stepId] || '?';

  if (status === 'running') {
    return (
      <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-blue-400 flex items-center justify-center">
        <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin-slow" />
      </div>
    );
  }
  if (status === 'success') {
    return (
      <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-emerald-700 text-[10px] font-bold">
        {label}
      </div>
    );
  }
  if (status === 'failed') {
    return (
      <div className="w-8 h-8 rounded-full bg-red-100 border-2 border-red-400 flex items-center justify-center text-red-600 text-[10px] font-bold">
        {label}
      </div>
    );
  }
  if (status === 'skipped') {
    return (
      <div className="w-8 h-8 rounded-full bg-amber-50 border-2 border-amber-300 flex items-center justify-center text-amber-600 text-[10px] font-bold">
        {label}
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center text-gray-400 text-[10px] font-bold">
      {label}
    </div>
  );
}

interface Props {
  steps: PipelineStep[];
  animate?: boolean;
  dryRun?: boolean;
  onComplete?: () => void;
}

export function PipelineTimeline({ steps: initialSteps, animate = false, dryRun = false, onComplete }: Props) {
  const [steps, setSteps] = useState<PipelineStep[]>(initialSteps);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const runAnimation = useCallback(async () => {
    if (!animate) return;

    const updated = [...initialSteps.map((s) => ({ ...s, status: 'pending' as PipelineStepStatus }))];
    setSteps([...updated]);

    for (let i = 0; i < updated.length; i++) {
      const step = updated[i];

      if (dryRun && i > 0) {
        step.status = 'skipped';
        step.description = `${step.description} (skipped — dry run)`;
        setSteps([...updated]);
        await new Promise((r) => setTimeout(r, 200));
        continue;
      }

      step.status = 'running';
      setSteps([...updated]);
      await new Promise((r) => setTimeout(r, step.duration * 1000));

      step.status = initialSteps[i].status === 'failed' ? 'failed' : 'success';
      setSteps([...updated]);

      if (step.status === 'failed') {
        for (let j = i + 1; j < updated.length; j++) {
          if (updated[j].id !== 'slack') {
            updated[j].status = 'skipped';
            updated[j].description = 'Skipped — upstream dependency failed';
          }
        }
        const slackStep = updated.find((s) => s.id === 'slack' && s.status === 'pending');
        if (slackStep) {
          slackStep.status = 'running';
          setSteps([...updated]);
          await new Promise((r) => setTimeout(r, 400));
          slackStep.status = 'success';
          slackStep.description = 'Posted failure alert to #marketing-ops';
        }
        setSteps([...updated]);
        break;
      }

      await new Promise((r) => setTimeout(r, 150));
    }

    onComplete?.();
  }, [animate, dryRun, initialSteps, onComplete]);

  useEffect(() => {
    runAnimation();
  }, [runAnimation]);

  return (
    <div className="relative">
      {steps.map((step, i) => (
        <div key={step.id} className="flex gap-4 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
          <div className="flex flex-col items-center">
            <StepIcon status={step.status} stepId={step.id} />
            {i < steps.length - 1 && (
              <div
                className={`w-0.5 flex-1 min-h-[24px] ${
                  step.status === 'success'
                    ? 'bg-emerald-300'
                    : step.status === 'failed'
                      ? 'bg-red-300'
                      : 'bg-gray-200'
                }`}
              />
            )}
          </div>
          <div className="flex-1 pb-6">
            <button
              onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
              className="w-full text-left group"
            >
              <div className="flex items-center gap-3 mb-0.5">
                <span className="font-medium text-sm text-gray-900">{step.name}</span>
                <StatusBadge status={step.status} />
                {step.duration > 0 && step.status !== 'pending' && (
                  <span className="text-xs text-gray-400">{step.duration.toFixed(1)}s</span>
                )}
                {step.status === 'failed' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="text-xs text-red-600 hover:text-red-700 font-medium ml-auto"
                  >
                    Retry
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500">{step.description}</p>
              {step.requestPayload && (
                <span className="text-[10px] text-gray-400 group-hover:text-zip-500 transition-colors">
                  {expandedStep === step.id ? 'Hide' : 'View'} request/response
                </span>
              )}
            </button>

            {expandedStep === step.id && step.requestPayload && (
              <div className="mt-3 space-y-3 animate-fade-in">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-medium">Request</div>
                  <JsonViewer data={step.requestPayload} />
                </div>
                {step.responsePayload && (
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-medium">Response</div>
                    <JsonViewer data={step.responsePayload} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
