
(function() {
    function Sprite(imgName, url, pos, size, speed, frames, dir, once) {
        this.pos = pos;
        this.size = size;
        this.speed = typeof speed === 'number' ? speed : 0;
        this.frames = frames;
        this._index = 0;
        this.url = url;
        this.imgName = 'aimer' || 'backdrop' || 'decor1' || 'decor2' || 'rocket' || 'smartdisc' || 'explode' || 'trek' || 'manta' || 'maverick' || 'scolder' 
                        || 'skull' || 'enemyfire' || 'enemybomb' || 'enemycomet' || 'enemypellet1' || 'enemypellet2' || 'enemypellet3' || 'enemypellet4' || 'driller' || 'boss' || 'bossbomb' || 'bossring' || 'oilslick' || 'oilsplash' || 'endportal';
        this.dir = dir || 'horizontal';
        this.once = once;
    };
    console.log(`IN spritejs - SPRITE ADDED [NAME: ${this.imgName}], [URL: ${this.url}], [${this.pos}], [${this.size}], ${this.speed}, [${this.frames}], ${this.dir}, ${this.once}`);
    Sprite.prototype = {
        getImgName: function() {
            return this.imgName;
        },
        setUrl: function(url){
            this.url = typeof url;
        },
        getUrl: function(){
            return this.url;
        },
        // setPos: function(pos){
        //     this.pos = pos;
        // },
        // setSize: function(size){
        //     this.size = size;
        // },
        update: function(dt) {
            this._index += this.speed*dt;
        },
        // setframe: function(frames) {
        //     var f = frames.length;
        //     console.log(`----in SPRITE setFrame -${f}---`);
        //     if (f>1) {
        //         this.frames = frames;
        //     } else {
        //         this.frames = frames[1];
        //     }
        // },
        // getFrame: function(){
        //     var f = frames.length;
        //     console.log(`----in SPRITE getFrame -${f}---`);
        //     if (f==1) {
        //         return this.frames;
        //     }
        //     else {
        //         return;
        //     }
        //     // else {
        //     //     return this.frames = frames[f];
        //     // }
        //     //return(this.frames);
        // },

        render: function(ctx) {
            var frame;

            if(this.speed > 0) {
                var max = this.frames.length;
                var idx = Math.floor(this._index);
                frame = this.frames[idx % max];

                if(this.once && idx >= max) {
                    this.done = true;
                    return;
                }
            }
            else {
                frame = 0;
            }


            var x = this.pos[0];
            var y = this.pos[1];

            if(this.dir == 'vertical') {
                y += frame * this.size[1];
            }
            else {
                x += frame * this.size[0];
            }

            ctx.drawImage(resources.get(this.url),
                          x, y,
                          this.size[0], this.size[1],
                          0, 0,
                          this.size[0], this.size[1]);
        }
    };

    window.Sprite = Sprite;
})();