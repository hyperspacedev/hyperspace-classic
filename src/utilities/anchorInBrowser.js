export function anchorInBrowser() {
    const links = document.querySelectorAll('a[href]');

    Array.prototype.forEach.call(links, (link) => {
        const url = link.getAttribute('href');
        if (url.indexOf('http') === 0) {
            link.setAttribute("onclick", "openInBrowser(\"" + link.href + "\");");
            link.href = "";
        }
    });
}