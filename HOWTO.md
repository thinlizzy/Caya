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

This will display a rotating blue circle. Note the `init` function, which is meant for initialization of variables and preparation of data. This function is called once as the state is being initialized. This happens automatically when the state is entered into for the first time, or you can initialize states manually using `myGame.initStates([state1, state2, ...])`. Either way, `init` is guaranteed to only be executed once.

Note that we are **not** using `simpleLoop` in the above example. This means that the engine will call both `update` and `draw` functions on the active game state.

See the examples folder for more examples on API usage.

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

Changing the view mode effects user input since coordinates must be translated accordingly. This is handled automatically in the Input class.

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

All functions all optional. When `simpleLoop` is used, `update` will be ignored.

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

### Render

The Render class contains

### Surface

### Input

### KeyInput

### AssetLoader

### Grid2D

### Timer

### Configuration

### Font

## Other functions

### General purpose

### Math and randomness
