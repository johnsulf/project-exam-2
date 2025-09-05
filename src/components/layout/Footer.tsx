export function Footer() {
  return (
    <footer className="w-full border-t bg-card text-card-foreground">
      <div className="mx-auto max-w-[1280px] px-5 h-16 flex items-center justify-between text-sm">
        <span>© {new Date().getFullYear()} Holidaze</span>
        <div className="opacity-70">Built with React & Tailwind</div>
      </div>
    </footer>
  );
}
