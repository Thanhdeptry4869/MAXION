import { drawSprite } from "./render.js";
// Adjust button dimensions and positions
export const buttons = [
    { text: 'Mobs', x: 270, y: 180, width: 150, height: 150 }, // Adjusted button size
    { text: 'Notes', x: 270, y: 330, width: 150, height: 150 }, // Adjusted button size
];

// Draw the menu with a horizontal layout
export function displayMenu(c, currentMenu, noteArray, mobArray, sprites, currentFrame) {
    // Draw menu background
    c.fillStyle = 'rgba(0, 0, 0, 0.7)'; // Semi-transparent background
    c.fillRect(420, 180, 1080, 720); // Centered horizontally and vertically

    // Draw buttons
    buttons.forEach(button => {
        c.fillStyle = currentMenu === button.text ? 'lightblue' : 'gray';
        c.fillRect(button.x, button.y, button.width, button.height);
        c.save();
        c.fillStyle = 'black';
        c.font = 'bold 50px Arial'; // Font size for the text
        c.fillText(button.text, button.x + 10, button.y + 100); // Center text in button
        c.restore();
    });

    if(currentMenu === 'Notes') {
        for(const noteObject of noteArray) {
            c.fillStyle = noteObject.collected ? 'pink' : 'black';
            c.fillRect(noteObject.x, noteObject.y, 200, 200);
            drawSprite(noteObject, c, sprites['note'], currentFrame);
        }
    } else {
        for(const mobObject of mobArray) {
            const ratio = 200 / mobObject.width;
            c.fillStyle = mobObject.found ? 'pink' : 'black';
            c.fillRect(mobObject.x, mobObject.y, 200, 200);
            drawSprite(mobObject, c, sprites[mobObject.sprite], currentFrame, ratio);
        }
    }
}