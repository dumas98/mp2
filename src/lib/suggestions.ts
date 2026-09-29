import { departmentOf } from '../data/departments.ts'
import type { Product } from '../types/product.ts'
import { matchesQuery } from './filtering.ts'

export interface SuggestionResult {
  // The best few matches, shown in the header dropdown
  items: Product[]
  // Every match in the same order, so previous / next can continue past the dropdown
  matches: Product[]
  // matches.length, for "See all 13 results"
  total: number
}

// 0: the name starts with the text ("iph" -> "iPhone 6")
// 1: a word in the name starts with it ("iph" -> "Apple iPhone Charger")
// 2: it appears somewhere else (brand, category, middle of a word)
function matchRank(title: string, query: string): number {
  const lowerTitle = title.toLowerCase()
  if (lowerTitle.startsWith(query)) return 0
  const firstWord = query.split(/\s+/)[0]
  if (lowerTitle.split(/\s+/).some((word) => word.startsWith(firstWord))) return 1
  return 2
}

// Header search suggestions, optionally within one department. Uses the same
// matching as Shop all, so "See all results" shows exactly these and more.
export function searchSuggestions(
  products: Product[],
  query: string,
  departmentSlug = '',
  limit = 6,
): SuggestionResult {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return { items: [], matches: [], total: 0 }

  const found = products.filter(
    (p) =>
      (!departmentSlug || departmentOf(p.category)?.slug === departmentSlug) && matchesQuery(p, normalized),
  )

  const matches = found
    .map((product) => ({ product, rank: matchRank(product.title, normalized) }))
    .sort((a, b) => a.rank - b.rank || b.product.rating - a.product.rating || a.product.title.localeCompare(b.product.title))
    .map((r) => r.product)

  return { items: matches.slice(0, limit), matches, total: matches.length }
}

export interface HighlightPart {
  text: string
  match: boolean
}

// Splits a name into parts so the typed text can be wrapped in <mark>,
// e.g. "iPhone 6" with "iph" -> [iPh][one 6]. Tries the whole query first,
// then its first word.
export function splitHighlight(text: string, query: string): HighlightPart[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return [{ text, match: false }]

  const lower = text.toLowerCase()
  let needle = normalized
  let index = lower.indexOf(needle)
  if (index === -1) {
    needle = normalized.split(/\s+/)[0]
    index = lower.indexOf(needle)
  }
  if (index === -1) return [{ text, match: false }]

  return [
    { text: text.slice(0, index), match: false },
    { text: text.slice(index, index + needle.length), match: true },
    { text: text.slice(index + needle.length), match: false },
  ].filter((part) => part.text.length > 0)
}
