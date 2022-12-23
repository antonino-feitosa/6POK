ig.module( 
	'game.main' 
)
.requires(
	'impact.debug.debug',
    'game.Random',
	'game.HexGame',
	'game.entities.Player',
    'game.levels.ModelSmall',
    'game.levels.ModelStart',
    'game.levels.ModelEnd',
)
.defines(function(){

    ig.global.tilesetName = [
        './media/terrain/air.png',
        './media/terrain/dark.png',
        './media/terrain/eletric.png',
        './media/terrain/fire.png',
        './media/terrain/ghost.png',
        './media/terrain/grass.png',
        './media/terrain/ground.png',
        './media/terrain/holy.png',
        './media/terrain/ice.png',
        './media/terrain/magic.png',
        './media/terrain/metal.png',
        './media/terrain/profane.png',
        './media/terrain/psychic.png',
        './media/terrain/rock.png',
        './media/terrain/sand.png',
        './media/terrain/water.png'
    ];
    LevelModelStartResources = ig.global.tilesetName.map(name => new ig.Image(name));

MyGame = HexGame.extend({

    gameSeed: 1,
    tilesetLength: 16,
    randomizeGround: true,
    maxLevel: 3,
	
	init: function() {
        this.rand = new Random(this.gameSeed);
		// Initialize your game here; bind keys etc.
		ig.input.bind(ig.KEY._1, 'action1');
		ig.input.bind(ig.KEY._2, 'action2');
		ig.input.bind(ig.KEY.UP_ARROW, 'up');
		ig.input.bind(ig.KEY.DOWN_ARROW,'down');
		ig.input.bind(ig.KEY.LEFT_ARROW,'left');
		ig.input.bind(ig.KEY.RIGHT_ARROW,'right');
		ig.input.bind(ig.KEY.SPACE,'interact');

		this.nextLevel();
        //loadLevelDeferred
	},

    loadLevel: function (data) {
        let levelClass = typeof(data) === 'string' ? ig.global[data] : data;
        if( !levelClass ) {
            throw("Can't load level of type " + data);
        }
        data = levelClass;
        this.parent(data);
    },
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		let gameviewport= ig.game.screen;
		let gamecanvas= ig.system;
		let player = this.getEntitiesByType(EntityPlayer)[0];
		if(player){
			gameviewport.x = player.pos.x - gamecanvas.width /2;
			gameviewport.y = player.pos.y - gamecanvas.height /2;
		}
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		
		// Add your own drawing code here
		//var x = ig.system.width/2,
		//	y = ig.system.height/2;
		
		//this.font.draw( 'It Works!', x, y, ig.Font.ALIGN.CENTER );
	},

    randomizeMap: function(map){
        let tileIndex = ig.game.rand.nextInt(ig.global.tilesetName.length);
        map.layer[0].tilesetName = ig.global.tilesetName[tileIndex];
        if(this.randomizeGround){
            let ground = map.layer.find(l => l.name === 'ground');
            ground.data = ground.data.map(
                row => row.map(cell => cell > 0 ? this.rand.nextRange(1, this.tilesetLength) : 0)
            );
        }
    },

    nextLevel: function(){
        if(!ig.global.mapMemory){
            let map = JSON.parse(JSON.stringify(LevelModelStart));
            ig.global.mapMemory = {
                map: map,
                next: null,
                previous: null,
                level: 0
            };
            this.randomizeMap(map);
            this.loadLevel(ig.global.mapMemory.map);
            return;
        } else if(ig.global.mapMemory.next === null){
            let nextLevel = ig.global.mapMemory.level + 1;
            let mapModel = nextLevel === this.maxLevel ? LevelModelEnd : LevelModelSmall;
            let map = JSON.parse(JSON.stringify(mapModel));
            this.randomizeMap(map);
            
            ig.global.mapMemory.next = {
                map: map,
                next: null,
                previous: ig.global.mapMemory,
                level: nextLevel
            };
        }
        ig.global.mapMemory = ig.global.mapMemory.next;
        this.loadLevelDeferred(ig.global.mapMemory.map);
    },

    backLevel: function(){
        ig.global.mapMemory = ig.global.mapMemory.previous;
        this.loadLevelDeferred(ig.global.mapMemory.map);
    }
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 30, 1350, 550, 1 );

});
