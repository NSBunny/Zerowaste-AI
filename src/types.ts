/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'donor' | 'ngo' | 'volunteer' | 'user';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  orgName?: string;
  location?: string;
  liveLocation?: {
    lat: number;
    lng: number;
    updatedAt: number;
  };
  createdAt: number;
}

export type DonationStatus = 'available' | 'claimed' | 'picked_up' | 'delivered';

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  foodName: string;
  quantity: string;
  whenMade: string;
  contact: string;
  address: string;
  image?: string;
  freshness: number;
  expiryEstimation: string;
  status: DonationStatus;
  ngoId?: string;
  volunteerId?: string;
  location?: {
    lat: number;
    lng: number;
  };
  createdAt: number;
  updatedAt: number;
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: any;
}
