/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Donation } from '../types';
import { Calendar, MapPin, Scale, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export interface FoodCardProps {
  donation: Donation;
  action?: React.ReactNode;
  key?: React.Key;
}

export const FoodCard: React.FC<FoodCardProps> = ({ donation, action }) => {
  const statusColors = {
    available: "bg-emerald-100 text-emerald-700",
    claimed: "bg-orange-100 text-orange-700",
    picked_up: "bg-blue-100 text-blue-700",
    delivered: "bg-gray-100 text-gray-700"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {donation.image ? (
          <img src={donation.image} alt={donation.foodName} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">No Image</div>
        )}
        <div className={cn(
          "absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm",
          statusColors[donation.status]
        )}>
          {donation.status}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900">{donation.foodName}</h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-1">{donation.donorName}</p>
        
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Scale className="h-4 w-4" />
            <span className="text-sm font-medium">{donation.quantity}</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium italic">Fresh: {donation.freshness}%</span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 border-t border-gray-50 pt-4">
          <div className="flex items-start gap-2 text-gray-500">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span className="text-xs">{donation.address}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="h-4 w-4" />
            <span className="text-xs">Made: {donation.whenMade}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="h-4 w-4" />
            <span className="text-xs">Expires approx: {donation.expiryEstimation}</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs font-bold">Contact: {donation.contact}</span>
          </div>
        </div>

        {action && (
          <div className="mt-6">
            {action}
          </div>
        )}
      </div>
    </motion.div>
  );
}
