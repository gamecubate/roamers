ig.module( 
	'game.entities.roamer' 
)
.requires(
	'impact.game',
	'plugins.gamecubate.automata.shifter'
)
.defines(function(){

EntityRoamer = ig.Entity.extend({
	
	DEFAULT_SHEET_PATH: 'media/roamer-2.png',
	TILESIZE: 32,
	
	size: {x:24, y:24},
	maxVel: {x: 50, y: 50},
	speed: 255,
	friction: {x:0,y:0},

	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.ACTIVE,

	// CA
	ca1: null, value1: 0,
	ca2: null, value2: 0,
	ca3: null, value3: 0,
	ca4: null, value4: 0,
	stepTimer: null,
	stepDuration: 0.1,
	displayInfo: null,
	
	
	init: function (x, y, settings)
	{
		var path = settings.sheetPath || this.DEFAULT_SHEET_PATH;
		this.animSheet = new ig.AnimationSheet(path, this.TILESIZE, this.TILESIZE);
		this.addAnim ('idle', 0.1, [0]);
		
		this.initCA();
		this.stepTimer = new ig.Timer();
		this.displayInfo = settings.displayInfo;
		
		this.parent (x, y, settings);
	},

	reset: function ()
	{
		this.resetCA();
	},

	update: function ()
	{
		// evolve?
		if (this.stepTimer.delta() > 0 && this.stepDuration > 0)
		{
			this.step ();
			this.stepTimer.set (this.stepDuration);
		}

		// wrap around?
		this.pos.x = this.pos.x < -25 ? ig.system.width+25 : (this.pos.x > ig.system.width+25 ? -25 : this.pos.x);
		this.pos.y = this.pos.y < -25 ? ig.system.height+25 : (this.pos.y > ig.system.height+25 ? -25 : this.pos.y);

		this.parent ();
	},

	draw: function()
	{
		this.parent();
	},

	handleMovementTrace: function( res )
	{
		if (res.collision.y && this.vel.y > 32)
		{
		}
		this.parent(res);
	},

	check: function (other)
	{
	},


	// Helpers
	initCA: function ()
	{
		var dirFunction = function(row, col)
		{
			return {vdir:(Math.random() < 0.6) ? 0 :0, hdir:(Math.random() < 0.6) ? 1 : -1};
		};
		
		this.ca1 = new Shifter (8,8);
		this.ca2 = new Shifter (8,8);
		this.ca3 = new Shifter (8,8);
		this.ca4 = new Shifter (8,8);

		this.ca1.directionFunction = dirFunction;
		this.ca2.directionFunction = dirFunction;
		this.ca3.directionFunction = dirFunction;
		this.ca4.directionFunction = dirFunction;

		this.ca1.populate (0.4);
		this.ca2.populate (0.4);
		this.ca3.populate (0.4);
		this.ca4.populate (0.4);
	},
	
	step: function ()
	{
		this.ca1.step();
		this.ca2.step();
		this.ca3.step();
		this.ca4.step();

		if (this.displayInfo)
		{
			this.updateMap (this.ca1, this.displayInfo.map, 8, this.displayInfo.offset.col, this.displayInfo.offset.row);
			this.updateMap (this.ca2, this.displayInfo.map, 8, this.displayInfo.offset.col+8, this.displayInfo.offset.row);
			this.updateMap (this.ca3, this.displayInfo.map, 8, this.displayInfo.offset.col+16, this.displayInfo.offset.row);
			this.updateMap (this.ca4, this.displayInfo.map, 8, this.displayInfo.offset.col+24, this.displayInfo.offset.row);
		}

		this.value1 = this.rebootIf (this.ca1) || this.value1;
		this.value2 = this.rebootIf (this.ca2) || this.value2;
		this.value3 = this.rebootIf (this.ca3) || this.value3;
		this.value4 = this.rebootIf (this.ca4) || this.value4;

		this.accel.x = -this.value1.map(0,255,0,360) + this.value2.map(0,255,0,360);
		this.accel.y = -this.value3.map(0,255,0,360) + this.value4.map(0,255,0,360);

		this.currentAnim.angle = (0).toRad() + Math.atan2(this.vel.x, -this.vel.y);
	},

	rebootIf: function (ca)
	{
		if (! ca.isStable())
			return undefined;

		var data = ca.data;
		var results = data[0][0] + 2*data[1][0] + 4*data[2][0] + 8*data[3][0] + 16*data[4][0] + 32*data[5][0] + 64*data[6][0] + 128*data[7][0];
		ca.reset();
		ca.populate(0.4);
		return results;
	},

	resetCA: function ()
	{
		this.ca1.reset (); this.ca1.populate (0.4);
		this.ca2.reset (); this.ca2.populate (0.4);
		this.ca3.reset (); this.ca3.populate (0.4);
		this.ca4.reset (); this.ca4.populate (0.4);
	},

	updateMap: function (ca, map, tileIndex, x, y)
	{
		var states = ca.data;

		// iterate
		for (var row=0; row<ca.rows; row++)
		{
			for (var col=0; col<ca.cols; col++)
			{
				var state = states[row][col];

				if (state == CellState.DEAD)
				{
						map.data[row+y][col+x] = 0;
				}
				else if (state == CellState.ALIVE)
				{
						map.data[row+y][col+x] = tileIndex;
				}
			}
		}
	},

});
});