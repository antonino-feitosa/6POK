ig.module('plugins.powers.action')
    .defines(function () {

        Action = ig.Class.extend({

            _finished: false,

            init: function (entity) {
                this.entity = entity;
            },

            finish: function(){
                this._finished = true;
            },

            finished: function(){
                return this._finished;
            },

            update: function () {  
            },

            eventEnd: function(){
            }
        });
    });
