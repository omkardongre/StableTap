import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import type { ChainRecord, ScannedBlock, StableTransfer } from "@stabletap/engine";

export interface StoredRecord extends Omit<ChainRecord, "fee"> {
  fee: { amount: bigint; assetId: number | null } | null;
}

export interface Stats {
  payments: number;
  volume: bigint;
  refunds: number;
  refunded: bigint;
  payers: number;
  merchants: number;
  /** Fees paid in the stablecoin: count and sum. */
  stableFees: { count: number; amount: bigint };
  /** Records whose fee was paid in the native token (should stay 0 for app traffic). */
  nativeFeeCount: number;
  /** Records paid (fee included) with another asset, e.g. a community token swapped on the way. */
  otherAssetFeeCount: number;
  firstBlock: number | null;
  lastBlock: number | null;
}

export interface Webhook {
  merchant: string;
  url: string;
  secret: string;
  /** Signed registration time (unix s); a newer registration must have a larger one. */
  signedAt: number;
}

/** A POS terminal behind a fixed NFC tag. Its charges can only pay `merchant`. */
export interface Terminal {
  id: string;
  /** SHA-256 of the terminal's write token; the token itself is shown to the POS once. */
  tokenHash: Buffer;
  merchant: string;
  charge: { link: string; expiresAt: number } | null;
}

export interface Delivery {
  id: string;
  merchant: string;
  payload: string;
  attempts: number;
}

