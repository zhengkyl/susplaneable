import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useCallback, useContext, useEffect, useState } from "react";
import { MapContext } from "../services/MapContext";
import { MapsService } from "../services/MapsService";
import { Coords, distBetweenCoords } from "../util/haversine";

const METERS_PER_POINT = 10;

export const MapView = () => {
  const { map, polyline } = useContext(MapContext);

  const [started, setStarted] = useState(false);

  const toggleStarted = useCallback(() => {
    setStarted(!started);

    const points = polyline.getPath().getArray();

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

    // console.log(approxPoints);
    let count = 0;

    const renderNext = () => {
      map.panTo(approxPoints[count]);
      count++;
      if (count < approxPoints.length) {
        setTimeout(renderNext, 100);
      }
      else {
        setStarted(false)
      }
    };
    renderNext();
  }, [started, polyline]);

  useEffect(() => {
    if (!map) return;
    MapsService.initWebGLOverlayView(map);
  }, [map]);

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
