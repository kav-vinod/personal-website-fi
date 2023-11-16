import './style.css'

import * as THREE from 'three';
import { MeshStandardMaterial } from 'three';

//orbit controls let you move around the scene using a mouse
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

//will always need 3 objects - a scene, a camera, and a renderer 
//scene - container holding all objects, cameras, lights
const scene = new THREE.Scene()

//Camera:
//multiple cameras in three.js - most common is the perspective camera, which mimics what human eyes see
//1st arg: field of view -  amt of world visible based on full 360 degrees
//2nd arg: aspect ratio - based off of user's browser's window (inner width/inner height)
//3rd arg: view frustrum, controls what objects are visible from the camera itself
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)

//renderer - renders graphics to the screen
const renderer = new THREE.WebGLRenderer({
  //render needs to know which element to use - canvas w/ id of background
  canvas: document.querySelector('#bg')
})

//set pixel ratio to device pixel ratio
//make full screen canvas by setting rederer size to the window size
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
//moves camera from middle along Z axis
camera.position.setZ(30)

renderer.render(scene, camera)

//creates big 3D Ring
const geometry = new THREE.TorusGeometry(10, 3, 16, 100)

//material - gives object color and texture, like wrapping paper for geometry
const material = new THREE.MeshStandardMaterial( {color: 0xFF6347 } ); 
//Basic material requires no light source
//standard material reacts to light bouncing off of it

//combines geometry + material
const torus = new THREE.Mesh(geometry, material);

//adds object to scene
scene.add(torus)

const pointLight = new THREE.PointLight(0xffffff, 1000)
pointLight.position.set(5, 5, 5)

const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(pointLight, ambientLight)

const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper)

//listen to dom events on the mouse and update camera position accordingly
const controls = new OrbitControls(camera, renderer.domElement)

//to see it, need to rerender the screen
//don't want to do it too many times in code - make a function to do it automaticallu


function addStar(){

  //create a star
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  //give the star a random position
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100)); 
  star.position.set(x, y, z);
  scene.add(star)

}

//array of 200 vals, for each value call the add star function
Array(200).fill().forEach(addStar)

//can pass a callback function here too be notified when your image is done loading - shows a loading bar 
const spaceTexture = new THREE.TextureLoader().load('spacebackground.jpg')
scene.background = spaceTexture;

//Texture mapping - wraps a 2D image thast provides the "texture" to a 3D object
const kavTexture = new THREE.TextureLoader().load('timessquare.jpg');

const kav = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({map: kavTexture})
);

scene.add(kav)

const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    //normal map helps make an object look more realistic
    normalMap: normalTexture
  })
);

scene.add(moon);

//both setter and equal function do the same thing

moon.position.z = 30;
moon.position.setX(-10);

//function is the event handler for the doc.body.onscroll event 
function moveCamera() {
  //calculate where user is currently scrolled to 
  //this function will tell us how far away we are from the top of the webpage
  const t = document.body.getBoundingClientRect().top;

  //start changing properties of 3D objects whenever this function is called
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075; 
  moon.rotation.z += 0.05;

  kav.rotation.y += 0.01; 
  kav.rotation.z += 0.01;

  //changes posution of actual camera itself
  //top val is always negative so multiply it by a neg # 

  camera.position.z = t * -0.01; 
  camera.position.x = t * -0.0002; 
  camera.position.y = t * -0.0002; 

}

document.body.onscroll = moveCamera

function animate() {
  //tells the browser you want to perform an animation
  requestAnimationFrame(animate); 
  //now whenever browser repaints the screen, it will call the render method to update the UI
  torus.rotation.x += 0.01; 
  torus.rotation.y += 0.005;
  torus.rotation.x += 0.01;
  
  controls.update(); 

  renderer.render(scene, camera); 
}

//basically infintely running
animate()

