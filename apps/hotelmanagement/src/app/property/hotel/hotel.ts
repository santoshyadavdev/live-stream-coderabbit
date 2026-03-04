import { Component, input, output } from '@angular/core';
import { IHotel } from '../../dashboard/Hotel';

@Component({
  selector: 'hm-hotel',
  imports: [],
  templateUrl: './hotel.html',
  styleUrl: './hotel.css',
})
export class Hotel {
  hotels = input.required<IHotel[]>();
  removeRooms = output<number>();

  deleteRoom(bookingId: number) {
    console.log(`Deleting booking with ID: ${bookingId}`);
    // Implement the logic to delete the booking here
    this.removeRooms.emit(bookingId);
  }
}
