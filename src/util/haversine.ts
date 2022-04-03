
// haversine method for calculating distance
// https://www.movable-type.co.uk/scripts/latlong.html
export const distBetweenCoords = (
  c1: { lat: number; lng: number },
  c2: { lat: number; lng: number }
) => {
  const R = 6371e3; // metres
  const φ1 = (c1.lat * Math.PI) / 180; // φ, λ in radians
  const φ2 = (c2.lat * Math.PI) / 180;
  const Δφ = ((c2.lat - c1.lat) * Math.PI) / 180;
  const Δλ = ((c2.lng - c1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres
  return d;
};
