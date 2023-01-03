
ig.module('game.entities.Spawn')
    .requires(
        'impact.entity',
        'game.entities.Animal'
    ).defines(function () {

        EntitySpawn = ig.Entity.extend({
            name: 'Spawn Point',

            size: { x: 16, y: 16 },
            offset: { x: (64 - 16) / 2, y: (64 - 16) / 2 },

            probability: 1.0,

            _wmDrawBox: true,
            _wmBoxColor: '#00FF00',

            _messages: [],
            _state: 'start',

            init(x, y, settings) {
                this.parent(x, y, settings);
                this.settins = settings;
            },

            update: function () {
                if(this._state === 'start'){
                    if (this.idGroup) {
                        this.r = ig.game.rand.nextDouble();
                        this.sendMessage({ id: this.id, value: this.r });
                        this._state = 'receive_messages';
                    } else {
                        this._state = 'end';
                    }
                } else if(this._state === 'receive_messages'){
                    // wait for the update of each enity in the group
                    let max = null;
                    let repeat = false;
                    this._messages.forEach(msg => {
                        if (max === null || msg.value >= max.value) {
                            repeat = max && max.value === msg.value;
                            max = msg;
                        }
                    });
                    if(repeat){
                        this._state = 'start';
                    } else if(this.id == max.id){
                        this._state = 'end';
                    } else {
                        this._state = 'kill';
                    }
                } else if(this._state === 'end'){
                    if (ig.game.rand.nextDouble() < this.probability) {
                        ig.game.spawnEntity(EntityAnimal, this.pos.x, this.pos.y, this.settings);
                    }
                    this._state = 'kill';
                } else if(this._state === 'kill'){
                    this.kill();
                }
            },

            sendMessage(message) {
                let group = ig.game.getGroup(this);
                group.forEach(ent => ent._messages.push(message));
            },

            receiveMessage() {
                return this._messages.shift();
            },

            hasMessage() {
                return this._messages.length > 0;
            },
        });
    });
