ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.background-map',
	'game.entities.roamer',
	'plugins.impact-splash-loader',
	'impact.debug.debug'
)
.defines(function(){

FullsizeImage = ig.Image.extend({
		resize: function(){},
		draw: function() {
			if( !this.loaded ) { return; }
			ig.system.context.drawImage( this.data, 0, 0 );
		}
});


Demo = ig.Game.extend({

	// don't clear the screen as we want to show the underlying CSS background
	clearColor: null,

	// How big is our simulated world?
	COLS: 40,
	ROWS: 64,
	
	// Roamers, brain dump view (overlay), and shadow FX
	N_ROAMERS: 8,
	roamers: null,
	overlay: null,
	shadowLayer: null,
	
	init: function()
	{
		// Setup maps
		var bg = this.createMap (this.COLS, this.ROWS, 'media/tiles.png', 8, 2, true);
		this.backgroundMaps.push (bg);
		//
		this.overlay = this.createMap (this.COLS, this.ROWS, 'media/tiles.png', 8, 0, false);
		this.backgroundMaps.push (this.overlay);
		//
		this.shadowLayer = new FullsizeImage ('media/shadow-256x512.png');
		
		// Setup crowd of roamers
		this.roamers = [];
		var roamer;
		var info;
		for (var i=0; i<this.N_ROAMERS-1; i++)
		{
			info = {map:this.overlay, offset:{col:0, row:i*8}};
			roamer = this.spawnEntity (EntityRoamer, 0, 0, {sheetPath:'media/roamer-6.png', displayInfo:info});
			roamer.pos = {x:Math.random()*ig.system.width, y:Math.random()*ig.system.height};
			this.roamers.push(roamer);
		}
		// add 1 foreigner ;)
		info = {map:this.overlay, offset:{col:0, row:(this.N_ROAMERS-1)*8}};
		roamer = this.spawnEntity (EntityRoamer, 0, 0, {sheetPath:'media/roamer-5.png', displayInfo:info});
		roamer.pos = {x:Math.random()*ig.system.width, y:Math.random()*ig.system.height};
		this.roamers.push(roamer);
		
		// Handle mouse events
		ig.input.bind(ig.KEY.MOUSE1, 'mouse1');
	},

	update: function ()
	{
		this.handleMouse();
		this.parent ();
	},

	handleMouse: function ()
	{
		if (ig.input.released("mouse1"))
		{
			this.reset ();
		}
	},

	draw: function()
	{
		ig.system.context.clearRect (0 ,0, ig.system.realWidth, ig.system.realHeight);
		this.parent();
		this.shadowLayer.draw();
	},
	
	
	// Helpers
	createData: function (cols, rows, fillValue)
	{
		var fill = fillValue || 0;
		var data = [];
		for (var row=0; row<rows; row++)
		{
			data[row] = [];
			for (var col=0; col<cols; col++)
				data[row][col] = fill;
		}
		return data;
	},

	createMap: function (cols, rows, tiles, tilesize, fillvalue, preRender)
	{
		var data = this.createData (cols, rows, fillvalue);
		var map = new ig.BackgroundMap (tilesize, data, new ig.Image (tiles));
		map.preRender = preRender || false;
		return map;
	},

	reset: function ()
	{
		// reset roamers
		for (var i=0; i<this.roamers.length; i++)
			this.roamers[i].reset();
	},

});


// Start the Game with 30fps, a resolution of 320x480, unscaled, and use splash loader plugin
ig.main ('#canvas', Demo, 30, 256, 512, 1, ig.ImpactSplashLoader);

});
