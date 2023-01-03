ig.module(
    'game.main'
)
    .requires(
        'impact.debug.debug',
        'game.Resources',
        'game.Random',
        'game.HexGame',
        'game.UserInterface',
        'game.MapManager',
        'game.AnimalStats'
    )
    .defines(function () {

        ig.global.gameSeed = 1;

        MyGame = HexGame.extend({

            autoSort: true,

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

                this.cameraPosition = { x: 0, y: 0 };

                this.readData(); // load saved game
                //ig.global.playerAnimal = new Animal();

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
                if (ent.isPlayer) {
                    this.player = ent;
                }
                if(ent.isTurnMode || ent.isCollisionMode || ent.isTriggerMode){
                    ent.zIndexInitial = ent.zIndex;
                    ent.zIndex = ent.zIndexInitial + y;
                }
                if(ent.groupId){
                    if(!this.map.groups[ent.groupId]){
                        this.map.groups[ent.groupId] = [];
                    }
                    let group = this.map.groups[ent.groupId];
                    group.push(ent);
                }
                return ent;
            },

            removeEntity: function (ent) {
                this.parent(ent);
                if(ent.groupId){
                    let group = this.map.groups[ent.groupId];
                    this.map.groups = group.filter(e => e.id != ent.id);
                }
            },

            getGroup(entity){
                if(entity.groupId){
                    if(!this.map.groups[entity.groupId]){
                        this.map.groups[entity.groupId] = [];
                    }
                    let group = this.map.groups[entity.groupId];
                    return group;
                }
            },

            endMove(entity, lastPosition, newPosition) {
                if(this.parent(entity, lastPosition, newPosition)){
                    entity.zIndex = entity.zIndexInitial + newPosition.y;
                    return true;
                }
                return false;
            },

            writeData: function () {
                fetch('gamedata.js', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({data: ig.global.playerAnimal})
                });
            },

            readData: function () {
                $.ajax({
                	url: 'gamedata.js',
                	method: 'get',
                	dataType: 'json',
                	async: false, 
                	success: function(gamedata) {
                        if(!gamedata.error){
                            ig.global.playerAnimal = gamedata.data;
                        } else {
                            ig.global.playerAnimal = new Animal();
                        }
                	},
                	//error: function( xhr, status, error ){}
                });
            },

            storePlayerPosition: function () {
                let opposite = this.player.direction.opposite;
                let lastPosition = this.player.nextPosition(opposite);
                this.map.playerPosition = { x: this.player.offset.x + lastPosition.x, y: this.player.offset.y + lastPosition.y };
            },

            restorePlayerPosition: function (direction) {
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

            processUserAction: function (entity) {
                return this.controls.processUserAction(entity);
            },

            openDialog: function (entity, title, options) {
                this.controls.openDialog(entity, title, options);
            },

            closeDialog: function(){
                this.controls.closeDialog();
            }
        });

        // Start the Game with 30fps, a resolution of 1350x550, scaled
        // up by a factor of 1
        ig.main('#canvas', MyGame, 30, 1350, 550, 1, Resources);

    });
