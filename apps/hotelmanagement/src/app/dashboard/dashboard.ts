import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'hm-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  summaryCards = signal([
    {
      title: 'Room Types',
      metric: '3 Active',
      description: 'Define occupancy, pricing, and media assets.',
      route: '/room-types',
    },
    {
      title: 'Room Inventory',
      metric: '5 Rooms',
      description: 'Monitor room status, floor distribution, and OOO actions.',
      route: '/rooms',
    },
    {
      title: 'OOO Schedules',
      metric: '1 Scheduled',
      description: 'Track cleaning, renovations, and maintenance windows.',
      route: '/ooo-schedules',
    },
    {
      title: 'Allocations',
      metric: 'Live',
      description: 'Auto/manual assignment workflows with VIP lock controls.',
      route: '/allocations',
    },
  ]);
}
