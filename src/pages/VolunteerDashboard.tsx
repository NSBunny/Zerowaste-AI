/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { Donation, UserProfile } from '../types';
import { Truck, Navigation, CheckCircle, Package, MapPin } from 'lucide-react';
import { FoodCard } from '../components/FoodCard';
import { RescueMap } from '../components/RescueMap';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function VolunteerDashboard() {
  const { user } = useAuth();
  const [activeTasks, setActiveTasks] = useState<Donation[]>([]);
  const [availableToPick, setAvailableToPick] = useState<Donation[]>([]);
  const [ngos, setNgos] = useState<UserProfile[]>([]);
  const [liveLocation, setLiveLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Real-time location tracking with throttling
      let lastUpdate = 0;
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const now = Date.now();
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLiveLocation(coords);
          
          // Only sync to DB every 5 seconds to reduce lag and database writes
          if (now - lastUpdate > 5000) {
            dbService.updateLiveLocation(user.uid, coords.lat, coords.lng);
            lastUpdate = now;
          }
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      // Tasks assigned to me
      const unsubMy = dbService.subscribeToUserDonations(user.uid, 'volunteer', setActiveTasks);
      
      // NGOs location
      const unsubNgos = dbService.subscribeToNGOs(setNgos);

      // Claimed donations waiting for volunteer
      const q = query(collection(db, 'donations'), where('status', '==', 'claimed'));
      const unsubAvail = onSnapshot(q, (snap) => {
        setAvailableToPick(snap.docs.map(d => ({ id: d.id, ...d.data() } as Donation)));
      });

      return () => {
        navigator.geolocation.clearWatch(watchId);
        unsubMy();
        unsubAvail();
        unsubNgos();
      };
    }
  }, [user]);

  const handlePickUp = async (id: string) => {
    if (!user) return;
    setLoading(true);
    try {
      await dbService.updateDonationStatus(id, 'picked_up', { volunteerId: user.uid });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeliver = async (id: string) => {
    setLoading(true);
    try {
      await dbService.updateDonationStatus(id, 'delivered');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-12 lg:flex-row">
        {/* Missions Content */}
        <div className="flex-1 space-y-12">
          {/* Rescue Map */}
          <section className="space-y-4">
             <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Mission Navigation</h2>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                 Live Tracking Active
              </div>
            </div>
            <RescueMap 
              donations={[...activeTasks, ...availableToPick]} 
              ngos={ngos}
              currentLocation={liveLocation || undefined}
              center={liveLocation ? [liveLocation.lat, liveLocation.lng] : undefined}
            />
          </section>

          {/* Active Missions */}
          <section>
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Navigation className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Current Mission</h2>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {activeTasks.filter(d => d.status === 'picked_up').map(donation => (
                <FoodCard 
                  key={donation.id} 
                  donation={donation} 
                  action={
                    <button 
                      onClick={() => handleDeliver(donation.id)}
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-emerald-700 active:scale-95"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Mark as Delivered
                    </button>
                  }
                />
              ))}
              {activeTasks.filter(d => d.status === 'picked_up').length === 0 && (
                <div className="col-span-full rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50 py-12 text-center text-gray-400">
                   No active deliveries. Ready for a new mission?
                </div>
              )}
            </div>
          </section>

          {/* Pending Pickups */}
          <section>
             <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Nearby Pickups Needed</h2>
             </div>
             <div className="grid gap-6 sm:grid-cols-2">
                {availableToPick.map(donation => (
                   <FoodCard 
                    key={donation.id} 
                    donation={donation} 
                    action={
                      <button 
                        onClick={() => handlePickUp(donation.id)}
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95"
                      >
                        <Package className="h-4 w-4" />
                        Start Rescue Mission
                      </button>
                    }
                  />
                ))}
                {availableToPick.length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-400">
                    All clear! No pending pickups in your area.
                  </div>
                )}
             </div>
          </section>
        </div>

        {/* Volunteer Stats */}
        <div className="lg:w-80">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-[2rem] bg-emerald-100 p-8">
              <Truck className="mb-4 h-10 w-10 text-emerald-600" />
              <h3 className="text-xl font-bold text-emerald-900">Hero Stats</h3>
              <p className="mt-4 text-sm text-emerald-800 leading-relaxed">
                Your efforts help lower carbon emissions and feed hungry families.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                 <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-[10px] font-bold uppercase text-gray-400">Missions</p>
                    <p className="font-mono text-xl font-bold text-gray-900">42</p>
                 </div>
                 <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-[10px] font-bold uppercase text-gray-400">CO2 Saved</p>
                    <p className="font-mono text-xl font-bold text-gray-900">5.2kg</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
