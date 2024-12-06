const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.9;
canvas.style.backgroundColor = 'grey';
canvas.style.position = 'absolute';
canvas.style.top = '50%';
canvas.style.left = '50%';
canvas.style.transform = 'translate(-50%, -50%)';

const circle = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    dx: 0,
    dy: 0,
    gravity: 0.2,
    friction: 0.98,
    moveSpeed: 8,
    color: 'white',
    canJump: false,
    canShrink: false,
    canPlacePlatform: false,
    canSpawnConfetti: false
};

const platform = {
    x: canvas.width / 2 - 50,
    y: canvas.height / 2,
    width: 100,
    height: 10
};

const powerUp = {
    x: canvas.width - 30,
    y: canvas.height - 30,
    width: 20,
    height: 20,
    collected: false
};

const shrinkPowerUp = {
    x: 30,
    y: canvas.height / 2 - 10,
    width: 20,
    height: 20,
    collected: false
};

const platformPowerUp = {
    x: 30,
    y: canvas.height - 30,
    width: 20,
    height: 20,
    collected: false
};

const confettiPowerUp = {
    x: canvas.width - 50,
    y: 50,
    width: 20,
    height: 20,
    collected: false
};

const userPlatforms = [];
const maxPlatforms = 5;
const confettiParticles = [];
let blocks = [];

blocks.push(
    { x: 380, y: canvas.height - 200, width: 20, height: 180 },
    { x: 0, y: canvas.height - 200, width: 380, height: 20 }
);

function drawCircle() {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = circle.color;
    ctx.fill();
    ctx.closePath();
}

function drawPlatform() {
    ctx.fillStyle = 'black';
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
}

function drawPowerUp() {
    if (!powerUp.collected) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
    } else {
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText('Press the up arrow to jump', 10, 30);
    }
}

function drawShrinkPowerUp() {
    if (circle.canJump && !shrinkPowerUp.collected) {
        ctx.fillStyle = 'green';
        ctx.fillRect(shrinkPowerUp.x, shrinkPowerUp.y, shrinkPowerUp.width, shrinkPowerUp.height);
    } else if (shrinkPowerUp.collected) {
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText('Press C to shrink and X to grow', 10, 60);
    }
}

function drawPlatformPowerUp() {
    if (circle.canShrink && !platformPowerUp.collected) {
        ctx.fillStyle = 'red';
        ctx.fillRect(platformPowerUp.x, platformPowerUp.y, platformPowerUp.width, platformPowerUp.height);
    } else if (platformPowerUp.collected) {
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText('Click to make platforms', 10, 90);
    }
}

function drawConfettiPowerUp() {
    if (platformPowerUp.collected && !confettiPowerUp.collected) {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(confettiPowerUp.x, confettiPowerUp.y, confettiPowerUp.width, confettiPowerUp.height);
    } else if (confettiPowerUp.collected) {
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText('Press space to spawn confetti', 10, 120);
    }
}

function drawPowerUps() {
    drawPowerUp();
    drawShrinkPowerUp();
    drawPlatformPowerUp();
    drawConfettiPowerUp();
}

