import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaItem, RoomType } from '@org/models';
import { RoomService } from '../services/room.service';
import { MediaUploadComponent } from '../media-gallery/media-upload.component';

@Component({
  standalone: true,
  selector: 'hm-room-type-detail',
  imports: [MediaUploadComponent],
  templateUrl: './room-type-detail.component.html',
  styleUrl: './room-type-detail.component.css',
})
export class RoomTypeDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly roomService = inject(RoomService);

  roomType = signal<RoomType | null>(null);
  mediaItems = signal<MediaItem[]>([]);
  activeMedia = signal<MediaItem | null>(null);
  error = signal('');

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.roomService.getRoomTypeById(id).subscribe({
      next: (roomType) => {
        this.roomType.set(roomType);
        this.loadMedia(roomType.id);
      },
      error: (error) => this.error.set(error.message || 'Failed to load room type'),
    });
  }

  upload(payload: { source: string; type: 'photo' | 'tour' | 'floorplan'; caption: string }): void {
    const roomType = this.roomType();
    if (!roomType) {
      return;
    }

    this.roomService
      .uploadMedia(roomType.id, payload.source, payload.type, payload.caption)
      .subscribe(() => this.loadMedia(roomType.id));
  }

  reorder(item: MediaItem, direction: 'up' | 'down'): void {
    const sortOrder = direction === 'up' ? item.sortOrder - 1 : item.sortOrder + 1;
    this.roomService.reorderMedia(item.id, Math.max(1, sortOrder)).subscribe(() => {
      const roomType = this.roomType();
      if (roomType) {
        this.loadMedia(roomType.id);
      }
    });
  }

  remove(itemId: string): void {
    this.roomService.deleteMedia(itemId).subscribe(() => {
      const roomType = this.roomType();
      if (roomType) {
        this.loadMedia(roomType.id);
      }
    });
  }

  private loadMedia(roomTypeId: string): void {
    this.roomService.getMediaByRoomType(roomTypeId).subscribe({
      next: (mediaItems) => this.mediaItems.set(mediaItems),
      error: (error) => this.error.set(error.message || 'Failed to load media'),
    });
  }
}
