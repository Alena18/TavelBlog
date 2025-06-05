import L from "leaflet";
import { useMapEvents, useMap } from "react-leaflet";
import flagImage from "../assets/images/flag.png";

export const createIcon = (placename) =>
  L.divIcon({
    className: "custom-marker-icon",
    html: `<div style="text-align: center;">
      <div style="font-size: 12px; font-weight: bold; color: #5400b0;">${placename}</div>
      <img src="${flagImage}" style="width: 40px; height: 40px;" />
    </div>`,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });

export function ZoomWatcher({ onZoomChange }) {
  const map = useMap();
  map.on("zoomend", () => onZoomChange(map.getZoom()));
  return null;
}

export function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      const popups = document.querySelectorAll(".leaflet-popup");
      if (popups.length > 0) return;
      onMapClick(e.latlng);
    },
  });
  return null;
}
