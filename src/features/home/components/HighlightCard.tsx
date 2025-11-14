type HighlightCardProps = {
  title: string;
  description: string;
};

export function HighlightCard({ title, description }: HighlightCardProps) {
  return (
    <div className="rounded-lg bg-card p-6">
      <h3>{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
