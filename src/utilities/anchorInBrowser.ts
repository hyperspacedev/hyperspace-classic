/**
 * Changes anchor tags by transferring href properties to onClick.
 * Used to determine whether a link should be opened via Electron's shell
 * or by the standard window functionality.
 */
export function anchorInBrowser() {
    const links = document.querySelectorAll('a[href]');

    Array.prototype.forEach.call(links, (link: HTMLAnchorElement) => {
        const url = link.getAttribute('href') || "";
        if (url.indexOf('http') === 0) {
            link.setAttribute("onclick", "openInBrowser(\"" + link.href + "\");");
            link.removeAttribute("href");
            link.classList.add("clickable-link");
        }
    });
}