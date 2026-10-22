/**
 * The exact text a merchant signs to set (url) or remove (url = "") its
 * webhook with an indexer. Shared by the app (signer) and the indexer (verifier).
 */
export function webhookRegistrationMessage(merchant: string, url: string, signedAt: number): string {
  return `stabletap:webhook:v1\nmerchant:${merchant}\nurl:${url}\nsignedAt:${signedAt}`;
}
