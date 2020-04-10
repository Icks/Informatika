const hemOptions = {
  skyColor: 0xf2f2f2,
  groundColor: 0xffffff,
  intensity: 1
};
export const lightSetup = (scene) => {
  const hemisphereLight = new THREE.HemisphereLight(hemOptions.skyColor, hemOptions.groundColor, hemOptions.intensity);
  scene.add(hemisphereLight);
}
