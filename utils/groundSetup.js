const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('./images/grass.jpg');

export const groundSetup = (scene) => {
  texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
  texture.repeat.set(20, 20);

  const material = new THREE.MeshLambertMaterial({map: texture});
  const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), material);
  mesh.position.y = 12;
  mesh.rotation.x = -Math.PI / 2;

  scene.add(mesh);
}
