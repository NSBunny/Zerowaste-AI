/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Recycle, LogOut, User, LayoutDashboard } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function Navbar() {
  const { user, profile, logOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Donate', path: '/donor', role: 'donor' },
    { name: 'Redistribute', path: '/ngo', role: 'ngo' },
    { name: 'Rescue', path: '/volunteer', role: 'volunteer' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Recycle className="h-8 w-8 text-emerald-600" />
          <span className="text-xl font-bold tracking-tight text-gray-900">ZeroWaste AI</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.filter(item => !item.role || (profile && profile.role === item.role)).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-emerald-600",
                location.pathname === item.path ? "text-emerald-600" : "text-gray-600"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end mr-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                  {profile?.role}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {user.displayName?.split(' ')[0]}
                </span>
              </div>
              <button
                onClick={() => logOut()}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 active:scale-95"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-emerald-700 hover:shadow-lg active:scale-95"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
