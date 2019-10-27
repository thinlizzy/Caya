![Caya](/logo.png?raw=true)

Caya is a lightweight HTML5 game development toolkit intended for 2D game development.

Version 0.2.1

## Features

- Single file (minified: 14.7KB) with zero external dependencies
- Supports all modern browsers (IE11/Edge/Firefox/Opera/Chrome/Safari)
- Easy to use API - most features are simple, reusable classes
- State based
- Asset management
- Keyboard and mouse or touch input
- [And much more! :)](HOWTO.md)

## Reference and Quick start guide

Please see [HOWTO.md](HOWTO.md). See documentation for API reference.

## Minimal example

```javascript
// create a game state
var myState = new caya.State();

// draw some shapes
myState.draw = function() {
	this.surface.clear();
	this.paint.rectFill(10, 10, 50, 20, 'red');
	this.paint.circleFill(100, 30, 20, 'blue');
};

// setup game
var myGame = new caya.Game({
	canvasId: 'myCanvasID', // canvas element ID
	state: myState, // initial game state
	simpleLoop: true // just draw and never call myState.update()
});

// run game on window load
window.addEventListener('load', myGame.run);
```

## Future plans

- More general math, geometry, randomness related functions
- More general purpose classes
- More render functions
- Utils (caya.UI, caya.level, ...)
- More demos

## Credits

- [howler.js](https://howlerjs.com/) - awesome audio library used in some examples and demos
- [QUnit](https://qunitjs.com/) - unit testing framework

## License

Copyright (c) 2019 Danijel Durakovic

MIT License
