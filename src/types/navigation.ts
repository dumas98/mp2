// Carried in the router state of every product link, so the detail page can
// step through the list the shopper came from (previous / next).
export interface BrowseState {
  // Product IDs of that list, in the order it was shown
  ids: number[]
  // URL of that list, including its search and filters, for "Back to results"
  from: string
  // Wording of the back link, e.g. "Back to deals"; "Back to results" if left out
  label?: string
}
