import { Object, Sprite } from './object.js';

export async function loadMaps() {
    try{
        const response = await fetch('maps.json');
        if (!response.ok) {
            throw new Error('Cant load map.json');
        }

        const map = await response.json();
        return map;
    } catch(error) {
        console.error('Error loading assets', error);
    }
}

export async function loadObjects() {
    try{
        let noteArray = [];
        let mobArray = [];
        const response = await fetch('objects.json');
        if (!response.ok) {
            throw new Error('Cant load objects.json');
        }

        const result = await response.json();
        for(const object of result.notes) {
            noteArray.push(object);
        }
        for(const object of result.mobs) {
            mobArray.push(object);
        }
        return [noteArray, mobArray];
    } catch(error) {
        console.error('Error loading objects', error);
    }
}

export async function loadAssets() {
    try {
        const response = await fetch('assets.json');
        if (!response.ok) {
            throw new Error('Cant load assets.json');
        }

        let assets = {
            sprites: {},
            tilesets: {}
        }

        const data = await response.json();
        const sprites = data.sprites;

        const loadSprites = sprites.map(sprite => {
            return new Promise((resolve, reject) => {
                console.log(`Loading sprite: ${sprite.name}`);
                const img = new Image();
                img.src = sprite.url;

                img.onload = () => {
                        assets.sprites[sprite.name] = {
                        name: sprite.name,
                        image: img,
                        width: sprite.width,
                        height: sprite.height,
                        frame: sprite.frame
                    };
                    resolve();
                }

                img.onerror = () => reject(new Error(`Failed to load image: ${sprite.url}`));
            })
        })
        
        const tileSets = data.tilesets;

        const loadTileSets = tileSets.map(tileset => {
            return new Promise((resolve, reject) => {
                console.log(`Loading sprite: ${tileset.name}`);
                const img = new Image();
                img.src = tileset.url;

                img.onload = () => {
                        assets.tilesets[tileset.name] = {
                        name: tileset.name,
                        image: img,
                    };
                    resolve();
                }

                img.onerror = () => reject(new Error(`Failed to load image: ${sprite.url}`));
            })
        })
        
        await Promise.all(loadSprites);
        await Promise.all(loadTileSets);
        console.log('All sprites loaded:', assets.sprites);
        console.log('All tilesets loaded:', assets.tilesets);
        return assets;

    } catch (error) {
        console.error('Error loading assets', error);
    }
}

export function loadPlatforms(platform) {
    let platforms = [];
    platform.data.forEach((object) => {
        platforms.push(new Object(128 * object[0],
        128 * object[1],
        128 * object[2],
        128 * object[3]));
    })
    return platforms;
}

export function loadTiles(tileMap, tilesets) {
    let tiles = [];
    for(const mapping of tileMap.mappings) {
        tileMap.data.forEach((tileArray, row) => {
            tileArray.forEach((tileNum, col) => {
                if(tileNum !== 0 && tileNum >= mapping.start && tileNum <= mapping.end) {
                    tiles.push(new Sprite(
                        128 * col,
                        128 * row,
                        tileMap.tileWidth * ((tileNum - mapping.start) % 8),
                        tileMap.tileHeight * Math.floor((tileNum - mapping.start) / 8),
                        tileMap.tileWidth,
                        tileMap.tileHeight,
                        tilesets[mapping.name].image
                    ))
                }
            }
            )
        }
        )
    }
    return tiles;
}