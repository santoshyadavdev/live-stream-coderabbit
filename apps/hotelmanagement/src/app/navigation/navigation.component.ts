import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  standalone: true,
  selector: 'hm-navigation',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
})
export class NavigationComponent {
  links = [
    { path: '/', label: 'Dashboard' },
    { path: '/room-types', label: 'Room Types' },
    { path: '/rooms', label: 'Rooms' },
    { path: '/amenities', label: 'Amenities' },
    { path: '/ooo-schedules', label: 'OOO Schedules' },
    { path: '/allocations', label: 'Allocations' },
  ];
}
