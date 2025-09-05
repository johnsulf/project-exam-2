export function Header() {
  return (
    <header className="w-full border-b bg-card">
      <div className="mx-auto max-w-[1280px] px-5 h-16 flex items-center justify-between">
        <div className="font-bold">holidaze</div>
        <button aria-label="Profile" className="rounded-full w-9 h-9 border" />
      </div>
    </header>
  );
}