const SCHEMA = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT NOT NULL) STRICT;
CREATE TABLE IF NOT EXISTS records (
  block_number INTEGER NOT NULL,
  extrinsic_index INTEGER NOT NULL,
  block_hash TEXT NOT NULL,
  tx_hash TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('payment', 'refund')),
  invoice_id TEXT NOT NULL,
  signer TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  fee_amount INTEGER,
  fee_asset INTEGER,
  PRIMARY KEY (block_number, extrinsic_index)
) STRICT;
CREATE INDEX IF NOT EXISTS records_signer ON records (signer, block_number);
CREATE INDEX IF NOT EXISTS records_invoice ON records (invoice_id);
CREATE INDEX IF NOT EXISTS records_tx ON records (tx_hash);
CREATE TABLE IF NOT EXISTS transfers (
  block_number INTEGER NOT NULL,
  extrinsic_index INTEGER NOT NULL,
  idx INTEGER NOT NULL,
  from_addr TEXT NOT NULL,
  to_addr TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  PRIMARY KEY (block_number, extrinsic_index, idx),
  FOREIGN KEY (block_number, extrinsic_index) REFERENCES records (block_number, extrinsic_index) ON DELETE CASCADE
) STRICT;
CREATE INDEX IF NOT EXISTS transfers_to ON transfers (to_addr, block_number);
CREATE TABLE IF NOT EXISTS webhooks (
  merchant TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  secret TEXT NOT NULL,
  signed_at INTEGER NOT NULL
) STRICT;
CREATE TABLE IF NOT EXISTS deliveries (
  id TEXT PRIMARY KEY,
  merchant TEXT NOT NULL,
  payload TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'delivered', 'failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  next_attempt_at INTEGER NOT NULL,
  last_error TEXT,
  delivered_at INTEGER
) STRICT;
CREATE INDEX IF NOT EXISTS deliveries_due ON deliveries (status, next_attempt_at);
CREATE TABLE IF NOT EXISTS terminals (
  id TEXT PRIMARY KEY,
  token_hash BLOB NOT NULL,
  merchant TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  charge_link TEXT,
  charge_expires_at INTEGER
) STRICT;
`;

/** Merchant view: payments that sent it stablecoin, and refunds it signed. */
const MERCHANT_KEYS = `
  SELECT block_number, extrinsic_index FROM transfers t
    WHERE t.to_addr = :who AND EXISTS (SELECT 1 FROM records r WHERE r.block_number = t.block_number AND r.extrinsic_index = t.extrinsic_index AND r.kind = 'payment' AND r.signer != :who)
  UNION
  SELECT block_number, extrinsic_index FROM records WHERE signer = :who AND kind = 'refund'`;

export class Store {
  readonly db: DatabaseSync;

  constructor(path: string) {
    if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
    this.db = new DatabaseSync(path);
    this.db.exec(SCHEMA);
  }

  close(): void {
    this.db.close();
  }

  /** Bind the database to one chain; refuses to mix data from another genesis or asset. */
  bindChain(genesisHash: string, assetId: number): void {
    const want = `${genesisHash}:${assetId}`;
    const have = this.getMeta("chain");
    if (have === null) this.setMeta("chain", want);
    else if (have !== want) throw new Error(`Database belongs to ${have}, not ${want}. Use a new INDEXER_DB.`);
  }

  nextBlock(startBlock: number): number {
    const v = this.getMeta("next_block");
    return v === null ? startBlock : Number(v);
  }

  /**
   * Store one scanned block and advance the cursor, atomically. Webhook
   * deliveries are written in the same transaction (outbox), so a crash can
   * neither lose nor duplicate an event.
   */
  applyBlock(block: ScannedBlock, toPayload: (rec: ChainRecord, merchant: string) => { id: string; payload: string }): void {
    this.tx(() => {
      const insRec = this.db.prepare(
        `INSERT OR IGNORE INTO records (block_number, extrinsic_index, block_hash, tx_hash, kind, invoice_id, signer, timestamp, fee_amount, fee_asset)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      );
      const insTr = this.db.prepare(`INSERT OR IGNORE INTO transfers (block_number, extrinsic_index, idx, from_addr, to_addr, amount) VALUES (?, ?, ?, ?, ?, ?)`);
      const hook = this.db.prepare(`SELECT 1 FROM webhooks WHERE merchant = ?`);
      const insDel = this.db.prepare(`INSERT OR IGNORE INTO deliveries (id, merchant, payload, status, next_attempt_at) VALUES (?, ?, ?, 'pending', ?)`);
      for (const r of block.records) {
        insRec.run(r.blockNumber, r.extrinsicIndex, r.blockHash, r.txHash, r.kind, r.invoiceId, r.signer, r.timestamp, r.fee?.amount ?? null, r.fee?.assetId ?? null);
        r.transfers.forEach((t, i) => insTr.run(r.blockNumber, r.extrinsicIndex, i, t.from, t.to, t.amount));
        for (const merchant of interestedParties(r)) {
          if (!hook.get(merchant)) continue;
          const { id, payload } = toPayload(r, merchant);
          insDel.run(id, merchant, payload, Date.now());
        }
      }
      this.setMeta("next_block", String(block.blockNumber + 1));
    });
  }

  merchantRecords(who: string, limit: number, beforeBlock?: number): StoredRecord[] {
    const rows = this.db
      .prepare(
        `SELECT r.* FROM records r JOIN (${MERCHANT_KEYS}) k USING (block_number, extrinsic_index)
         WHERE (:before IS NULL OR r.block_number < :before)
         ORDER BY r.block_number DESC, r.extrinsic_index DESC LIMIT :limit`,
      )
      .all({ who, before: beforeBlock ?? null, limit });
    return this.withTransfers(rows);
  }

  recentRecords(limit: number): StoredRecord[] {
    return this.withTransfers(this.db.prepare(`SELECT * FROM records ORDER BY block_number DESC, extrinsic_index DESC LIMIT ?`).all(limit));
  }

  /** All records for one invoice id (payments and refunds), oldest first. */
  invoiceRecords(invoiceId: string): StoredRecord[] {
    return this.withTransfers(this.db.prepare(`SELECT * FROM records WHERE invoice_id = ? ORDER BY block_number, extrinsic_index`).all(invoiceId));
  }

  stats(stableAssetId: number): Stats {
    const big = <T>(sql: string, ...p: SQLInputValue[]) => {
      const st = this.db.prepare(sql);
      st.setReadBigInts(true);
      return st.get(...p) as T;
    };
    // A swap payment first moves the stablecoin from the pool to the payer; only what leaves the payer is volume.
    const pay = big<{ n: bigint; vol: bigint | null; payers: bigint }>(
      `SELECT COUNT(*) n, (SELECT SUM(t.amount) FROM transfers t JOIN records r USING (block_number, extrinsic_index) WHERE r.kind = 'payment' AND t.to_addr != r.signer) vol,
              COUNT(DISTINCT signer) payers FROM records WHERE kind = 'payment'`,
    );
    const ref = big<{ n: bigint; vol: bigint | null }>(
      `SELECT COUNT(DISTINCT r.tx_hash) n, SUM(t.amount) vol FROM records r JOIN transfers t USING (block_number, extrinsic_index) WHERE r.kind = 'refund'`,
    );
    // The merchant is the first recipient other than the payer (the platform share comes after it).
    const merchants = big<{ n: bigint }>(
      `SELECT COUNT(DISTINCT t.to_addr) n FROM transfers t JOIN records r USING (block_number, extrinsic_index)
       WHERE r.kind = 'payment' AND t.idx = (SELECT MIN(t2.idx) FROM transfers t2
         WHERE t2.block_number = t.block_number AND t2.extrinsic_index = t.extrinsic_index AND t2.to_addr != r.signer)`,
    );
    const fees = big<{ n: bigint; amt: bigint | null }>(`SELECT COUNT(*) n, SUM(fee_amount) amt FROM records WHERE fee_asset = ?`, stableAssetId);
    const nativeFees = big<{ n: bigint }>(`SELECT COUNT(*) n FROM records WHERE fee_amount IS NOT NULL AND fee_asset IS NULL`);
    const otherFees = big<{ n: bigint }>(`SELECT COUNT(*) n FROM records WHERE fee_asset IS NOT NULL AND fee_asset != ?`, stableAssetId);
    const range = big<{ lo: bigint | null; hi: bigint | null }>(`SELECT MIN(block_number) lo, MAX(block_number) hi FROM records`);
    return {
      payments: Number(pay.n),
      volume: pay.vol ?? 0n,
      refunds: Number(ref.n),
      refunded: ref.vol ?? 0n,
      payers: Number(pay.payers),
      merchants: Number(merchants.n),
      stableFees: { count: Number(fees.n), amount: fees.amt ?? 0n },
      nativeFeeCount: Number(nativeFees.n),
      otherAssetFeeCount: Number(otherFees.n),
      firstBlock: range.lo === null ? null : Number(range.lo),
      lastBlock: range.hi === null ? null : Number(range.hi),
    };
  }

  getWebhook(merchant: string): Webhook | null {
    const row = this.db.prepare(`SELECT merchant, url, secret, signed_at FROM webhooks WHERE merchant = ?`).get(merchant) as
      | { merchant: string; url: string; secret: string; signed_at: number }
      | undefined;
    return row ? { merchant: row.merchant, url: row.url, secret: row.secret, signedAt: row.signed_at } : null;
  }

  putWebhook(w: Webhook): void {
    this.db
      .prepare(`INSERT INTO webhooks (merchant, url, secret, signed_at) VALUES (?, ?, ?, ?) ON CONFLICT (merchant) DO UPDATE SET url = excluded.url, secret = excluded.secret, signed_at = excluded.signed_at`)
      .run(w.merchant, w.url, w.secret, w.signedAt);
  }

  deleteWebhook(merchant: string): void {
    this.tx(() => {
      this.db.prepare(`DELETE FROM webhooks WHERE merchant = ?`).run(merchant);
      this.db.prepare(`UPDATE deliveries SET status = 'failed', last_error = 'webhook removed' WHERE merchant = ? AND status = 'pending'`).run(merchant);
    });
  }

  dueDeliveries(now: number, limit: number): Delivery[] {
    return this.db
      .prepare(`SELECT id, merchant, payload, attempts FROM deliveries WHERE status = 'pending' AND next_attempt_at <= ? ORDER BY next_attempt_at LIMIT ?`)
      .all(now, limit) as unknown as Delivery[];
  }

  markDelivered(id: string, now: number): void {
    this.db.prepare(`UPDATE deliveries SET status = 'delivered', delivered_at = ?, attempts = attempts + 1, last_error = NULL WHERE id = ?`).run(now, id);
  }

  markFailedAttempt(id: string, error: string, nextAttemptAt: number | null): void {
    this.db
      .prepare(`UPDATE deliveries SET attempts = attempts + 1, last_error = ?, status = CASE WHEN ? IS NULL THEN 'failed' ELSE 'pending' END, next_attempt_at = COALESCE(?, next_attempt_at) WHERE id = ?`)
      .run(error.slice(0, 500), nextAttemptAt, nextAttemptAt, id);
  }

  deliveryStatus(merchant: string, limit: number): { id: string; status: string; attempts: number; lastError: string | null; deliveredAt: number | null }[] {
    return (
      this.db
        .prepare(`SELECT id, status, attempts, last_error, delivered_at FROM deliveries WHERE merchant = ? ORDER BY rowid DESC LIMIT ?`)
        .all(merchant, limit) as { id: string; status: string; attempts: number; last_error: string | null; delivered_at: number | null }[]
    ).map((d) => ({ id: d.id, status: d.status, attempts: d.attempts, lastError: d.last_error, deliveredAt: d.delivered_at }));
  }

  createTerminal(t: { id: string; tokenHash: Buffer; merchant: string; createdAt: number }): void {
    this.db.prepare(`INSERT INTO terminals (id, token_hash, merchant, created_at) VALUES (?, ?, ?, ?)`).run(t.id, t.tokenHash, t.merchant, t.createdAt);
  }

  getTerminal(id: string): Terminal | null {
    const row = this.db.prepare(`SELECT id, token_hash, merchant, charge_link, charge_expires_at FROM terminals WHERE id = ?`).get(id) as
      | { id: string; token_hash: Uint8Array; merchant: string; charge_link: string | null; charge_expires_at: number | null }
      | undefined;
    if (!row) return null;
    return {
      id: row.id,
      tokenHash: Buffer.from(row.token_hash),
      merchant: row.merchant,
      charge: row.charge_link === null || row.charge_expires_at === null ? null : { link: row.charge_link, expiresAt: row.charge_expires_at },
    };
  }

  /** Set (or clear, with null) the charge a terminal's NFC tag currently points to. */
  setTerminalCharge(id: string, charge: { link: string; expiresAt: number } | null): void {
    this.db.prepare(`UPDATE terminals SET charge_link = ?, charge_expires_at = ? WHERE id = ?`).run(charge?.link ?? null, charge?.expiresAt ?? null, id);
  }

  private withTransfers(rows: unknown[]): StoredRecord[] {
    const tr = this.db.prepare(`SELECT from_addr, to_addr, amount FROM transfers WHERE block_number = ? AND extrinsic_index = ? ORDER BY idx`);
    tr.setReadBigInts(true);
    return (rows as RecordRow[]).map((r) => ({
      kind: r.kind,
      invoiceId: r.invoice_id,
      txHash: r.tx_hash,
      blockNumber: r.block_number,
      blockHash: r.block_hash,
      extrinsicIndex: r.extrinsic_index,
      signer: r.signer,
      timestamp: r.timestamp,
      fee: r.fee_amount === null ? null : { amount: BigInt(r.fee_amount), assetId: r.fee_asset },
      transfers: (tr.all(r.block_number, r.extrinsic_index) as { from_addr: string; to_addr: string; amount: bigint }[]).map(
        (t): StableTransfer => ({ from: t.from_addr, to: t.to_addr, amount: t.amount }),
      ),
    }));
  }

  private getMeta(key: string): string | null {
    const row = this.db.prepare(`SELECT value FROM meta WHERE key = ?`).get(key) as { value: string } | undefined;
    return row?.value ?? null;
  }

  private setMeta(key: string, value: string): void {
    this.db.prepare(`INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value`).run(key, value);
  }

  private tx(fn: () => void): void {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      fn();
      this.db.exec("COMMIT");
    } catch (e) {
      this.db.exec("ROLLBACK");
      throw e;
    }
  }
}

interface RecordRow {
  block_number: number;
  extrinsic_index: number;
  block_hash: string;
  tx_hash: string;
  kind: "payment" | "refund";
  invoice_id: string;
  signer: string;
  timestamp: number;
  fee_amount: number | bigint | null;
  fee_asset: number | null;
}

/** Who gets a webhook for this record: every recipient of a payment, or the merchant that signed a refund. */
export function interestedParties(r: ChainRecord): string[] {
  return r.kind === "refund" ? [r.signer] : [...new Set(r.transfers.map((t) => t.to).filter((to) => to !== r.signer))];
}
