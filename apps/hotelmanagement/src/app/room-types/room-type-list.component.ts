import { Component, inject, signal } from '@angular/core';
import { RoomType } from '@org/models';
import { RoomService } from '../services/room.service';
import { RoomTypeFormComponent } from './room-type-form.component';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'hm-room-type-list',
  imports: [RoomTypeFormComponent, RouterLink],
  templateUrl: './room-type-list.component.html',
  styleUrl: './room-type-list.component.css',
})
export class RoomTypeListComponent {
  private readonly roomService = inject(RoomService);

  roomTypes = signal<RoomType[]>([]);
  selected = signal<RoomType | null>(null);
  error = signal('');

  constructor() {
    this.load();
  }

  load(): void {
    this.roomService.getRoomTypes().subscribe({
      next: (roomTypes) => this.roomTypes.set(roomTypes),
      error: (error) => this.error.set(error.message || 'Failed to load room types'),
    });
  }

  create(roomType: Omit<RoomType, 'id'>): void {
    this.roomService.createRoomType(roomType).subscribe(() => this.load());
  }

  update(roomType: Omit<RoomType, 'id'>): void {
    const selected = this.selected();
    if (!selected) {
      return;
    }

    this.roomService.updateRoomType(selected.id, roomType).subscribe(() => {
      this.selected.set(null);
      this.load();
    });
  }

  remove(id: string): void {
    this.roomService.deleteRoomType(id).subscribe(() => this.load());
  }
}
