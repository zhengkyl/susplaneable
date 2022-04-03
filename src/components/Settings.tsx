import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";

import { useContext, useEffect, useState } from "react";
import { MapContext } from "../services/MapContext";
import Button from "@mui/material/Button";
import { WaypointInput } from "./WaypointInput";
interface Coords {
  lat: number;
  lng: number;
}

interface Waypoint {
  coords?: Coords;
  id: string;
}
export const Settings = () => {
  const { map, polyline } = useContext(MapContext);

  const [waypoints, setWaypoints] = useState<Waypoint[]>([{ id: "startwp" }]);

  useEffect(() => {
    if (!map) return;
    const bounds = new google.maps.LatLngBounds();

    const count = waypoints.reduce((prev, wp) => {
      if (!wp.coords) return prev;
      bounds.extend(wp.coords);
      return prev + 1;
    }, 0);

    if (!count) return;
    map.fitBounds(bounds);

    if (count <= 1) {
      polyline.setMap(null);
      return;
    }
    polyline.setMap(map);
    const path = waypoints.flatMap(wp=>wp.coords || [])
    polyline.setPath(path);
  }, [waypoints, map]);

  const updateWaypoint = (index: number, coords?: Coords) => {
    if (!coords) {
      // remove
      setWaypoints([
        ...waypoints.slice(0, index),
        ...waypoints.slice(index + 1),
      ]);
      return;
    }
    setWaypoints([
      ...waypoints.slice(0, index),
      { id: waypoints[index].id, coords },
      ...waypoints.slice(index + 1),
    ]);
  };

  const onAdd = () => {
    setWaypoints([...waypoints, { id: new Date().toISOString() }]);
  };

  return (
    <Box sx={{ flex: 1, p: 2 }}>
      <Box sx={{ "& > *": { mb: 2 } }}>
        {waypoints.map((wp, index) => (
          <WaypointInput
            index={index}
            updateWaypoint={updateWaypoint}
            key={wp.id}
          />
        ))}
      </Box>

      <Button
        variant="outlined"
        aria-label="add"
        onClick={onAdd}
        startIcon={<AddIcon />}
        size="small"
      >
        Add waypoint
      </Button>
    </Box>
  );
};
