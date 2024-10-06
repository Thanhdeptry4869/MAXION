export class Object {
    constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this._x = x;
    this._y = y;
    this.width = width;
    this.height = height;
    this.cx = this.x + this.width / 2;
    this.cy = this.y + this.height / 2;
    this.color = 'lime';
    this.framecount = 0;
    this.framebuffer = 10;
    }
}

export class Note extends Object {
    constructor(objID, x, y, text, sprite) {
        super(x, y, 128, 128);
        this.objID = objID;
        this.text = text;
        this.color = 'red';
        this.sprite = sprite;
    }

    
}

export class Sprite extends Object {
    constructor(x, y, sprite_x, sprite_y, spriteWidth, spriteHeight, sprite) {
        super(x, y, spriteWidth, spriteHeight);
        this.sprite_x = sprite_x;
        this.sprite_y = sprite_y;
        this.sprite = sprite;
    }
}