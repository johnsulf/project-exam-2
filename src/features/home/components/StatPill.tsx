import type { ReactNode } from "react";

type StatPillProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
};

export function StatPill({ icon, label, value }: StatPillProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-background px-4 py-3 shadow-sm">
      <span className="flex p-2 items-center justify-center rounded-full bg-white">
        {icon}
      </span>
      <div>
        <p className="font-semibold">{value}</p>
        <p>{label}</p>
      </div>
    </div>
  );
}
