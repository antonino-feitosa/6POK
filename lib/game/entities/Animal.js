
ig.module('game.entities.Animal')
    .requires(
        'game.HexEntity',
        'game.Random',
        'game.Direction'
    ).defines(function () {

        ANIMAL_NAMES = ['Adax', 'Alce', 'Almiqui', 'Anta', 'Arganaz', 'Asellia', 'Asno'];

        STAT_NAMES = ['hp', 'atk', 'def', 'spatk', 'spdef', 'speed'];

        TYPE_NAMES = ['Air', 'Dark', 'Eletric', 'Fire', 'Ghost', 'Grass', 'Ground', 'Holy', 'Ice', 'Magic', 'Metal', 'Profane', 'Psychic', 'Rock', 'Sand', 'Water'];

        NATURE_NAMES = [ "Hardy",  "Lonely",  "Brave",  "Adamant",  "Naughty",  "Bold",  "Docile",  "Relaxed",  "Impish",  "Lax",  "Timid",  "Hasty",  "Serious",  "Jolly",  "Naive",  "Modest",  "Mild",  "Quiet",  "Bashful",  "Rash",  "Calm",  "Gentle",  "Sassy",  "Careful", "Quirky"];

        AnimalType = ig.Class.extend({

            init: function(name){
                this.name = name;
                this.attack = [];
                this.defense = [];
                this._calcEffect(this.attack);
                this._calcEffect(this.defense);
            },

            _calcEffect: function(array){
                let rand = new Random(this.name + ig.global.gameSeed);
                let numNoEffect = rand.nextRange(0, 2);
                let numHalfEffect = rand.nextRange(1, 6);
                let numSuperEffect = rand.nextRange(1, 6);
                let types = [...TYPE_NAMES];
                rand.shuffle(types);
                types.slice(0, numNoEffect).forEach(type => array[type] = 0.0);
                types.slice(numNoEffect, numHalfEffect).forEach(type => array[type] = 0.5);
                types.slice(numNoEffect + numHalfEffect, numSuperEffect).forEach(type => array[type] = 2.0);
                types.slice(numNoEffect + numHalfEffect + numSuperEffect).forEach(type => array[type] = 1.0);
            },

            defenseEffect: function(AnimalType){
                return this.defense[AnimalType.name];
            },

            attackEffect: function(AnimalType){
                return this.attack[AnimalType.name];
            }
        });

        AnimalType.values = TYPE_NAMES.map(type => new AnimalType(type));
        AnimalType.values.forEach(type => AnimalType[type.name] = type);

        Nature = ig.Class.extend({
            init: function (name, increase, decrease) {
                this.name = name;
                STAT_NAMES.forEach(stat => this[stat] = 1.0);
                if(increase !== decrease){
                    this[increase] = 1.1;
                    this[decrease] = 0.9;
                }
            },
        });

        Nature.randomize = function(){
            let rand = new Random(ig.global.gameSeed);
            let pairs = [];
            let noHP = STAT_NAMES.filter(st => st !== 'hp');
            noHP.forEach(first => noHP.forEach( second => pairs.push([first,second])));
            rand.shuffle(pairs);
            Nature.values = NATURE_NAMES.map((name, index) => new Nature(name, pairs[index][0], pairs[index][1]));
            Nature.values.forEach(nat => Nature[nat.name] = nat);
        };
        Nature.randomize();
        
        Animal = ig.Class.extend({

            init: function (settings = {}) {
                this.name = settings.name || ig.game.rand.pick(ANIMAL_NAMES);
                this.level = settings.level || 1;
                this.type1 = settings.type1 || ig.game.rand.pick(TYPE_NAMES);
                this.type2 = settings.type2 || ig.game.rand.pick(TYPE_NAMES);
                this.nature = settings.nature || ig.game.rand.pick(Nature.values);
                rand = new Random(this.name + ig.global.gameSeed);
                this.bv = STAT_NAMES.map(_ => rand.nextInt(256));
                this.iv = STAT_NAMES.map(_ => ig.game.rand.nextInt(32));
                this.ev = STAT_NAMES.map(_ => 0);
                STAT_NAMES.forEach(att => this[att] = () => this._calcStatistic(att));
                this.health = settings.health || this.hp();
            },

            addEV: function (stat, points) {
                let sum = this.ev.reduce((total, s) => total + s, 0);
                let index = STAT_NAMES.indexOf(stat);
                if (sum + points > 510) {
                    points = 510 - sum;
                }
                if (this.ev[index] + points > 252) {
                    points = 252 - this.ev[index];
                }
                this.ev[index] += points;
            },

            delEV: function (stat, points) {
                let index = STAT_NAMES.indexOf(stat);
                if (points > this.ev[index]) {
                    points = this.ev[index];
                }
                this.ev[index] -= points;
            },

            _calcStatistic: function (att) {
                let index = STAT_NAMES.indexOf(att);
                let basevalue = this.bv[index];
                let ivalue = this.iv[index];
                let evalue = this.ev[index];
                let nat = this.nature[att];
                let st = Math.floor((2 * basevalue + ivalue + Math.floor(evalue / 4)) * this.level / 100);
                st = att === 'hp' ? st + this.level + 10 : Math.floor((st + 5) * nat);
                return st;
            }
        });

        EntityAnimal = HexEntity.extend({
            name: 'Animal',

            type: ig.Entity.TYPE.B,
            checkAgainst: ig.Entity.TYPE.BOTH,
            collides: ig.Entity.COLLIDES.ACTIVE,

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                if (!settings.animal) {
                    //ig.game.rand: hack weltmeister mode
                    if (this.isPlayer) {
                        this.animal = ig.game.rand ? ig.global.playerAnimal : { name: 'Adax' };
                    } else {
                        this.animal = ig.game.rand ? new Animal(settings) : { name: 'Alce' };
                    }
                }
                if (this.isPlayer) {
                    this.type = ig.Entity.TYPE.A;
                    this.process = () => ig.game.processUserAction(this);
                    this.name = 'Animal Player (' + this.animal.name + "-" + this.id + ')';
                }

                this.name = 'Animal ' + this.animal.name + '(' + this.id + ')';
                this.animSheet = new ig.AnimationSheet('media/animals/' + this.animal.name + '.png', 64, 64),
                    this.addAnim('stub', 0.1, [0]);
            },

            process: function () {
                return this.actionExplore();
            },

            handle_colision: function (other) {
                console.log("Collision with " + other.name);
            },

            actionExplore: function () {
                let options = Direction.values.filter(x => x !== this.direction.opposite && ig.game.canMove(this, x));
                let newDirection = this.direction;
                if (options) {
                    newDirection = options.length > 0 && ig.game.rand.pick(options);
                }
                return this.move(newDirection);
            },

            actionGraze: function () {
                if (!this.grazeCount || this.grazeCount === 0) {
                    this.grazeCount = ig.game.rand.nextInt(10);
                    return this.actionExplore();
                }
            }
        });
    });
