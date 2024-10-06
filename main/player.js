import { Object } from "./object.js"
import { drawSprite } from "./render.js";

export class Player extends Object {
    constructor() {
        super(300, 0, 128, 256);
        this.dy = 0;
        this.dx = 0;
        this.speed = 6;
        this.hp = 100;
        this.collect = false;
        this.sprite = "Max";
        this.direction = true;
        this.color = 'cyan';
        this.collected = 0;
    }

    displaySprite(c, sprites, offset_x, offset_y) {
        drawSprite(this, c, sprites[this.sprite], Math.floor(this.framecount / this.framebuffer), 1, offset_x, offset_y);
        this.framecount++;
    }

    move(keys) {
        this.color = 'cyan';
        this.dx = 0;
        this.dy = 0;
        if(keys.left) {
            this.direction = false;
            this.dx = -this.speed;
        } else if(keys.right) {
            this.direction = true;
            this.dx = this.speed;
        }

        if(keys.down) {
            this.dy = this.speed;
        } else if(keys.up) {
            this.dy = -this.speed;
        }
    }

    changeSprite() {
        if(this.dx > 0) {
            this.sprite = "Max1";
            this.width = 256;
            this.height = 128;
        } else if (this.dx < 0) {
            this.sprite = "Max2";
            this.width = 256;
            this.height = 128;
        } else {
            this.sprite = "Max";
            this.width = 128;
            this.height = 256;
        }
    }

    update(keys, sprites, c, offset_x, offset_y) {
        this.move(keys);
        this.changeSprite();
        this.displaySprite(c, sprites, offset_x, offset_y);
    }

    collisionDetection(object, offset_x, offset_y) {
        if(this.x - offset_x + this.width < object.x ||
            this.x - offset_x > object.x + object.width ||
            this.y - offset_y + this.height < object.y ||
            this.y - offset_y > object.y + object.height) {
                return;
            }
        this.collisionHandling(object, offset_x, offset_y);
    }
    
    collisionHandling(object, offset_x, offset_y) {
        let playerTop_objBottom = Math.abs(this.y - offset_y - object.y - object.height);
        let playerBottom_objTop = Math.abs(this.y - offset_y - object.y + this.height);
        let playerLeft_objRight = Math.abs(this.x - offset_x - object.x - object.width);
        let playerRight_objLeft = Math.abs(this.x - offset_x - object.x + this.width);
        
        if((this.x - offset_x <= object.x + object.width && this.x - offset_x + this.width > object.x + object.width) &&
        (playerLeft_objRight < playerBottom_objTop && playerLeft_objRight < playerTop_objBottom)) {
            this.x = object.x + object.width + offset_x;
        } else if((this.x - offset_x + this.width >= object.x && this.x - offset_x < object.x) &&
        (playerRight_objLeft < playerBottom_objTop && playerRight_objLeft < playerTop_objBottom)) {
            this.x = object.x - this.width + offset_x;
        } else if((this.y - offset_y + this.height >= object.y && this.y - offset_y < object.y) &&
        (playerBottom_objTop < playerLeft_objRight && playerBottom_objTop < playerRight_objLeft)) {
            this.y = object.y - this.height + offset_y;
            this.onGround = true;
            this.dy = 0;
        } else if((this.y - offset_y <= object.y + object.height && this.y - offset_y + this.height > object.y + object.height) &&
        (playerTop_objBottom < playerLeft_objRight && playerTop_objBottom < playerRight_objLeft)) {
            this.y = object.y + object.height + offset_y;
            this.dy = 0;
        }
    }

    hoverDetection(object, offset_x, offset_y) {
        if(this.x - offset_x + this.width < object.x ||
            this.x - offset_x > object.x + object.width ||
            this.y - offset_y + this.height < object.y ||
            this.y - offset_y > object.y + object.height) {
                return false;
            }
        this.collect = true;
        this.color = 'purple';
        return true;
    }
}