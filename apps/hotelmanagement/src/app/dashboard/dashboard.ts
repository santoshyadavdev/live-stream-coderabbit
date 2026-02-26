import { Component } from '@angular/core';

interface Hotel {
  name: string;
  location: string;
}

@Component({
  selector: 'hm-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  title = 'Welcome to the Hotel Management Dashboard!';

  numberOfBookings = 0;

  dateOfLastBooking: Date | null = null;

  hotelList : Hotel[] = [
  ];


}
