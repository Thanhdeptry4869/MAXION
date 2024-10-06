export const keys = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false,
    f: false,
    c: false,
    click: false
}

export const pendingKeys = {...keys};

export function handleKeyChange(Key, isPressed, keyLock) {
    let key = Key.toLowerCase();
    if((key === 'a' || key === 'd') && !keyLock) {
        if(key === 'a') {
            keys.left = isPressed;
            pendingKeys.left = isPressed;
        } else {
            keys.right = isPressed;
            pendingKeys.right = isPressed;
        }
        
        if(isPressed) {
            // When 'a' is pressed, disable right movement, and vice versa
            key === 'a' ? (keys.right = false) : (keys.left = false);
        } else {
            // Restore pending key states when the key is released
            key === 'a' ? (keys.right = pendingKeys.right) : (keys.left = pendingKeys.left);
        }
    }

    if((key === 'w' || key === 's') && !keyLock) {
        if(key === 'w') {
            keys.up = isPressed;
            pendingKeys.up = isPressed;
        } else {
            keys.down = isPressed;
            pendingKeys.down = isPressed;
        }
        
        if(isPressed) {
            // When 'w' is pressed, disable down movement, and vice versa
            key === 'w' ? (keys.down = false) : (keys.up = false);
        } else {
            // Restore pending key states when the key is released
            key === 's' ? (keys.down = pendingKeys.down) : (keys.up = pendingKeys.up);
        }
    }

    if(key === ' ') {
        keys.space = isPressed;
    }

    if(key === 'f') {
        keys.f = isPressed;
    }

    if(key === 'c') {
        keys.c = isPressed;
    }
}

export function getMousePos(event, canvas) {
    const rect = canvas.getBoundingClientRect(); // Get the canvas position
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
}