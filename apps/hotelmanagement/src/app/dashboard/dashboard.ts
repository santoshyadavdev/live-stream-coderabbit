import { Component, inject, signal } from '@angular/core';
import { Hotel } from '../property/hotel/hotel';
import { PropertyService } from './property';
import { HttpClient } from '@angular/common/http';
import { HotelAPIResponse } from '../hotel-card/hotel.interface';
import { HotelCard } from '../hotel-card/hotel-card';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'hm-dashboard',
  imports: [HotelCard, AsyncPipe],
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

  hotels$ = inject(HttpClient).get<HotelAPIResponse>('/api/hotels');

  handleRemoveRooms(bookingId: number) {
    console.log(`Handling remove rooms for booking ID: ${bookingId}`);
  }
}
