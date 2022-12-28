ig.module(
    'game.main'
)
    .requires(
        'impact.debug.debug',
        'game.Resources',
        'game.Random',
        'game.HexGame',
        'game.Controls',
        'game.MapManager',
        'game.entities.Animal'
    )
    .defines(function () {

        ig.global.gameSeed = 1;

        MyGame = HexGame.extend({

            maxLevel: 3,
            rand: new Random(this.gameSeed),

            init: function () {
                this.mapManager = new MapManager(this.rand, this.maxLevel);
                this.controls = new Controls();
                
                ig.input.bind(ig.KEY._1, 'action1');
                ig.input.bind(ig.KEY._2, 'action2');
                ig.input.bind(ig.KEY.UP_ARROW, 'up');
                ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
                ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
                ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
                ig.input.bind(ig.KEY.SPACE, 'interact');

                this.cameraPosition = {x:0, y:0};
                ig.global.playerAnimal = new Animal({name: 'Adax'});

                this.nextLevel();
                //loadLevelDeferred
            },

            update: function () {
                // Update all entities and backgroundMaps
                this.parent();

                // TODO transition
                let gameviewport = ig.game.screen;
                let gamecanvas = ig.system;
                gameviewport.x = this.cameraPosition.x - gamecanvas.width / 2;
                gameviewport.y = this.cameraPosition.y - gamecanvas.height / 2;
            },

            draw: function () {
                // Draw all entities and backgroundMaps
                this.parent();


                // Add your own drawing code here
                //var x = ig.system.width/2,
                //	y = ig.system.height/2;

                //this.font.draw( 'It Works!', x, y, ig.Font.ALIGN.CENTER );
            },

            spawnEntity: function (type, x, y, settings) {
                let ent = this.parent(type, x, y, settings);
                if(ent.isPlayer){
                    this.player = ent;
                }
                return ent;
            },

            storePlayerPosition: function(){
                let opposite = this.player.direction.opposite;
                let lastPosition = this.player.nextPosition(opposite);
                this.map.playerPosition = {x: this.player.offset.x + lastPosition.x, y: this.player.offset.y + lastPosition.y};
            },

            restorePlayerPosition: function(direction){
                this.player.pos.x = this.map.playerPosition.x;
                this.player.pos.y = this.map.playerPosition.y;
                this.player.direction = direction;
            },

            nextLevel: function () {
                this.map = this.mapManager.nextMap();
                this.loadLevel(this.map);
                this.cameraPosition = this.player.pos;
            },

            backLevel: function () {
                this.map = this.mapManager.previousMap();
                this.loadLevel(this.map);
                this.cameraPosition = this.player.pos;
            },

            processUserAction: function(entity){
                return this.controls.processUserAction(entity);
            },

            sendFeedback: function(text){
                this.controls.sendFeedback(text);
            }
        });

        // Start the Game with 30fps, a resolution of 1350x550, scaled
        // up by a factor of 1
        ig.main('#canvas', MyGame, 30, 1350, 550, 1, Resources);

    });
