import { Component, signal } from '@angular/core';
import { single } from 'rxjs';

interface Hotel {
  id: number;
  name: string;
  location: string;
  numberOfRooms: number;
}

@Component({
  selector: 'hm-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  title = signal('Welcome to the Hotel Management Dashboard!');

  numberOfBookings = signal(10);

  dateOfLastBooking: Date | null = null;

  hotelList = signal<Hotel[]>([
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
}
