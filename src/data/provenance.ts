export type ContentStatus = "verified" | "reviewed" | "unverified" | "needs_refresh"

export interface Provenance {
  source: string // human-readable origin collection/document
  sourceUrl?: string // http(s) URL, or repo-relative path that must exist
  owner: string // responsible maintainer, e.g. "research-atlas"
  status: ContentStatus // verified = checked against rubric+sources; reviewed = human-read; unverified = imported, not yet reviewed; needs_refresh = known stale
  addedAt: string // ISO date content entered the repo
  reviewedAt?: string // ISO date of last human review; omit if never reviewed
}

export const STALE_AFTER_DAYS = 365
