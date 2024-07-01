class MovingPlatform extends Platform {
    constructor(x, y, width, height, color, direction, speed, range) {
        super(x, y, width, height, color);
        this.initialX = x;
        this.direction = direction;
        this.speed = speed; // Use the provided speed
        this.range = range; // The maximum distance the platform can move from its initial position
    }

    update() {
        if (this.direction === 'left') {
            this.x -= this.speed;
            if (this.x <= this.initialX - this.range) {
                this.direction = 'right';
                this.x = this.initialX - this.range; // Ensure position is within range
            }
        } else {
            this.x += this.speed;
            if (this.x >= this.initialX + this.range) {
                this.direction = 'left';
                this.x = this.initialX + this.range; // Ensure position is within range
            }
        }
    }

    draw() {
        this.update();
        super.draw();
    }
}

function adjustDifficulty(player, platforms) {
    console.log("Adjusting difficulty for player score:", player.score);

    const distanceBetweenPlatforms = 20; // Minimum distance between platforms
    const newPlatforms = [];

    platforms.forEach((platform, index) => {
        let newPlatform = platform;

        if (player.score >= 30 && player.score < 50) {
            if (index % 3 === 2 && !(platform instanceof MovingPlatform)) {
                newPlatform = convertToMovingPlatform(platform);
            }
        } else if (player.score >= 50 && player.score < 70) {
            if ((index % 3 === 1 || index % 3 === 2) && !(platform instanceof MovingPlatform)) {
                newPlatform = convertToMovingPlatform(platform);
            }
        } else if (player.score >= 80) {
            if (!(platform instanceof MovingPlatform)) {
                newPlatform = convertToMovingPlatform(platform);
            }
        }

        newPlatforms.push(newPlatform);
    });

    positionPlatforms(newPlatforms, distanceBetweenPlatforms);
    platforms.length = 0;
    platforms.push(...newPlatforms);
}

function convertToMovingPlatform(platform) {
    const direction = Math.random() < 0.5 ? 'left' : 'right';
    const speed = Math.random() * 2 + 1;
    const range = Math.random() * 50 + 50; // Move within a range of 50 to 100 pixels
    return new MovingPlatform(platform.x, platform.y, platform.width, platform.height, platform.color, direction, speed, range);
}

function positionPlatforms(platforms, distance) {
    for (let i = 1; i < platforms.length; i++) {
        const prevPlatform = platforms[i - 1];
        const currentPlatform = platforms[i];

        if (currentPlatform instanceof MovingPlatform || prevPlatform instanceof MovingPlatform) {
            currentPlatform.x = Math.max(currentPlatform.x, prevPlatform.x + prevPlatform.width + distance);
        }
    }
}

function updatePlayerPosition(player, platforms) {
    let onMovingPlatform = false;

    platforms.forEach(platform => {
        if (platform instanceof MovingPlatform) {
            if (player.y + player.height === platform.y && player.x + player.width > platform.x && player.x < platform.x + platform.width) {
                onMovingPlatform = true;
                if (platform.direction === 'left') {
                    player.x -= platform.speed;
                } else {
                    player.x += platform.speed;
                }
            }
        }
    });

    // Ensure the player does not get stuck moving with a platform when not on it
    if (!onMovingPlatform) {
        // Reset player position or logic here if needed
    }
}

