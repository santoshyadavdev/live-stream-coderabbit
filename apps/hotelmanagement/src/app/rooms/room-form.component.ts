import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Amenity, Room, RoomType, RoomStatus } from '@org/models';
import { RoomService } from '../services/room.service';
import { AmenityPickerComponent } from '../amenities/amenity-picker.component';

@Component({
  standalone: true,
  selector: 'hm-room-form',
  imports: [FormsModule, AmenityPickerComponent],
  templateUrl: './room-form.component.html',
  styleUrl: './room-form.component.css',
})
export class RoomFormComponent {
  private readonly roomService = inject(RoomService);

  room = input<Room | null>(null);
  roomTypes = input<RoomType[]>([]);
  save = output<Omit<Room, 'id'>>();

  amenities = signal<Amenity[]>([]);
  form = signal<Omit<Room, 'id'>>({
    roomNumber: '',
    roomTypeId: '',
    floor: 1,
    wing: 'East',
    status: 'available',
    amenityIds: [],
  });

  statuses: RoomStatus[] = ['available', 'occupied', 'maintenance'];

  constructor() {
    this.roomService.getAmenities().subscribe((amenities) => this.amenities.set(amenities));

    effect(() => {
      const value = this.room();
      if (!value) {
        return;
      }
      this.form.set({ ...value, amenityIds: [...value.amenityIds] });
    });
  }

  update<K extends keyof Omit<Room, 'id'>>(key: K, value: Omit<Room, 'id'>[K]): void {
    this.form.update((current) => ({ ...current, [key]: value }));
  }

  submit(): void {
    this.save.emit(this.form());
  }
}
