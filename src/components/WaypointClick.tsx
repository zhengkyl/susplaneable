import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";

import { ChangeEventHandler, useContext, useEffect, useState } from "react";
import { MapContext } from "../services/MapContext";
import { clampLat, clampLng } from "../util/latlng";

interface Coords {
  lat: number;
  lng: number;
}

interface WaypointInputProps {
  index: number;
  coords: Coords;
  updateWaypoint: (index: number, coords?: Coords) => void;
}

export const WaypointClick = ({
  coords,
  index,
  updateWaypoint,
}: WaypointInputProps) => {
  const { map } = useContext(MapContext);

  const [lat, setLat] = useState(clampLat(coords.lat));
  const [lng, setLng] = useState(clampLng(coords.lng));

  const onChangeLat: ChangeEventHandler<HTMLInputElement> = (event) =>
    setLat(clampLat(+event.target.value));
  const onChangeLng: ChangeEventHandler<HTMLInputElement> = (event) =>
    setLng(clampLng(+event.target.value));

  const [marker, setMarker] = useState<google.maps.Marker>();

  useEffect(() => {
    if (!map) return;

    if (marker) {
      marker.setMap(null);
    }
    setMarker(new google.maps.Marker({ map, position: { lat, lng } }));

    updateWaypoint(index, { lat, lng });
  }, [map, lat, lng]);

  const onDelete = () => {
    updateWaypoint(index);
    if (marker) {
      marker.setMap(null);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <TextField
        variant="outlined"
        label={`Waypoint ${index + 1} Lat`}
        value={lat}
        onChange={onChangeLat}
        sx={{ mr: 1 }}
      />
      <TextField
        variant="outlined"
        label={`Waypoint ${index + 1} Lng`}
        value={lng}
        onChange={onChangeLng}
        sx={{ ml: 1 }}
      />
      <IconButton
        sx={{ mr: -1, ml: 0.5 }}
        aria-label="delete"
        onClick={onDelete}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};
