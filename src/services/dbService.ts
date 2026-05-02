/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Donation, DonationStatus, UserProfile, UserRole } from '../types';

export const dbService = {
  // User Profile
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { ...docSnap.data(), uid: docSnap.id } as UserProfile;
  },

  async syncUserProfile(profile: Partial<UserProfile>): Promise<void> {
    if (!profile.uid) return;
    const docRef = doc(db, 'users', profile.uid);
    const existing = await this.getUserProfile(profile.uid);
    
    const dataToSet = {
      ...profile,
      updatedAt: serverTimestamp(),
      createdAt: existing?.createdAt || serverTimestamp()
    };
    
    await setDoc(docRef, dataToSet, { merge: true });
  },

  async updateLiveLocation(uid: string, lat: number, lng: number): Promise<void> {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      liveLocation: {
        lat,
        lng,
        updatedAt: serverTimestamp()
      }
    });
  },

  subscribeToVolunteers(callback: (volunteers: UserProfile[]) => void) {
    const q = query(collection(db, 'users'), where('role', '==', 'volunteer'));
    return onSnapshot(q, (snapshot) => {
      const volunteers = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as UserProfile));
      callback(volunteers);
    });
  },

  subscribeToNGOs(callback: (ngos: UserProfile[]) => void) {
    const q = query(collection(db, 'users'), where('role', '==', 'ngo'));
    return onSnapshot(q, (snapshot) => {
      const ngos = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as UserProfile));
      callback(ngos);
    });
  },

  // Donations
  async createDonation(donation: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const collRef = collection(db, 'donations');
    const docRef = await addDoc(collRef, {
      ...donation,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  async updateDonationStatus(id: string, status: DonationStatus, extra: Partial<Donation> = {}): Promise<void> {
    const docRef = doc(db, 'donations', id);
    await updateDoc(docRef, {
      ...extra,
      status,
      updatedAt: serverTimestamp()
    });
  },

  subscribeToAvailableDonations(callback: (donations: Donation[]) => void) {
    const q = query(
      collection(db, 'donations'), 
      where('status', '==', 'available'),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Donation));
      callback(docs);
    });
  },

  subscribeToUserDonations(userId: string, role: UserRole, callback: (donations: Donation[]) => void) {
    let q;
    if (role === 'donor') {
      q = query(collection(db, 'donations'), where('donorId', '==', userId), orderBy('createdAt', 'desc'));
    } else if (role === 'ngo') {
      q = query(collection(db, 'donations'), where('ngoId', '==', userId), orderBy('createdAt', 'desc'));
    } else {
      q = query(collection(db, 'donations'), where('volunteerId', '==', userId), orderBy('createdAt', 'desc'));
    }

    return onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Donation));
      callback(docs);
    });
  }
};
