import { Component, inject, resource, signal } from '@angular/core';
import { Hotel } from '../property/hotel/hotel';
import { PropertyService } from './property';
import { HttpClient } from '@angular/common/http';
import { HotelAPIResponse } from '../hotel-card/hotel.interface';
import { HotelCard } from '../hotel-card/hotel-card';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Chat } from '../chat/chat';

@Component({
  selector: 'hm-dashboard',
  imports: [HotelCard, AsyncPipe, JsonPipe, Chat],
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


  // This is old observale-based approach, just for reference
  hotels$ = inject(HttpClient).get<HotelAPIResponse>('/api/hotels');

  hotelResource = resource({
    loader: () =>
      fetch('/api/hotels').then(
        (res) => res.json() as Promise<HotelAPIResponse>,
      ),
  });

  handleRemoveRooms(bookingId: number) {
    console.log(`Handling remove rooms for booking ID: ${bookingId}`);
  }
}
