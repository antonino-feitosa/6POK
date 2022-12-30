
ig.module('game.entities.Animal')
    .requires(
        'game.HexEntity',
        'game.Random',
        'game.Direction'
    ).defines(function () {

        ANIMAL_NAMES = ['Adax', 'Alce', 'Almiqui', 'Anta', 'Arganaz', 'Asellia', 'Asno'];

        STAT_NAMES = ['hp', 'atk', 'def', 'spatk', 'spdef', 'speed'];

        TYPE_NAMES = ['Air', 'Dark', 'Eletric', 'Fire', 'Ghost', 'Grass', 'Ground', 'Holy', 'Ice', 'Magic', 'Metal', 'Profane', 'Psychic', 'Rock', 'Sand', 'Toxic', 'Water'];

        NATURE_NAMES = ["Hardy", "Lonely", "Brave", "Adamant", "Naughty", "Bold", "Docile", "Relaxed", "Impish", "Lax", "Timid", "Hasty", "Serious", "Jolly", "Naive", "Modest", "Mild", "Quiet", "Bashful", "Rash", "Calm", "Gentle", "Sassy", "Careful", "Quirky"];

        AnimalType = ig.Class.extend({

            init: function (name) {
                this.name = name;
                this.attack = [];
                this.defense = [];
                this._calcEffect(this.attack);
                this._calcEffect(this.defense);
            },

            _calcEffect: function (array) {
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

            defenseEffect: function (AnimalType) {
                return this.defense[AnimalType.name];
            },

            attackEffect: function (AnimalType) {
                return this.attack[AnimalType.name];
            }
        });

        AnimalType.values = TYPE_NAMES.map(type => new AnimalType(type));
        AnimalType.values.forEach(type => AnimalType[type.name] = type);

        Nature = ig.Class.extend({
            init: function (name, increase, decrease) {
                this.name = name;
                STAT_NAMES.forEach(stat => this[stat] = 1.0);
                if (increase !== decrease) {
                    this[increase] = 1.1;
                    this[decrease] = 0.9;
                }
            },
        });

        Nature.randomize = function () {
            let rand = new Random(ig.global.gameSeed);
            let pairs = [];
            let noHP = STAT_NAMES.filter(st => st !== 'hp');
            noHP.forEach(first => noHP.forEach(second => pairs.push([first, second])));
            rand.shuffle(pairs);
            Nature.values = NATURE_NAMES.map((name, index) => new Nature(name, pairs[index][0], pairs[index][1]));
            Nature.values.forEach(nat => Nature[nat.name] = nat);
        };
        Nature.randomize();

        Experience = ig.Class.extend({
            init: function (name, values) {
                this.name = name;
                this.values = values;
            },

            expByLevel: function (level) {
                return this.values[level - 1];
            }
        });

        Experience.Erratic = new Experience('Erratic', [0, 15, 52, 122, 237, 406, 637, 942, 1326, 1800, 2369, 3041, 3822, 4719, 5737, 6881, 8155, 9564, 11111, 12800, 14632, 16610, 18737, 21012, 23437, 26012, 28737, 31610, 34632, 37800, 41111, 44564, 48155, 51881, 55737, 59719, 63822, 68041, 72369, 76800, 81326, 85942, 90637, 95406, 100237, 105122, 110052, 115015, 120001, 125000, 131324, 137795, 144410, 151165, 158056, 165079, 172229, 179503, 186894, 194400, 202013, 209728, 217540, 225443, 233431, 241496, 249633, 257834, 267406, 276458, 286328, 296358, 305767, 316074, 326531, 336255, 346965, 357812, 367807, 378880, 390077, 400293, 411686, 423190, 433572, 445239, 457001, 467489, 479378, 491346, 501878, 513934, 526049, 536557, 548720, 560922, 571333, 583539, 591882, 600000]);
        Experience.Fast = new Experience('Fast', [0, 6, 21, 51, 100, 172, 274, 409, 583, 800, 1064, 1382, 1757, 2195, 2700, 3276, 3930, 4665, 5487, 6400, 7408, 8518, 9733, 11059, 12500, 14060, 15746, 17561, 19511, 21600, 23832, 26214, 28749, 31443, 34300, 37324, 40522, 43897, 47455, 51200, 55136, 59270, 63605, 68147, 72900, 77868, 83058, 88473, 94119, 100000, 106120, 112486, 119101, 125971, 133100, 140492, 148154, 156089, 164303, 172800, 181584, 190662, 200037, 209715, 219700, 229996, 240610, 251545, 262807, 274400, 286328, 298598, 311213, 324179, 337500, 351180, 365226, 379641, 394431, 409600, 425152, 441094, 457429, 474163, 491300, 508844, 526802, 545177, 563975, 583200, 602856, 622950, 643485, 664467, 685900, 707788, 730138, 752953, 776239, 800000]);
        Experience.MediumFast = new Experience('MediumFast', [0, 8, 27, 64, 125, 216, 343, 512, 729, 1000, 1331, 1728, 2197, 2744, 3375, 4096, 4913, 5832, 6859, 8000, 9261, 10648, 12167, 13824, 15625, 17576, 19683, 21952, 24389, 27000, 29791, 32768, 35937, 39304, 42875, 46656, 50653, 54872, 59319, 64000, 68921, 74088, 79507, 85184, 91125, 97336, 103823, 110592, 117649, 125000, 132651, 140608, 148877, 157464, 166375, 175616, 185193, 195112, 205379, 216000, 226981, 238328, 250047, 262144, 274625, 287496, 300763, 314432, 328509, 343000, 357911, 373248, 389017, 405224, 421875, 438976, 456533, 474552, 493039, 512000, 531441, 551368, 571787, 592704, 614125, 636056, 658503, 681472, 704969, 729000, 753571, 778688, 804357, 830584, 857375, 884736, 912673, 941192, 970299, 1000000]);
        Experience.MediumSlow = new Experience('MediumSlow', [0, 9, 57, 96, 135, 179, 236, 314, 419, 560, 742, 973, 1261, 1612, 2035, 2535, 3120, 3798, 4575, 5460, 6458, 7577, 8825, 10208, 11735, 13411, 15244, 17242, 19411, 21760, 24294, 27021, 29949, 33084, 36435, 40007, 43808, 47846, 52127, 56660, 61450, 66505, 71833, 77440, 83335, 89523, 96012, 102810, 109923, 117360, 125126, 133229, 141677, 150476, 159635, 169159, 179056, 189334, 199999, 211060, 222522, 234393, 246681, 259392, 272535, 286115, 300140, 314618, 329555, 344960, 360838, 377197, 394045, 411388, 429235, 447591, 466464, 485862, 505791, 526260, 547274, 568841, 590969, 613664, 636935, 660787, 685228, 710266, 735907, 762160, 789030, 816525, 844653, 873420, 902835, 932903, 963632, 995030, 1027103, 1059860]);
        Experience.Slow = new Experience('Slow', [0, 10, 33, 80, 156, 270, 428, 640, 911, 1250, 1663, 2160, 2746, 3430, 4218, 5120, 6141, 7290, 8573, 10000, 11576, 13310, 15208, 17280, 19531, 21970, 24603, 27440, 30486, 33750, 37238, 40960, 44921, 49130, 53593, 58320, 63316, 68590, 74148, 80000, 86151, 92610, 99383, 106480, 113906, 121670, 129778, 138240, 147061, 156250, 165813, 175760, 186096, 196830, 207968, 219520, 231491, 243890, 256723, 270000, 283726, 297910, 312558, 327680, 343281, 359370, 375953, 393040, 410636, 428750, 447388, 466560, 486271, 506530, 527343, 548720, 570666, 593190, 616298, 640000, 664301, 689210, 714733, 740880, 767656, 795070, 823128, 851840, 881211, 911250, 941963, 973360, 1005446, 1038230, 1071718, 1105920, 1140841, 1176490, 1212873, 1250000]);
        Experience.Fluctuating = new Experience('Fluctuating', [0, 4, 13, 32, 65, 112, 178, 276, 393, 540, 745, 967, 1230, 1591, 1957, 2457, 3046, 3732, 4526, 5440, 6482, 7666, 9003, 10506, 12187, 14060, 16140, 18439, 20974, 23760, 26811, 30146, 33780, 37731, 42017, 46656, 50653, 55969, 60505, 66560, 71677, 78533, 84277, 91998, 98415, 107069, 114205, 123863, 131766, 142500, 151222, 163105, 172697, 185807, 196322, 210739, 222231, 238036, 250562, 267840, 281456, 300293, 315059, 335544, 351520, 373744, 390991, 415050, 433631, 459620, 479600, 507617, 529063, 559209, 582187, 614566, 639146, 673863, 700115, 737280, 765275, 804997, 834809, 877201, 908905, 954084, 987754, 1035837, 1071552, 1122660, 1160499, 1214753, 1254796, 1312322, 1354652, 1415577, 1460276, 1524731, 1571884, 1640000]);
        Experience.values = [Experience.Erratic, Experience.Fast, Experience.MediumFast, Experience.MediumSlow, Experience.Slow, Experience.Fluctuating];

        Animal = ig.Class.extend({

            init: function () {
                this.name = ig.game.rand.pick(ANIMAL_NAMES);
                this.level = 1;
                rand = new Random(this.name + ig.global.gameSeed);
                this.type1 = rand.pick(TYPE_NAMES);
                this.type2 = rand.pick(TYPE_NAMES);
                this.nature = rand.pick(Nature.values);
                this.bv = STAT_NAMES.map(_ => rand.nextInt(256));
                this.iv = STAT_NAMES.map(_ => ig.game.rand.nextInt(32));
                this.ev = STAT_NAMES.map(_ => 0);
                STAT_NAMES.forEach(att => this[att] = () => this._calcStatistic(att));
                this.health = this.hp();
                this.expFunction = rand.pick(Experience.values);
                this.exp = this.expFunction.expByLevel(this.level);

                this.baseExp = rand.nextRange(50, 501);
                this.yield = STAT_NAMES.map(_ => rand.nextInt(4));
                let sum = 0;
                for (let i = 0; i < this.yield.length; i++) {
                    if (this.yield[i] + sum > 3) {
                        this.yield[i] = 3 - sum;
                    }
                    sum += this.yield[i];
                }
                rand.shuffle(this.yield);
            },

            onLevelUp: function(level){

            },

            earnExp: function(points){
                if(this.level >= 100){
                    return;
                }
                let pointsNextLevel = this.expFunction.expByLevel(this.level + 1);
                while(points + this.exp > pointsNextLevel){
                    points -= pointsNextLevel - this.exp;
                    this.exp = pointsNextLevel;
                    this.level += 1;
                    this.onLevelUp(this.level);
                    pointsNextLevel = this.expFunction.expByLevel(this.level + 1);
                }
                this.exp += points;
            },

            yieldExp: function (level) {
                let be = this.baseExp;
                let l = this.level;
                return Math.ceil((be * l) / 5 + ((2 * l + 10) / (l + level + 10)) ** (2.5))
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
