/**
 * Utility function to format a date to a readable string.
 * @param date - The date to format.
 * @returns A formatted date string.
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Utility function to generate a unique identifier.
 * @returns A unique identifier string.
 */
export function generateUniqueId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Utility function to capitalize the first letter of a string.
 * @param str - The string to capitalize.
 * @returns The capitalized string.
 */
export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Utility function to conditionally join class names.
 * @param classes - An array of class names.
 * @returns A string of joined class names.
 */
export function cn(...classes: string[]): string {
  return classes.filter(Boolean).join('');
}