ig.module( 'game.levels.ModelStart' )
.requires( 'impact.image','game.entities.Grass','game.entities.ForwardPortal','game.entities.Animal','game.entities.Obstacle' )
.defines(function(){
LevelModelStart=/*JSON[*/{
	"entities": [
		{
			"type": "EntityGrass",
			"x": 280,
			"y": 264
		},
		{
			"type": "EntityForwardPortal",
			"x": 472,
			"y": 264
		},
		{
			"type": "EntityGrass",
			"x": 312,
			"y": 216
		},
		{
			"type": "EntityAnimal",
			"x": 152,
			"y": 264,
			"settings": {
				"isPlayer": "true",
				"name": "Adax"
			}
		},
		{
			"type": "EntityObstacle",
			"x": 408,
			"y": 360
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