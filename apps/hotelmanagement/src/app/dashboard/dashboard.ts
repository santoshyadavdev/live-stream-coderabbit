import { Component, signal } from '@angular/core';
import { IHotel } from './Hotel';
import { Hotel } from "../property/hotel/hotel";

@Component({
  selector: 'hm-dashboard',
  imports: [Hotel],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  title = signal('Welcome to the Hotel Management Dashboard!');

  numberOfBookings = signal(10);

  dateOfLastBooking: Date | null = null;

  hotelList = signal<IHotel[]>([
    {
      id: 1,
      name: 'Hotel California',
      location: 'Los Angeles',
      numberOfRooms: 0,
    },
    {
      id: 2,
      name: 'The Grand Budapest Hotel',
      location: 'Zubrowka',
      numberOfRooms: 200,
    },
    {
      id: 3,
      name: 'The Overlook Hotel',
      location: 'Colorado',
      numberOfRooms: 10,
    },
  ]);

  propertyTypes = signal<'Hotel' | 'Motel' | 'Resort' | 'Hostel'>('Hotel');

  handleRemoveRooms(bookingId: number) {
    console.log(`Handling remove rooms for booking ID: ${bookingId}`);
  }
}
