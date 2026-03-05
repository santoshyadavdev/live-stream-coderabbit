import { Component, inject, signal } from '@angular/core';
import { Hotel } from "../property/hotel/hotel";
import { PropertyService } from './property';

@Component({
  selector: 'hm-dashboard',
  imports: [Hotel],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  providers: [PropertyService],
})
export class Dashboard {
  title = signal('Welcome to the Hotel Management Dashboard!');

  numberOfBookings = signal(10);

  dateOfLastBooking: Date | null = null;

  hotelList = inject(PropertyService).getHotels();

  propertyTypes = signal<'Hotel' | 'Motel' | 'Resort' | 'Hostel'>('Hotel');

  handleRemoveRooms(bookingId: number) {
    console.log(`Handling remove rooms for booking ID: ${bookingId}`);
  }
}
