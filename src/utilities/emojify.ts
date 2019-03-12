import {Emoji} from '../types/Emojis';

/**
 * Takes a given string and inserts the correct emoji elements.
 * @param content The HTML string to locate and replace emojis with
 * @returns HTML string with emojis as `img` elements
 */
export function emojifyHTML(content: string): string {
    const div = document.createElement('div');
    let html = content;
    let emojis: [Emoji] = JSON.parse(localStorage.getItem("emojis") as string);
    emojis.forEach((emoji: Emoji) => {
        let regexp = new RegExp(':' + emoji.name + ':', 'g');
        html = html.replace(regexp, `<img src="${emoji.imageUrl}" class="emoji"/>`);
    });
    div.innerHTML = html;
    return div.innerHTML;
}