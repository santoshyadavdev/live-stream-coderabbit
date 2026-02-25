import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';

@Component({
  imports: [ RouterModule, Dashboard],
  selector: 'hm-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'hotelmanagement';
}
