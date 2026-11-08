# Tinker integration plan

## Target

Integrate the Tinker editor feature set into Alt3rEdit as native features, not as a second independently loaded Geode mod. Work is being done on `feature/tinker-integration`; the existing `v6` branch is not modified.

## Upstream and license

- Upstream source: https://github.com/djdhsvsbdb-design/Tinker
- Upstream project: Tinker by Alphalaneous
- License: GPL-3.0 (retain the complete license and copyright notices for imported/derived files).
- Tinker identifies its upstream source as https://github.com/Alphalaneous/Tinker.

Because the imported code is GPL-3.0, the combined distribution and source must satisfy GPL-3.0. The repository's existing LGPL notices do not replace Tinker's license obligations.

## Compatibility blockers found

| Area | Alt3rEdit | Tinker | Integration consequence |
|---|---|---|---|
| Geode SDK | 5.6.1 | 5.10.1 | Tinker APIs must be checked against the target SDK or the project SDK upgraded deliberately. |
| C++ | C++20 | C++23 | Tinker uses C++23 library/language facilities; port or raise the project standard. |
| Editor hooks | Existing hooks in EditorUI, EditorPauseLayer, LevelEditorLayer, etc. | Central MainEditorUI/MainLevelEditorLayer hooks plus per-module hooks | Merge hook responsibilities carefully; avoid duplicate $modify implementations with conflicting overrides. |
| Dependencies | node-ids 1.21.0, gmd-api 1.5.0, level-id-api 2.0.0, editortab_api 2.0.3 | node-ids 1.23.3, good_grid, alphas_geode_utils, alphas-ui-pack, editortab_api 2.1.11, level-storage-api, better-touch-prio, imageplus, plus optional integrations | Resolve version and dependency requirements before enabling modules. |

## Planned migration order

1. Establish the shared module/event/settings lifecycle and adapt it to Alt3rEdit's existing editor hooks.
2. Port self-contained editor quality-of-life features and fixes first.
3. Port features with external API dependencies (object search, custom tabs, reference images, object collaboration) only after their dependencies are reconciled.
4. Reconcile duplicate functionality with Alt3rEdit (zoom text, UI scaling, editor touch fixes, color/edit menus) rather than loading both implementations.
5. Merge settings and resources with unique IDs; preserve the existing Alt3rEdit settings and assets.
6. Build and test on each supported target before considering the migration complete.

## Initial feature inventory

Potentially useful Tinker areas include canvas rotation, object search, start-position tools, duration dragging, multi-text editing, object summary, live colors, reference images, scrollable objects, improved group view, editor grid customization, and editor bug fixes.

The inventory is not a promise that every feature can be enabled unchanged. Each feature must pass API, hook-conflict, dependency, and build checks.

## Validation status

- Repository trees and project manifests inspected.
- Compatibility differences recorded above.
- Complete upstream Tinker repository is now pinned as a Git submodule at `third_party/Tinker` (commit `270d61e8c1f4d6fa29d47214f3e99a2eb670d82d`); `.gitmodules` records the source URL.
- The submodule preserves all upstream files, assets, metadata, settings, and unfinished experiments without flattening or overwriting Alt3rEdit files.
- This is a source import/staging step only: Tinker is not yet compiled into Alt3rEdit, its settings/resources are not merged, and no successful build is claimed.
