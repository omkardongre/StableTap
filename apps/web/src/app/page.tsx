import Link from "next/link";
import { PhoneMock } from "@/components/PhoneMock";

const STEPS = [
  { title: "Open your wallet", body: "Your fingerprint keeps it safe. Nothing to install." },
  { title: "Scan the shop's code", body: "Check the amount and the shop name." },
  { title: "Pay with your fingerprint", body: "Done in seconds. The fee comes out of your dollars." },
];

export default function Home() {
  return (
    <div className="landing">
      <section className="hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <h1 id="home-title">
            Pay in dollars
            <br />
            <span className="gradient-text">with your fingerprint.</span>
          </h1>
          <p className="lead">Scan the shop&apos;s code and pay. No app, no extra coins.</p>
          <Link className="btn primary hero-btn" href="/wallet">
            Open wallet
          </Link>
        </div>
        <PhoneMock>
          <span className="mock-label">Corner Coffee</span>
          <span className="mock-amount">$4.50</span>
          <span className="mock-sub">Fee $0.03</span>
          <span className="mock-btn">Pay with fingerprint</span>
        </PhoneMock>
      </section>

      <section aria-labelledby="home-how">
        <h2 id="home-how" className="landing-h2">
          How it works
        </h2>
        <ol className="rows">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className="row-n">{i + 1}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <Link className="switch-card" href="/business">
        <span>
          <strong>Run a shop?</strong> Take payments on your phone.
        </span>
        <span aria-hidden="true">→</span>
      </Link>

      <footer className="footer">
        <span>Demo on a test network. Not real money.</span>
      </footer>
    </div>
  );
}
