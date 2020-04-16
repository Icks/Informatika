import {resizeRenderer} from "./resizeRenderer.js";
import {raycasterSetup} from "./raycasterSetup.js";

const {leftRaycaster, rightRaycaster} = raycasterSetup()

const intersects = {
  left: undefined,
  right: undefined
}

export const render = (scene, camera, renderer, pointerControls, movement, velocity) => {
  if (pointerControls.isLocked) {

    leftRaycaster.ray.origin.copy(pointerControls.getObject().position);
    rightRaycaster.ray.origin.copy(pointerControls.getObject().position);

    if (scene.children.length > 2) {
      intersects.left = leftRaycaster.intersectObjects(scene.children[3].children, true);
      intersects.right = rightRaycaster.intersectObjects(scene.children[3].children, true);

      if (intersects.left.length) {
        if (intersects.left[0].distance < 1) {
          if (movement.left) velocity.x = 0;
        }
      }
      if (intersects.right.length) {
        if (intersects.right[0].distance < 1) {
          if (movement.right) velocity.x = 0;
        }
      }
    }

    if (movement.up) {
      velocity.y += 1
    }
    if (movement.down) {
      velocity.y -= 1
    }

    pointerControls.moveForward(velocity.z);
    pointerControls.moveRight(velocity.x);
    pointerControls.getObject().position.y = velocity.y;
  }

  if (resizeRenderer(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  renderer.render(scene, camera);

  requestAnimationFrame(() => render(scene, camera, renderer, pointerControls, movement, velocity));
}
