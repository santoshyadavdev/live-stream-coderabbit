import { Component, inject, input, signal, OnInit } from '@angular/core';
import { MediaItem } from '@org/models';
import { RoomService } from '../services/room.service';
import { MediaUploadComponent } from './media-upload.component';

@Component({
  standalone: true,
  selector: 'hm-media-gallery',
  imports: [MediaUploadComponent],
  templateUrl: './media-gallery.component.html',
  styleUrl: './media-gallery.component.css',
})
export class MediaGalleryComponent implements OnInit {
  private readonly roomService = inject(RoomService);

  roomTypeId = input.required<string>();
  mediaItems = signal<MediaItem[]>([]);
  activeMedia = signal<MediaItem | null>(null);
  error = signal('');

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.roomService.getMediaByRoomType(this.roomTypeId()).subscribe({
      next: (mediaItems) => this.mediaItems.set(mediaItems),
      error: (error) => this.error.set(error.message || 'Failed to load media'),
    });
  }

  upload(payload: { source: string; type: 'photo' | 'tour' | 'floorplan'; caption: string }): void {
    this.roomService
      .uploadMedia(this.roomTypeId(), payload.source, payload.type, payload.caption)
      .subscribe(() => this.load());
  }

  reorder(item: MediaItem, direction: 'up' | 'down'): void {
    const nextSortOrder = direction === 'up' ? item.sortOrder - 1 : item.sortOrder + 1;
    this.roomService.reorderMedia(item.id, Math.max(1, nextSortOrder)).subscribe(() => this.load());
  }

  remove(itemId: string): void {
    if (!confirm('Delete this media item?')) {
      return;
    }

    this.roomService.deleteMedia(itemId).subscribe(() => this.load());
  }
}
