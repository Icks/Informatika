import {frameArea} from "./frameArea.js";
import {dumpObject} from "./dumpObject.js";

const loader = document.querySelector('#loader'); // Get loader
const perentageLoaded = document.querySelector('#perentageLoaded'); // Get percentage
const startButton = document.querySelector('#startButton'); // Get startButton

export const gltfSetup = (scene, orbitControls, camera, canvas) => {

  const gltfLoader = new THREE.GLTFLoader();

  gltfLoader.load('./models/informatics_5.glb', (gltf) => {

      // Treats all mesh materials as individual entities
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.material = child.material.clone();
        }
      });

      const root = gltf.scene;
      const glasses = root.children.filter((children) => {
        const properties = children.name.split('_');
        return properties[0] === 'glass';
      });

      glasses.forEach((glass) => {
        if (glass.children.length) {
          glass.children[1].material.transparent = true;
          glass.children[1].material.transparency = 0.1;
          glass.children[1].material.color = {r: 240, g: 248, b: 255};
          glass.children[1].material.opacity = 0.2;
        }
      })


      // dumpObject(root);
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
    },
    (xhr) => {
      const percentage = (xhr.loaded / xhr.total * 100)
      perentageLoaded.innerHTML = `${percentage.toFixed(0)}`
      if (percentage === 100) {
        // gltfLoader.load('./models/tree_tut.glb', (gltf) => {
        //
        //   // Treats all mesh materials as individual entities
        //   gltf.scene.traverse((child) => {
        //     if (child.isMesh) {
        //       child.material = child.material.clone();
        //     }
        //   });
        //
        //   const root = gltf.scene;
        //   scene.add(root);
        //
        //   const box = new THREE.Box3().setFromObject(root);
        //   const boxSize = box.getSize(new THREE.Vector3()).length();
        //   const boxCenter = box.getCenter(new THREE.Vector3());
        //   frameArea(boxSize, boxSize, boxCenter, camera);
        //
        //   orbitControls.target.copy(boxCenter);
        // })

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
