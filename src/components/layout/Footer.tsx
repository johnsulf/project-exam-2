export function Footer() {
  return (
    <footer className="w-full border-t bg-card">
      <div className="mx-auto max-w-[1280px] px-5 h-16 flex items-center justify-between text-sm">
        <span>© {new Date().getFullYear()} Holidaze</span>
      </div>
    </footer>
  );
}
