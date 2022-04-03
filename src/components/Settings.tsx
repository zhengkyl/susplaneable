import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";

import { useContext, useEffect, useState } from "react";
import { MapContext } from "../services/MapContext";
import Button from "@mui/material/Button";
import { WaypointAddress } from "./WaypointAddress";
import { WaypointClick } from "./WaypointClick";
interface Coords {
  lat: number;
  lng: number;
}

interface Waypoint {
  coords?: Coords;
  id: string;
  click: boolean; // click or address type
}
export const Settings = () => {
  const { map, polyline } = useContext(MapContext);

  const [waypoints, setWaypoints] = useState<Waypoint[]>([
    { id: "startwp", click: false },
  ]);

  const [dblClkListener, setDblClkListener] = useState<google.maps.MapsEventListener>();

  useEffect(() => {
    if (!map) return;
    if (dblClkListener) {
      google.maps.event.removeListener(dblClkListener);
    }
    setDblClkListener(
      map.addListener("dblclick", (mapEvent: google.maps.MapMouseEvent) => {
        updateWaypoint(waypoints.length, {
          lat: mapEvent.latLng.lat(),
          lng: mapEvent.latLng.lng(),
        });
      })
    );
  }, [waypoints, map]);

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
    const path = waypoints.flatMap((wp) => wp.coords || []);
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
    if (index < waypoints.length) {
      setWaypoints([
        ...waypoints.slice(0, index),
        { id: waypoints[index].id, click: waypoints[index].click, coords },
        ...waypoints.slice(index + 1),
      ]);
    } else if (index == waypoints.length) {
      setWaypoints([
        ...waypoints,
        { id: new Date().toISOString(), coords, click: true },
      ]);
    }
  };

  const onAdd = () => {
    setWaypoints([
      ...waypoints,
      { id: new Date().toISOString(), click: false },
    ]);
  };

  return (
    <Box sx={{ flex: 1, p: 2 }}>
      <Box sx={{ "& > *": { mb: 2 } }}>
        {waypoints.map((wp, index) =>
          wp.click ? (
            <WaypointClick
              coords={wp.coords}
              index={index}
              updateWaypoint={updateWaypoint}
              key={wp.id}
            />
          ) : (
            <WaypointAddress
              index={index}
              updateWaypoint={updateWaypoint}
              key={wp.id}
            />
          )
        )}
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
