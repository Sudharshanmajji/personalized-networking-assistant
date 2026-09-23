import { Link } from "@tanstack/react-router";

import { isLiveBackend } from "@/lib/api";

const NAV = [
  { to: "/", label: "Dashboard" },
  { to: "/history", label: "History" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/feedback", label: "Feedback" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b-2 border-ink bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-2xl bg-coral font-display text-lg font-bold text-primary-foreground shadow-block-sm">
            P
          </div>
          <div>
            <p className="font-display text-base font-bold leading-none">Persona</p>
            <p className="text-[11px] tracking-wide text-ink-soft">Networking Assistant</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-full px-4 py-2 hover:bg-ink/5"
              activeProps={{ className: "rounded-full px-4 py-2 bg-ink text-paper" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-mint/40 bg-mint/20 px-3 py-1.5 text-xs font-semibold text-mint sm:inline-flex">
            <span className="size-2 rounded-full bg-mint" />
            {isLiveBackend ? "API live" : "API ready"}
          </span>
          <div className="grid size-9 place-items-center rounded-full bg-sun font-display text-sm font-bold outline-2 outline-ink">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
