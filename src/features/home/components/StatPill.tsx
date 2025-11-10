import type { ReactNode } from "react";

type StatPillProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
};

export function StatPill({ icon, label, value }: StatPillProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-card px-4 py-3 shadow-sm">
      <span className="flex size-8 items-center justify-center rounded-full bg-neutral-900/5 ">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
