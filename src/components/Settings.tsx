import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import {
  ChangeEventHandler,
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { MapContext } from "../services/MapContext";
import Button from "@mui/material/Button";
interface Coords {
  lat: number;
  lng: number;
}
interface WaypointInputProps {
  index: number;
  updateWaypoint: (index: number, coords?: Coords) => void;
}
export const WaypointInput = ({
  index,
  updateWaypoint,
}: WaypointInputProps) => {
  const ref = useRef(null);

  const { map, geocoder } = useContext(MapContext);

  const [value, setValue] = useState("");
  const [marker, setMarker] = useState<google.maps.Marker>();

  // const [coords, setCoords] = useState<Coords | undefined>();
  const onChangeValue: ChangeEventHandler<HTMLInputElement> = (e) =>
    setValue(e.target.value);

  // const coordsFromValue = (input: string) => {
  //   geocoder
  //     .geocode({ address: input })
  //     .then((result) => {
  //       console.log(result);
  //     })
  //     .catch((e) => console.log(e));
  // };

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

interface Waypoint {
  coords?: Coords;
  id: string;
}
export const Settings = () => {
  const { map, geocoder } = useContext(MapContext);

  const [waypoints, setWaypoints] = useState<Waypoint[]>([{ id: "startwp" }]);

  // const handleSubmit =
  //   (callback: () => void) => (event: FormEvent<HTMLFormElement>) => {
  //     event.preventDefault();
  //     callback();
  //   };

  useEffect(() => {
    if (!map) return;
    const bounds = new google.maps.LatLngBounds();
    let shouldUpdate = false;

    waypoints.forEach((wp) => {

      if (!wp.coords) return;
      bounds.extend(wp.coords);
      shouldUpdate = true;
    });

    if (!shouldUpdate) return;

    map.fitBounds(bounds);
  }, [waypoints, map]);

  // const triggerUpdate = () => {
  //   setWaypoints([...waypoints]);
  // };
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
            // triggerUpdate={triggerUpdate}
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
