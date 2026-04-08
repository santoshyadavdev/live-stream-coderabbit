import {
  Amenity,
  AmenityCategory,
  Room,
  RoomFilter,
  RoomStatus,
  RoomType,
  RoomTypeFilter,
} from '@org/models';

export class RoomsService {
  private roomTypes: RoomType[] = [
    {
      id: 'rt-deluxe-king',
      name: 'Deluxe King',
      description: 'Spacious room with king bed and city view.',
      maxAdults: 2,
      maxChildren: 1,
      squareFootage: 420,
      bedConfiguration: ['1 King Bed'],
      basePrice: 210,
      amenityIds: ['am-city-view', 'am-smart-tv', 'am-minibar', 'am-work-desk'],
    },
    {
      id: 'rt-family-suite',
      name: 'Family Suite',
      description: 'Two-room suite designed for family stays.',
      maxAdults: 4,
      maxChildren: 2,
      squareFootage: 720,
      bedConfiguration: ['1 King Bed', '2 Twin Beds', '1 Sofa Bed'],
      basePrice: 340,
      amenityIds: ['am-sofa-bed', 'am-smart-tv', 'am-bathtub', 'am-mini-kitchen'],
    },
    {
      id: 'rt-accessible-queen',
      name: 'Accessible Queen',
      description: 'Barrier-free room with accessible bathroom.',
      maxAdults: 2,
      maxChildren: 1,
      squareFootage: 460,
      bedConfiguration: ['1 Queen Bed'],
      basePrice: 190,
      amenityIds: ['am-wheelchair-access', 'am-roll-in-shower', 'am-smart-tv'],
    },
  ];

  private rooms: Room[] = [
    {
      id: 'room-101',
      roomNumber: '101',
      roomTypeId: 'rt-deluxe-king',
      floor: 1,
      wing: 'East',
      status: 'available',
      amenityIds: ['am-city-view'],
    },
    {
      id: 'room-102',
      roomNumber: '102',
      roomTypeId: 'rt-deluxe-king',
      floor: 1,
      wing: 'East',
      status: 'occupied',
      amenityIds: ['am-city-view'],
    },
    {
      id: 'room-203',
      roomNumber: '203',
      roomTypeId: 'rt-family-suite',
      floor: 2,
      wing: 'West',
      status: 'available',
      amenityIds: ['am-balcony', 'am-sofa-bed'],
    },
    {
      id: 'room-205',
      roomNumber: '205',
      roomTypeId: 'rt-family-suite',
      floor: 2,
      wing: 'West',
      status: 'maintenance',
      amenityIds: ['am-sofa-bed'],
    },
    {
      id: 'room-307',
      roomNumber: '307',
      roomTypeId: 'rt-accessible-queen',
      floor: 3,
      wing: 'North',
      status: 'available',
      amenityIds: ['am-wheelchair-access', 'am-roll-in-shower'],
    },
  ];

  private amenities: Amenity[] = [
    { id: 'am-city-view', name: 'City View', category: 'view', icon: 'city' },
    { id: 'am-balcony', name: 'Private Balcony', category: 'view', icon: 'balcony' },
    {
      id: 'am-wheelchair-access',
      name: 'Wheelchair Accessible',
      category: 'accessibility',
      icon: 'wheelchair',
    },
    {
      id: 'am-roll-in-shower',
      name: 'Roll-in Shower',
      category: 'accessibility',
      icon: 'shower',
    },
    { id: 'am-smart-tv', name: 'Smart TV', category: 'feature', icon: 'tv' },
    { id: 'am-minibar', name: 'Minibar', category: 'feature', icon: 'glass' },
    { id: 'am-work-desk', name: 'Work Desk', category: 'feature', icon: 'desk' },
    { id: 'am-sofa-bed', name: 'Sofa Bed', category: 'feature', icon: 'sofa' },
    {
      id: 'am-mini-kitchen',
      name: 'Mini Kitchen',
      category: 'feature',
      icon: 'kitchen',
    },
    { id: 'am-bathtub', name: 'Bathtub', category: 'feature', icon: 'bath' },
  ];

  getAllRoomTypes(filter?: RoomTypeFilter): RoomType[] {
    let result = [...this.roomTypes];

    if (!filter) {
      return result;
    }

    if (filter.name) {
      const nameFilter = filter.name.toLowerCase();
      result = result.filter((roomType) => roomType.name.toLowerCase().includes(nameFilter));
    }

    if (filter.minAdults !== undefined) {
      result = result.filter((roomType) => roomType.maxAdults >= filter.minAdults!);
    }

    if (filter.minChildren !== undefined) {
      result = result.filter((roomType) => roomType.maxChildren >= filter.minChildren!);
    }

    if (filter.minPrice !== undefined) {
      result = result.filter((roomType) => roomType.basePrice >= filter.minPrice!);
    }

    if (filter.maxPrice !== undefined) {
      result = result.filter((roomType) => roomType.basePrice <= filter.maxPrice!);
    }

    if (filter.amenityIds?.length) {
      result = result.filter((roomType) =>
        filter.amenityIds!.every((amenityId) => roomType.amenityIds.includes(amenityId))
      );
    }

    return result;
  }

