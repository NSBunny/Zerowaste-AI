/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { Donation, UserProfile } from '../types';
import { ShieldCheck, MapPin, Search, Filter, Users } from 'lucide-react';
import { FoodCard } from '../components/FoodCard';
import { RescueMap } from '../components/RescueMap';
import { motion } from 'motion/react';

export function NGODashboard() {
  const { user } = useAuth();
  const [available, setAvailable] = useState<Donation[]>([]);
  const [myClaims, setMyClaims] = useState<Donation[]>([]);
  const [volunteers, setVolunteers] = useState<UserProfile[]>([]);
  const [liveLocation, setLiveLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
       // Real-time location tracking for NGOs
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLiveLocation(coords);
          dbService.updateLiveLocation(user.uid, coords.lat, coords.lng);
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true }
      );

      const unsubAvailable = dbService.subscribeToAvailableDonations(setAvailable);
      const unsubMy = dbService.subscribeToUserDonations(user.uid, 'ngo', setMyClaims);
      const unsubVolunteers = dbService.subscribeToVolunteers(setVolunteers);
      return () => {
        navigator.geolocation.clearWatch(watchId);
        unsubAvailable();
        unsubMy();
        unsubVolunteers();
      };
    }
  }, [user]);

  const handleClaim = async (id: string) => {
    if (!user) return;
    setLoading(true);
    try {
      await dbService.updateDonationStatus(id, 'claimed', { ngoId: user.uid });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-12 lg:flex-row">
        {/* Main Content */}
        <div className="flex-1 space-y-12">
          {/* Map View */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                <h2 className="text-xl font-bold text-gray-900">Live Mission Map</h2>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                 <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Donors</div>
                 <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" /> Volunteers</div>
              </div>
            </div>
            <RescueMap 
              donations={[...available, ...myClaims]} 
              volunteers={volunteers}
              currentLocation={liveLocation || undefined}
            />
          </section>

          {/* Available for Claim */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <Search className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Available Near You</h2>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {available.length > 0 ? (
                available.map((donation) => (
                  <FoodCard 
                    key={donation.id} 
                    donation={donation} 
                    action={
                      <button 
                        onClick={() => handleClaim(donation.id)}
                        disabled={loading}
                        className="w-full rounded-2xl bg-orange-600 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-orange-700 active:scale-95"
                      >
                        Claim for Redistribution
                      </button>
                    }
                  />
                ))
              ) : (
                <div className="col-span-full rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50 py-24 text-center">
                  <p className="text-gray-400">Searching for surplus food in your area...</p>
                </div>
              )}
            </div>
          </section>

          {/* Claimed/Requests */}
          <section>
             <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Active Requests</h2>
             </div>
             <div className="grid gap-6 sm:grid-cols-2">
                {myClaims.filter(d => ['claimed', 'picked_up'].includes(d.status)).map(donation => (
                  <FoodCard key={donation.id} donation={donation} />
                ))}
             </div>
          </section>
        </div>

        {/* Sidebar / Stats */}
        <div className="lg:w-80">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-[2rem] bg-emerald-900 p-8 text-white">
              <ShieldCheck className="mb-4 h-10 w-10" />
              <h3 className="text-xl font-bold">NGO Verification</h3>
              <p className="mt-4 text-sm text-emerald-100 leading-relaxed">
                Your organization is verified to handle and redistribute food safely.
              </p>
              <div className="mt-8 flex flex-col gap-4">
                 <div className="flex items-center justify-between border-t border-emerald-800 pt-4">
                    <span className="text-xs text-emerald-400 uppercase tracking-widest">Rescued Today</span>
                    <span className="font-mono text-xl font-bold">12kg</span>
                 </div>
                 <div className="flex items-center justify-between border-t border-emerald-800 pt-4">
                    <span className="text-xs text-emerald-400 uppercase tracking-widest">Active Points</span>
                    <span className="font-mono text-xl font-bold">4</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
