export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-secondary text-secondary-foreground px-3 py-2 rounded-md shadow"
    >
      Skip to content
    </a>
  );
}
