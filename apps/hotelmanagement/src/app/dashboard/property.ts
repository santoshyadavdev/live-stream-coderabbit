import { Injectable, signal } from '@angular/core';
import { IHotel } from './Hotel';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  hotels = signal<IHotel[]>([]);

  constructor() {
    console.log('PropertyService initialized');
  }

  getHotels() {
    // This method would typically make an HTTP request to fetch hotel data
    this.hotels.set([
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
    return this.hotels;
  }
}
