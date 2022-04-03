import Box from "@mui/material/Box";
import { useContext, useEffect } from "react";
import { MapContext } from "../services/MapContext";
import { MapsService } from "../services/MapsService";

export const MapView = () => {
  const {map} = useContext(MapContext);

  useEffect(() => {
    if (!map) return;
    MapsService.initWebGLOverlayView(map);
  }, [map]);

  return <Box id="map" sx={{flex:2}}></Box>;
};
