# Caya Reference

## Contents

- [Quick start guide](#quick-start-guide)
- Core concepts and philosophy
- Classes
   - Game
   - State
   - Render
   - Surface
   - Input
   - KeyInput
   - Grid2D
   - Timer
   - Configuration
   - Font
- Other functions
   - General purpose
   - Math and randomness

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

You can now use Caya in your code! Hooray!

All we need to create a basic Caya game is a game state and the game definition.

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

That's it! Your first Caya game is complete. If you run it, you will see a nice red square of size 50x50 pixels displayed at position 10, 10 on your canvas.

A game state represents a single segment of the game, or a screen. You may for example create one state for the game menu, another for the actual game, yet another for story screen, and so on. In the code above, we're using the state's `draw` function to paint to the screen. This function gets called by the Game object whenever this particular state is active. Note the `state: myState` line which informs the engine that we would like `myState` to be the initial game for when the game runs. This argument is needed for the game to run and is not optional. Once running, we may change the game state using `myGame.setState(nextState)`.

Note the line that reads `simpleLoop: true`. This informs the engine that you would like to make a game where you don't care for logic updates, you only want to draw to the screen. Defining this flag will make the engine run an alternate game loop that's optimized for this mode. Use it if your game relies on user input to change the game state. You will need to code your own timers or transition functions to support animations in this mode. To avoid entering this mode, simpy skip the definition.

What if we want to make a simple animation instead? Let's define both update and draw functions for our state, and let's use a regular loop for our game:

```JavaScript
// create a game state
var myState = new caya.State();

// state init function
// gets called once as the state initializes
myState.init = function() {
	// initialize all our goodies here
	this.rotation = 0;
	this.speed = 0.1;
	this.offset = 150;
	this.radius = 50;
};

// state draw function
myState.draw = function() {
	// draw a blue circle
	var circle_x = this.radius * Math.cos(this.rotation) + this.offset;
	var circle_y = this.radius * Math.sin(this.rotation) + this.offset;
	this.paint.circleFill(circle_x, circle_y, 30, 'blue');
};

// state update function
myState.update = function(dt) {
	// dt is time elapsed in milliseconds since previous update
	// increase rotation
	this.rotation += this.speed * dt;
};

// setup the game
var myGame = new caya.Game({
	canvasId: 'myCanvasID',
	state: myState
});

// run the game when window finishes loading
window.addEventListener('load', myGame.run);
```

This will display a rotating blue circle. Note the `init` function, which is meant for initialization of variables and preparation of data. This function is called once as the state is being initialized. This happens automatically when the state is entered into for the first time, or you can initialize states manually using `myGame.initStates([state1, state2, ...])`.

Note that we are **not** using `simpleLoop` in the above example. This means that the engine will call both `update` and `draw` functions on the active game state.

See the examples folder for more examples on API usage.

## Core concepts and philosophy

## Classes

### Game

### State

### Render

### Surface

### Input

### KeyInput

### Grid2D

### Timer

### Configuration

### Font

## Other functions

### General purpose

### Math and randomness
