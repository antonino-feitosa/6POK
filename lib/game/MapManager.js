

ig.module(
    'game.MapManager'
)
    .requires(
        'game.levels.ModelStart',
        'game.levels.ModelEnd',
        'game.levels.ModelSmall',
        'game.entities.Animal'
)
    .defines(function () {

        MapManager = ig.Class.extend({

            debugMode: false,
            headMap: null,

            init: function (rand, maxLevel) {
                this.rand = rand;
                this.maxLevel = maxLevel
            },

            currentMap: function () {
                return this.headMap.map;
            },

            nextMap: function () {
                if (this.headMap === null) {
                    let map = this._createStartMap();
                    this.headMap = { map: map, next: null, previous: null };
                    map.level = 1;
                } else if (this.headMap.next) {
                    this.headMap = this.headMap.next;
                } else if (this.headMap.map.level + 1 <= this.maxLevel) {
                    let nextLevel = this.headMap.map.level + 1;
                    let map = nextLevel === this.maxLevel ? this._createEndMap() : this._createLevelMap();
                    map.level = nextLevel;
                    this.headMap.next = { map: map, next: null, previous: this.headMap };
                    this.headMap = this.headMap.next;
                } else {
                    throw new Error('Can not create a map for the level: ' + (this.maxLevel + 1));
                }
                return this.headMap.map;
            },

            previousMap: function () {
                if (this.headMap.map.level > 1) {
                    this.headMap = this.headMap.previous;
                    return this.headMap.map;
                } else {
                    throw new Error('Can not create a map for the level: 0');
                }
            },

            _createStartMap: function () {
                let map = JSON.parse(JSON.stringify(LevelModelStart));
                this.randomizeMap(map);
                return map;
            },

            _createLevelMap: function () {
                let map = JSON.parse(JSON.stringify(LevelModelSmall));
                this.randomizeMap(map);
                return map;
            },

            _createEndMap: function () {
                let map = JSON.parse(JSON.stringify(LevelModelEnd));
                this.randomizeMap(map);
                return map;
            },

            randomizeMap: function (map) {
                this.randomizeType(map);
                if (this.randomizeGround) {
                    let ground = map.layer.find(l => l.name === 'ground');
                    ground.data = ground.data.map(
                        row => row.map(cell => cell > 0 ? this.rand.nextRange(1, this.tilesetLength) : 0)
                    );
                }
            },

            randomizeType: function (map) {
                map.type = this.rand.pick(Animal.Types);
                map.layer[0].tilesetName = './media/terrain/' + map.type + '.png';
            }
        });
    });
