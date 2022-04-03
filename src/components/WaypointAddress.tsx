import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  ChangeEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { MapContext } from "../services/MapContext";
interface Coords {
  lat: number;
  lng: number;
}
interface WaypointInputProps {
  index: number;
  updateWaypoint: (index: number, coords?: Coords) => void;
}
export const WaypointAddress = ({
  index,
  updateWaypoint,
}: WaypointInputProps) => {
  const ref = useRef(null);

  const { map, geocoder } = useContext(MapContext);

  const [value, setValue] = useState("");
  const [marker, setMarker] = useState<google.maps.Marker>();

  const onChangeValue: ChangeEventHandler<HTMLInputElement> = (e) =>
    setValue(e.target.value);


  useEffect(() => {
    if (!map) return;
    if (!ref.current) return;

    const autocomplete = new google.maps.places.Autocomplete(ref.current, {
      fields: ["geometry", "name"],
    });
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.name) {
        return;
      }
      if (!place.geometry?.location) {
        // setCoords(undefined);
        // updateWaypoint(index); shouldn't remove
        alert("Invalid location");
        return;
      }
      const coords = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      // setCoords();
      setValue(place.name);
      // ref.current!.value! = place.formatted_address
      if (marker) {
        marker.setMap(null)
      }
      setMarker(
        new google.maps.Marker({ map, position: place.geometry.location })
      );

      // const bounds = index ? map.getBounds() : new google.maps.LatLngBounds();
      // bounds?.extend(coords)
      // map.fitBounds(bounds)
      updateWaypoint(index, coords);
      // triggerUpdate(); //
    });
  }, [map]);

  const onDelete = () => {
    updateWaypoint(index);
    if (marker) {
      marker.setMap(null);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <TextField
        inputRef={ref}
        variant="outlined"
        label={`Waypoint ${index + 1}`}
        value={value}
        onChange={onChangeValue}
        fullWidth
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