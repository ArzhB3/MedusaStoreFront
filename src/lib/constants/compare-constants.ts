/**
 * Global
 */
export const MIN_COMPARED_PRODUCTS = 2
export const MAX_COMPARED_PRODUCTS = 3
export const COMPARED_PRODUCTS_KEY = "compared_products_list"
export const COMPARED_PRODUCTS_REFRESH_THRESHOLD = 1000 * 60 * 30 // 30 minutes

/**
 * Toast Messages
 */
export const COMPARE_TOAST = {
  ADDED: {
    TITLE: "Compared product added",
    DESCRIPTION: (productTitle: string) =>
      `${productTitle} has been added to the comparison list`,
  },
  REMOVED: {
    TITLE: "Compared product removed",
    DESCRIPTION: (productTitle: string) =>
      `${productTitle} has been removed from the comparison list`,
  },
}

/**
 * Errors (Messages for UI feedback)
 */
export const ERROR_COMPARE_MESSAGE = {
  PRODUCT_MISSING_ID: "Cannot process product in comparison list.",
  PRODUCT_LIMIT_REACHED: `You can compare up to ${MAX_COMPARED_PRODUCTS} products at a time.`,
  PRODUCT_REFRESH_FAILED: "Unable to refresh product details for comparison.",
  STORAGE_LOAD_FAILED: "Unable to load comparison list.",
  STORAGE_SAVE_FAILED: "Unable to save comparison list.",
  STORAGE_SYNC_FAILED: "Unable to synchronize comparison list between tabs.",
}

/**
 * Error Page (Messages for UI feedback)
 */
export const ERROR_COMPARE_PAGE = {
  FALLBACK_MESSAGE:
    "We encountered an issue while trying to compare these products.",
}
