
ig.module(
    'game.HexTrigger'
)
    .requires(
        'game.HexGame',
        'impact.entity'
    )
    .defines(function () {

        HexTrigger = ig.Entity.extend({
            size: { x: 16, y: 16 },
            priority: 1,
            isTriggerMode: true,

            type: ig.Entity.TYPE.A,
            checkAgainst: ig.Entity.TYPE.BOTH,
            collides: ig.Entity.COLLIDES.ACTIVE,

            _wmDrawBox: true,

            entities: [],
            _processing: [],
            _enter: [],
            _stay: [],
            _leave: [],
            _interact: null,

            doTriggerLeave: function () {
                let result = false;
                this._leave = [];
                for (let ent of this.entities.filter(x => !this.touches(x))) {
                    result = this.triggerOnCollisionLeaves(ent) || result;
                    this._leave.push(ent);
                }
                return result;
            },

            doTriggerStay: function () {
                let result = false;
                this._stay = [];
                for (let ent of this.entities.filter(x => this.touches(x))) {
                    result = this.triggerOnCollisionStays(ent) || result;
                    this._stay.push(ent);
                }
                return result;
            },

            doTriggerEnter: function () {
                let result = false;
                this._enter = [];
                for (let ent of this._processing) {
                    result = this.triggerOnCollisionEnters(ent) || result;
                    this._enter.push(ent);
                }
                this._processing = [];
                return result;
            },

            doTrigger: function () {
                let result = false;
                this._leave.forEach(x => result = this.trigger(x) || result);
                this._stay.forEach(x => result = this.trigger(x) || result);
                this._enter.forEach(x => result = this.trigger(x) || result);

                this._stay.push(...this._enter);
                this.entities = this._stay;
                return result;
            },

            doTriggerInteract: function () {
                if (this._interact) {
                    if (this.triggerOnInteract(this._interact)) {
                        return true;
                    } else {
                        this._interact = null;
                        return false;
                    }
                }
                return false;
            },

            trigger: function (ent) {
                return false;
            },

            triggerOnCollisionStays: function (ent) {
                return false;
            },

            triggerOnCollisionEnters: function (ent) {
                return false;
            },

            triggerOnCollisionLeaves: function (ent) {
                return false;
            },

            triggerOnInteract: function (ent) {
                return false;
            },

            interact: function (ent) {
                this._interact = ent;
            },

            check(other) {
                if (!this.entities.includes(other) && !this._processing.includes(other)) {
                    this._processing.push(other);
                }
            }
        });
    });
