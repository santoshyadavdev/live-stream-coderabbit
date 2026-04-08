import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Amenity, Room, RoomType } from '@org/models';
import { RoomService } from '../services/room.service';

@Component({
  standalone: true,
  selector: 'hm-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrl: './room-detail.component.css',
})
export class RoomDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly roomService = inject(RoomService);

  room = signal<Room | null>(null);
  roomType = signal<RoomType | null>(null);
  amenities = signal<Amenity[]>([]);
  error = signal('');

  amenityNames = computed(() => this.amenities().map((amenity) => amenity.name));

  constructor() {
    const roomId = this.route.snapshot.paramMap.get('id');
    if (!roomId) {
      return;
    }

    this.roomService.getAmenities().subscribe((amenities) => this.amenities.set(amenities));

    this.roomService.getRoomById(roomId).subscribe({
      next: (room) => {
        this.room.set(room);
        this.roomService.getRoomTypeById(room.roomTypeId).subscribe((roomType) => this.roomType.set(roomType));
      },
      error: (error) => this.error.set(error.message || 'Failed to load room details'),
    });
  }

  resolveSelectedAmenities(): string[] {
    const room = this.room();
    if (!room) {
      return [];
    }

    return this.amenities()
      .filter((amenity) => room.amenityIds.includes(amenity.id))
      .map((amenity) => amenity.name);
  }
}
