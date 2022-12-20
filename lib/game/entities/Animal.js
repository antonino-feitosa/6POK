
ig.module('game.entities.Animal')
.requires(
    'game.HexEntity',
    'game.Random'
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

    AnimalStatistics = ig.Class.extend({

        init: function (name, nature, level = 1) {
            this.level = level;
            this.nature = nature;
            rand = new Random(name + ig.game.gameSeed);
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

    EntityAnimal = HexEntity.extend({
        name: 'animal',

        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.ACTIVE,

        animSheet: new ig.AnimationSheet('media/animals/Adax.png', 64, 64),

        init: function (x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('stub', 0.1, [0]);
        },

        process: function () {
            return false;
        },

        handle_colision: function (other) {
            console.log("Collision with " + other.name);
        }
    });
});
