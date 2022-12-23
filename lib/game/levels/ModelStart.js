ig.module( 'game.levels.ModelStart' )
.requires( 'impact.image','game.entities.Player','game.entities.ForwardPortal' )
.defines(function(){
LevelModelStart=/*JSON[*/{
	"entities": [
		{
			"type": "EntityPlayer",
			"x": 152,
			"y": 264
		},
		{
			"type": "EntityForwardPortal",
			"x": 408,
			"y": 264
		}
	],
	"layer": [
		{
			"name": "ground",
			"width": 10,
			"height": 10,
			"linkWithCollision": false,
			"visible": true,
			"tilesetName": "./media/terrain/ground.png",
			"repeat": false,
			"preRender": false,
			"distance": 1,
			"tilesize": 64,
			"foreground": false,
			"data": [
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,7,7,7,7,7,7,7,0],
				[0,7,7,7,7,7,7,7,7,0],
				[0,7,7,7,7,7,7,7,7,0],
				[0,7,7,7,7,7,7,7,7,0],
				[0,7,7,7,7,7,7,7,7,0],
				[0,7,7,7,7,7,7,7,7,0],
				[0,7,7,7,7,7,7,7,7,0],
				[0,7,7,7,7,7,7,7,0,0],
				[0,0,0,0,0,0,0,0,0,0]
			]
		},
		{
			"name": "collision",
			"width": 10,
			"height": 10,
			"linkWithCollision": false,
			"visible": true,
			"tilesetName": "",
			"repeat": false,
			"preRender": false,
			"distance": 1,
			"tilesize": 64,
			"foreground": false,
			"data": [
				[1,1,1,1,1,1,1,1,1,0],
				[1,1,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,1,0],
				[1,1,1,1,1,1,1,1,1,0]
			]
		}
	]
}/*]JSON*/;
LevelModelStartResources=[new ig.Image('./media/terrain/ground.png')];
});