  getRoomTypeById(id: string): RoomType | null {
    return this.roomTypes.find((roomType) => roomType.id === id) ?? null;
  }

  createRoomType(input: Omit<RoomType, 'id'>): RoomType {
    const roomType: RoomType = {
      id: `rt-${Date.now()}`,
      ...input,
    };

    this.roomTypes.push(roomType);
    return roomType;
  }

  updateRoomType(id: string, updates: Partial<Omit<RoomType, 'id'>>): RoomType | null {
    const existing = this.getRoomTypeById(id);
    if (!existing) {
      return null;
    }

    const updated: RoomType = { ...existing, ...updates, id };
    this.roomTypes = this.roomTypes.map((roomType) => (roomType.id === id ? updated : roomType));
    return updated;
  }

  deleteRoomType(id: string): boolean {
    const initialLength = this.roomTypes.length;
    this.roomTypes = this.roomTypes.filter((roomType) => roomType.id !== id);
    return this.roomTypes.length < initialLength;
  }

  getAllRooms(filter?: RoomFilter): Room[] {
    let result = [...this.rooms];

    if (!filter) {
      return result;
    }

    result = this.applyTypeFilter(result, filter.roomTypeId);
    result = this.applyFloorFilter(result, filter.floor);
    result = this.applyWingFilter(result, filter.wing);
    result = this.applyStatusFilter(result, filter.status);
    result = this.applyAmenityFilter(result, filter.amenityIds);

    return result;
  }

  getRoomById(id: string): Room | null {
    return this.rooms.find((room) => room.id === id) ?? null;
  }

  getByRoomNumber(roomNumber: string): Room | null {
    return this.rooms.find((room) => room.roomNumber === roomNumber) ?? null;
  }

  createRoom(input: Omit<Room, 'id'>): Room {
    const room: Room = {
      id: `room-${Date.now()}`,
      ...input,
    };

    this.rooms.push(room);
    return room;
  }

  updateRoom(id: string, updates: Partial<Omit<Room, 'id'>>): Room | null {
    const existing = this.getRoomById(id);
    if (!existing) {
      return null;
    }

    const updated: Room = { ...existing, ...updates, id };
    this.rooms = this.rooms.map((room) => (room.id === id ? updated : room));
    return updated;
  }

  deleteRoom(id: string): boolean {
    const initialLength = this.rooms.length;
    this.rooms = this.rooms.filter((room) => room.id !== id);
    return this.rooms.length < initialLength;
  }

  getAllAmenities(): Amenity[] {
    return [...this.amenities];
  }

  getAmenitiesByCategory(category: AmenityCategory): Amenity[] {
    return this.amenities.filter((amenity) => amenity.category === category);
  }

  attachToRoom(roomId: string, amenityIds: string[]): Room | null {
    const room = this.getRoomById(roomId);
    if (!room) {
      return null;
    }

    const mergedAmenityIds = Array.from(new Set([...room.amenityIds, ...amenityIds]));
    return this.updateRoom(roomId, { amenityIds: mergedAmenityIds });
  }

  attachToRoomType(roomTypeId: string, amenityIds: string[]): RoomType | null {
    const roomType = this.getRoomTypeById(roomTypeId);
    if (!roomType) {
      return null;
    }

    const mergedAmenityIds = Array.from(new Set([...roomType.amenityIds, ...amenityIds]));
    return this.updateRoomType(roomTypeId, { amenityIds: mergedAmenityIds });
  }

  private applyTypeFilter(rooms: Room[], roomTypeId?: string): Room[] {
    if (!roomTypeId) {
      return rooms;
    }
    return rooms.filter((room) => room.roomTypeId === roomTypeId);
  }

  private applyFloorFilter(rooms: Room[], floor?: number): Room[] {
    if (floor === undefined) {
      return rooms;
    }
    return rooms.filter((room) => room.floor === floor);
  }

  private applyWingFilter(rooms: Room[], wing?: string): Room[] {
    if (!wing) {
      return rooms;
    }
    return rooms.filter((room) => room.wing.toLowerCase() === wing.toLowerCase());
  }

  private applyStatusFilter(rooms: Room[], status?: RoomStatus): Room[] {
    if (!status) {
      return rooms;
    }
    return rooms.filter((room) => room.status === status);
  }

  private applyAmenityFilter(rooms: Room[], amenityIds?: string[]): Room[] {
    if (!amenityIds?.length) {
      return rooms;
    }

    return rooms.filter((room) => amenityIds.every((amenityId) => room.amenityIds.includes(amenityId)));
  }
}
