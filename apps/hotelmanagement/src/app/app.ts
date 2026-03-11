import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { PropertyService } from './dashboard/property';
import { HttpClient } from '@angular/common/http';

@Component({
  imports: [RouterModule, Dashboard],
  selector: 'hm-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'hotelmanagement';

  hotelList = inject(PropertyService).getHotels();

  hotels = inject(HttpClient)
    .get('/api/hotels')
    .subscribe((data) => {
      console.log(data);
    });
}
