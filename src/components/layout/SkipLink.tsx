export function SkipLink() {
  return (
    <a
      href="#main"
      className="z-50 sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:p-2 rounded-lg bg-secondary text-secondary-foreground shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      Skip to content
    </a>
  );
}
