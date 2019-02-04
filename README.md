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

> Note: if you want to build the desktop version, run `npm run build-electron` instead of `npm run build`.

## Modules used
Hyperspace makes use of the following modules and components to make it as fluffy as possible:

- `megalodon` - the handler for Mastodon API calls
- `office-ui-fabric-react` - React components from Microsoft that offer Modern/Fluent design
- `@uifabric/icons` - Icon pack that goes with Fabric UI
- `moment` - for date formatting
- `node-sass` - for compiling the Sass files needed
- `electron` - for making the desktop versions