import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HotelData } from './hotel.interface';



@Component({
  selector: 'hm-hotel-card',
  imports: [CurrencyPipe],
  templateUrl: './hotel-card.html',
  styleUrl: './hotel-card.css',
})
export class HotelCard {
  hotel = input.required<HotelData>();
}
