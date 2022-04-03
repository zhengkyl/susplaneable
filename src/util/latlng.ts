export const clampLat = (lat: number) => Math.min(Math.max(lat, -85), 85);
export const clampLng = (lng: number) => Math.min(Math.max(lng, -180), 180);