function drawUserPlatforms() {
    userPlatforms.forEach(platform => {
        ctx.fillStyle = 'white';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function drawBlocks() {
    blocks.forEach(block => {
        ctx.fillStyle = 'black';
        ctx.fillRect(block.x, block.y, block.width, block.height);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(block.x, block.y, block.width, block.height);
    });
}

function drawConfetti() {
    confettiParticles.forEach(particle => {
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    });
}

function updateCircle() {
    circle.dy += circle.gravity;
    circle.dy *= circle.friction;
    circle.x += circle.dx;
    circle.y += circle.dy;

    if (circle.y + circle.radius > canvas.height) {
        circle.y = canvas.height - circle.radius;
        circle.dy = 0;
    }

    if (circle.x - circle.radius < 0) {
        circle.x = circle.radius;
    } else if (circle.x + circle.radius > canvas.width) {
        circle.x = canvas.width - circle.radius;
    }
}

function updateCircleWithPlatform() {
    updateCircle();

    if (circle.y + circle.radius > platform.y &&
        circle.y - circle.radius < platform.y + platform.height &&
        circle.x + circle.radius > platform.x &&
        circle.x - circle.radius < platform.x + platform.width) {
        circle.y = platform.y - circle.radius;
        circle.dy = 0;
    }
}

function updateCircleWithUserPlatforms() {
    updateCircleWithPlatform();

    userPlatforms.forEach(platform => {
        if (circle.y + circle.radius > platform.y &&
            circle.y - circle.radius < platform.y + platform.height &&
            circle.x + circle.radius > platform.x &&
            circle.x - circle.radius < platform.x + platform.width) {
            circle.y = platform.y - circle.radius;
            circle.dy = 0;
        }
    });
}

function updateCircleWithBlocks() {
    updateCircleWithUserPlatforms();

    blocks.forEach(block => {
        if (circle.y + circle.radius > block.y &&
            circle.y - circle.radius < block.y + block.height &&
            circle.x + circle.radius > block.x &&
            circle.x - circle.radius < block.x + block.width) {
            circle.y = block.y - circle.radius;
            circle.dy = 0;
        }
    });
}

function updateConfetti() {
    confettiParticles.forEach((particle, index) => {
        particle.dy += 0.1; 
        particle.x += particle.dx;
        particle.y += particle.dy;

        if (particle.y > canvas.height) {
            confettiParticles.splice(index, 1);
        }
    });
}

function checkPowerUpCollision() {
    if (!powerUp.collected &&
        circle.x + circle.radius > powerUp.x &&
        circle.x - circle.radius < powerUp.x + powerUp.width &&
        circle.y + circle.radius > powerUp.y &&
        circle.y - circle.radius < powerUp.y + powerUp.height) {
        powerUp.collected = true;
        circle.canJump = true;
        blocks = [
            { x: 125, y: canvas.height - 400, width: 100, height: 20 },
            { x: 275, y: canvas.height - 300, width: 100, height: 20 },
            { x: 450, y: canvas.height - 200, width: 100, height: 20 },
            { x: 600, y: canvas.height - 100, width: 100, height: 20 },
            { x: 0, y: canvas.height - 500, width: 100, height: 20 },
            { x: 380, y: canvas.height - 200, width: 20, height: 180 },
            { x: 0, y: canvas.height - 200, width: 380, height: 20 }
        ];
    }
}

function checkShrinkPowerUpCollision() {
    if (!shrinkPowerUp.collected &&
        circle.x + circle.radius > shrinkPowerUp.x &&
        circle.x - circle.radius < shrinkPowerUp.x + shrinkPowerUp.width &&
        circle.y + circle.radius > shrinkPowerUp.y &&
        circle.y - circle.radius < shrinkPowerUp.y + shrinkPowerUp.height) {
        shrinkPowerUp.collected = true;
        circle.canShrink = true;
    }
}

function checkPlatformPowerUpCollision() {
    if (!platformPowerUp.collected &&
        circle.x + circle.radius > platformPowerUp.x &&
        circle.x - circle.radius < platformPowerUp.x + platformPowerUp.width &&
        circle.y + circle.radius > platformPowerUp.y &&
        circle.y - circle.radius < platformPowerUp.y + platformPowerUp.height) {
        platformPowerUp.collected = true;
        circle.canPlacePlatform = true;
    }
}

function checkConfettiPowerUpCollision() {
    if (!confettiPowerUp.collected &&
        circle.x + circle.radius > confettiPowerUp.x &&
        circle.x - circle.radius < confettiPowerUp.x + confettiPowerUp.width &&
        circle.y + circle.radius > confettiPowerUp.y &&
        circle.y - circle.radius < confettiPowerUp.y + confettiPowerUp.height) {
        confettiPowerUp.collected = true;
        circle.canSpawnConfetti = true;
    }
}

function checkPowerUpCollisions() {
    checkPowerUpCollision();
    checkShrinkPowerUpCollision();
    checkPlatformPowerUpCollision();
    checkConfettiPowerUpCollision();
}

function spawnConfetti() {
    for (let i = 0; i < 20; i++) {
        confettiParticles.push({
            x: circle.x,
            y: circle.y - circle.radius, 
            dx: (Math.random() - 0.5) * 4, 
            dy: Math.random() * -4 - 2, 
            size: Math.random() * 5 + 2,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`
        });
    }
}

function updatePlayerColor() {
    if (powerUp.collected) {
        circle.color = 'blue';
    }
    if (shrinkPowerUp.collected) {
        circle.color = 'green';
    }
    if (platformPowerUp.collected) {
        circle.color = 'red';
    }
    if (confettiPowerUp.collected) {
        circle.color = 'yellow';
    }
}

function handleKeyDown(event) {
    if (event.key === 'ArrowLeft') {
        circle.dx = -circle.moveSpeed;
    } else if (event.key === 'ArrowRight') {
        circle.dx = circle.moveSpeed;
    } else if (event.key === 'ArrowUp' && circle.canJump && circle.dy === 0) {
        circle.dy = -10;
    } else if (event.key === 'c' && circle.canShrink) {
        circle.radius = 10;
    } else if (event.key === 'x' && circle.canShrink) {
        circle.radius = 20;
    } else if (event.key === ' ' && circle.canSpawnConfetti) {
        spawnConfetti();
    }
}

function handleKeyUp(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        circle.dx = 0;
    }
}

function handleCanvasClick(event) {
    if (circle.canPlacePlatform) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left - 50;
        const y = event.clientY - rect.top - 10;
        userPlatforms.push({ x, y, width: 100, height: 20 });

        if (userPlatforms.length > maxPlatforms) {
            userPlatforms.shift();
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle();
    drawPlatform();
    drawPowerUps();
    drawUserPlatforms();
    drawBlocks();
    drawConfetti();
    updateCircleWithBlocks();
    updateConfetti();
    checkPowerUpCollisions();
    updatePlayerColor();
    requestAnimationFrame(animate);
}


document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
canvas.addEventListener('click', handleCanvasClick);

animate();
