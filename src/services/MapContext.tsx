import { CircularProgress } from "@mui/material";
import React, { createContext, useContext, useEffect, useState } from "react";
import { MapsService } from "./MapsService";

export const MapContext = createContext<google.maps.Map>();

export const MapContextProvider = ({ children }) => {
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    (async () => {
      const retMap = await MapsService.initMap();
      setMap(retMap);
    })();
  }, []);

  return (
    <MapContext.Provider value={map}>
      {children}
    </MapContext.Provider>
  );
};
