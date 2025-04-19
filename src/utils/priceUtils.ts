/**
 * Utility functions for handling price conversions between string and number formats
 * This ensures consistent handling of prices throughout the application
 */

/**
 * Convert a price from any format (string or number) to a string
 * @param price - The price value to convert to string
 * @returns The price as a formatted string
 */
export function ensurePriceString(price: string | number): string {
  if (typeof price === 'number') {
    return price.toString();
  }
  return price;
}

/**
 * Convert a price from any format (string or number) to a number
 * @param price - The price value to convert to number
 * @returns The price as a number
 */
export function ensurePriceNumber(price: string | number): number {
  if (typeof price === 'string') {
    return parseFloat(price);
  }
  return price;
}

/**
 * Validate if a price is a valid positive number
 * @param price - The price value to validate
 * @returns True if the price is valid
 */
export function isValidPrice(price: string | number): boolean {
  const priceNum = typeof price === 'string' ? parseFloat(price) : price;
  return !isNaN(priceNum) && priceNum > 0;
}

/**
 * Convert a price to Stripe's format (cents)
 * @param price - The price value in dollars/euros
 * @returns The price in cents for Stripe API
 */
export function convertPriceToStripeCents(price: string | number): number {
  const priceNum = typeof price === 'string' ? parseFloat(price) : price;
  return Math.round(priceNum * 100);
}