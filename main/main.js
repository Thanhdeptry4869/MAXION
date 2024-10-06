import { keys, handleKeyChange, getMousePos } from './control.js';
import { drawRect, drawSprite, drawTiles } from './render.js';
import { loadMaps, loadAssets, loadPlatforms, loadTiles, loadObjects } from './load.js';
import { Player } from './player.js';
import { displayMenu, buttons } from './menu.js';
import { Object, Note } from './object.js';
import { Mob, createMob } from './mob.js';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1920;
canvas.height = 1080;
canvas.style.display = 'none';
const credit = document.getElementById('credits');
const menu = document.getElementById('menu');

const player = new Player();

let collidableObject = [];
let collectableObject = [];
let findableMobs = [];
let noteArray = [];
let mobArray = [];
let tileArray = [];
let assets;
let tileMap;
let offset_x = 0;
let offset_y = 0;
let mousePos = {};
let currentMenu = 'Mobs';
let currentFrame = 0;
let elapsedTime = 0;
let pause = false;
let noteDisplayed = false;
let mobDisplayed = false;
let detected = false;
let displayMsg = false;
let keyLock = false;
let dark = false;
let currentNote;
let currentMob;
let currentText;
let currentMap = 0;
const fps = 8;

async function initializeGame() {
    try {
        menu.style.display = 'none';
        canvas.style.display = 'flex';
        var result = await loadObjects();
        noteArray = result[0];
        mobArray = result[1];
        tileMap = await loadMaps(); // Await loading map
        assets = await loadAssets(); // Await loading assets
        collidableObject = loadPlatforms(tileMap.map1.platforms);
        tileArray = loadTiles(tileMap.map1, assets.tilesets);
        noteArray.forEach((note) => {
            tileMap.map1.objects.notes.forEach((object) => {
                if(note.objID === object.objID) {
                    collectableObject.push(new Note(note.objID, object.x, object.y, note.text, assets.sprites[note]));
                }
            })
        }),
        mobArray.forEach((mob) => {
            tileMap.map1.objects.mobs.forEach((object) => {
                if(mob.objID === object.objID) {
                    findableMobs.push(createMob(mob, object, assets.sprites));
                }
            })
        })
        displayMsg = true;
        currentText = 'Press F to open menu and Space to collect Notes, hold LMB on mobs to inspect them!';
        requestAnimationFrame(updateFrame); // Start game loop
    } catch (error) {
        console.error('Error initializing the game:', error);
    }
    console.log(assets.sprites);
    console.log(findableMobs);
    console.log(collectableObject);
    console.log(tileArray);
}

window.initializeGame = initializeGame;

function showCredits() {
    if(credit.style.display === 'none') {
        menu.style.display = 'none';
        credit.style.display = 'flex';
    } else {
        menu.style.display = 'flex';
        credit.style.display = 'none';
    }
}

window.showCredits = showCredits;

function updateObject() {
    for(const object of collectableObject) {
        object.x = object._x - offset_x;
        object.y = object._y - offset_y;
    }
    for(const object of collidableObject) {
        object.x = object._x - offset_x;
        object.y = object._y - offset_y;
    }
    for(const object of findableMobs) {
        object.x = object._x - offset_x;
        object.y = object._y - offset_y;
    }
    for(const object of tileArray) {
        object.x = object._x - offset_x;
        object.y = object._y - offset_y;
    }
}

function updateBackground() {
    c.drawImage(assets.tilesets['background4'].image,
        0,
        0, 
        1920, 
        1280, 
        0, 
        0, 
        1920,
        1280);
    drawTiles(tileArray, c);
    for(const object of collectableObject) {
        if(!noteArray[object.objID].collected) {
            drawSprite(object, c, assets.sprites['note'], 0);
        }
    }
    for(const object of collidableObject) {
        drawRect(object, c, 0, 0);
    }
    for(const object of findableMobs) {
        // drawRect(object, c, 0, 0);
        object.updateMob(player, c);
    }
}

function moveCamera() {
    if(offset_x + player.dx <= 0) {
        offset_x = 0;
    } else if(offset_x + player.dx >= 16640 - canvas.width) {
        offset_x = 16640 - canvas.width;
    } else if(player.x - offset_x >= canvas.width / 2 && player.dx > 0) {
        offset_x += player.dx;
    } else if(player.x - offset_x <= canvas.width / 2 && player.dx < 0) {
        offset_x += player.dx;
    }

    if(offset_y + player.dy <= 0) {
        offset_y = 0;
    } else if(offset_y + player.dy >= 9088 - canvas.height) {
        offset_y = 9088 - canvas.height;
    } else if(player.y - offset_y >= canvas.height / 2 && player.dy > 0) {
        offset_y += player.dy;
    } else if(player.y - offset_y <= canvas.height / 2 && player.dy < 0) {
        offset_y += player.dy;
    }
}

function updatePlayer() {
    player.update(keys, assets.sprites, c, offset_x, offset_y);
    player.x += player.dx;
    player.y += player.dy;
    player.cx = player.x + player.width / 2;
    player.cy = player.y + player.height / 2;
}

function collision() {
    detected = false;
    for(const object of collidableObject) {
        player.collisionDetection(object, offset_x, offset_y);
    }

    for(const object of collectableObject) {
        if(!object.collected) {
            player.hoverDetection(object, offset_x, offset_y);
        }
    }

    collectableObject.forEach((object) => {
        if(!noteArray[object.objID].collected && keys.space && player.hoverDetection(object, offset_x, offset_y)) {
            noteArray[object.objID].collected = true;
            displayMsg = true;
            currentText = object.text;
        }
    })

    findableMobs.forEach((object) => {
        if(mouseHover(object) && !object.found) {
            detected = true;
            if(keys.click) {
                if(object.hp < object.maxHp) {
                    object.hp += 1;
                } else {
                    mobArray[object.objID].found = true;
                }
            }
        }
    })
}

