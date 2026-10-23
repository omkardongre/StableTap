import Link from "next/link";
import type { Route } from "next";

const TOOLS: { href: Route; icon: string; title: string; body: string; go: string }[] = [
  { href: "/wallet", icon: "👛", title: "Wallet", body: "A passkey-locked wallet. Scan, tap or paste a link to pay in dollars.", go: "Open wallet" },
  { href: "/pos", icon: "🧾", title: "Merchant POS", body: "Type an amount, show a QR or NFC tag, and see it paid in about a second.", go: "Open POS" },
  { href: "/dashboard", icon: "📊", title: "Dashboard", body: "Today's takings, refunds, signed webhooks and a 2-of-3 team wallet.", go: "Open dashboard" },
  { href: "/stats", icon: "⛓️", title: "On-chain stats", body: "Every payment and fee, read from finalized Portaldot blocks.", go: "See stats" },
  { href: "/partner", icon: "🛍️", title: "Partner app", body: "A third-party shop whose checkout is the StableTap Pay button from the SDK.", go: "Try the Pay button" },
  { href: "/checkout", icon: "🦊", title: "MetaMask checkout", body: "Hold a deposit, capture what was used and release the rest, with one signature.", go: "Open checkout" },
];

const STEPS = [
  { title: "Create a wallet", body: "Your fingerprint or face locks the key on your phone. No seed phrase to start, no app to install." },
  { title: "Scan or tap to pay", body: "The shop shows a QR code or NFC tag. You see the amount, the shop and the fee before you approve." },
  { title: "The fee is in dollars", body: "Portaldot takes the network fee in pUSD through its fee pool, so you never need to hold tPOT." },
];

export default function Home() {
  return (
    <div className="home">
      <section className="hero" aria-labelledby="home-title">
        <div>
          <span className="pill">
            <span className="pill-dot" aria-hidden="true" />
            Live on Portaldot V3 testnet
          </span>
          <h1 id="home-title">
            Pay in dollars.
            <br />
            <span className="gradient-text">Never touch gas.</span>
          </h1>
          <p className="lead">
            StableTap lets anyone pay a shop in a dollar stablecoin on Portaldot. The network fee is paid in dollars too, so customers never spend tPOT.
          </p>
          <div className="cta">
            <Link className="btn primary" href="/wallet">
              Open wallet
            </Link>
            <Link className="btn" href="/pos">
              Open merchant POS
            </Link>
          </div>
          <p className="hero-note">Passkey wallet · No tPOT needed · Fee paid in pUSD</p>
        </div>

        {/* Decorative preview of a receipt; real receipts come from the wallet. */}
        <div className="preview" aria-hidden="true">
          <div className="card">
            <div className="row">
              <span className="label">Paid Corner Coffee</span>
              <span className="chip ok">Final</span>
            </div>
            <span className="big">$4.50</span>
            <dl className="kv">
              <dt>Fee (in dollars)</dt>
              <dd>$0.0225</dd>
              <dt>tPOT spent</dt>
              <dd>0.00</dd>
              <dt>With a tPOT fee</dt>
              <dd className="bad">would fail</dd>
              <dt>Settled in</dt>
              <dd>≈ 6 s</dd>
            </dl>
          </div>
        </div>
      </section>

      <section aria-labelledby="home-how">
        <div className="section-head">
          <span className="eyebrow">How it works</span>
          <h2 id="home-how">From sign-up to paid in three steps</h2>
        </div>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className="step-n">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="home-tools">
        <div className="section-head">
          <span className="eyebrow">Try it</span>
          <h2 id="home-tools">Everything runs on the live testnet</h2>
        </div>
        <div className="tools">
          {TOOLS.map((t) => (
            <Link key={t.href} className="tool" href={t.href}>
              <span className="tool-icon" aria-hidden="true">
                {t.icon}
              </span>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
              <span className="tool-go">
                {t.go} <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span>Portaldot V3 testnet with test pUSD. Not audited.</span>
        <span>Portaldot Hacker House 2026 · Payments & Commerce</span>
      </footer>
    </div>
  );
}
