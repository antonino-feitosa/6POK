ig.module(
    'game.main'
)
    .requires(
        'impact.debug.debug',
        'game.Random',
        'game.HexGame',
        'game.MapManager'
    )
    .defines(function () {

        ig.global.types = ['air','dark','eletric','fire','ghost','grass','ground','holy','ice','magic','metal','profane','psychic','rock','sand','water'];

        ig.global.types.getPath = name => './media/terrain/' + name + '.png';

        LevelModelStartResources = ig.global.types.map(name => new ig.Image(ig.global.types.getPath(name)));

        MyGame = HexGame.extend({

            gameSeed: 1,
            tilesetLength: 16,
            randomizeGround: true,
            maxLevel: 3,

            init: function () {
                this.rand = new Random(this.gameSeed);
                this.mapManager = new MapManager(this.rand, this.maxLevel);

                // Initialize your game here; bind keys etc.
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

            randomizeMap: function (map) {
                map.layer[0].tilesetName = this.rand.pick(ig.global.tilesetName);
                if (this.randomizeGround) {
                    let ground = map.layer.find(l => l.name === 'ground');
                    ground.data = ground.data.map(
                        row => row.map(cell => cell > 0 ? this.rand.nextRange(1, this.tilesetLength) : 0)
                    );
                }
            },

            nextLevel: function () {
                this.map = this.mapManager.nextMap();
                this.loadLevel(this.map);
            },

            backLevel: function () {
                this.map = this.mapManager.previousMap();
                this.loadLevel(this.map);
            }
        });


        // Start the Game with 30fps, a resolution of 1350x550, scaled
        // up by a factor of 1
        ig.main('#canvas', MyGame, 30, 1350, 550, 1);

    });
