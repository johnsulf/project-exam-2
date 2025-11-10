export function Footer() {
  return (
    <footer className="w-full border-t bg-card">
      <div className="mx-auto max-w-screen-xl px-4 h-16 flex items-center justify-between">
        <span>© {new Date().getFullYear()} Holidaze</span>
        <p>Built with React & Tailwind</p>
      </div>
    </footer>
  );
}
