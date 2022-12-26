ig.module(
    'game.main'
)
    .requires(
        'impact.debug.debug',
        'game.Resources',
        'game.Random',
        'game.HexGame',
        'game.Controls',
        'game.MapManager'
    )
    .defines(function () {

        MyGame = HexGame.extend({

            gameSeed: 1,
            tilesetLength: 16,
            randomizeGround: true,
            maxLevel: 3,

            init: function () {
                this.rand = new Random(this.gameSeed);
                this.mapManager = new MapManager(this.rand, this.maxLevel);
                this.controls = new Controls();

                
                ig.input.bind(ig.KEY._1, 'action1');
                ig.input.bind(ig.KEY._2, 'action2');
                ig.input.bind(ig.KEY.UP_ARROW, 'up');
                ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
                ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
                ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
                ig.input.bind(ig.KEY.SPACE, 'interact');

                this.nextLevel();
                //loadLevelDeferred
            },

            update: function () {
                // Update all entities and backgroundMaps
                this.parent();

                let gameviewport = ig.game.screen;
                let gamecanvas = ig.system;
                let player = this.getEntitiesByType(EntityPlayer)[0];
                if (player) {
                    gameviewport.x = player.pos.x - gamecanvas.width / 2;
                    gameviewport.y = player.pos.y - gamecanvas.height / 2;
                }
            },

            draw: function () {
                // Draw all entities and backgroundMaps
                this.parent();


                // Add your own drawing code here
                //var x = ig.system.width/2,
                //	y = ig.system.height/2;

                //this.font.draw( 'It Works!', x, y, ig.Font.ALIGN.CENTER );
            },

            nextLevel: function () {
                this.map = this.mapManager.nextMap();
                this.loadLevel(this.map);
            },

            backLevel: function () {
                this.map = this.mapManager.previousMap();
                this.loadLevel(this.map);
            },

            processUserAction: function(entity){
                if(!this.player){
                    this.player = entity;
                }
                if(this.controls.processUserAction(entity)){
                    this.player = null;
                    return true;
                }
                return false;
            }
        });

        // Start the Game with 30fps, a resolution of 1350x550, scaled
        // up by a factor of 1
        ig.main('#canvas', MyGame, 30, 1350, 550, 1, Resources);

    });
