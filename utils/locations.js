const blocker = document.querySelector('#blocker');

export const locations = (camera, pointerControls) => {
  const onKeyDown = function (event) {
    if (blocker.style.visibility === 'visible') {
      return 0;
    }
    pointerControls.lock()
    switch (event.keyCode) {
      case 49: //1: Cafeteria
        camera.position.set(-80, 100, 260);
        camera.lookAt(1840, 100, 2100);
        break;
      case 50: //2: Entrance
        camera.position.set(140, 100, -2100);
        camera.lookAt(140, 100, 2100);
        break;
    }
  };

  document.addEventListener('keydown', onKeyDown);
}
