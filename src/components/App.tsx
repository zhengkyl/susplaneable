import Box from "@mui/material/Box";
import { MapContextProvider } from "../services/MapContext";
import { MapView } from "./Map";
import { Settings } from "./Settings";

function App() {
  return (
    <MapContextProvider>
      <Box sx={{ display: "flex", flexWrap: "wrap", height: "100vh" }}>
        <MapView />
        <Settings />
      </Box>
    </MapContextProvider>
  );
}

export default App;
