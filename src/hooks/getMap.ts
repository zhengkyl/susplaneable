import { useEffect, useState } from "react";
import { MapsService } from "../services/MapsService";

const useGetMap = () => {
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(()=> {
    (async ()=> {
      const retMap = await MapsService.initMap();
      setMap(retMap);
    })
  },[])


  return map;
};
