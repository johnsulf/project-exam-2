type HighlightCardProps = {
  title: string;
  description: string;
};

export function HighlightCard({ title, description }: HighlightCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
