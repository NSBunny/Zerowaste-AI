import React, { useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Donation, UserProfile } from '../types';
import { ExternalLink, Navigation } from 'lucide-react';

// Custom SVG Markers for absolute reliability and high contrast
const createCustomIcon = (color: string) => L.divIcon({
  className: 'custom-rescue-icon',
  html: `<div style="
    background-color: ${color}; 
    width: 32px; 
    height: 32px; 
    border-radius: 50% 50% 50% 0; 
    transform: rotate(-45deg); 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    border: 3px solid white; 
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    position: relative;
  ">
    <div style="
      width: 12px; 
      height: 12px; 
      background-color: white; 
      border-radius: 50%; 
      transform: rotate(45deg);
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
    "></div>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const DONOR_ICON = createCustomIcon('#10b981'); // Emerald
const VOLUNTEER_ICON = createCustomIcon('#3b82f6'); // Blue
const NGO_ICON = createCustomIcon('#f97316'); // Orange

interface RescueMapProps {
  donations?: Donation[];
  volunteers?: UserProfile[];
  ngos?: UserProfile[];
  currentLocation?: { lat: number; lng: number };
  center?: [number, number];
  zoom?: number;
}

function MapController({ center, donations, volunteers, ngos = [] }: RescueMapProps & { donations: Donation[], volunteers: UserProfile[] }) {
  const map = useMap();
  const hasAutoFitted = useRef(false);
  const prevCenter = useRef<[number, number] | undefined>(undefined);

  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 500);
    return () => clearTimeout(timer);
  }, [map]);

  // Live center tracking for navigation
  useEffect(() => {
    if (center && (!prevCenter.current || 
        Math.abs(center[0] - prevCenter.current[0]) > 0.001 || 
        Math.abs(center[1] - prevCenter.current[1]) > 0.001)) {
      map.panTo(center, { animate: true });
      prevCenter.current = center;
    }
  }, [center, map]);

  // Global view fit (only once on load or when many points appear)
  useEffect(() => {
    if (hasAutoFitted.current) return;

    const points: [number, number][] = [];
    donations.forEach(d => d.location && points.push([d.location.lat, d.location.lng]));
    volunteers.forEach(v => v.liveLocation && points.push([v.liveLocation.lat, v.liveLocation.lng]));
    ngos.forEach(n => n.liveLocation && points.push([n.liveLocation.lat, n.liveLocation.lng]));
    
    if (points.length > 1) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [100, 100], maxZoom: 15 });
      hasAutoFitted.current = true;
    } else if (points.length === 1) {
      map.setView(points[0], 15);
      hasAutoFitted.current = true;
    }
  }, [donations.length, volunteers.length, ngos.length, map]);

  return null;
}

export const RescueMap = React.memo(({ 
  donations = [], 
  volunteers = [], 
  ngos = [],
  currentLocation,
  center = [12.9716, 77.5946],
  zoom = 15 
}: RescueMapProps) => {
  const openInGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  const validDonations = useMemo(() => 
    donations.filter(d => d.location && (d.location.lat !== 0 || d.location.lng !== 0)),
    [donations]
  );

  const validVolunteers = useMemo(() => 
    volunteers.filter(v => v.liveLocation && (v.liveLocation.lat !== 0 || v.liveLocation.lng !== 0)),
    [volunteers]
  );

  const validNGOs = useMemo(() => 
    ngos.filter(n => n.liveLocation && (n.liveLocation.lat !== 0 || n.liveLocation.lng !== 0)),
    [ngos]
  );

  return (
    <div className="relative h-[550px] w-full overflow-hidden rounded-[3rem] border-[10px] border-white bg-gray-50 shadow-2xl">
      <MapContainer 
        center={center as [number, number]} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        preferCanvas={false}
      >
        <MapController 
          center={center as [number, number]} 
          zoom={zoom} 
          donations={validDonations} 
          volunteers={validVolunteers}
          ngos={validNGOs}
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {currentLocation && (currentLocation.lat !== 0 || currentLocation.lng !== 0) && (
          <Marker position={[currentLocation.lat, currentLocation.lng]} icon={NGO_ICON}>
            <Popup>
              <div className="min-w-[150px] p-2 text-center">
                <p className="font-bold text-gray-900 mb-2">Your Base Position</p>
                <button 
                  onClick={() => openInGoogleMaps(currentLocation.lat, currentLocation.lng)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-[10px] font-bold text-white shadow-xl transition-transform active:scale-95"
                >
                  <ExternalLink size={14} /> Open in Google Maps
                </button>
              </div>
            </Popup>
          </Marker>
        )}

        {validDonations.map((donation) => (
          (
            <Marker 
              key={donation.id} 
              position={[donation.location!.lat, donation.location!.lng]} 
              icon={DONOR_ICON}
            >
              <Popup>
                <div className="min-w-[200px] p-1 text-center">
                  <div className="mb-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-700 uppercase">
                    Donor: {donation.donorName}
                  </div>
                  <p className="text-base font-black text-gray-900">{donation.foodName}</p>
                  <p className="mt-1 text-[11px] text-gray-500 leading-tight">{donation.address}</p>
                  <div className="my-3 h-px bg-gray-100 w-full"></div>
                  <button 
                    onClick={() => openInGoogleMaps(donation.location!.lat, donation.location!.lng)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-[10px] font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95"
                  >
                    <Navigation size={14} /> Start Navigation
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        ))}

        {validVolunteers.map((volunteer) => (
          (
            <Marker 
              key={volunteer.uid} 
              position={[volunteer.liveLocation!.lat, volunteer.liveLocation!.lng]} 
              icon={VOLUNTEER_ICON}
            >
              <Popup>
                <div className="min-w-[180px] p-1 text-center">
                   <div className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-[10px] font-bold text-blue-700 uppercase">
                    Volunteer: {volunteer.displayName}
                  </div>
                  <p className="text-base font-black text-gray-900">{volunteer.displayName}</p>
                  <p className="text-[11px] text-blue-600 font-medium">On Active Mission (Live)</p>
                  <button 
                    onClick={() => openInGoogleMaps(volunteer.liveLocation!.lat, volunteer.liveLocation!.lng)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-[10px] font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                  >
                    <Navigation size={14} /> Coordinate Pickup
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        ))}

        {validNGOs.map((ngo) => (
          (
            <Marker 
              key={ngo.uid} 
              position={[ngo.liveLocation!.lat, ngo.liveLocation!.lng]} 
              icon={NGO_ICON}
            >
              <Popup>
                <div className="min-w-[180px] p-1 text-center">
                   <div className="mb-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-[10px] font-bold text-orange-700 uppercase">
                    NGO: {ngo.orgName || ngo.displayName}
                  </div>
                  <p className="text-base font-black text-gray-900">{ngo.orgName || ngo.displayName}</p>
                  <p className="text-[11px] text-orange-600 font-medium">Distribution Base</p>
                  <button 
                    onClick={() => openInGoogleMaps(ngo.liveLocation!.lat, ngo.liveLocation!.lng)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 text-[10px] font-bold text-white shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all active:scale-95"
                  >
                    <Navigation size={14} /> Navigate to Base
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
});
