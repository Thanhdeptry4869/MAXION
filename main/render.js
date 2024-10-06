export function drawRect(rect, canvas, offset_x, offset_y) {
    canvas.fillStyle = `${rect.color}`;;
    canvas.fillRect(rect.x - offset_x, rect.y - offset_y, rect.width, rect.height);
};

export function drawSprite(object, canvas, sprite, currentFrame, ratio = 1, offset_x = 0, offset_y = 0) {
    canvas.drawImage(sprite.image,
                     (currentFrame % sprite.frame) * sprite.width,
                     0, 
                     sprite.width,
                     sprite.height,
                     object.x - offset_x,
                     object.y - offset_y,
                     object.width * ratio,
                     object.height * ratio);
};

export function drawTiles(tileArray, canvas){
    for(const tile of tileArray) {
        canvas.drawImage(tile.sprite,
            tile.sprite_x,
            tile.sprite_y, 
            tile.width, 
            tile.height,
            tile.x, 
            tile.y, 
            128, 
            128);
    }
};