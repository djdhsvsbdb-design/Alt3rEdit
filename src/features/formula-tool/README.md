# Formula Object Tool

This feature adds formula-driven placement and transformation of selected Geometry Dash editor objects.

## Opening the tool

Select one or more objects in the editor and click **f(x)** in the edit toolbar.

## Formula fields

- Position X/Y and rotation are evaluated for each parameter value `t`.
- Amount controls how many copies are generated (1–500).
- Start and End define the parameter interval.
- Scale and HSV dialogs add per-copy transformations.
- Options control absolute scaling/rotation, angle units, position units, and whether originals are removed.
- Presets can be created, loaded, copied to the clipboard, and deleted.

Expressions support arithmetic, parentheses, exponentiation, the variable `t`, `pi`, and functions including trigonometric, logarithmic, rounding, min/max, and random functions.

## Attribution and license

The initial implementation is based on **Prosto-bob**, a fork of Functional by zowepsilon.

- Source: https://github.com/djdhsvsbdb-design/Prosto-bob
- Original author credit: zowepsilon
- The imported implementation is distributed under the MIT License. See [LICENSE-MIT](LICENSE-MIT).

Alt3rEdit's existing source and license remain unchanged.
