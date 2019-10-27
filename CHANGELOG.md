## 0.2.1 (October 27, 2019)
- `FEATURE` Add viewMode to Game constructor options.
- `FEATURE` Add Tween class.

## 0.2.0 (October 21, 2019)
- `BUGFIX` Changed KeyInput.keyReturn to KeyInput.keyEnter.
- `BUGFIX` Changed KeyInput.getASCII to KeyInput.getCharacter.
- `FEATURE` Added state-aware input usable via `input.on(...).bindTo(state)`.
- `FEATURE` Added `off` function to Input for event deregistration.
- `FEATURE` Added `line` function to Render.
- `FEATURE` Added `pointInCircle` function.
- `FEATURE` Added `coinFlip` function.
- `FEATURE` Changed game loop to fixed time step loop.
- `BUGFIX` Fixed a bug where a single state could be initialized multiple times when states were provided through `gameStates` in the Game constructor.

## 0.1.3 (January 31, 2019)
- `FEATURE` Moved surface clearing from library to user side.

## 0.1.2 (April 1, 2018)
- `FEATURE` Changed how assets are processed and retreived in `AssetLoader` - `get` now understands categories. Added `from` function for easier asset retreival and removed obsolete `acquire` function.

## 0.1.0 (March 31, 2018)
- Initial commit