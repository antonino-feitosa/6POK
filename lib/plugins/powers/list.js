ig.module(
    'plugins.powers.list'
)
    .defines(function () {

        CircularList = ig.Class.extend({

            init: function () {
                this.head = null;
                this.count = 0;
            },

            length: function(){
                return this.count;
            },

            current: function(){
                return this.head.element;
            },

            next: function(){
                var e = this.head.element;
                this.head = this.head.next;
                return e;
            },

            add: function(element){
                if(!this.head){
                    this.head = {element: element};
                    this.head.next = this.head;
                } else {
                    var e = {element: element, next: this.head.next};
                    this.head.next = e;
                }
                this.count += 1;
            },

            has: function(element){
                if(this.count == 0){
                    throw("The list is empty!");
                }

                var current = this.head;
                for(let c=0;c<this.count;c++){
                    if(element.id == current.element.id){
                        return true;
                    } else {
                        current = current.next;
                    }
                }
            },

            del: function(element){
                if(this.count == 0){
                    throw("The list is empty!");
                }
                if(this.count == 1){
                    this.head = null;
                    this.count = 0;
                } else {
                    let previous = this.head;
                    let current = this.head.next;
                    let index = 0;
                    while(index < this.count && element.id != current.element.id){
                        index += 1;
                        previous = previous.next;
                        current = current.next;
                    }
                    if(element.id == current.element.id){
                        previous.next = current.next;
                        this.count -= 1;
                        if(this.head.element.id == current.element.id){
                            this.head = current.next;
                        }
                    }
                }
                //this.print();
            },

            isEmpty: function(){
                return this.count == 0;
            },

            clear: function(){
                this.head = null;
                this.count = 0;
            },

            print: function(){
                var current = this.head;
                for(let c=0;c<this.count;c++){
                    console.log("<"+ current.element.id + ", " + current.element.name +">");
                    current = current.next;
                }
                console.log("");
            }
        });
    });
