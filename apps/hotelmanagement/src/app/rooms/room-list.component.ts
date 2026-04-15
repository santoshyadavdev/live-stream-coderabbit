import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Amenity, Room, RoomFilter, RoomType, RoomStatus } from '@org/models';
import { RoomService } from '../services/room.service';
import { RoomCardComponent } from './room-card.component';
import { RoomFormComponent } from './room-form.component';

@Component({
  standalone: true,
  selector: 'hm-room-list',
  imports: [FormsModule, RouterLink, RoomCardComponent, RoomFormComponent],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css',
})
export class RoomListComponent {
  private readonly roomService = inject(RoomService);
  private readonly router = inject(Router);

  rooms = signal<Room[]>([]);
  roomTypes = signal<RoomType[]>([]);
  amenities = signal<Amenity[]>([]);
  selectedRoom = signal<Room | null>(null);
  error = signal('');

  filter = signal<{ roomTypeId: string; floor: string; wing: string; status: '' | RoomStatus; amenities: string }>({
    roomTypeId: '',
    floor: '',
    wing: '',
    status: '',
    amenities: '',
  });

  filteredRooms = computed(() => this.rooms());

  constructor() {
    this.roomService.getRoomTypes().subscribe((items) => this.roomTypes.set(items));
    this.roomService.getAmenities().subscribe((items) => this.amenities.set(items));
    this.loadRooms();
  }

  updateFilter<K extends keyof ReturnType<typeof this.filter>>(key: K, value: ReturnType<typeof this.filter>[K]): void {
    this.filter.update((current) => ({ ...current, [key]: value }));
  }

  applyFilters(): void {
    const value = this.filter();
    const payload: RoomFilter = {
      roomTypeId: value.roomTypeId || undefined,
      floor: value.floor ? Number(value.floor) : undefined,
      wing: value.wing || undefined,
      status: (value.status || undefined) as RoomStatus | undefined,
      amenityIds: value.amenities
        ? value.amenities
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : undefined,
    };

    this.loadRooms(payload);
  }

  loadRooms(filter?: RoomFilter): void {
    this.roomService.getRooms(filter).subscribe({
      next: (rooms) => this.rooms.set(rooms),
      error: (error) => this.error.set(error.message || 'Failed to load rooms'),
    });
  }

  saveRoom(payload: Omit<Room, 'id'>): void {
    const selected = this.selectedRoom();
    const request$ = selected
      ? this.roomService.updateRoom(selected.id, payload)
      : this.roomService.createRoom(payload);

    request$.subscribe(() => {
      this.selectedRoom.set(null);
      this.loadRooms();
    });
  }

  removeRoom(id: string): void {
    this.roomService.deleteRoom(id).subscribe(() => this.loadRooms());
  }

  markOOO(roomId: string): void {
    this.router.navigate(['/ooo-schedules'], { queryParams: { roomId } });
  }

  resolveType(roomTypeId: string): RoomType | null {
    return this.roomTypes().find((roomType) => roomType.id === roomTypeId) || null;
  }

  resolveAmenities(ids: string[]): Amenity[] {
    return this.amenities().filter((amenity) => ids.includes(amenity.id));
  }
}
