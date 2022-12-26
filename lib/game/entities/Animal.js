
ig.module('game.entities.Animal')
.requires(
    'game.HexEntity',
    'game.Random',
    'game.Direction'
).defines(function () {

    STAT_NAMES = ['hp', 'atk', 'def', 'spatk', 'spdef', 'speed'];

    Nature = ig.Class.extend({
        init: function (name, increase, decrease) {
            this.name = name;
            this.stats = [1, 1, 1, 1, 1, 1];
            this.stats[STAT_NAMES.indexOf(increase)] = 1.1;
            this.stats[STAT_NAMES.indexOf(decrease)] = 0.9;
        }
    });

    Nature.Hardy = new Nature('Hardy');
    Nature.Lonely = new Nature('Lonely', 'atk', 'def');
    Nature.Brave = new Nature('Brave', 'atk', 'speed');
    Nature.Adamant = new Nature('Adamant', 'atk', 'spatk');
    Nature.Naughty = new Nature('Naughty', 'atk', 'spdef');

    Nature.Bold = new Nature('Bold', 'def', 'atk');
    Nature.Docile = new Nature('Docile');
    Nature.Relaxed = new Nature('Relaxed', 'def', 'speed');
    Nature.Impish = new Nature('Impish', 'def', 'spatk');
    Nature.Lax = new Nature('Lax', 'def', 'spdef');

    Nature.Timid = new Nature('Timid', 'speed', 'atk');
    Nature.Hasty = new Nature('Hasty', 'speed', 'def');
    Nature.Serious = new Nature('Serious');
    Nature.Jolly = new Nature('Jolly', 'speed', 'spatk');
    Nature.Naive = new Nature('Naive', 'speed', 'spdef');

    Nature.Modest = new Nature('Modest', 'spatk', 'atk');
    Nature.Mild = new Nature('Mild', 'spatk', 'def');
    Nature.Quiet = new Nature('Quiet', 'spatk', 'speed');
    Nature.Bashful = new Nature('Bashful');
    Nature.Rash = new Nature('Rash', 'spatk', 'spdef');

    Nature.Calm = new Nature('Calm', 'spdef', 'atk');
    Nature.Gentle = new Nature('Gentle', 'spdef', 'def');
    Nature.Sassy = new Nature('Sassy', 'spdef', 'speed');
    Nature.Careful = new Nature('Careful', 'spdef', 'spatk');
    Nature.Quirky = new Nature('Quirky');

    Nature.values = [Nature.Hardy, Nature.Lonely, Nature.Brave, Nature.Adamant, Nature.Naughty, Nature.Bold, Nature.Docile, Nature.Relaxed, Nature.Impish, Nature.Lax, Nature.Timid, Nature.Hasty, Nature.Serious, Nature.Jolly, Nature.Naive, Nature.Modest, Nature.Mild, Nature.Quiet, Nature.Bashful, Nature.Rash, Nature.Calm, Nature.Gentle, Nature.Sassy, Nature.Careful, Nature.Quirky];

    Animal = ig.Class.extend({

        init: function (settings = {}) {
            this.name = settings.name || ig.game.rand.pick(Animal.Names);
            this.level = settings.level || 1;
            this.nature = settings.nature || nature;
            rand = new Random(this.name + ig.game.gameSeed);
            this.bv = STAT_NAMES.forEach(_ => rand.nextInt(256));
            this.iv = STAT_NAMES.forEach(_ => ig.game.rand.nextInt(32));
            this.ev = STAT_NAMES.forEach(_ => 0);
            STAT_NAMES.forEach(att => this[att] = () => this._calcStatistic(att));
        },

        addEV: function(stat, points){
            let sum = this.ev.reduce((total, s) => total + s, 0);
            let index = STAT_NAMES.indexOf(att);
            if(sum + points > 510){
                points = 510 - sum;
            }
            if(this.ev[index] + points > 252){
                points = 252 - this.ev[index];
            }
            this.ev[index] += points;
        },

        delEV: function(stat, points){
            let index = STAT_NAMES.indexOf(att);
            if(points > this.ev[index]){
                points = this.ev[index];
            }
            this.ev[index] -= points;
        },

        _calcStatistic: function (att) {
            let index = STAT_NAMES.indexOf(att);
            let basevalue = this.bv[index];
            let ivalue = this.iv[index];
            let evalue = this.ev[index];
            let nat = this.stats[index];
            let st = Math.floor((2 * basevalue + ivalue + Math.floor(evalue / 4)) * this.level / 100);
            st = att === hp ? st + this.level + 10 : Math.floor((st + 5) * nat);
            return st;
        }
    });

    Animal.Types = ['air','dark','eletric','fire','ghost','grass','ground','holy','ice','magic','metal','profane','psychic','rock','sand','water'];

    Animal.Names = ['Adax', 'Alce', 'Almiqui', 'Anta', 'Arganaz', 'Asellia', 'Asno'];

    EntityAnimal = HexEntity.extend({
        name: 'animal',

        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.ACTIVE,

        animSheet: new ig.AnimationSheet('media/animals/Alce.png', 64, 64),

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('stub', 0.1, [0]);
        },

        process: function () {
            return this.actionExplore();
        },

        handle_colision: function (other) {
            console.log("Collision with " + other.name);
        },

        actionExplore: function(){
            let options = Direction.values.filter(x => x !== this.direction.opposite && ig.game.canMove(this, x));
            if(options){
                this.direction = options.length > 0 && ig.game.rand.pick(options);
            }
            return this.move();
        },

        actionGraze: function(){
            if(!this.grazeCount || this.grazeCount === 0){
                this.grazeCount = ig.game.rand.nextInt(10);
                return this.actionExplore();
            }
        }
    });
});
