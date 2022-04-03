export const apiOptions = {
  apiKey: import.meta.env.VITE_MAPS_API_KEY as string,
  version: "beta",
  libraries:["places" as const]
};

export const mapOptions = {
  zoom: 18,
  center: { lat: 33.77690281220873, lng: -84.39653629324592 },
  mapId: import.meta.env.VITE_MAPS_MAP_ID as string,
};
