import { Loader } from "@googlemaps/js-api-loader";
import { apiOptions, mapOptions } from "../config";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const initMap = async () => {
  const mapDiv = document.querySelector<HTMLElement>("#map")!;
  const apiLoader = new Loader(apiOptions);
  await apiLoader.load();
  return new google.maps.Map(mapDiv, mapOptions);
};

const initWebGLOverlayView = (map: google.maps.Map) => {
  let scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    camera: THREE.Camera,
    loader: GLTFLoader;

  const webGLOverlayView = new google.maps.WebGLOverlayView();
  // WebGLOverlayView code goes here

  webGLOverlayView.onAdd = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
    directionalLight.position.set(0.5, -1, 0.5);
    scene.add(directionalLight);

    loader = new GLTFLoader();

    loader.load("pin.gltf", (gltf) => {
      gltf.scene.scale.set(25, 25, 25);
      gltf.scene.rotation.x = (180 * Math.PI) / 180;

      scene.add(gltf.scene);
    });
  };

  webGLOverlayView.onContextRestored = ({ gl }) => {
    renderer = new THREE.WebGLRenderer({
      canvas: gl.canvas,
      context: gl,
      ...gl.getContextAttributes(),
    });
    renderer.autoClear = false;
  };

  webGLOverlayView.onDraw = ({ gl, transformer }) => {
    const latLngAlt = {
      lat: mapOptions.center.lat,
      lng: mapOptions.center.lng,
      altitude: 120,
    };

    const matrix = transformer.fromLatLngAltitude(latLngAlt);
    camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);

    webGLOverlayView.requestRedraw();
    renderer.render(scene, camera);
    renderer.resetState();
  };

  webGLOverlayView.setMap(map);
};


export const MapsService = {
  initMap,
  initWebGLOverlayView,
}
