import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useCallback, useContext, useEffect, useState } from "react";
import { MapContext } from "../services/MapContext";
import { MapsService } from "../services/MapsService";
import { Coords, distBetweenCoords } from "../util/haversine";
import * as THREE from "three";
import { latLngToVector3, ThreeJSOverlayView } from "@googlemaps/three";

const METERS_PER_POINT = 10;

export const MapView = () => {
  const { map, polyline, scene } = useContext(MapContext);

  const [started, setStarted] = useState(false);

  const toggleStarted = useCallback(() => {
    const points = polyline.getPath().getArray();

    if (points.length <= 1) {
      return;
    }

    setStarted(!started);
    const approxPoints: Coords[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const dist = google.maps.geometry.spherical.computeDistanceBetween(
        points[i],
        points[i + 1]
      );

      const numPoints = dist / METERS_PER_POINT;

      for (let j = 0; j < numPoints; j++) {
        const latlng = google.maps.geometry.spherical.interpolate(
          points[i],
          points[i + 1],
          j / numPoints
        );
        approxPoints.push({ lat: latlng.lat(), lng: latlng.lng() });
      }
    }
    // new ThreeJSOverlayView({
    //   scene,
    //   map,
    // });
    // // Create a box mesh
    // const box = new THREE.Mesh(
    //   new THREE.BoxBufferGeometry(10, 50, 10),
    //   new THREE.MeshNormalMaterial()
    // );

    // box.position.setY(25);

    // console.log(scene);
    // scene.add(box);

    let count = 0;

    // const animate = () => {
    //   if (count >= approxPoints.length) return;

    //   box.position.lerp(latLngToVector3(approxPoints[count]), 0.7);
    // };
    // // console.log(approxPoints);

    const renderNext = () => {
      if (count >= approxPoints.length) {
        setStarted(false);
        // scene.remove(box);
        return;
      }

      map.panTo(approxPoints[count]);
      // requestAnimationFrame(animate);
      count++;
      setTimeout(renderNext, 100);
    };
    renderNext();
    // requestAnimationFrame(animate);
  }, [started, polyline, scene]);

  useEffect(() => {
    if (!map) return;
    MapsService.initWebGLOverlayView(map);
    // new ThreeJSOverlayView({
    //   scene,
    //   map,
    // });
  }, [map, scene]);

  return (
    <Box sx={{ position: "relative", flex: 2, height: "100%" }}>
      <Box id="map" sx={{ height: "100%" }}></Box>
      <Button
        sx={{
          position: "absolute",
          margin: "auto",
          left: 0,
          right: 0,
          bottom: 32,
        }}
        onClick={toggleStarted}
        variant="contained"
        disabled={started}
      >
        {started ? "Delivering..." : "Start Delivery"}
      </Button>
    </Box>
  );
};
