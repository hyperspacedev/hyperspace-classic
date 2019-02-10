# Hyperspace
A fluffy client for Mastodon

![Hyperspace screenshot](screenshot.png)

Hyperspace is a client for Mastodon and the fediverse written in ReactJS. It aims to provide a clean, simple, and fun interface for interacting with Mastodon instances.

## Building from source

To get the packages and environment set up, run `npm install`. Most commands and scripts derive from `create-react-app` and should be easy enough to use.

```bash
npm install
npm run build
serve build
```

### Building desktop versions
If you wish to build the desktop versions of Hyperspace, it is recommended to run `build-electron` instead of `npm run build`. This will build for Windows, macOS, and Linux.

Alternatively, you can run any of these commands to build for your specific platform:

- `build-electron-darwin` - build only for macOS
- `build-electron-win` - build only for Windows
- `build-electron-linux` - build only for Linux distributions (rpm,deb,AppImage)
- `build-electron-linux -- <package type>` - where `<package type>` is `rpm`,`deb`, or `appimage` to build the specific package type

> Note: Ensure you have code-signing certificates ready. `electron-builder` should automatically detect them and code-sign your apps for you.

## Modules used
Hyperspace makes use of the following modules and components to make it as fluffy as possible:

- `megalodon` - the handler for Mastodon API calls
- `office-ui-fabric-react` - React components from Microsoft that offer Modern/Fluent design
- `@uifabric/icons` - Icon pack that goes with Fabric UI
- `moment` - for date formatting
- `node-sass` - for compiling the Sass files needed
- `electron` - for making the desktop versions
- `emoji-picker-react` - for adding an emoji picker

## Licensing
The Hyperspace project itself is licensed under the GNU Lesser General Public License, though some components are licensed under other free-software licenses such as the MIT License and GNU GPL.