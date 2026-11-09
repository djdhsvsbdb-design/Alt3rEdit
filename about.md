# Alt3rEdit

Alt3rEdit is a community-maintained Geometry Dash editor enhancement mod. It builds on BetterEdit and adds further editor utilities, workflow improvements, and an integrated multiplayer feature set.

## Features

- Improved color, font, and movement menus.
- View controls and editor quality-of-life improvements.
- Scroll-wheel improvements and custom grid sizes.
- Group ID offset controls.
- Pinch-to-zoom on supported mobile devices.
- Customizable editor UI scaling and keybinds.
- Formula Tool (`f(x)`) for applying mathematical expressions to selected objects, with reusable presets and scale/HSV controls.
- Multiplayer rooms, player cursors, chat, session status, and level synchronization.
- Multiplayer undo/revert handling and remote actions.

Some multiplayer capabilities require compatible server and signaling services. Availability and behavior may change during development.

## Compatibility

The multiplayer integration branch is configured for **Geode SDK 5.11.2**. Compatibility with a particular Geometry Dash platform/build should be confirmed against the corresponding release and CI build before installation.

## Restoring old BetterEdit backups

Pre-2.206 versions of BetterEdit relied on the now-defunct BetterSave mod to create backups for levels. If you have backups from this time you'd like to restore, locate the old backups at `<GD Save Directory>/levels/<level-string-id>/backups`, and then move them to `<GD Save Directory>/betteredit-level-backups/<level-numeric-id>/backups`.

The string ID (`<level-string-id>`) of a level is likely very close to its name except converted to kebab-case. The numeric ID (`<level-numeric-id>`) can be seen in-game in the created levels list by enabling the `Show IDs in Search` option from the Editor Level ID API mod.
