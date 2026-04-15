import { Component, input, output } from '@angular/core';
import { Amenity, Room, RoomType } from '@org/models';

@Component({
  standalone: true,
  selector: 'hm-room-card',
  templateUrl: './room-card.component.html',
  styleUrl: './room-card.component.css',
})
export class RoomCardComponent {
  room = input.required<Room>();
  roomType = input<RoomType | null>(null);
  amenities = input<Amenity[]>([]);
  allocationLabel = input('Unassigned');

  edit = output<string>();
  markOOO = output<string>();
}
