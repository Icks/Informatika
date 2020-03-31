(() => {
  const textureLoader = new THREE.TextureLoader();

  let moveForward = false;
  let moveBackward = false;
  let moveLeft = false;
  let moveRight = false;
  let moveUp = false;
  let moveDown = false;

  const velocity = new THREE.Vector3(0,14,0);

  const canvas = document.querySelector('#informatics'); // Get canvas
  const startButton = document.querySelector('#startButton'); // Get canvas
  const renderer = new THREE.WebGLRenderer({canvas});

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#7ac4f0');

  // Camera
  const cameraOptions = {
    fov: 50,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 10000
  };
  const camera = new THREE.PerspectiveCamera(cameraOptions.fov, cameraOptions.aspect, cameraOptions.near, cameraOptions.far);

  // Controls
  const orbitControls = new THREE.OrbitControls(camera, canvas);
  orbitControls.maxPolarAngle = 1.57
  orbitControls.keyPanSpeed = 20
  orbitControls.update();
  const pointerControls = new THREE.PointerLockControls(camera, document.body);
  startButton.addEventListener('click', function () {
    pointerControls.lock();
  });

  const onKeyDown = function ( event ) {
    switch ( event.keyCode ) {

      case 38: // up
      case 87: // w
        moveForward = true;
        velocity.z = 0.1;
        break;

      case 37: // left
      case 65: // a
        moveLeft = true;
        velocity.x = -0.1;
        break;

      case 40: // down
      case 83: // s
        moveBackward = true;
        velocity.z = -0.1;
        break;

      case 39: // right
      case 68: // d
        moveRight = true;
        velocity.x = 0.1;
        break;

      case 82: // r
        moveUp = true;

        break;

      case 70: // f
        moveDown = true;
        break;

    }
  };

  const onKeyUp = function ( event ) {

    switch ( event.keyCode ) {

      case 38: // up
      case 87: // w
        moveForward = false;
        break;

      case 37: // left
      case 65: // a
        moveLeft = false;
        break;

      case 40: // down
      case 83: // s
        moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        moveRight = false;
        break;

      case 82: // r
        moveUp = false;
        break;

      case 70: // f
        moveDown = false;
        break;

    }
    velocity.z = 0;
    velocity.x = 0;
  };

  document.addEventListener( 'keydown', onKeyDown );
  document.addEventListener( 'keyup', onKeyUp );

  // Light (Further experiments needed)
  const hemOptions = {
    skyColor: 0xf2f2f2,
    groundColor: 0xffffff,
    intensity: 1
  };
  const hemisphereLight = new THREE.HemisphereLight(hemOptions.skyColor, hemOptions.groundColor, hemOptions.intensity);
  scene.add(hemisphereLight);

  // Ground texture and material
  const groundTexture = textureLoader.load('./js/images/grass.jpg');
  groundTexture.wrapS = groundTexture.wrapT = THREE.MirroredRepeatWrapping;
  groundTexture.repeat.set(20, 20);
  const groundMaterial = new THREE.MeshLambertMaterial({map: groundTexture});
  const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), groundMaterial);
  mesh.position.y = 12;
  mesh.rotation.x = -Math.PI / 2;
  // mesh.receiveShadow = true;
  scene.add(mesh);

  function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
    const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
    const halfFovY = THREE.MathUtils.degToRad(camera.fov * .5);
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
    // compute a unit vector that points in the direction the camera is now
    // in the xz plane from the center of the box
    const direction = (new THREE.Vector3())
      .subVectors(camera.position, boxCenter)
      .multiply(new THREE.Vector3(0, 0, -10))
      .normalize();


    // move the camera to a position distance units way from the center
    // in whatever direction the camera was from the center already
    camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

    // pick some near and far values for the frustum that
    // will contain the box.
    camera.near = boxSize / 100;
    camera.far = boxSize * 100;

    camera.updateProjectionMatrix();
    // camera.position.add(camera.getWorldDirection());

    // point the camera to look at the center of the box
    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
  }

  function dumpObject(obj, lines = [], isLast = true, prefix = '') {
    const localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
      const isLast = ndx === lastNdx;
      dumpObject(child, lines, isLast, newPrefix);
    });
    return lines;
  }

  let doors;
  {

    const gltfLoader = new THREE.GLTFLoader();
    gltfLoader.load('./models/Maincolor.glb', (gltf) => {
      gltf.scene.traverse(function (child) {

        if (child.isMesh) {

          child.material = child.material.clone();

        }

      });
      const root = gltf.scene;
      console.log(dumpObject(root).join('\n'));
      doors = root.getObjectByName('door_main_1');
      // console.log(doors)
      // if (doors) {
      //   for (const door of doors.children) {
      //     // door.rotation.x = time;
      //     console.log(door.material)
      //     door.material.color = {r:0,g:0,b:0}
      //   }
      // }

      document.addEventListener('mousedown', () => {
        if (doors) {
          for (const door of doors.children) {
            // door.rotation.x = time;
            console.log(door.material)
            door.rotation.y = 10;
          }
        }
      }, false);

      scene.add(root);


      // compute the box that contains all the stuff
      // from root and below
      const box = new THREE.Box3().setFromObject(root);

      const boxSize = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());

      // set the camera to frame the box
      frameArea(boxSize * 0.5, boxSize, boxCenter, camera);

      // update the Trackball controls to handle the new size
      orbitControls.maxDistance = boxSize * 4;
      orbitControls.target.copy(boxCenter);
    });
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render() {
    // orbitControls.update();
    if ( pointerControls.isLocked === true ) {
      if(moveUp){
        velocity.y+=0.1
      }
      if(moveDown){
        velocity.y-=0.1
      }
      pointerControls.moveForward( velocity.z );
      pointerControls.moveRight( velocity.x );
      pointerControls.getObject().position.y = velocity.y;
    }
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

})()
