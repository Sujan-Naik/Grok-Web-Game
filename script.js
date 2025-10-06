// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('gameContainer').appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Car (improved geometry)
const carGroup = new THREE.Group();
const carBody = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 4), new THREE.MeshLambertMaterial({ color: 0xff0000 }));
carGroup.add(carBody);
const carRoof = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.8, 2), new THREE.MeshLambertMaterial({ color: 0x000000 }));
carRoof.position.y = 0.65;
carGroup.add(carRoof);
carGroup.position.set(0, 0.5, 0);
carGroup.castShadow = true;
scene.add(carGroup);

// Track (looped road)
const trackGeometry = new THREE.PlaneGeometry(50, 50);
const trackMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
const track = new THREE.Mesh(trackGeometry, trackMaterial);
track.rotation.x = -Math.PI / 2;
track.receiveShadow = true;
scene.add(track);

// Track boundaries (invisible walls)
const wallGeometry = new THREE.BoxGeometry(50, 2, 1);
const wallMaterial = new THREE.MeshBasicMaterial({ visible: false }); // Invisible but collidable

const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
wall1.position.set(0, 1, -25);
scene.add(wall1);

const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
wall2.position.set(0, 1, 25);
wall2.rotation.y = Math.PI;
scene.add(wall2);

const wall3 = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 50), wallMaterial);
wall3.position.set(-25, 1, 0);
wall3.rotation.y = Math.PI / 2;
scene.add(wall3);

const wall4 = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 50), wallMaterial);
wall4.position.set(25, 1, 0);
wall4.rotation.y = -Math.PI / 2;
scene.add(wall4);

// Start/finish line
const finishLine = new THREE.Mesh(new THREE.PlaneGeometry(2, 50), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }));
finishLine.rotation.x = -Math.PI / 2;
finishLine.position.set(0, 0.01, 0);
scene.add(finishLine);

// Camera
const cameraOffset = new THREE.Vector3(0, 5, -10);

// Car physics
let carSpeed = 0;
let carRotation = 0;
const maxSpeed = 1;
const acceleration = 0.01;
const friction = 0.98;
const turnSpeed = 0.05;

// Keys
const keys = {};

// Lap system
let laps = 0;
let hasPassedStart = false;

// Event listeners
window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Collision detection
function checkCollision(obj1, obj2) {
    const box1 = new THREE.Box3().setFromObject(obj1);
    const box2 = new THREE.Box3().setFromObject(obj2);
    return box1.intersectsBox(box2);
}

// Update UI
function updateUI() {
    document.getElementById('speed').textContent = Math.round(carSpeed * 100);
    document.getElementById('laps').textContent = laps;
}

// Game loop
function gameLoop() {
    // Handle input
    if (keys['w']) {
        carSpeed += acceleration;
        if (carSpeed > maxSpeed) carSpeed = maxSpeed;
    }
    if (keys['s']) {
        carSpeed -= acceleration * 2;
        if (carSpeed < -maxSpeed / 2) carSpeed = -maxSpeed / 2;
    }
    if (keys['a']) {
        carRotation += turnSpeed;
    }
    if (keys['d']) {
        carRotation -= turnSpeed;
    }

    // Apply friction
    carSpeed *= friction;

    // Update car position
    carGroup.position.x += Math.sin(carRotation) * carSpeed;
    carGroup.position.z += Math.cos(carRotation) * carSpeed;
    carGroup.rotation.y = carRotation;

    // Check collisions with walls
    if (checkCollision(carGroup, wall1) || checkCollision(carGroup, wall2) || checkCollision(carGroup, wall3) || checkCollision(carGroup, wall4)) {
        carSpeed = 0;
        carGroup.position.set(0, 0.5, 0);
        carRotation = 0;
    }

    // Check lap
    if (carGroup.position.z < 1 && carGroup.position.z > -1 && carGroup.position.x > -1 && carGroup.position.x < 1) {
        if (!hasPassedStart) {
            hasPassedStart = true;
        }
    } else if (hasPassedStart && carGroup.position.z > 5) {
        laps++;
        hasPassedStart = false;
        if (laps >= 3) {
            alert('You win!');
            laps = 0;
        }
    }

    // Update camera
    const cameraPosition = carGroup.position.clone().add(new THREE.Vector3(0, 5, -10).applyAxisAngle(new THREE.Vector3(0, 1, 0), carRotation));
    camera.position.copy(cameraPosition);
    camera.lookAt(carGroup.position);

    updateUI();
    renderer.render(scene, camera);
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();