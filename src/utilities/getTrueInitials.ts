import {getInitials} from '@uifabric/utilities/lib/initials.js';

/**
 * Forcibly get initials for a given name, even if they do not contain
 * Latin characters.
 * 
 * @param name The name to search initials for.
 * @returns A string containing the initials for the given name or 'MU'
 */
export function getTrueInitials(name: string) {
    try {
        return getInitials(name, false);
    } catch (err) {
        console.warn(`Characters in ${name} may not be Latin! Defaulting to 'MU'.`);
        return 'MU';
    }
}