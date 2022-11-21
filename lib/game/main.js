ig.module( 
	'game.main' 
)
.requires(
	'impact.debug.debug',
	'game.HexGame',
	'game.entities.player',
	'game.levels.Test'
)
.defines(function(){

MyGame = HexGame.extend({
	
	init: function() {
		// Initialize your game here; bind keys etc.
		ig.input.bind(ig.KEY._1, 'action1');
		ig.input.bind(ig.KEY._2, 'action2');
		ig.input.bind(ig.KEY.UP_ARROW, 'up');
		ig.input.bind(ig.KEY.DOWN_ARROW,'down');
		ig.input.bind(ig.KEY.LEFT_ARROW,'left');
		ig.input.bind(ig.KEY.RIGHT_ARROW,'right');
		this.loadLevel(LevelTest);
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		// Add your own, additional update code here

		//var gameviewport= ig.game.screen;
		//var gamecanvas= ig.system;
		/*var player = this.getEntitiesByType(EntityPlayer)[0];
		if(player){
			gameviewport.x = player.pos.x - gamecanvas.width /2;
			gameviewport.y = player.pos.y - gamecanvas.height /2;
		}*/
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
ig.main( '#canvas', MyGame, 30, 1280, 550, 1 );

});
