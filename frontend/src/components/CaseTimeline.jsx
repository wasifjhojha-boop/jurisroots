import { CASE_STAGES, stageIndex } from "@/lib/api";

export default function CaseTimeline({ stage }) {
  const current = stageIndex(stage);
  return (
    <div className="w-full" data-testid="case-timeline">
      <div className="flex items-center w-full">
        {CASE_STAGES.map((s, i) => (
          <div key={s.key} className="flex items-center flex-1 last:flex-none">
            <div
              className={`stage-dot ${i < current ? "done" : ""} ${
                i === current ? "active" : ""
              }`}
              data-testid={`timeline-dot-${s.key}`}
            />
            {i < CASE_STAGES.length - 1 && (
              <div className={`stage-line ${i < current ? "done" : ""}`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-start mt-3 w-full">
        {CASE_STAGES.map((s, i) => (
          <div
            key={s.key}
            className="flex-1 last:flex-none text-xs text-[#57534E]"
            style={{
              textAlign: i === 0 ? "left" : i === CASE_STAGES.length - 1 ? "right" : "center",
            }}
          >
            <div
              className={
                i <= current ? "text-[#1C1917] font-medium" : "text-[#57534E]"
              }
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
