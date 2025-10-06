// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
document.getElementById('gameContainer').appendChild(renderer.domElement);

// Car properties
const carGeometry = new THREE.BoxGeometry(1, 0.5, 2);
const carMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const car = new THREE.Mesh(carGeometry, carMaterial);
car.position.set(0, 0, 10);
scene.add(car);

// Track (simple torus)
const trackGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
const trackMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const track = new THREE.Mesh(trackGeometry, trackMaterial);
scene.add(track);

// Camera position
camera.position.z = 20;

// Keys
const keys = {};

// Event listeners
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Check if car is on track (simplified)
function isOnTrack(position) {
    const dist = Math.sqrt(position.x ** 2 + position.z ** 2);
    return dist >= 7 && dist <= 13; // Approximate torus inner/outer
}

// Game loop
function gameLoop() {
    // Handle input
    if (keys['ArrowUp']) {
        car.position.z -= 0.1;
    }
    if (keys['ArrowDown']) {
        car.position.z += 0.1;
    }
    if (keys['ArrowLeft']) {
        car.position.x -= 0.1;
    }
    if (keys['ArrowRight']) {
        car.position.x += 0.1;
    }

    // Keep car on track (reset if off)
    if (!isOnTrack(car.position)) {
        car.position.set(0, 0, 10);
    }

    // Rotate track for visual effect
    track.rotation.y += 0.01;

    renderer.render(scene, camera);
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();