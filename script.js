const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Car properties
const car = {
    x: 400,
    y: 550,
    width: 30,
    height: 50,
    speed: 2,
    angle: 0
};

// Track properties (simple oval)
const track = {
    innerRadius: 100,
    outerRadius: 250,
    centerX: 400,
    centerY: 300
};

// Keys
const keys = {};

// Event listeners
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Draw track
function drawTrack() {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(track.centerX, track.centerY, track.outerRadius, track.innerRadius, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(track.centerX, track.centerY, track.innerRadius, track.outerRadius, 0, 0, 2 * Math.PI);
    ctx.stroke();
}

// Draw car
function drawCar() {
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.angle);
    ctx.fillStyle = 'red';
    ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);
    ctx.restore();
}

// Check if car is on track
function isOnTrack(x, y) {
    const dist = Math.sqrt((x - track.centerX) ** 2 + (y - track.centerY) ** 2);
    return dist >= track.innerRadius && dist <= track.outerRadius;
}

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw track
    drawTrack();

    // Handle input
    if (keys['ArrowUp']) {
        car.x += Math.sin(car.angle) * car.speed;
        car.y -= Math.cos(car.angle) * car.speed;
    }
    if (keys['ArrowDown']) {
        car.x -= Math.sin(car.angle) * car.speed;
        car.y += Math.cos(car.angle) * car.speed;
    }
    if (keys['ArrowLeft']) {
        car.angle -= 0.05;
    }
    if (keys['ArrowRight']) {
        car.angle += 0.05;
    }

    // Keep car on track (simple boundary)
    if (!isOnTrack(car.x, car.y)) {
        // Reset position if off track
        car.x = 400;
        car.y = 550;
        car.angle = 0;
    }

    // Draw car
    drawCar();

    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();