/**
 * The 12 recovery words as a numbered grid, like Coinbase Wallet and Phantom: each word whole,
 * in order, easy to copy onto paper. No copy button on purpose: other apps can read the clipboard.
 */
export function PhraseGrid({ phrase }: { phrase: string }) {
  return (
    <ol className="phrase-grid" aria-label="Recovery phrase">
      {phrase.split(/\s+/).map((w, i) => (
        <li key={i}>
          <span className="phrase-n" aria-hidden="true">
            {i + 1}
          </span>
          {w}
        </li>
      ))}
    </ol>
  );
}
