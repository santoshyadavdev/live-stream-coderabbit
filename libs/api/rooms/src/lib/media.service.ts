import { MediaItem, MediaType } from '@org/models';

interface UploadPayload {
  source: string;
  type: MediaType;
  caption: string;
}

export class MediaService {
  private mediaItems: MediaItem[] = [
    {
      id: 'media-1',
      roomTypeId: 'rt-deluxe-king',
      url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
      type: 'photo',
      caption: 'Deluxe king bedroom view',
      sortOrder: 1,
    },
    {
      id: 'media-2',
      roomTypeId: 'rt-deluxe-king',
      url: 'https://images.unsplash.com/photo-1560185007-5f0bb1866cab',
      type: 'tour',
      caption: 'Virtual walk-through',
      sortOrder: 2,
    },
    {
      id: 'media-3',
      roomTypeId: 'rt-family-suite',
      url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
      type: 'floorplan',
      caption: 'Family suite floorplan',
      sortOrder: 1,
    },
  ];

  getByRoomType(roomTypeId: string): MediaItem[] {
    return this.mediaItems
      .filter((mediaItem) => mediaItem.roomTypeId === roomTypeId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  upload(roomTypeId: string, payload: UploadPayload): MediaItem {
    const mediaItem: MediaItem = {
      id: `media-${Date.now()}`,
      roomTypeId,
      url: payload.source,
      type: payload.type,
      caption: payload.caption,
      sortOrder: this.getNextSortOrder(roomTypeId),
    };

    this.mediaItems.push(mediaItem);
    return mediaItem;
  }

  reorder(id: string, sortOrder: number): MediaItem | null {
    const mediaItem = this.mediaItems.find((item) => item.id === id);
    if (!mediaItem) {
      return null;
    }

    mediaItem.sortOrder = sortOrder;
    return mediaItem;
  }

  delete(id: string): boolean {
    const initialLength = this.mediaItems.length;
    this.mediaItems = this.mediaItems.filter((item) => item.id !== id);
    return this.mediaItems.length < initialLength;
  }

  private getNextSortOrder(roomTypeId: string): number {
    const roomTypeMedia = this.mediaItems.filter((item) => item.roomTypeId === roomTypeId);
    if (!roomTypeMedia.length) {
      return 1;
    }

    return Math.max(...roomTypeMedia.map((item) => item.sortOrder)) + 1;
  }
}
