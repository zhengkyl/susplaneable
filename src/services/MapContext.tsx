import { CircularProgress } from "@mui/material";
import React, { createContext, useContext, useEffect, useState } from "react";
import { MapsService } from "./MapsService";

interface ContextObj {
  map: google.maps.Map;
  geocoder: google.maps.Geocoder;
  polyline: google.maps.Polyline;
}

export const MapContext = createContext<ContextObj>();

export const MapContextProvider = ({ children }) => {
  const [map, setMap] = useState<google.maps.Map>();
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder>();
  const [polyline, setPolyline] = useState<google.maps.Polyline>();

  useEffect(() => {
    (async () => {
      const retMap = await MapsService.initMap();
      setMap(retMap);
      setGeocoder(new google.maps.Geocoder());
      setPolyline(new google.maps.Polyline());
    })();
  }, []);

  return (
    <MapContext.Provider value={{ map, geocoder, polyline }}>
      {children}
    </MapContext.Provider>
  );
};
