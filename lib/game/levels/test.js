ig.module( 'game.levels.test' )
.requires( 'impact.image','game.entities.player','game.entities.enemy' )
.defines(function(){
LevelTest=/*JSON[*/{
	"entities": [
		{
			"type": "EntityPlayer",
			"x": 160,
			"y": 96
		},
		{
			"type": "EntityEnemy",
			"x": 352,
			"y": 96
		}
	],
	"layer": [
		{
			"name": "collision",
			"width": 12,
			"height": 12,
			"linkWithCollision": false,
			"visible": 1,
			"tilesetName": "",
			"repeat": false,
			"preRender": false,
			"distance": 1,
			"tilesize": 64,
			"foreground": false,
			"data": [
				[1,1,1,1,1,1,1,1,1,1,1,0],
				[1,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,1,0],
				[1,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,1,0,0,0,1,0],
				[1,0,0,0,0,0,1,1,0,0,0,1],
				[1,0,0,0,0,0,1,0,0,0,1,0],
				[1,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,1,0],
				[1,0,0,0,0,0,0,0,1,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,1,0],
				[0,1,1,1,1,1,1,1,1,1,1,0]
			]
		},
		{
			"name": "background",
			"width": 12,
			"height": 12,
			"linkWithCollision": false,
			"visible": 1,
			"tilesetName": "media/Tileset.png",
			"repeat": false,
			"preRender": false,
			"distance": "1",
			"tilesize": 64,
			"foreground": false,
			"data": [
				[4,4,4,4,4,4,4,4,4,4,4,0],
				[4,2,2,2,2,2,2,2,2,2,2,4],
				[4,2,2,2,2,2,2,2,2,2,4,0],
				[4,2,2,2,2,2,2,2,2,2,2,4],
				[4,2,2,2,2,2,4,2,2,2,4,0],
				[4,2,2,2,2,2,4,4,2,2,2,4],
				[4,2,2,2,2,2,4,2,2,2,4,0],
				[4,2,2,2,2,2,2,2,2,2,2,4],
				[4,2,2,2,2,2,2,2,2,2,4,0],
				[4,2,2,2,2,2,2,2,4,2,2,4],
				[4,2,2,2,2,2,2,2,2,2,4,0],
				[0,4,4,4,4,4,4,4,4,4,4,0]
			]
		}
	]
}/*]JSON*/;
LevelTestResources=[new ig.Image('media/Tileset.png')];
});