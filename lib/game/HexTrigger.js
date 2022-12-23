
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

		type: ig.Entity.TYPE.A,
		checkAgainst: ig.Entity.TYPE.BOTH,
		collides: ig.Entity.COLLIDES.ACTIVE,

        _wmDrawBox: true,

        entities: [],
        _processing: [],
        _enter: [],
        _stay: [],
        _leave: [],

        doTriggerLeave: function(){
            let result = false;
            this._leave = [];
            for(let ent of this.entities.filter(x => !this.touches(x))){
                result = this.triggerOnCollisionLeaves(ent) || result;
                this._leave.push(ent);
            }
            return result;
        },

        doTriggerStay: function(){
            let result = false;
            this._stay = [];
            for(let ent of this.entities.filter(x => this.touches(x))){
                result = this.triggerOnCollisionStays(ent) || result;
                this._stay.push(ent);
            }
            return result;
        },

        doTriggerEnter: function(){
            let result = false;
            this._enter = [];
            for(let ent of this._processing){
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

        trigger(ent){
            return false;
        },

        triggerOnCollisionStays(ent){
            return false;
        },

        triggerOnCollisionEnters(ent){
            return false;
        },

        triggerOnCollisionLeaves(ent){
            return false;
        },

        check(other){
            if(!this.entities.includes(other) && !this._processing.includes(other)){
                this._processing.push(other);
            }
        }
	});
});
