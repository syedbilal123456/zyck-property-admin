'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Center of Pakistan
const pakistanCenter = { lat: 30.3753, lng: 69.3451 };
const zoomLevel = 5; // Adjusted for better initial view

// Map bounds for Pakistan
const pakistanBounds: LatLngTuple[] = [
  [23.6345, 60.9500],
  [37.0841, 77.3650]
];

// Define the custom icon
const greenIcon = L.icon({
  iconUrl: '/leaf-green.png', // Path to your icon file

  iconSize: [38, 45], // Size of the icon
  shadowSize: [50, 64], // Size of the shadow
  iconAnchor: [22, 94], // Point of the icon corresponding to marker's location
  shadowAnchor: [4, 62], // Same for the shadow
  popupAnchor: [-3, -76] // Point from which the popup opens relative to iconAnchor
});

const PakistanMap = () => {
  return (
    <div className="w-full h-[500px]"> {/* Fixed height container */}
      <MapContainer
        center={pakistanCenter}
        zoom={zoomLevel}
        className="w-full h-full" // Use full width and height of container
        maxBounds={pakistanBounds}
        maxBoundsViscosity={1.0}
        minZoom={5}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        <Marker position={{ lat: 22.7607, lng: 67.7011 }} icon={greenIcon}>
          <Popup>Karachi, Pakistan</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default PakistanMap;
