/**
 * Checks localStorage and returns the list of classes
 * to append for a 'dark mode'.
 * @returns 'dark' or an empty string
 */
export function getDarkMode() {
    if (localStorage.getItem('prefers-dark-mode') === "true") {
        return 'dark';
    } else {
        return '';
    }
}