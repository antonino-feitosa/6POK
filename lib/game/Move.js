

ig.module(
    'game.Move'
)
    .requires(
        'game.Constants',
    )
    .defines(function () {

        Effect = ig.Class.extend({

            setEntity: function (entity) {
                this.entity = entity;
            },

            apply: function (modifier, move, targets) {
            },

            process() {

            },

            randomize: function (move) {

            },

            getLookPosition() {
                return this.entity.pos;
            },

            getLookDirection() {
                return this.entity.direction;
            }
        });

        CATEGORY = {
            PHYSICAL: 0,
            SPECIAL: 1
        };

        TARGET = {
            SELF: 0b0001,
            ALLY: 0b0010,
            ENEMY: 0b0100,
            WORLD: 0b1000
        };

        SINGLE_TARGET = {
            NONE: 0,
            NEAR: 0b001,
            FAR: 0b010,
            RANDOM: 0b100
        };

        MULTIPLE_TARGET = {
            NONE: 0,
            NEAR: 0b0001,
            FAR: 0b0010,
            RANDOM: 0b0100,
            ALL: 0b1000
        };

        RANGE_TYPE = {
            POSITION: 'position',
            RADIAL: 'radial',
            LINE: 'line',
            CONE: 'cone'
        };

        // multiple target
        // single, near, far, random

        // type damage
        //all, crescente, descrescente


        Move = ig.Class.extend({

            name: 'move empty',
            minLevel: 1,
            effect: null,
            type: TYPE.Ground,
            isPhysical: true,
            isSpecial: false,
            power: 20,
            accuracy: 1.0,
            maxCharge: 10,
            cooldown: 10,
            numTargets: 1,
            target: TARGET.ENEMY,
            singleTarget: SINGLE_TARGET.NEAR,
            multipleTarget: MULTIPLE_TARGET.NONE,
            rangeType: RANGE_TYPE.LINE,
            range: 1,

            setEntity(entity) {
                this.entity = entity;
                this.effect.setEntity(this.entity);
            },

            getTargets() {
                let look = this._processTargets();
                if (this.singleTarget) {
                    look = this._processSingleTarget(look);
                } else if (this.multipleTarget) {
                    look = this._processMultipleTargets(look);
                }
                let targets = this._processTargetType(look);
                return targets;
            },

            _processTargets() {
                let look = [];
                let lookPos = this.effect.getLookPosition();
                let lookDir = this.effect.getLookDirection();
                switch (this.rangeType) {
                    case RANGE_TYPE.POSITION:
                        look = ig.game.lookAtPosition(lookPos);
                        break;
                    case RANGE_TYPE.RADIAL:
                        look = ig.game.lookAtRadius(lookPos, this.range);
                        break;
                    case RANGE_TYPE.LINE:
                        look = ig.game.lookAtLine(lookPos, this.range, lookDir);
                        break;
                    case RANGE_TYPE.CONE:
                        look = ig.game.lookAtCone(lookPos, this.range, lookDir);
                        break;
                }
                return look;
            },

            _processTargetType(look) {
                let targets = {};
                targets.all = [];
                if (this.target & TARGET.SELF) {
                    targets.self = this.entity;
                    targets.all = [targets.self];
                }
                if (this.target & TARGET.ENEMY) {
                    targets.enemies = look.filter(e => e.isEntity && e.ent.type !== this.entity.type);
                    targets.enemies.map(e => e.ent);
                    targets.all += targets.enemies;
                }
                if (this.target & TARGET.ALLY) {
                    targets.allies = look.filter(e => e.isEntity && e.ent.type === this.entity.type && e.ent.id !== this.entity.id);
                    targets.allies.map(e => e.ent);
                    targets.all += targets.allies;
                }
                if (this.target & TARGET.WORLD) {
                    targets.world = look.filter(e => e.isTrigger);
                    targets.world.map(e => e.ent);
                    targets.all += targets.world;
                }
                return targets;
            },

            _processSingleTarget(look) {
                if (this.singleTarget === SINGLE_TARGET.RANDOM) {
                    return this.rand.pick(look);
                } else {
                    look.sort((x, y) => x.dist < y.dist);
                    if (this.singleTarget === SINGLE_TARGET.NEAR) {
                        return look[0];
                    } else if (this.singleTarget === SINGLE_TARGET.FAR) {
                        return look[look.length - 1];
                    }
                }
                return null;
            },

            _processMultipleTargets(look) {
                if (this.multipleTarget !== MULTIPLE_TARGET.ALL) {
                    if (this.multipleTarget === MULTIPLE_TARGET.RANDOM) {
                        if (look.length > this.numTargets) {
                            this.rand.shuffle(look);
                        }
                    } else {
                        if (this.multipleTarget === SINGLE_TARGET.NEAR) {
                            look.sort((x, y) => x.dist < y.dist);
                        } else if (this.multipleTarget === SINGLE_TARGET.FAR) {
                            look.sort((x, y) => x.dist > y.dist);
                        }
                    }
                    look = look.slice(0, Math.min(look.length, this.numTargets));
                }
                return look;
            }
        });

        // Effects

        EffectPound = {

            apply: function (modifier, move, targets) {
                let player = this.entity.animal;
                let enemy = targets.enemies[0];
                let level = player.level;
                let attack = move.isPhysical ? player.atk() : player.spatk();
                let defense = move.isPhysical ? enemy.def() : enemy.spdef();
                let damage = ((2 * level) / 5 * move.power * attack / defense) / 50 + 2;
                damage *= modifier.isCritical ? 1.5 : 1;
                damage *= ig.game.map.type === move.type ? 2 : 1;
                damage *= AnimalType[move.type].attackEffect(AnimalType[enemy.type1]);
                damage *= AnimalType[move.type].attackEffect(AnimalType[enemy.type2]);
                damage *= move.rand.nextRange(85, 101);
                damage = Math.floor(damage / 100);
                return damage;
            },

            _createEmptyMove() {
                let move = new Move();
                move.effect = this;
                move.charge = move.maxCharge;
                move.cooldown = 10;
                move.isPhysical = true;
                move.accuracy = 1.0;
                move.numTargets = 1;
                move.target = TARGET.ENEMY;
                move.singleTarget = SINGLE_TARGET.NEAR;
                move.multipleTarget = MULTIPLE_TARGET.NONE;
                move.rangeType = RANGE_TYPE.LINE;
                move.range = 1;
            },

            _fillOptions(options) {
                let moves = [];
                for (let type of TYPE) {
                    for (let opt of options) {
                        let move = this._createEmptyMove();
                        move.type = type;
                        move.name = opt.name + move.type;
                        move.minLevel = opt.level;
                        move.power = opt.power;
                        move.maxCharge = opt.charge;
                        move.accuracy = opt.accuracy;
                        moves.push(move);
                    }
                }
                return moves;
            },

            makeStart() {
                let options = [
                    { name: 'Pound I ', power: 40, charge: 10, level: 1, accuracy: 1 },
                    { name: 'Anger Pound I ', power: 60, charge: 10, level: 1, accuracy: 0.8 }
                ];
                return this._fillOptions(options);
            },

            makeLeveling() {
                let options = [
                    { name: "Pound II ", power: 60, charge: 8, level: 8 },
                    { name: "Pound III ", power: 80, charge: 6, level: 16 },
                    { name: "Pound IV ", power: 100, charge: 4, level: 24 },
                    { name: "Anger Pound II ", power: 80, charge: 8, level: 12, accuracy: 0.8 },
                    { name: "Anger Pound III ", power: 100, charge: 6, level: 24, accuracy: 0.8 },
                    { name: "Anger Pound IV ", power: 120, charge: 3, level: 36, accuracy: 0.8 }
                ];
                return this._fillOptions(options);
            },

            makeFinal() {
                let options = [
                    { name: 'Pound V ', power: 120, charge: 2, level: 1, accuracy: 1 },
                    { name: 'Anger Pound V ', power: 150, charge: 1, level: 1, accuracy: 0.8 }
                ];
                return this._fillOptions(options);
            }
        };

        AnimalMove = ig.Class.extend({

            move: null,
            _charge: 10,
            _turns: 0,

            init(move) {
                this.move = move;
                this._charge = this.move.maxCharge;
                this._turns = 0;
            },

            setEntity(entity) {
                this.move.setEntity(entity);
            },

            apply() {
                if (this._charge > 0) {
                    this.move.effect.apply({}, this.move, this.move.getTargets());
                    this._charge -= 1;
                    return true;
                }
                return false;
            },

            process() {
                this.move.effect.process();
                this._turns += 1;
                if (this._turns >= this.move.cooldown) {
                    this._turns = 0;
                    if (this._charge < this.move.maxCharge) {
                        this._charge += 1;
                    }
                }
            },
        });


        MoveList = ig.Class.extend({

            list: [],

            init(animal) {
                if (!MoveList.lists[animal.name]) {
                    let start = MoveList.startMoves.filter(move.type === animal.type1 || move.type === animal.type2);
                    let end = MoveList.finalMoves.filter(move.type === animal.type1 || move.type === animal.type2);
                    let leveling = MoveList.levelingMoves.filter(move.type === animal.type1 || move.type === animal.type2);
                    let others = MoveList.levelingMoves.filter(move.type !== animal.type1 && move.type !== animal.type2);

                    let rand = new Random(animal.name);
                    let list = [];
                    list += rand.sample(start, 4);
                    list += rand.sample(leveling, 12);
                    list += rand.sample(others, 6);
                    list += rand.sample(end, 8);
                    list.sort((x, y) => x.minLevel - y.minLevel);

                    MoveList.lists[animal.name] = list;
                }
                this.list = [... (MoveList.lists[animal.name])];
                this.movesToLevel(animal.level);
            },

            hasMove() {
                return this.list.length > 0;
            },

            peekMove() {
                return this.list[0];
            },

            popMove() {
                return this.list.shift();
            },

            popStartMoves() {
                let moves = this.list.slice(0, 4);
                this.list = this.list.slice(4);
                return moves;
            },

            movesToLevel(level) {
                let count = 4;
                while (count < this.list.length && level < this.list[count - 1].minLevel) {
                    count++;
                }
                this.list = this.list.slice(count - 4);
            }
        });

        MoveList.lists = {};
        MoveList.startMoves = EffectPound.makeStart();
        MoveList.levelingMoves = EffectPound.makeLeveling();
        MoveList.finalMoves = EffectPound.makeFinal();
    });
