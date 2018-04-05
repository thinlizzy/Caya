/*
 *  Caya Example 03 - Graphics
 *
 */

// create the main state
var myState = new caya.State();

// called when state initializes
myState.init = function() {
	this.sprite = myLoader.get('graphics.sprite');
};

// draw the sprite
myState.draw = function() {
	this.paint.graphics(this.sprite, 140, 90);
};

// setup and run the game
var myGame = new caya.Game({
	canvasId: 'caya-example', // canvas element to initialize the game on
	state: myState, // initial game state
	simpleLoop: true // use a simple game loop that only draws and doesn't call state.update
});

// asset list
var myAssets = {
	graphics: {
		sprite: 'sprite.png'
	}
};

// asset loader
var myLoader = new caya.AssetLoader();

// load assets on window load
window.addEventListener('load', function() {
	myLoader.load({
		assets: myAssets,
		done: myGame.run // run game when all assets are loaded
	});
});