function mouseHover(object) {
    if(mousePos.x < object.x ||
        mousePos.x > object.x + object.width ||
        mousePos.y < object.y ||
        mousePos.y > object.y + object.height) {
            return false;
        }
    return true;
}

function drawCursorCircle() {
    c.beginPath();
    // Draw the circle with the calculated coordinates
    c.arc(mousePos.x, mousePos.y, 80, 0, Math.PI * 2); // Adjust radius as needed
    c.lineWidth = 10; // Set line width
    c.strokeStyle = detected ? 'red' : 'blue'; // Set circle color
    c.stroke(); // Outline the circle
    c.closePath();
}

function message(currentText) {
    c.save();
    c.fillStyle = 'rgba(0, 0, 0, 0.8)';
    c.fillRect(0, 0, 1920, 300); // Fill the background
    c.fillStyle = 'white';
    c.font = '30px Arial';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(currentText, 1920 / 2, 300 / 2);

    // Add a small text in the right bottom corner
    c.font = '20px Arial';
    c.textAlign = 'right';
    c.textBaseline = 'bottom';
    c.fillText('Press C to continue', 1920 - 20, 300 - 20);

    c.restore();
}

function lightroom() {
    // Draw dark overlay
    c.save();
    c.fillStyle = 'rgba(0, 0, 0, 0.8)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.globalCompositeOperation = "source-over";
    // Draw lighted area around player's head
    c.beginPath();
    c.fillStyle = 'rgba(255, 255, 255, 0.2)';
    c.arc(player.cx - offset_x + player.dx * 20, player.y - offset_y + player.dy * 50, 300, 0, Math.PI*2, false);
    c.fill();
    c.closePath();
    c.restore();
}

window.addEventListener('keydown', (event) => {handleKeyChange(event.key, true, keyLock);
                                               if(keys.f) pause = !pause});
window.addEventListener('keyup', (event) => {handleKeyChange(event.key, false, keyLock)});
canvas.addEventListener('mousemove', (event) => {mousePos = getMousePos(event, canvas);});
canvas.addEventListener('mousedown', () => {
    keys.click = true;
});
canvas.addEventListener('mouseup', () => {
    keys.click = false;
});

function updateFrame(timestamp) {
    const deltaTime = timestamp - elapsedTime;
    if (deltaTime >= 1000 / fps) {
        currentFrame  += 1;
        elapsedTime = timestamp;
    }

    c.clearRect(0, 0, canvas.width, canvas.height);

    updateObject();
    updateBackground();
    // drawSprite(player, c, assets.sprites[player.sprite], currentFrame, 1, offset_x, offset_y);
    if(dark) lightroom();


    // drawRect(player, c, offset_x, offset_y);

    if (pause) {
        displayMenu(c, currentMenu, noteArray, mobArray, assets.sprites, currentFrame);
        buttons.forEach(button => {
            if (keys.click && mouseHover(button)) {
                currentMenu = button.text;
            }
        });

        if (currentMenu === 'Notes') {
            for (const object of noteArray) {
                if (keys.click && mouseHover(object) && object.collected && !noteDisplayed) {
                    noteDisplayed = true; // set noteDisplayed to true when clicked
                    currentNote = object; // store the current note being displayed
                }
            }

            if (noteDisplayed) {
                c.fillStyle = 'cyan';
                c.fillRect(500, 500, 1000, 500);
                c.fillStyle = 'black';
                c.font = 'bold 20px Arial'; // Font size for the text
                c.fillText(currentNote.text, 500, 600); // Center text in button
                // Draw a new button to turn off the note display
                c.fillStyle = 'red';
                c.fillRect(1500, 500, 200, 50);
                c.fillStyle = 'white';
                c.font = 'bold 20px Arial';
                c.fillText('Close', 1520, 530);
                // Check if the close button is clicked
                if (keys.click && mouseHover({ x: 1500, y: 500, width: 200, height: 50 })) {
                    noteDisplayed = false; // turn off the note display
                }
            }
        } else {
            for (const object of mobArray) {
                if (keys.click && mouseHover(object.block) && object.found && !mobDisplayed) {
                    mobDisplayed = true; // set noteDisplayed to true when clicked
                    currentMob = object; // store the current note being displayed
                }
            }

            if (mobDisplayed) {
                c.fillStyle = 'cyan';
                c.fillRect(500, 500, 1000, 500);
                c.fillStyle = 'black';
                c.font = 'bold 20px Arial'; // Font size for the text
                c.fillText(currentMob.name, 500, 600); // Center text in button
                // Draw a new button to turn off the note display
                c.fillStyle = 'red';
                c.fillRect(1500, 500, 200, 50);
                c.fillStyle = 'white';
                c.font = 'bold 20px Arial';
                c.fillText('Close', 1520, 530);
                // Check if the close button is clicked
                if (keys.click && mouseHover({ x: 1500, y: 500, width: 200, height: 50 })) {
                    mobDisplayed = false; // turn off the note display
                }
            }
        }
    }

    if(!pause) {
        updatePlayer();
        collision();
        moveCamera();
        drawCursorCircle();
    }

    if(displayMsg) {
        message(currentText);
        keyLock = true;
        if(keys.c) {
            displayMsg = false;
            keyLock = false;
        }
    }
    
    requestAnimationFrame(updateFrame);
}