import {OrbitControls} from './OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Set background color
scene.background = new THREE.Color(0x000000);

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 15);
scene.add(directionalLight);

// Enable shadows
renderer.shadowMap.enabled = true;
directionalLight.castShadow = true;

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi/180);
}

// --------------------- All Materials --------------------------------
// court floor
const courtFloorMat = new THREE.MeshPhongMaterial({
  color: 0xc68642,  // Brown wood color
  shininess: 50
});

// court floor white markings
const courtFloorMarkingsMat = new THREE.LineBasicMaterial({
  color: 0xdddddd, // white
  shininess: 0
});

// Create basketball court
function createBasketballCourt() {

  createCourtFloor();
  createHoops();
  createStaticBall();
}

function createCourtFloor(){
  const courtWidth = 15
  const courtLength = 28
  const courtThickness = 0.2
  const courtMarkingsThickness = 0.1
  const courtMarkingsYPos = courtThickness / 2 + 0.01
  const threePointsMarkingsRadius = courtWidth * 0.4

  // Court floor - just a simple brown surface
  const courtGeometry = new THREE.BoxGeometry(courtLength, courtThickness, courtWidth);

  const court = new THREE.Mesh(courtGeometry, courtFloorMat);
  court.receiveShadow = true;

  scene.add(court);

  // Center line marking
  const centerLineGeometry = new THREE.PlaneGeometry(courtMarkingsThickness, courtWidth);
  const centerLine = new THREE.Mesh(centerLineGeometry, courtFloorMarkingsMat);
  centerLine.rotation.x = -Math.PI / 2;
  centerLine.position.y = courtMarkingsYPos;
  scene.add(centerLine);

  // Center circle marking
  const circleRadius = 1.8;

  const ringGeometry = new THREE.RingGeometry(
      circleRadius - courtMarkingsThickness / 2,
      circleRadius + courtMarkingsThickness / 2,
      64);

  const centerCircle = new THREE.Mesh(ringGeometry, courtFloorMarkingsMat);

  // rotate so the ring is flat on the floor
  centerCircle.rotation.x = -Math.PI / 2;
  centerCircle.position.y = courtMarkingsYPos;

  scene.add(centerCircle);

  // Three-point markings (arcs)
  const arcInnerRadius = threePointsMarkingsRadius - courtMarkingsThickness / 2;
  const arcOuterRadius = threePointsMarkingsRadius + courtMarkingsThickness / 2;
  const arcSegments = 64;

  function createThreePointArc(xPos, flip) {
    const arcShape = new THREE.RingGeometry(arcInnerRadius, arcOuterRadius, arcSegments, 1, degrees_to_radians(270), degrees_to_radians(180));
    const arc = new THREE.Mesh(arcShape, courtFloorMarkingsMat);
    arc.rotation.x = -Math.PI / 2;
    arc.position.set(xPos, courtMarkingsYPos , 0);
    if (flip) arc.rotation.z = Math.PI;
    scene.add(arc);
  }

  createThreePointArc(-courtLength/2, false);
  createThreePointArc(courtLength/2, true);
}

function createHoops(){

}

function createStaticBall(){

}

// Create all elements
createBasketballCourt();

// Set camera position for better view
const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(0, 15, 30);
camera.applyMatrix4(cameraTranslate);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
let isOrbitEnabled = true;

// Instructions display
const instructionsElement = document.createElement('div');
instructionsElement.style.position = 'absolute';
instructionsElement.style.bottom = '20px';
instructionsElement.style.left = '20px';
instructionsElement.style.color = 'white';
instructionsElement.style.fontSize = '16px';
instructionsElement.style.fontFamily = 'Arial, sans-serif';
instructionsElement.style.textAlign = 'left';
instructionsElement.innerHTML = `
  <h3>Controls:</h3>
  <p>O - Toggle orbit camera</p>
`;
document.body.appendChild(instructionsElement);

// Handle key events
function handleKeyDown(e) {
  if (e.key === "o") {
    isOrbitEnabled = !isOrbitEnabled;
  }
}

document.addEventListener('keydown', handleKeyDown);

// Animation function
function animate() {
  requestAnimationFrame(animate);
  
  // Update controls
  controls.enabled = isOrbitEnabled;
  controls.update();
  
  renderer.render(scene, camera);
}

animate();