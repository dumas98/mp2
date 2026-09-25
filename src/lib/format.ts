const wholeDollars = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const withCents = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

// Cents only matter on cheap items: $9.99, but $1,100 rather than $1,099.99
export function formatPrice(amount: number): string {
  return amount >= 100 ? wholeDollars.format(amount) : withCents.format(amount)
}

const shortDate = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

// "2025-04-30T09:41:02.053Z" -> "Apr 30, 2025"
export function formatDate(isoDate: string): string {
  return shortDate.format(new Date(isoDate))
}
