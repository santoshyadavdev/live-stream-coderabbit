import { Component, computed, inject, signal } from '@angular/core';
import { RoomService } from '../services/room.service';
import { Amenity } from '@org/models';

@Component({
  standalone: true,
  selector: 'hm-amenity-list',
  templateUrl: './amenity-list.component.html',
  styleUrl: './amenity-list.component.css',
})
export class AmenityListComponent {
  private readonly roomService = inject(RoomService);
  readonly groups = ['view', 'accessibility', 'feature'] as const;

  amenities = signal<Amenity[]>([]);
  error = signal('');

  groupedAmenities = computed(() => {
    const list = this.amenities();
    return {
      view: list.filter((item) => item.category === 'view'),
      accessibility: list.filter((item) => item.category === 'accessibility'),
      feature: list.filter((item) => item.category === 'feature'),
    };
  });

  constructor() {
    this.roomService.getAmenities().subscribe({
      next: (amenities) => this.amenities.set(amenities),
      error: (error) => this.error.set(error.message || 'Failed to load amenities'),
    });
  }

  getAmenitiesForGroup(group: (typeof this.groups)[number]): Amenity[] {
    return this.groupedAmenities()[group];
  }
}
