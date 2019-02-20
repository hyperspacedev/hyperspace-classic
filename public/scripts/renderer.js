if (navigator.userAgent.includes("Electron")) {
    const { remote } = require('electron')
    const { Menu } = remote

    const contextItems = [
        {
            label: "Cut",
            role: 'cut'
        },
        {
            label: "Copy",
            role: 'copy'
        },
        {
            label: "Paste",
            role: 'paste'
        },
        {
            type: 'separator'
        },
        {
            label: "Search",
            click () {
                let query = window.getSelection().toString();
                remote.shell.openExternal('https://duckduckgo.com/?q=' + query);
            }
        }
    ]

    const menu = new Menu.buildFromTemplate(contextItems);

    window.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      menu.popup({ window: remote.getCurrentWindow() })
    }, false)
  }