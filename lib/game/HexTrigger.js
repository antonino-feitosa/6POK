
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

		doTrigger: function () {
            let result = false;
            let processed = [];

            for(let ent of this._processing){
                result = this.trigger(ent) || result;
                result = this.triggerOnCollisionEnters(ent) || result;
                processed.push(ent);
            }

            let leave = [];
            for(let ent of this.entities){
                if(this.touches(ent)){
                    result = this.triggerOnCollisionStays(ent) || result;
                    processed.push(ent);
                } else {
                    leave.push(ent);
                }
            }

            leave.forEach(ent => result = this.triggerOnCollisionLeaves(ent) || result);

            entities.forEach(ent => result = this.trigger(ent) || result);
            this.entities = processed;
            this._processing = [];
            return result;
		},

        trigger(ent){
            console.log('Trigger');
            return false;
        },

        triggerOnCollisionStays(ent){
            console.log('Trigger Stays');
            return false;
        },

        triggerOnCollisionEnters(ent){
            console.log('Trigger Enters');
            return false;
        },

        triggerOnCollisionLeaves(ent){
            console.log('Trigger Leaves');
            return false;
        },

        check(other){
            if(!this.entities.includes(other) && !this._processing.includes(other))
                this._processing.push(other);
        }
	});
});
