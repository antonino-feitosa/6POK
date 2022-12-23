ig.module( 'game.levels.ModelSmall' )
.requires( 'impact.image','game.entities.Player','game.entities.ForwardPortal','game.entities.Grass','game.entities.GrassGroup','game.entities.Animal','game.entities.BackwardPortal' )
.defines(function(){
LevelModelSmall=/*JSON[*/{
	"entities": [
		{
			"type": "EntityPlayer",
			"x": 152,
			"y": 264
		},
		{
			"type": "EntityForwardPortal",
			"x": 536,
			"y": 360
		},
		{
			"type": "EntityGrass",
			"x": 280,
			"y": 168
		},
		{
			"type": "EntityGrassGroup",
			"x": 224,
			"y": 304
		},
		{
			"type": "EntityAnimal",
			"x": 408,
			"y": 360
		},
		{
			"type": "EntityBackwardPortal",
			"x": 120,
			"y": 120
		},
		{
			"type": "EntityGrassGroup",
			"x": 448,
			"y": 256
		},
		{
			"type": "EntityGrassGroup",
			"x": 320,
			"y": 160
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
LevelModelSmallResources=[new ig.Image('./media/terrain/ground.png')];
});