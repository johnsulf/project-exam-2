export function StatChip({ label, value }: { label: string; value?: number }) {
  return (
    <div className="rounded-md border px-3 py-1.5 text-sm">
      <span className="font-medium">{value ?? "—"}</span>{" "}
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
