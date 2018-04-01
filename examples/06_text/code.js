/*
 *  Caya Example 06 - Text
 *
 */
 
// create the main state
var myState = new caya.State();

// called when state initializes
myState.init = function() {
	this.font = new caya.Font({
		graphics: myLoader.get('graphics.font'),
		size: [16, 16]
	});
};

// draw some text
myState.draw = function() {
	this.paint.bmptext(this.font, "Hello World", 20, 20);
	this.paint.bmptext(this.font, "Bitmap Text", 20, 50);
	this.paint.bmptext(this.font, "A t r a e  o o s", 20, 80, 1);
	this.paint.bmptext(this.font, " l e n t  C l r ", 20, 80, 2);
	this.paint.bmptext(this.font, "Symbols!?@#$%^&*()[];'", 20, 110);
	this.paint.bmptext(this.font, "\"{},.<>:-=+\\/~|`", 20, 140);
	this.paint.text('Non-bitmap text', 20, 180);
	this.paint.text('Colored text', 20, 202, 'red');
	this.paint.text('Centered text with custom font', 200, 230, 'purple', 'center', '20px sans-serif');
	this.paint.text('Right aligned text with custom font', 380, 270, '#000', 'right', '11px verdana');
};

// setup and run the game
var myGame = new caya.Game({
	canvasId: 'caya-example', // canvas element to initialize the game on
	state: myState, // initial game state
	simpleLoop: true // use a simple game loop that only draws and doesn't call state.update
});

// asset list
var myAssets = {
	// font graphics
	graphics: {
		font: 'font.png'
	}
};

// asset loader
var myLoader = new caya.AssetLoader();

// load assets on window load
window.addEventListener('load', function() {
	myLoader.load({
		assets: myAssets,
		done: myGame.run
	});
});
