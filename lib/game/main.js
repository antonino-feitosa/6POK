ig.module( 
	'game.main' 
)
.requires(
	'impact.debug.debug',
    'game.Random',
	'game.HexGame',
	'game.entities.Player',
	'game.levels.Ground',
    'game.levels.Water'
)
.defines(function(){

MyGame = HexGame.extend({

    gameSeed: 0,
    tilesetLength: 16,
    randomizeGround: true,
	
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

        this.player = new EntityPlayer(0,0);

		this.loadLevel(LevelGround);
        //loadLevelDeferred
	},

    loadLevel: function (data) {
        let levelClass = typeof(data) === 'string' ? ig.global[data] : data;
        if( !levelClass ) {
            throw("Can't load level of type " + data);
        }
        data = levelClass;

        if(this.randomizeGround){
            let ground = data.layer.find(l => l.name === 'ground');
            ground.data = ground.data.map(
                row => row.map(cell => cell > 0 ? this.rand.nextRange(1, this.tilesetLength) : 0)
            );
        }
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
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 30, 1350, 550, 1 );

});
