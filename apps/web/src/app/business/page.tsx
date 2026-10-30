import type { Metadata } from "next";
import { PhoneMock } from "@/components/PhoneMock";
import { ShopButton } from "./ShopButton";

export const metadata: Metadata = { title: "StableTap Business", description: "Get paid in dollars at the counter and online. 1% per sale, no monthly fee." };

const STEPS = [
  { title: "Set up your shop", body: "Enter a name. Your passkey keeps it safe and signs you in on a new phone." },
  { title: "At the counter", body: "Type the amount. Your customer scans the code with their phone." },
  { title: "Online", body: "Make a payment link for an item and share it in a chat or on your site." },
];

export default function Business() {
  return (
    <div className="landing">
      <section className="hero" aria-labelledby="biz-title">
        <div className="hero-copy">
          <h1 id="biz-title">
            Get paid in dollars.
            <br />
            <span className="gradient-text">On your phone.</span>
          </h1>
          <p className="lead">At the counter and online. 1% per sale, no card machine, no monthly fee.</p>
          <ShopButton />
        </div>
        <PhoneMock tone="paid">
          <span className="mock-check">✓</span>
          <span className="mock-label">Paid</span>
          <span className="mock-amount">$4.50</span>
        </PhoneMock>
      </section>

      <section aria-labelledby="biz-how">
        <h2 id="biz-how" className="landing-h2">
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

      <footer className="footer">
        <span>Demo on a test network. Not real money.</span>
      </footer>
    </div>
  );
}
