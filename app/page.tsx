import Link from "next/link";

const pains = [
  {
    title: "The spreadsheet lies",
    body: "Usage windows live in a tab nobody opens. Media buyers keep scaling a Spark Ad three weeks after the license ended.",
  },
  {
    title: "Expired UGC is a legal event",
    body: "Talent contracts, exclusivity, and paid vs organic are not the same permission. One mismatch is enough for a takedown — or a claim.",
  },
  {
    title: "Agencies juggle ten brands",
    body: "Clearspan is the board legal, creative, and performance can share: what is active, what expires in 14 days, what must stop today.",
  },
];

const features = [
  {
    k: "01",
    title: "License window",
    body: "Start date, end date, platforms, usage type, exclusivity, and a link to the actual contract.",
  },
  {
    k: "02",
    title: "Traffic-light status",
    body: "Active, expiring in 14 days, expired. Counts sit at the top so a PM can scan the book in five seconds.",
  },
  {
    k: "03",
    title: "CSV in, CSV out",
    body: "Import the sheet you already have. Export a clean file for finance or outside counsel.",
  },
  {
    k: "04",
    title: "Runs in the browser",
    body: "No login, no vendor sitting on your talent roster. Data stays in local storage until you are ready to self-host.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-full">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-sm border border-accent/40 bg-bg-mute text-[11px] font-medium tracking-[0.18em] text-accent">
            CS
          </span>
          <span className="text-sm tracking-[0.22em] uppercase text-ink-dim">
            Clearspan
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-ink-dim">
          <a href="#product" className="hover:text-ink">
            Product
          </a>
          <Link href="/app" className="text-accent hover:text-ink">
            Open the board
          </Link>
        </nav>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 pb-20 pt-10 md:pt-20">
          <p className="mb-5 text-xs tracking-[0.28em] uppercase text-accent">
            Rights ops for paid social
          </p>
          <h1 className="max-w-3xl text-4xl font-medium leading-[1.1] tracking-tight md:text-6xl">
            Don&apos;t run ads past the license.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-dim">
            Clearspan is a clearance board for UGC and influencer creatives.
            Know what you can still run on Meta, TikTok, YouTube, Telegram, and
            the web — before the next media buy.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/app"
              className="rounded-sm bg-accent px-5 py-3 text-sm font-medium text-bg hover:opacity-90"
            >
              Open the board
            </Link>
            <a
              href="#product"
              className="rounded-sm border border-line px-5 py-3 text-sm text-ink-dim hover:text-ink"
            >
              See how it works
            </a>
          </div>
        </section>

        <section
          id="product"
          className="border-y border-line bg-bg-elev py-16"
        >
          <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-3">
            {pains.map((item) => (
              <article key={item.title}>
                <h2 className="text-lg font-medium">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-dim">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-xs tracking-[0.28em] uppercase text-ink-dim">
            Built for the people who get the call
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-medium tracking-tight">
            Performance agencies, in-house growth, and counsel sharing one
            source of truth.
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-line bg-line md:grid-cols-2">
            {features.map((item) => (
              <article key={item.k} className="bg-bg-elev p-8">
                <p className="font-mono text-xs text-accent">{item.k}</p>
                <h3 className="mt-4 text-xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-dim">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-line px-6 py-8 text-sm text-ink-dim">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>Clearspan — Apache-2.0. Data stays in your browser.</p>
          <Link href="/app" className="text-accent hover:text-ink">
            Launch workspace
          </Link>
        </div>
      </footer>
    </div>
  );
}
