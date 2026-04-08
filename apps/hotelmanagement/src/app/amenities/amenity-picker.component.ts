import { Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Amenity, AmenityCategory } from '@org/models';

@Component({
  standalone: true,
  selector: 'hm-amenity-picker',
  imports: [FormsModule],
  templateUrl: './amenity-picker.component.html',
  styleUrl: './amenity-picker.component.css',
})
export class AmenityPickerComponent {
  readonly categories: Array<'all' | AmenityCategory> = [
    'all',
    'view',
    'accessibility',
    'feature',
  ];

  amenities = input<Amenity[]>([]);
  selectedIds = input<string[]>([]);
  selectionChange = output<string[]>();

  category = signal<'all' | AmenityCategory>('all');
  query = signal('');
  localSelection = signal<string[]>([]);

  filteredAmenities = computed(() => {
    const category = this.category();
    const query = this.query().toLowerCase().trim();

    return this.amenities().filter((amenity) => {
      const categoryMatch = category === 'all' || amenity.category === category;
      const queryMatch = !query || amenity.name.toLowerCase().includes(query);
      return categoryMatch && queryMatch;
    });
  });

  constructor() {
    effect(() => {
      this.localSelection.set([...(this.selectedIds() ?? [])]);
    });
  }

  setCategory(category: 'all' | AmenityCategory): void {
    this.category.set(category);
  }

  onSearch(value: string): void {
    this.query.set(value);
  }

  toggleAmenity(amenityId: string, checked: boolean): void {
    const next = checked
      ? Array.from(new Set([...this.localSelection(), amenityId]))
      : this.localSelection().filter((id) => id !== amenityId);

    this.localSelection.set(next);
    this.selectionChange.emit(next);
  }

  isChecked(amenityId: string): boolean {
    return this.localSelection().includes(amenityId);
  }
}
