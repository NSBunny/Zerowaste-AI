/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Apple, ShieldCheck, Truck, LogIn, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../types';
import { cn } from '../lib/utils';

export function Login() {
  const { signIn, updateRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('donor');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn(selectedRole);
      navigate(`/${selectedRole}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const roles: { id: UserRole; icon: any; label: string; desc: string; color: string }[] = [
    { id: 'donor', icon: Apple, label: 'Donor', desc: 'Restaurants & Events', color: 'emerald' },
    { id: 'ngo', icon: ShieldCheck, label: 'NGO', desc: 'Food Redistribution', color: 'orange' },
    { id: 'volunteer', icon: Truck, label: 'Volunteer', desc: 'Delivery Hero', color: 'blue' }
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-emerald-900/10"
      >
        <div className="grid lg:grid-cols-2">
          {/* Left Side */}
          <div className="p-8 lg:p-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Select your role to start making an impact today.</p>

            <div className="mt-10 space-y-4">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={cn(
                    "relative flex w-full items-center gap-4 rounded-3xl p-5 text-left transition-all border-2",
                    selectedRole === role.id 
                      ? "border-emerald-600 bg-emerald-50/50 shadow-inner" 
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl",
                    selectedRole === role.id ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-500"
                  )}>
                    <role.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className={cn("font-bold", selectedRole === role.id ? "text-emerald-900" : "text-gray-900")}>
                      {role.label}
                    </p>
                    <p className="text-xs text-gray-500">{role.desc}</p>
                  </div>
                  {selectedRole === role.id && (
                    <motion.div layoutId="check" className="text-emerald-600">
                      <CheckCircle2 className="h-6 w-6" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={handleSignIn}
              disabled={loading}
              className="mt-10 flex w-full items-center justify-center gap-3 rounded-full bg-emerald-600 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Sign in with Google
                </>
              )}
            </button>
          </div>

          {/* Right Side - Visual */}
          <div className="hidden bg-emerald-50 lg:flex lg:items-center lg:justify-center lg:p-12">
            <div className="space-y-8 text-center text-emerald-900">
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-xl">
                 <AnimatePresence mode="wait">
                   {roles.map(role => role.id === selectedRole && (
                     <motion.div
                       key={role.id}
                       initial={{ opacity: 0, rotate: -20, scale: 0.5 }}
                       animate={{ opacity: 1, rotate: 0, scale: 1 }}
                       exit={{ opacity: 0, rotate: 20, scale: 0.5 }}
                       transition={{ type: "spring", damping: 12 }}
                     >
                       <role.icon className="h-16 w-16" />
                     </motion.div>
                   ))}
                 </AnimatePresence>
              </div>
              <div className="space-y-2">
                 <h3 className="text-xl font-bold">Safe & Real-time</h3>
                 <p className="text-sm leading-relaxed">
                   Join a network of thousands helping redistribute surplus food across cities.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
