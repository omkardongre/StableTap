import type { ReactNode } from "react";

/** A small, clearly-labelled example screen for landing pages. Decorative only. */
export function PhoneMock({ tone = "light", children }: { tone?: "light" | "paid"; children: ReactNode }) {
  return (
    <div className="mock-wrap" aria-hidden="true">
      <div className={`mock ${tone === "paid" ? "mock-paid" : ""}`}>
        <span className="mock-tag">Example</span>
        {children}
      </div>
    </div>
  );
}
