// Set up scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Set background color to black

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('background-animation').appendChild(renderer.domElement);

// Debug log to confirm renderer is added
console.log("Renderer added to background-animation");

// Adjust scene on window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // Debug log to confirm resize event
    console.log("Window resized, renderer size updated");
});

// Re-add the skybox code for a starry background
const skyboxGeometry = new THREE.SphereGeometry(500, 32, 32);
const skyboxTexture = new THREE.TextureLoader().load('https://i.imgur.com/gY9PSFo.jpg'); // Starry texture URL
const skyboxMaterial = new THREE.MeshBasicMaterial({ map: skyboxTexture, side: THREE.BackSide });
const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
scene.add(skybox);

// Debug log to confirm skybox is added
console.log("Skybox added to scene");

// Create the Earth
const earthGeometry = new THREE.SphereGeometry(5, 32, 32); // Earth radius = 5 units
const earthTexture = new THREE.TextureLoader().load('https://i.imgur.com/kFoWvzw.jpg'); // Diffuse map URL
const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Debug log to confirm Earth is added
console.log("Earth added to scene");

// Add a subtle atmosphere effect
const atmosphereGeometry = new THREE.SphereGeometry(5.1, 32, 32); // Slightly larger sphere
const atmosphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x00D4FF,
    transparent: true,
    opacity: 0.2,
    side: THREE.BackSide
});
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
scene.add(atmosphere);

// Debug log to confirm atmosphere is added
console.log("Atmosphere added to scene");

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Debug log to confirm lights are added
console.log("Lights added to scene");

// Position the camera
camera.position.z = 15;

// (Optional) Add OrbitControls for interactivity
const controlsScript = document.createElement('script');
controlsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/examples/js/controls/OrbitControls.js';
controlsScript.onload = () => {
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Debug log to confirm controls are added
    console.log("OrbitControls added");

    animate();
};
document.head.appendChild(controlsScript);

// Animation loop (if OrbitControls loads, this will be called from its onload)
function animate() {
    requestAnimationFrame(animate);
    // Rotate Earth and atmosphere
    earth.rotation.y += 0.002;
    atmosphere.rotation.y += 0.002;
    renderer.render(scene, camera);
    // Debug log to confirm animation frame
    console.log("Animation frame rendered");
}
