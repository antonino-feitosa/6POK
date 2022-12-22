
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
		flip: false,

		type: ig.Entity.TYPE.A,
		checkAgainst: ig.Entity.TYPE.BOTH,
		collides: ig.Entity.COLLIDES.ACTIVE,

        _wmDrawBox: true,

        processing: [],
        newProcessing: [],

		doTrigger: function () {
            let result = false;
            let processed = [];

            for(let ent of this.processing){
                if(this.touches(ent)){
                    result = this.triggerOnCollisionStays(ent) || result;
                    processed.push(ent);
                } else {
                    result = this.triggerOnCollisionLeaves(ent) || result;
                }
            }

            for(let ent of this.newProcessing){
                result = this.trigger(ent) || result;
                result = this.triggerOnCollisionEnters(ent) || result;
                processed.push(ent);
            }

            processed.forEach(ent => result = this.trigger(ent) || result);
            this.processing = processed;
            this.newProcessing = [];
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
            if(!this.processing.includes(other) && !this.newProcessing.includes(other))
                this.newProcessing.push(other);
        }
	});
});
