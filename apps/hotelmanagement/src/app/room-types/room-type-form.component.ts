import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Amenity, RoomType } from '@org/models';
import { RoomService } from '../services/room.service';
import { AmenityPickerComponent } from '../amenities/amenity-picker.component';

@Component({
  standalone: true,
  selector: 'hm-room-type-form',
  imports: [FormsModule, AmenityPickerComponent],
  templateUrl: './room-type-form.component.html',
  styleUrl: './room-type-form.component.css',
})
export class RoomTypeFormComponent {
  private readonly roomService = inject(RoomService);

  roomType = input<RoomType | null>(null);
  save = output<Omit<RoomType, 'id'>>();

  amenities = signal<Amenity[]>([]);
  form = signal<Omit<RoomType, 'id'>>({
    name: '',
    description: '',
    maxAdults: 2,
    maxChildren: 0,
    squareFootage: 350,
    bedConfiguration: ['1 Queen Bed'],
    basePrice: 150,
    amenityIds: [],
  });

  constructor() {
    this.roomService.getAmenities().subscribe((amenities) => this.amenities.set(amenities));

    effect(() => {
      const value = this.roomType();
      if (!value) {
        return;
      }

      this.form.set({
        name: value.name,
        description: value.description,
        maxAdults: value.maxAdults,
        maxChildren: value.maxChildren,
        squareFootage: value.squareFootage,
        bedConfiguration: [...value.bedConfiguration],
        basePrice: value.basePrice,
        amenityIds: [...value.amenityIds],
      });
    });
  }

  update<K extends keyof Omit<RoomType, 'id'>>(key: K, value: Omit<RoomType, 'id'>[K]): void {
    this.form.update((current) => ({ ...current, [key]: value }));
  }

  addBedConfiguration(): void {
    this.form.update((current) => ({
      ...current,
      bedConfiguration: [...current.bedConfiguration, ''],
    }));
  }

  removeBedConfiguration(index: number): void {
    this.form.update((current) => ({
      ...current,
      bedConfiguration: current.bedConfiguration.filter((_, idx) => idx !== index),
    }));
  }

  updateBedConfiguration(index: number, value: string): void {
    this.form.update((current) => ({
      ...current,
      bedConfiguration: current.bedConfiguration.map((item, idx) => (idx === index ? value : item)),
    }));
  }

  onAmenitiesChanged(amenityIds: string[]): void {
    this.update('amenityIds', amenityIds);
  }

  submit(): void {
    this.save.emit(this.form());
  }
}
