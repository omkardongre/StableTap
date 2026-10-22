import Link from "next/link";

export default function Home() {
  return (
    <section className="stack">
      <h1>StableTap</h1>
      <p className="muted">Pay in dollars on Portaldot. The fee is paid in dollars too, so you never spend tPOT.</p>
      <Link className="btn primary" href="/wallet">
        Open wallet
      </Link>
      <Link className="btn" href="/pos">
        Open merchant POS
      </Link>
    </section>
  );
}
