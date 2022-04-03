import { CircularProgress } from "@mui/material";
import React, { createContext, useContext, useEffect, useState } from "react";
import { MapsService } from "./MapsService";

interface ContextObj {
  map: google.maps.Map;
  geocoder: google.maps.Geocoder;
}

export const MapContext = createContext<ContextObj>();

export const MapContextProvider = ({ children }) => {
  const [map, setMap] = useState<google.maps.Map>();
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder>();

  useEffect(() => {
    (async () => {
      const retMap = await MapsService.initMap();
      setMap(retMap);
      setGeocoder(new google.maps.Geocoder());
    })();
  }, []);

  return (
    <MapContext.Provider value={{ map, geocoder }}>
      {children}
    </MapContext.Provider>
  );
};
