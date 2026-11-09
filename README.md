# Alt3rEdit

**Alt3rEdit** — community-maintained fork of BetterEdit for the Geometry Dash editor. The project combines editor quality-of-life tools with additional features and an integrated multiplayer mode.

> [!NOTE]
> This branch targets **Geometry Dash with Geode SDK 5.11.2**. It is an integration/development branch; platform builds and in-game behavior still need to be verified before treating it as a stable release.

## Features

- Improved editor menus and workflows.
- Enhanced color, font, movement, and view controls.
- Custom grid sizes, UI scaling, and editor keybinds.
- Formula Tool (`f(x)`) for mathematical object placement and transformations.
- Multiplayer sessions with room browsing, synchronization, chat, player cursors, and session status.
- Multiplayer-related undo/revert and remote-action handling.

Multiplayer availability depends on compatible server/signaling infrastructure and may be subject to change while this integration is being tested.

## Installation

Install Geode for your Geometry Dash version, then install Alt3rEdit from a compatible Geode index/release when one is published.

This development branch is not guaranteed to have a published package. Building from source requires the Geode SDK **v5.11.2** and the dependencies configured in `CMakeLists.txt`.

## Bug reports and suggestions

Please open an issue in the [Alt3rEdit repository](https://github.com/djdhsvsbdb-design/Alt3rEdit/issues). Include:
- Geometry Dash version and platform.
- Geode version.
- Alt3rEdit version or commit.
- Steps to reproduce the issue and relevant logs.

For multiplayer issues, also include whether the problem occurs while joining a room, synchronizing a level, or using chat/cursors. Do not post passwords, access tokens, or other private credentials.

## Credits

Alt3rEdit builds on the original [BetterEdit](https://github.com/HJfod/BetterEdit) project and incorporates the Formula Tool and multiplayer work maintained in the Alt3rEdit/MPEdit code lineage. Multiplayer upstream attribution and permission details are recorded in [MULTIPLAYER_NOTICE.md](MULTIPLAYER_NOTICE.md).

## License

Alt3rEdit retains the upstream project's **LGPL-3.0** licensing terms. See [LICENSE](LICENSE) and the notices accompanying imported components for details.
