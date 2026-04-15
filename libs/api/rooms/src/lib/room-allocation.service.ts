import { RoomAllocation } from '@org/models';
import { OOOScheduleService } from './ooo-schedule.service';
import { RoomsService } from './rooms.service';

export interface Reservation {
  id: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  roomTypeId: string;
  isVIP: boolean;
}

interface AllocationRecord {
  allocation: RoomAllocation;
  reservation: Reservation;
}

export class RoomAllocationService {
  private allocationRecords: AllocationRecord[] = [];
  private reservations = new Map<string, Reservation>();

  constructor(
    private readonly roomsService: RoomsService,
    private readonly oooScheduleService: OOOScheduleService
  ) {}

  autoAllocate(reservation: Reservation): RoomAllocation {
    this.reservations.set(reservation.id, reservation);

    const candidateRooms = this.roomsService
      .getAllRooms({ roomTypeId: reservation.roomTypeId, status: 'available' })
      .filter((room) => this.isRoomReservable(room.id, reservation));

    if (!candidateRooms.length) {
      throw new Error('No available rooms for auto-allocation');
    }

    const selectedRoom = [...candidateRooms].sort((a, b) => {
      const aGap = this.getGapScore(a.id, reservation.checkIn);
      const bGap = this.getGapScore(b.id, reservation.checkIn);
      return aGap - bGap;
    })[0];

    return this.createAllocation(selectedRoom.id, reservation);
  }

  manualAllocate(reservationId: string, roomId: string): RoomAllocation {
    const reservation = this.reservations.get(reservationId);

    if (!reservation) {
      throw new Error('Reservation context not found for manual allocation');
    }

    const room = this.roomsService.getRoomById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.roomTypeId !== reservation.roomTypeId) {
      throw new Error('Room type does not match reservation type');
    }

    if (!this.isRoomReservable(roomId, reservation)) {
      throw new Error('Room is not available for the selected reservation dates');
    }

    return this.createAllocation(roomId, reservation);
  }

  lockRoom(allocationId: string): RoomAllocation | null {
    return this.updateLockState(allocationId, true);
  }

  unlockRoom(allocationId: string): RoomAllocation | null {
    return this.updateLockState(allocationId, false);
  }

  deallocate(allocationId: string): boolean {
    const initialLength = this.allocationRecords.length;
    this.allocationRecords = this.allocationRecords.filter(
      (record) => record.allocation.id !== allocationId
    );

    return this.allocationRecords.length < initialLength;
  }

  getAllocations(): RoomAllocation[] {
    return this.allocationRecords.map((record) => record.allocation);
  }

  upsertReservation(reservation: Reservation): void {
    this.reservations.set(reservation.id, reservation);
  }

  private createAllocation(roomId: string, reservation: Reservation): RoomAllocation {
    const allocation: RoomAllocation = {
      id: `alloc-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      roomId,
      reservationId: reservation.id,
      isLocked: reservation.isVIP,
      allocatedAt: new Date().toISOString(),
    };

    this.allocationRecords.push({ allocation, reservation });
    return allocation;
  }

  private updateLockState(allocationId: string, isLocked: boolean): RoomAllocation | null {
    const record = this.allocationRecords.find((item) => item.allocation.id === allocationId);
    if (!record) {
      return null;
    }

    record.allocation = {
      ...record.allocation,
      isLocked,
    };

    return record.allocation;
  }

  private isRoomReservable(roomId: string, reservation: Reservation): boolean {
    const room = this.roomsService.getRoomById(roomId);
    if (!room || room.status !== 'available') {
      return false;
    }

    const oooAvailable = this.oooScheduleService.isRoomAvailable(roomId, {
      startDate: reservation.checkIn,
      endDate: reservation.checkOut,
    });

    if (!oooAvailable) {
      return false;
    }

    return !this.allocationRecords.some((record) => {
      if (record.allocation.roomId !== roomId) {
        return false;
      }

      const existingStart = new Date(record.reservation.checkIn).getTime();
      const existingEnd = new Date(record.reservation.checkOut).getTime();
      const nextStart = new Date(reservation.checkIn).getTime();
      const nextEnd = new Date(reservation.checkOut).getTime();

      return nextStart <= existingEnd && existingStart <= nextEnd;
    });
  }

  private getGapScore(roomId: string, nextCheckIn: string): number {
    const checkInMs = new Date(nextCheckIn).getTime();

    const previousAllocations = this.allocationRecords
      .filter((record) => record.allocation.roomId === roomId)
      .map((record) => new Date(record.reservation.checkOut).getTime())
      .filter((checkOut) => checkOut <= checkInMs)
      .sort((a, b) => b - a);

    if (!previousAllocations.length) {
      return Number.MAX_SAFE_INTEGER;
    }

    return checkInMs - previousAllocations[0];
  }
}
