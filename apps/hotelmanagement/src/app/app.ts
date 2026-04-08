import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';

@Component({
  standalone: true,
  imports: [RouterOutlet, NavigationComponent],
  selector: 'hm-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
