
ig.module('plugins.powers.unitstub')
.requires(
    'impact.animation',
    'plugins.powers.moveable'
)
.defines(function () {
    EntityUnitStub = EntityMoveable.extend({
        alpha: 1.0,

        init: function(x, y, settings){
            this.parent(x, y, settings);

            let idle = 'media/Unit - Circle - Front - Idle.png';
            let move = 'media/Unit - Circle - Front - Move.png';
            let att = 'media/Unit - Circle - Front - Attack.png';
            let dead = 'media/Unit - Circle - Front - Dead.png';
            let hit = 'media/Unit - Circle - Front - Hit.png';
            let loot = 'media/Unit - Circle - Front - Loot.png';

            this.addDirections('idle', idle);
            this.addDirections('move', move);
            this.addDirections('hit', hit);
            this.addDirections('att', att, true);
            this.addDirections('dead', dead, true);
            this.addDirections('loot', loot, true);
        },

        attack: function(entity, x, y, settings){
            this.currentAnim = this.anims['att' + this.direction.name].rewind();
            // TODO call attack before animation
            this.parent(entity, x, y, settings);
            this.waitForAnimation();
        },

        kill: function() {
            this.currentAnim = this.anims['dead' + this.direction.name].rewind();
            this.waitForAnimation(this.parent);
        },
        
        receiveDamage: function(amount, from) {
            this.parent(amount, from);
            let old = this.currentAnim;
            this.currentAnim = this.anims['hit' + this.direction.name].rewind();
            this.waitForAnimation(() => this.currentAnim = old);
        },

        addDirections(name, path, stop = false, frameTime = 1.0/8.0, sequence = [0,1,2,3,4,5,6,7]) {
            this.addAnimation(name + 'front', path, false, 0, stop, frameTime, sequence);
            this.addAnimation(name + 'frontup', path, false, -Math.PI/4, stop, frameTime, sequence);
            this.addAnimation(name + 'frontdown', path, false, Math.PI/4, stop, frameTime, sequence);
            this.addAnimation(name + 'back', path, true, 0, stop, frameTime, sequence);
            this.addAnimation(name + 'backup', path, true, Math.PI/4, stop, frameTime, sequence);
            this.addAnimation(name + 'backdown', path, true, -Math.PI/4, stop, frameTime, sequence);
        },

        addAnimation: function(name, path, flip, angle, stop, frameTime, sequence) {
            let sheet = this.addSheet(path);
            let anim = new ig.Animation(sheet, frameTime, sequence, stop);
            anim.alpha = this.alpha;
            anim.flip.x = flip;
            anim.angle = angle;
            this.anims[name] = anim;
            if(!this.currentAnim){
                this.currentAnim = anim;
            }
            return anim;
        },

        addSheet: function(name){
            if(!this.sheets){
                this.sheets = {};
            }
            if(!this.sheets.name){
                this.sheets[name] = new ig.AnimationSheet(name, 64, 64);
            }
            return this.sheets[name]
        },

        changeDirection: function (side) {
            this.parent(side);
            switch (this.direction) {
                case Side.Front: this.currentAnim = this.anims.idlefront.rewind(); break;
                case Side.FrontUp: this.currentAnim = this.anims.idlefrontup.rewind(); break;
                case Side.FrontDown: this.currentAnim = this.anims.idlefrontdown.rewind(); break;
                case Side.Back: this.currentAnim = this.anims.idleback.rewind(); break;
                case Side.BackUp: this.currentAnim = this.anims.idlebackup.rewind(); break;
                case Side.BackDown: this.currentAnim = this.anims.idlebackdown.rewind(); break;
            }
            if(this.currentAnim){
                this.currentAnim.flip.x = this.direction.side == Orientation.Back;
            }
        },

        moveFront: function(){
            this.parent();
            this.currentAnim = this.anims.movefront.rewind();
        },

        moveFrontUp: function(){
            this.parent();
            this.currentAnim = this.anims.movefrontup.rewind();
        },

        moveFrontDown: function(){
            this.parent();
            this.currentAnim = this.anims.movefrontdown.rewind();
        },

        moveBack: function(){
            this.parent();
            this.currentAnim = this.anims.moveback.rewind();
        },

        moveBackUp: function(){
            this.parent();
            this.currentAnim = this.anims.movebackup.rewind();
        },

        moveBackDown: function(){
            this.parent();
            this.currentAnim = this.anims.movebackdown.rewind();
        },

        stopedMoving: function(){
            this.currentAnim = this.anims['idle' + this.direction.name].rewind();
        },

        draw: function() {
            this.parent();
            if(this.anims.stub) {
                this.anims.stub.draw(
                    this.pos.x - this.offset.x - ig.game._rscreen.x,
                    this.pos.y - this.offset.y - ig.game._rscreen.y
                );
            }
        },

        update_animation() {
            this.parent();
            if(this.anims.stub) {
                this.anims.stub.update();
            }
        }
    });
});
