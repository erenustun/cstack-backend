export type SortDir = 'ASC' | 'DESC'
export type SortOption = 'price' | 'rating'

export const SORT_DIR = { ASC: 'ASC' as SortDir, DESC: 'DESC' as SortDir }
export const SORT_OPTION = {
  PRICE: 'price' as SortOption,
  RATING: 'rating' as SortOption,
}
