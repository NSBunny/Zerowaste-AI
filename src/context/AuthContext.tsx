/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut, signInAnonymously } from 'firebase/auth';
import { onSnapshot, doc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { dbService } from '../services/dbService';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (rolePreference?: UserRole) => Promise<void>;
  logOut: () => Promise<void>;
  updateRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: () => void = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      
      if (u) {
        // Real-time profile listener
        unsubscribeProfile = onSnapshot(doc(db, 'users', u.uid), (docSnap) => {
          if (docSnap.exists()) {
            setProfile({ ...docSnap.data(), uid: docSnap.id } as UserProfile);
          } else {
            setProfile(null);
          }
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProfile();
    };
  }, []);

  const signIn = async (rolePreference: UserRole = 'donor') => {
    let u: User;
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      u = result.user;
    } catch (error) {
      console.warn("Google Sign-In failed, falling back to Anonymous Auth:", error);
      const result = await signInAnonymously(auth);
      u = result.user;
    }
    
    // Always force sync with the selected role
    await dbService.syncUserProfile({
      uid: u.uid,
      email: u.email || `anonymous-${u.uid.slice(0, 5)}@example.com`,
      displayName: u.displayName || `Test User (${rolePreference})`,
      role: rolePreference
    });
  };

  const logOut = async () => {
    await signOut(auth);
  };

  const updateRole = async (role: UserRole) => {
    if (!user) return;
    await dbService.syncUserProfile({ uid: user.uid, role });
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, logOut, updateRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
