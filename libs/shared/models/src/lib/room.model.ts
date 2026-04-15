export type RoomStatus = 'available' | 'occupied' | 'maintenance';
export type AmenityCategory = 'view' | 'accessibility' | 'feature';
export type OOOReason = 'cleaning' | 'renovation' | 'maintenance';
export type MediaType = 'photo' | 'tour' | 'floorplan';

export interface RoomType {
  id: string;
  name: string;
  description: string;
  maxAdults: number;
  maxChildren: number;
  squareFootage: number;
  bedConfiguration: string[];
  basePrice: number;
  amenityIds: string[];
}

export interface Room {
  id: string;
  roomNumber: string;
  roomTypeId: string;
  floor: number;
  wing: string;
  status: RoomStatus;
  amenityIds: string[];
}

export interface Amenity {
  id: string;
  name: string;
  category: AmenityCategory;
  icon: string;
}

export interface OutOfOrderSchedule {
  id: string;
  roomId: string;
  startDate: string;
  endDate: string;
  reason: OOOReason;
  notes: string;
}

export interface RoomAllocation {
  id: string;
  roomId: string;
  reservationId: string;
  isLocked: boolean;
  allocatedAt: string;
}

export interface MediaItem {
  id: string;
  roomTypeId: string;
  url: string;
  type: MediaType;
  caption: string;
  sortOrder: number;
}

export interface RoomFilter {
  roomTypeId?: string;
  floor?: number;
  wing?: string;
  status?: RoomStatus;
  amenityIds?: string[];
}

export interface RoomTypeFilter {
  name?: string;
  minAdults?: number;
  minChildren?: number;
  minPrice?: number;
  maxPrice?: number;
  amenityIds?: string[];
}
