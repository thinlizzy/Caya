# Caya Reference

## Contents

- [Introduction](#introduction)
- [Quick start guide](#quick-start-guide)
- [Classes](#classes)
   - [Game](#game)
   - [State](#state)
   - [Render](#render)
   - [Surface](#surface)
   - [Input](#input)
   - [KeyInput](#keyinput)
   - [AssetLoader](#assetloader)
   - [Grid2D](#grid2d)
   - [Timer](#timer)
   - [Configuration](#configuration)
   - [Font](#font)
- [Other functions](#other-functions)
   - [General purpose](#general-purpose)
   - [Math and randomness](#math-and-randomness)

## Introduction

This library provides a collection of classes and functions that aim to simplify some of the heavy-lifting involved in implementing simple 2D games using HTML5. It aims to be lightweight and provide a clear API that's both powerful and easy to use, and lets you focus on game logic instead of working with all the technical details behind the scenes.

This engine is still in ongoing development. The release version is stable but the API may change in future releases.

## Quick start guide

To get started, create a HTML file with your favorite HTML5 template and add a canvas element to it:

```HTML
<canvas id="myCanvasID" width="500" height="400"></canvas>
```

Include Caya and the associated scripts for your game to the HTML:

```HTML
<script src="path/to/caya.min.js"></script>
<script src="path/to/game.js"></script>
```

You can now use Caya in your code! Hooray! All we need to create a basic Caya game is a game state and the game definition.

Put the following code in your JavaScript file:

```JavaScript
// create a game state
var myState = new caya.State();

// state draw function
myState.draw = function() {
	// draw a red square
	this.paint.rectFill(10, 10, 50, 50, 'red');
};

// setup the game
var myGame = new caya.Game({
	canvasId: 'myCanvasID',
	state: myState,
	simpleLoop: true
});

// run the game when window finishes loading
window.addEventListener('load', myGame.run);
```

That's it! Your first Caya game is complete. If you run it in your browser, you will see a nice red square displayed on your canvas.

A game state represents a single segment of the game, or a screen. You may for example create one state for the game menu, another for the actual game, yet another for story screen, and so on. In the code above, we're using the state's `draw` function to paint to the screen. This function gets called by the Game object whenever this particular state is active. Note the `state: myState` line which informs the engine that we would like `myState` to be the initial state for when the game runs. This argument is needed for the game to run and is not optional. Once running, we may change the game state using `myGame.setState(nextState)`.

Note the line that reads `simpleLoop: true`. This informs the engine that we would like to make a game where we don't care for logic updates, we only want to draw to the screen. Defining this flag will make the engine run an alternate game loop that's optimized for this mode. Use it if your game relies on user input to "push" the game forward. You will need to code your own timer and transition functions to support animations in this mode. To avoid entering this mode, simpy skip the definition.

What if we want to make a simple animation instead? Let's define both update and draw functions for our state, and let's use a regular loop for our game:

```JavaScript
// create a game state
var myState = new caya.State();

// state init function
// gets called once as the state initializes
myState.init = function() {
	// initialize all our goodies here
	this.rotation = 0;
};

// state draw function
myState.draw = function() {
	// draw a blue circle
	var circle_x = 50 * Math.cos(this.rotation) + 200;
	var circle_y = 50 * Math.sin(this.rotation) + 200;
	this.paint.circleFill(circle_x, circle_y, 30, 'blue');
};

// state update function
myState.update = function(dt) {
	// dt is time elapsed in milliseconds since previous update
	// increase rotation
	var speed = 0.1;
	this.rotation += speed * dt;
};

// setup the game
var myGame = new caya.Game({
	canvasId: 'myCanvasID',
	state: myState
});

// run the game when window finishes loading
window.addEventListener('load', myGame.run);
```

This will display a blue circle orbiting around a central point. Note the `init` function, which is meant for initialization of variables and preparation of data. This function is called once as the state is being initialized. This happens automatically when the state is entered into for the first time, or you can initialize states manually using `myGame.initStates([state1, state2, ...])`. Either way, `init` is guaranteed to only be executed once.

Note that we are **not** using `simpleLoop` in the above example. This means that the engine will call both `update` and `draw` functions on the active game state.

Ideally, we would do all of our state calculations in the `update` functions and we would only use `draw` for rendering calls. However, doing some calculations inside `draw` makes the example above simpler since we don't need to bother with defining extra variables. Generally speaking, it's ok to do some calculations on the rendering side of your game as long as you keep all the game logic updates in the `update` function. The purpose of the `update` function is to update the game state to a renewed state, constantly keeping it afresh as it were, and the purpose of the `draw` function is to render whatever state the game is currently in, to the screen.

You should always keep performance in mind when writing any sort of code in either of these functions, as they are being updated in real time (in most cases that means about 60 times per second).

Below is a short summary of classes and functions in Caya. See the [/examples/](examples/) folder for more examples on usage. See the [/doc/](doc/) folder for API reference.

## Classes

### Game

The Game class constructs a Game object that exists at the core of a Caya game. It handles initialization and main game loop. It is initialized in the following way:

```JavaScript
var myGame = new caya.Game({
	canvasId: 'myCanvasID',
	state: myState
});
```

The argument `canvasId` is the ID of the `<canvas>` element in the DOM tree. The `state` argument points to the initial game state. Both parameters are required. Optionally, you can define `simpleLoop: true` in the arguments list to make the engine use a simplified loop that doesn't call the `update` function on states.

The game will not start automatically. To start the game, use:
```JavaScript
myGame.run();
```

To change the active game state:
```JavaScript
myGame.setState(nextState);
```

To retreive the active game state:
```JavaScript
var activeState = myGame.getState();
```

States will initialize automatically when they are first entered into. For cases where you wish to manually initialize states, use:

```JavaScript
myGame.initStates([state1, state2, ...]);
```

To set view mode:
```JavaScript
// centers canvas element to parent
myGame.setViewMode('center');

// scales canvas element to parent maintaining a fixed aspect ratio
myGame.setViewMode('scale-fit');

// scales canvas element to parent fully, ignoring aspect ratio
myGame.setViewMode('scale-stretch');

// expands canvas element to parent, changing physical diemensions of the canvas
myGame.setViewMode('expand');
```

Note that changing the view mode effects user input since coordinates must be translated accordingly. This is handled automatically in the Input class.

### State

The State class allows you to create State instances. These can be used to handle various game screens. At least one state is needed for a Caya game to function. A state with its corresponding functions is defined in the following way:

```JavaScript
var myState = new caya.State();

myState.init = function() {
	/* initialize state here */
};

myState.draw = function() {
	/* draw to screen here */
};

myState.update = function(dt) {
	/* update state here */
};

myState.enter = function() {
	/* state was entered */
};

myState.exit = function() {
	/* state was exited */
};
```

All functions are optional. When `simpleLoop` is used, `update` will be ignored.

You can use an alternate syntax if you want to:

```JavaScript
var myState = new caya.State({
	init: function() {
		/* initialize state here */
	},
	draw: function() {
		/* draw to screen here */
	},
	update: function(dt) {
		/* update state here */
	},
	enter: function() { 
		/* state was entered */
	},
	exit: function() {
		/* state was exited */
	}
});
```

The `init` function initializes and prepares the state and is guaranteed to only be invoked once per state. The `draw` function is used for rendering graphics to screen and `update` is used for updating state logic and is called with the `dt` (delta time) parameter which represents time passed from last update call. When a state becomes active, `enter` is called. Similarly, when the state stops being active, `exit` is called.

### Render

The Render class contains functions that deal with on-screen rendering. Render is already present when a Surface is initialized (see next section for information on the Surface class).

It can be accessed via `state.surface.render` or the shorthand `state.paint`. It is preferable to use the shorthand method. Methods are listed below. Note the optional and default values.

Rendering shapes:
```JavaScript
// rectangle
rect(x, y, width, height, [lineColor='#fff'], [lineWidth=1]);

// filled rectangle
rectFill(x, y, width, height, [backgroundColor='#fff']);

// circle
circle(x, y, radius, lineColor, [lineWidth=1)];

// filled circle
circleFill(x, y, radius, [backgroundColor='#fff']);

// arc (part of a circle)
arc(x, y, radius, startAngle, endAngle, [lineColor='#fff'], [lineWidth=1]);

// solid polygon
points = [[x1, y1], [x2, y2], ...];
polygon(points, [backgroundColor='#fff']);
```

Rendering graphics and tiles:
```JavaScript
// plain or stretched graphics
graphics(gfxSource, x, y, [width], [height]);

// surface
surface(surface, x, y);

// tile
tile(gfxSource, tileX, tileY, tileWidth, tileHeight, sourceX, sourceY);

// stretched tile
stretchTile(gfxSource, tileX, tileY, sourceWidth, sourceHeight, sourceX, sourceY, tileWidth, tileHeight);

// native text
text(text, x, y, [textColor='#fff'], [alignment='left'], [font='11px sans-serif']);

// bitmap text
bmptext(fontObject, text, x, y, [colorIndex=0], [align=0]);
```

Alpha blending example:
```JavaScript
myState.draw = function() {
	this.paint.setAlpha(0.5); // set alpha level
	this.paint.rectFill(0, 0, 100, 100, 'red');
	this.paint.setAlpha(); // restore alpha
};
```

Rotation example:
```JavaScript
myState.draw = function() {
	var angle = 45; // angle of rotation
	var point = [50, 50]; // rotation pivot point
	this.paint.rotate(angle, point); // rotate at 45 degrees around point 50, 50
	this.paint.rectFill(0, 0, 100, 100, 'red');
	// once we are done rotating, we need to restore saved context
	this.paint.restore();
};
```

If you require additional rendering functions, you can extend the renderer.

You can access the global surface's render like so:
```JavaScript
myGame.getSurface().render
```

To add a custom function to renderer:
```JavaScript
caya.compose(myGame.getSurface().render, {
	blueCircle: function(x, y) {
		// renders a blue circle at x, y
		// use this.ctx for raw API calls
		this.ctx.strokeStyle = 'blue';
		this.ctx.lineWidth = 10;
		this.ctx.arc(x, y, 20, 0, Math.PI * 2);
		this.ctx.stroke();
	}
});

myState.draw = function() {
	// we can now use the function in any state
	this.paint.blueCircle(20, 20);
};
```

In a future version you will also be able to substitute the default renderer with your own.

### Surface

A Surface is a class that wraps a `<canvas>` element and includes a renderer. A global surface is instantiated when the game first runs and is available to all game states. You can instantiate your own surfaces to pre-render graphics. This is useful for optimizing expensive graphic calls.

To create a Surface object:
```JavaScript
var mySurface = new caya.Surface({
	width: 200,
	height: 200
});
```

This creates a Surface with its own internal `<canvas>` of specified dimensions.

If you need to, you may also create a Surface to wrap an already existing `<canvas>` element:
```JavaScript
var sourceCanvas = document.getElementById('someCanvasID');
var mySurface = new caya.Surface({
	fromCanvas: sourceCanvas
});
```

You can access the internal `<canvas>` element with `mySurface.canvas`.

To draw on a Surface, simply access the internal `render` object and use any of its methods:
```JavaScript
// paints a yellow rectangle of size 50x50 at 20, 20 onto mySurface
mySurface.render.rectFill(20, 20, 50, 50, 'yellow');
```

To clear a surface:
```JavaScript
mySurface.clear();
```

By default, surfaces will clear to transparent color. You can set a solid fill color instead if needed:
```JavaScript
// sets fill clear method with default (black) color
mySurface.setFillClearMethod();
// sets fill clear method with custom color
mySurface.setFillClearMethod('#aabbcc');
```

To toggle back to default clear method:
```JavaScript
mySurface.setDefaultClearMethod();
```

### Input

The Input class is used for handling mouse and touch events. The engine does not differentiate between mouse and touch events, they are treated in an equivalent way.

To instantiate an Input object, you need to associate it with a Game object. Simply pass it as an argument:
```JavaScript
var myInputHandler = new caya.Input(myGame);
```

The input handler only has a single function, `on`. You can use it to register one of three events: press, move or release:
```JavaScript
myInputHandler.on('press', function(coords) {
	// mousedown or touch-start has occured
	var cx = coords[0]; // event x coordinate
	var cy = coords[1]; // event y coordinate
});
myInputHandler.on('move', function(coords) {
	// mousemove or touch-move has occured
});
myInputHandler.on('release', function(coords) {
	// mouseup or touch-end has occured
});
```

`CAUTION` The Input class is not state aware, so you are required to bypass events manually when you're not in the correct state. Note that future versions will add additional functionality that will resolve this but will likely alter the API.

### KeyInput

The KeyInput class handles keyboard events.

To create a handler:
```JavaScript
var myKeyInputHandler = new caya.KeyInput();
```

To poll last keyboard event:
```JavaScript
var keyEvent = myKeyInputHandler.pollEvent();
```

The return value stored in `keyEvent` will contain two properties, `type` and `keycode` - `type` can correspond to `myKeyInputHandler.KEYDOWN` or `myKeyInputHandler.KEYUP`, which are just static values representing event type. The `keycode` property contains a value with the corresponding key code.

The keyboard handler conatins key codes for all common keys. You can access them in your handler by the key prefix:
```JavaScript
myKeyInputHandler.keyEnter
myKeyInputHandler.keyA
myKeyInputHandler.keyB
myKeyInputHandler.key1
myKeyInputHandler.key2
```

To clear the event queue:
```JavaScript
myKeyInputHandler.clear();
```

To check if a keycode is alphanumeric:
```JavaScript
myKeyInputHandler.isAlphanumeric(keyEvent.keycode);
```

To convert a key code into a character:
```JavaScript
myKeyInputHandler.getASCII(keyEvent.keycode);
```

To check if a given key is in keydown state:
```JavaScript
var key = myKeyInputHandler.keyEnter; // example
myKeyInputHandler.isKeyDown(key);
```

The keyboard handler is typically used in the `update` function of some game state thereby binding it to that particular state. Example usage:
```JavaScript
myState.update = function(dt) {
	// fetching keyboard events
	// loop through keyboard events until there are none left
	var keyEvent;
	while (keyEvent = myKeyInputHandler.pollEvent()) {
		if (keyEvent.type === myKeyInputHandler.KEYDOWN) {
			// a keydown event has occured
			// do something with keyEvent.keycode
		}
		else if (keyEvent.type === myKeyInputHandler.KEYUP) {
			// a keyup event has occured
			// do something with keyEvent.keyup
		}
	}
	// checking individual key states
	var isKeyWDown = myKeyInputHandler.isKeyDown(myKeyInputHandler.keyW);
	var isKeyQDown = myKeyInputHandler.isKeyDown(myKeyInputHandler.keyQ);
};
```

### AssetLoader

The AssetLoader class is used to preload various types of game assets, and provides a way to access them later on.

AssetLoader includes a few default handlers for loading assets. Custom handler functions can be defined to process various types of data. Default handlers can be safely overriden as well.

To create an AssetLoader, use:
```JavaScript
var myAssetLoader = new caya.AssetLoader();
```

You will need a list of assets that point to the files. This list needs to have specific category names that correspond to the appropriate load handler functions. The default handlers are `graphics` for any type of image files, `data` for JSON files and `text` for plaintext files.
```JavaScript
var myAssets = {
	graphics: {
		player: 'path/to/player.png',
		monster: 'path/to/monster.png',
		background: 'path/to/background.jpg'
	},
	data: {
		levels: 'level.json'
	},
	text: {
		story: 'story.txt'
	}
};
```

To preload assets, use the `load` function. Use the `assets` attribute to point to a list of assets you want preloaded. Attach a `done` function to inform you of when all processing is complete. Optionally, you can attach a `progress` function to track the load progress:
```JavaScript
myAssets.load({
	assets: myAssets,
	done: function() {
		// we are done loading assets!
		// typically we would run a game here, or continue to the main screen
	},
	progress: function(loaded, all) {
		// track progress
		console.log('Loaded ' + loaded + ' out of ' + all + ' assets!');
	}
});
```

To retreive assets once they have been loaded, use the `get` function:
```JavaScript
var gfxPlayer = myAssets.get('graphics.player');
var storyText = myAssets.get('text.story');
```

To retreive several assets at once:
```JavaScript
var gfx = myAssetLoader.get('graphics.player graphics.monster graphics.background');
// we can now use gfx.player, gfx.monster, gfx.background
```

You can use the `from` function to make your life easier:
```JavaScript
var gfx = myAssetLoader.from('graphics').get('player monster background');
var story = myAssetLoader.from('text').get('story');
```

To define a custom category, add a handler function to the list of handlers:
```JavaScript
myAssets.handler.custom = function(filename, ready) {
	// process file given by filename
	var object;
	/* ... */
	// call ready with the loaded object when done
	ready(object);
};
```

You can now use a custom category:
```JavaScript
var myAssets = {
	custom: {
		/* keys and filenames */
	}
};
```

This is an example for a sound effect asset handler using [howler.js](https://howlerjs.com/):
```javascript
myLoader.handler.sfx = function(filenames, ready) {
	var sfx = new Howl({
		src: filenames,
		autoplay: false,
		loop: false,
		volume: 1,
		onload: function() {
			// return sfx once everything is loaded
			ready(sfx);
		},
		onloaderror: ready // will return an undefined asset
	});
};

var myAssets = {
	sfx: {
		foo: ['foo.ogg', 'foo.aac', 'foo.wav'].
		bar: ['bar.ogg', 'bar.aac', 'bar.wav']
	}
};

myLoader.load({
	assets: myAssets,
	done: function() {
		// retreive sfx
		var sfx_foo = myLoader.get('sfx.foo');
		var sfx_bar = myLoader.get('sfx.bar');
		// play foo
		sfx_foo.play();
	}
});
```

### Grid2D

The Grid2D class is a simple container for a 2D matrix of values. It can be instantiated in the following way:
```JavaScript
// creates a grid of size 100x100 with the default value 0
var gridWidth = 100;
var gridHeight = 100;
var gridDefaultValue = 0;
var myGrid = new caya.Grid2D(gridWidth, gridHeight, gridDefaultValue);
```

Use the `clear` function to clear the entire grid to the default value specified in the constructor:
```JavaScript
myGrid.clear();
```

Note that on instantiation, grid values are undefined until `clear` is applied.

Use the `set` function to set a grid value:
```JavaScript
var x = 10;
var y = 10;
var value = 20;
myGrid.set(x, y, value);
```

Use the `get` function to retreive a value from the grid:
```JavaScript
var x = 10;
var y = 10;
var value = myGrid.get(x, y);
```

### Timer

The Timer class is used for creating simple, tick-based timer objects that can be used in conjunction with a state's `update` function.

To create a Timer object:
```JavaScript
var interval = 60; // specifies the rate at which the timer ticks. 60 ticks ~ 1 second
var myTimer = new caya.Timer(interval);
```

A timer's interval represents the number of ticks that need to occur for the timer to tick. Example usage:
```JavaScript
myState.init = function() {
	this.showRectangle = true;
};

myState.draw = function() {
	if (this.showRectangle) {
		this.paint.rectFill(20, 20, 100, 100, 'purple');
	}
};

myState.update = function(dt) {
	if (myTimer.run(dt)) {
		// timer has ticked
		// toggle visibility of rectangle
		this.showRectangle = !this.showRectangle;
	}
};
```

The `run` function is passed the `dt` parameter and reports back whether or not the timer has ticked. Alternatively, you can ignore the return value and check whether the timer has ticked or not by accessing the `ticked` property.

You can use the `reset` function to reset the timer back to initial state:
```JavaScript
myTimer.reset();
```

### Configuration

The Configuration class provides a way to handle persistant storage for your game. It wraps the localStorage API in a neat and easy to use interface. You may instantiate more than one Configuration as long as keys for each configuration remain unique.

A Configuration object is initialized in the following way:

```javascript
var myKey = 'example';
var myDefaultConfig = {
	foo: 'value',
	bar: 0
};
var myConfig = new Z9.Configuration(myKey, myDefaultConfig);
```

A configuration object acts like any other object and you may populate it with any sort of data. A default configuration serves as a template for your configuration. A `load` call needs to be applied at the start of the game to retreive the active configuration. If none is found within localStorage, the default configuration will be used.

You can control saving and loading using the `save` and `load` functions:
```javascript
// NOTE: myConfig will remain empty untill a load call is applied!

// load configuration
// load retreives the configuration from local storage if the key is present;
// otherwise it retreives the default configuration
myConfig.load();

// do some changes to configuration
myConfig.foo = 'other value';
myConfig.bar = 2;

// save configuration to local storage
myConfig.save();
```

### Font

The Font class provides a bitmap font construct. This is useful for some games that only require a limited set of characters. The problem with regular HTML5 text routines is that they can slow the game down if the text is being redrawn over and over again. This can be solved by pre-rendering texts and then drawing those as sprites, but you still can't have dynamic texts unless you develop some sort of a workaround where you dynamically render only changes to the text. The other problem with text is it is very often inconsistent between browsers, where one browser will render your text slightly offset to the top, or the spacing will be different, or hinting, etc. Modern browsers are very complex in their way to render fonts and this comes with its own set of problems with regards to game development. This class essentially dumbs down font rendering by displaying text characters as sprites in a tileset, and provides an interface for ease of use. You are limited to an ASCII range of characters with this class and you will also need to create your own fonts (create graphics and define character widths) to go with it.

Examples on usage can be found in the [/examples/](examples/) folder.

## Other functions

Listed here are some of the functions included in Caya that may come in handy when developing games:

### General purpose

`compose` creates a number of JavaScript objects and creates a single object out of them. This is useful for creating any sort of entity-component systems, as well as extending functionality of objects or simply using it for syntax sugar. It uses Object.assign under the hood or emulates it on non-ES6 compliant browsers.
```JavaScript
var result = caya.compose({
	apples: 10
}, {
	oranges: 20
});
// result: { apples: 10, oranges: 20 }
```

`iter` iterates over members of an object, ignoring any member functions.
```JavaScript
var object = {
	pumpkins: 30,
	strawberries: 40
};
caya.iter(object, function(key, item) {
	console.log(key + ': ' + item);
});
```

`getFilenameExtension` retreives the extension of a filename.
```JavaScript
var filename = `file.json';
caya.getFilenameExtension(filename); // returns 'json'
```

### Math and randomness

`clamp` returns a number, constrained to a given range.
```JavaScript
var number = 10;
var min = 20;
var max = 40;
caya.clamp(number, min, max); // returns 20
```

`pointInRect` checks whether a point is within a given rectangle:
```JavaScript
var pointX = 20;
var pointY = 30;
var rectX = 10;
var rectY = 10;
var rectWidth = 80;
var rectHeight = 100;
caya.pointInRect(pointX, pointY, rectX, rectY, rectWidth, rectHeight); // returns true
```

`getRandomInt` returns an integer from a range at random:
```JavaScript
var min = 20;
var max = 40;
caya.getRandomInt(min, max); // returns a number between 20 and 40 (inclusive)
```

`shuffle` shuffles an array:
```JavaScript
var values = [1, 2, 4, 8, 16];
caya.shuffle(values);
```

`choose` picks an element from an array at random:
```JavaScript
var values = [1, 2, 3];
caya.choose(values); // returns either 1, 2 or 3
```