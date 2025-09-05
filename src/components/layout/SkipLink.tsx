export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:p-1 bg-secondary text-secondary-foreground rounded-md shadow"
    >
      Skip to content
    </a>
  );
}
