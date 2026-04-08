import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Room, RoomAllocation, RoomType } from '@org/models';
import { Reservation, RoomService } from '../services/room.service';

@Component({
  standalone: true,
  selector: 'hm-allocation-dashboard',
  imports: [FormsModule],
  templateUrl: './allocation-dashboard.component.html',
  styleUrl: './allocation-dashboard.component.css',
})
export class AllocationDashboardComponent {
  private readonly roomService = inject(RoomService);

  rooms = signal<Room[]>([]);
  roomTypes = signal<RoomType[]>([]);
  allocations = signal<RoomAllocation[]>([]);
  selectedReservation = signal<Reservation | null>(null);
  selectedRoomId = signal('');
  error = signal('');

  unassignedReservations = signal<Reservation[]>([
    {
      id: 'res-1001',
      guestName: 'Alice Morgan',
      checkIn: '2026-04-12',
      checkOut: '2026-04-15',
      roomTypeId: 'rt-deluxe-king',
      isVIP: true,
    },
    {
      id: 'res-1002',
      guestName: 'Ken Adams',
      checkIn: '2026-04-13',
      checkOut: '2026-04-14',
      roomTypeId: 'rt-accessible-queen',
      isVIP: false,
    },
  ]);

  constructor() {
    this.roomService.getRooms().subscribe((rooms) => this.rooms.set(rooms));
    this.roomService.getRoomTypes().subscribe((roomTypes) => this.roomTypes.set(roomTypes));
  }

  autoAllocate(reservation: Reservation): void {
    this.roomService.autoAllocate(reservation).subscribe({
      next: (allocation) => {
        this.allocations.update((items) => [...items, allocation]);
        this.unassignedReservations.update((items) => items.filter((item) => item.id !== reservation.id));
      },
      error: (error) => this.error.set(error.message || 'Unable to auto-allocate'),
    });
  }

  manualAllocate(): void {
    const reservation = this.selectedReservation();
    if (!reservation || !this.selectedRoomId()) {
      return;
    }

    this.roomService.manualAllocate(reservation.id, this.selectedRoomId(), reservation).subscribe({
      next: (allocation) => {
        this.allocations.update((items) => [...items, allocation]);
        this.unassignedReservations.update((items) => items.filter((item) => item.id !== reservation.id));
        this.selectedReservation.set(null);
        this.selectedRoomId.set('');
      },
      error: (error) => this.error.set(error.message || 'Unable to manually allocate'),
    });
  }

  toggleLock(allocation: RoomAllocation): void {
    this.roomService.lockAllocation(allocation.id, !allocation.isLocked).subscribe({
      next: (updated) => {
        this.allocations.update((items) =>
          items.map((item) => (item.id === updated.id ? updated : item))
        );
      },
      error: (error) => this.error.set(error.message || 'Unable to update lock state'),
    });
  }

  deallocate(id: string): void {
    this.roomService.deallocate(id).subscribe(() => {
      this.allocations.update((items) => items.filter((item) => item.id !== id));
    });
  }
}
