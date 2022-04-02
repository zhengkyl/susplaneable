import Box from "@mui/material/Box";
import { MapContextProvider } from "../services/MapContext";
import { MapView } from "./Map";

function App() {
  return (
    <MapContextProvider>
      <Box sx={{ display: "flex", flexWrap: "wrap", height: "100vh" }}>
        <MapView />
      </Box>
    </MapContextProvider>
  );
}

export default App;
