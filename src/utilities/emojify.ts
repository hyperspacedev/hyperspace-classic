import {Emoji, MastodonEmoji} from '../types/Emojis';

/**
 * Takes a given string and inserts the correct emoji elements.
 * @param content The HTML string to locate and replace emojis with
 * @param extraEmojis Any additional emojis that should be rendered
 * @returns HTML string with emojis as `img` elements
 */
export function emojifyHTML(content: string, extraEmojis?: [MastodonEmoji]): string {
    const div = document.createElement('div');
    let html = content;
    let emojis: [Emoji] = JSON.parse(localStorage.getItem("emojis") as string);
    if (emojis !== null) {
        emojis.forEach((emoji: Emoji) => {
            let regexp = new RegExp(':' + emoji.name + ':', 'g');
            html = html.replace(regexp, `<img src="${emoji.imageUrl}" class="emoji"/>`);
        });
    }
    if (extraEmojis !== undefined && extraEmojis.length > 0) {
        extraEmojis.forEach((emoji: MastodonEmoji) => {
            let regexp = new RegExp(':' + emoji.shortcode + ':', 'g');
            html = html.replace(regexp, `<img src="${emoji.static_url}" class="emoji"/>`)
        })
    }
    
    div.innerHTML = html;
    return div.innerHTML;
}