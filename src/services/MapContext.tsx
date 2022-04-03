import { ThreeJSOverlayView } from "@googlemaps/three";
import React, { createContext, useContext, useEffect, useState } from "react";
import * as THREE from "three";
import { MapsService } from "./MapsService";

interface ContextObj {
  map: google.maps.Map;
  geocoder: google.maps.Geocoder;
  polyline: google.maps.Polyline;
  scene: THREE.Scene;
}

export const MapContext = createContext<ContextObj>();

export const MapContextProvider = ({ children }) => {
  const [map, setMap] = useState<google.maps.Map>();
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder>();
  const [polyline, setPolyline] = useState<google.maps.Polyline>();
  const [scene, setScene] = useState<THREE.Scene>(new THREE.Scene);

  useEffect(() => {
    (async () => {
      const retMap = await MapsService.initMap();
      setMap(retMap);
      setGeocoder(new google.maps.Geocoder());
      setPolyline(new google.maps.Polyline());
      // setScene(new THREE.Scene());
      // const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
      // scene1.add(ambientLight);

  // //   const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
  // //   directionalLight.position.set(0.5, -1, 0.5);
  // //   scene.add(directionalLight);
    })();
  }, []);

  return (
    <MapContext.Provider value={{ map, geocoder, polyline, scene}}>
      {children}
    </MapContext.Provider>
  );
};
