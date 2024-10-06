import { Object } from "./object.js";
import { drawRect, drawSprite } from "./render.js";

export class Mob extends Object {
    constructor(objID, x, y, info, sprite) {
        super(x, y, info.width, info.height);
        this.objID = objID;
        this.name = info.name;
        this.type = info.type;
        this.sprite = sprite;
        this.speed = 2;
        this.distance = 0;
        this.hp = 0;
        this.maxHp = info.hp;
        this.direction = true;
    }

    displaySprite(c) {
        drawSprite(this, c, this.direction ? this.sprite[0] : this.sprite[1], Math.floor(this.framecount / this.framebuffer));
        this.framecount++;
    }

    displayHP(c) {
        drawRect({x: this.x, y: this.y - 100, width: this.width, height: 50, color: 'black'}, c, 0, 0);
        drawRect({x: this.x, y: this.y - 100, width: (this.hp / this.maxHp) * this.width, height: 50, color: 'yellow'}, c, 0, 0);
    }

    moving(maxDistance) {
        if(this.distance < maxDistance) {
            this.distance += this.speed;
            this._x += this.direction ? this.speed : -this.speed;
        } else {
            this.distance = 0;
            this.direction = !this.direction;
        }
    }

    displayMob(c) {
        if(this.hp > 0 && this.hp < this.maxHp) this.displayHP(c);
        this.displaySprite(c);
    }
}

const mobClasses = {
    Blobfish: class Blobfish extends Mob {
        constructor(objID, x, y, info, sprite) {
            super(objID, x, y, info, sprite);
            this.speed = 3;
        }

        updateMob(player, c) {
            this.moving(600);
            this.displayMob(c);
        }
    },

    Flishflosh: class Flishflosh extends Mob {
        constructor(objID, x, y, info, sprite) {
            super(objID, x, y, info, sprite);
            this.speed = 10;
        }

        updateMob(player, c) {
            this.moving(600);
            this.displayMob(c);
        }
    },

    Coralhead: class Coralhead extends Mob {
        constructor(objID, x, y, info, sprite) {
            super(objID, x, y, info, sprite);
            this.speed = 2;
        }

        updateMob(player, c) {
            this.moving(600);
            this.displayMob(c);
        }
    },

    Tinylodon: class Tinylodon extends Mob {
        constructor(objID, x, y, info, sprite) {
            super(objID, x, y, info, sprite);
            this.speed = 2;
            this.attack = 10;
            this.aggressiveSpeed = 5;
        }

        updateMob(player, c) {
            this.moving(600);
            this.displayMob(c);
        }
    },

    Snalker: class Snalker extends Mob {
        constructor(objID, x, y, info, sprite) {
            super(objID, x, y, info, sprite);
            this.speed = 1;
            this.attack = 5;
            this.aggressiveSpeed = 6;
        }

        updateMob(player, c) {
            this.moving(600);
            this.displayMob(c);
        }
    },

    Pinkyslinky: class Pinkyslinky extends Mob {
        constructor(objID, x, y, info, sprite) {
            super(objID, x, y, info, sprite);
        }

        updateMob(player, c) {
            this.displayMob(c);
        }
    },

    Sparkjelly: class Sparkjelly extends Mob {
        constructor(objID, x, y, info, sprite) {
            super(objID, x, y, info, sprite);
            this.attack = 15;
        }

        updateMob(player, c) {
            this.displayMob(c);
        }
    },

    Whitejelly: class Whitejelly extends Mob {
        constructor(objID, x, y, info, sprite) {
            super(objID, x, y, info, sprite);
            this.attack = 15;
        }

        updateMob(player, c) {
            this.displayMob(c);
        }
    },

    Pinkjelly: class Pinkjelly extends Mob {
        constructor(objID, x, y, info, sprite) {
            super(objID, x, y, info, sprite);
            this.speed = 2;
        }

        updateMob(player, c) {
            this.displayMob(c);
        }
    },

    Bluejelly: class Bluejelly extends Mob {
        constructor(objID, x, y, info, sprite) {
            super(objID, x, y, info, sprite);
            this.speed = 2;
        }

        updateMob(player, c) {
            this.displayMob(c);
        }
    },

    Klam: class Klam extends Mob {
        constructor(objID, x, y, info, sprite) {
            super(objID, x, y, info, sprite);
            this.speed = 2;
        }

        updateMob(player, c) {
            this.displayMob(c);
        }
    },

    Rocky: class Rocky extends Mob {
        constructor(objID, x, y, info, sprite) {
            super(objID, x, y, info, sprite);
            this.speed = 2;
        }

        updateMob(player, c) {
            this.displayMob(c);
        }
    },

    Stupish: class Stupish extends Mob {
        constructor(objID, x, y, info, sprite) {
            super(objID, x, y, info, sprite);
            this.speed = 2;
        }

        updateMob(player, c) {
            this.moving(600);
            this.displayMob(c);
        }
    },

    Plankton: class Plankton extends Mob {
        constructor(objID, x, y, info, sprite) {
            super(objID, x, y, info, sprite);
            this.speed = 2;
        }

        updateMob(player, c) {
            this.displayMob(c);
        }
    },

    Stonebug: class Stonebug extends Mob {
        constructor(objID, x, y, info, sprite) {
            super(objID, x, y, info, sprite);
            this.speed = 2;
        }

        updateMob(player, c) {
            this.moving(600);
            this.displayMob(c);
        }
    },

    Rambutan: class Rambutan extends Mob {
        constructor(objID, x, y, info, sprite) {
            super(objID, x, y, info, sprite);
            this.speed = 2;
        }

        updateMob(player, c) {
            this.moving(600);
            this.displayMob(c);
        }
    }
  };
  
  function createMob(trueMob, mapMob, sprites) {
    const MobClass = mobClasses[trueMob.sprite];
    return new MobClass(trueMob.objID, mapMob.x, mapMob.y, trueMob, [sprites[trueMob.sprite], sprites[trueMob.sprite + '1']]);
}

export { createMob };