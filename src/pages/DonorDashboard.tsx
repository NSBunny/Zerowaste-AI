/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { analyzeFoodImage } from '../services/aiService';
import { Donation } from '../types';
import { Camera, Upload, Loader2, Sparkles, AlertCircle, Plus } from 'lucide-react';
import { FoodCard } from '../components/FoodCard';
import { motion, AnimatePresence } from 'motion/react';

export function DonorDashboard() {
  const { user } = useAuth();
  const [history, setHistory] = useState<Donation[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [image, setImage] = useState<string | null>(null);
  
  // Extra fields
  const [quantity, setQuantity] = useState('');
  const [whenMade, setWhenMade] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      return dbService.subscribeToUserDonations(user.uid, 'donor', setHistory);
    }
  }, [user]);

  useEffect(() => {
    if (analysis) {
      setQuantity(analysis.quantityEst || '');
    }
  }, [analysis]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setImage(base64);
      setIsUploading(true);
      try {
        const results = await analyzeFoodImage(base64);
        setAnalysis(results);
      } catch (err) {
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDonate = async () => {
    if (!user || !analysis || !image) return;
    
    if (!quantity || !whenMade || !contact || !address) {
      alert("Please fill in all extra details.");
      return;
    }

    setIsUploading(true);
    try {
      // Get current position for donation
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      await dbService.createDonation({
        donorId: user.uid,
        donorName: user.displayName || 'Donor',
        foodName: analysis.foodName,
        quantity,
        whenMade,
        contact,
        address,
        image,
        freshness: analysis.freshnessScore,
        expiryEstimation: analysis.expiryEstimation,
        status: 'available',
        location: {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }
      });
      setAnalysis(null);
      setImage(null);
      setQuantity('');
      setWhenMade('');
      setContact('');
      setAddress('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-12 lg:flex-row">
        {/* Donation Form */}
        <div className="lg:w-1/3">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">List Surplus Food</h2>
              <p className="mt-2 text-sm text-gray-500">Capture an image, and our AI will assessment the freshness and quantity.</p>

              <div className="mt-8">
                {!image ? (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-64 w-full flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-500 transition-all hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-600"
                  >
                    <div className="rounded-full bg-white p-4 shadow-sm">
                      <Camera className="h-8 w-8" />
                    </div>
                    <span className="font-medium">Upload Food Image</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleImageChange} 
                    />
                  </button>
                ) : (
                  <div className="space-y-6">
                    <div className="relative aspect-auto h-64 overflow-hidden rounded-3xl">
                      <img src={image} className="h-full w-full object-cover" alt="Food" />
                      <button 
                        onClick={() => { setImage(null); setAnalysis(null); }}
                        className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white backdrop-blur-md transition-all hover:bg-black/70"
                      >
                        <Plus className="h-5 w-5 rotate-45" />
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {isUploading && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-700"
                        >
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span className="text-sm font-medium">Processing...</span>
                        </motion.div>
                      )}

                      {analysis && !isUploading && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          className="space-y-4 rounded-2xl border border-emerald-100 bg-emerald-50/30 p-6"
                        >
                          <div className="flex items-center gap-2 text-emerald-700">
                             <Sparkles className="h-5 w-5" />
                             <span className="font-bold text-sm uppercase tracking-wider">AI Assessment</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className="text-[10px] font-bold uppercase text-gray-400">Food Detected</label>
                               <p className="text-sm font-semibold text-gray-900">{analysis.foodName}</p>
                            </div>
                            <div>
                               <label className="text-[10px] font-bold uppercase text-gray-400">Rel. Freshness</label>
                               <p className="text-sm font-semibold text-emerald-600">{analysis.freshnessScore}%</p>
                            </div>
                          </div>

                          <div className="space-y-4 pt-4 border-t border-emerald-100">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-600">Quantity (e.g. 5kg, 10 packets)</label>
                              <input 
                                value={quantity} 
                                onChange={(e) => setQuantity(e.target.value)}
                                className="w-full rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                                placeholder="Edit identified quantity"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-600">When was it made?</label>
                              <input 
                                value={whenMade} 
                                onChange={(e) => setWhenMade(e.target.value)}
                                className="w-full rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                                placeholder="e.g. Today at 2 PM"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-600">Contact Number</label>
                              <input 
                                value={contact} 
                                onChange={(e) => setContact(e.target.value)}
                                className="w-full rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                                placeholder="Phone number"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-600">Pickup Address</label>
                              <textarea 
                                value={address} 
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                                placeholder="Full address"
                                rows={2}
                              />
                            </div>
                          </div>

                          {!analysis.isSafe && (
                            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-red-600">
                               <AlertCircle className="h-4 w-4" />
                               <span className="text-xs font-medium">AI alert: Food may not be safe for redistribution.</span>
                            </div>
                          )}

                          <button 
                            onClick={handleDonate}
                            disabled={!analysis.isSafe}
                            className="mt-2 w-full rounded-full bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
                          >
                            List for Rescue
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* List of Donations */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Your Donations</h2>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            {history.length > 0 ? (
              history.map((donation) => (
                <FoodCard key={donation.id} donation={donation} />
              ))
            ) : (
              <div className="col-span-full rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50 py-24 text-center">
                <p className="text-gray-400">No donations listed yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
