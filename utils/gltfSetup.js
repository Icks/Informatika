import {frameArea} from "./frameArea.js";
import {dumpObject} from "./dumpObject.js";

const loader = document.querySelector('#loader'); // Get loader
const perentageLoaded = document.querySelector('#perentageLoaded'); // Get percentage
const startButton = document.querySelector('#startButton'); // Get startButton

export const gltfSetup = (scene, orbitControls, camera, canvas) => {

  const gltfLoader = new THREE.GLTFLoader();

  gltfLoader.load('./models/informatics_1.glb', (gltf) => {

    // Treats all mesh materials as individual entities
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone();
      }
    });

    const root = gltf.scene;
    // dumpObject(root).join('\n');
    scene.add(root);

    // compute the box that contains all the stuff
    // from root and below
    const box = new THREE.Box3().setFromObject(root);

    const boxSize = box.getSize(new THREE.Vector3()).length();
    const boxCenter = box.getCenter(new THREE.Vector3());
    // set the camera to frame the box
    frameArea(boxSize, boxSize, boxCenter, camera);

    // update the Trackball controls to handle the new size
    // orbitControls.maxDistance = boxSize * 4;
    orbitControls.target.copy(boxCenter);
  }, (xhr) => {
    const percentage = (xhr.loaded / xhr.total * 100)
    perentageLoaded.innerHTML = `${percentage.toFixed(0)}`
    if (percentage === 100) {
      setTimeout(() => {
        canvas.style.visibility = 'visible'
        startButton.style.visibility = 'visible'
        loader.style.visibility = 'hidden'
      }, 1000)
    }
  }, (error) => {
    console.log('An error happened', error);
  });
}
