import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  standalone: true,
  selector: 'hm-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-layout">
      <aside class="navigation">
        <h1>Hotel Ops</h1>
        <nav>
          @for (link of links; track link.path) {
            <a
              [routerLink]="link.path"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: link.path === '/' || link.path === '/dashboard' }"
            >
              {{ link.label }}
            </a>
          }
        </nav>
      </aside>
      <main class="content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
      background: linear-gradient(180deg, #f3f8fc 0%, #eef5fb 100%);
      display: grid;
      gap: 16px;
      grid-template-columns: 260px minmax(0, 1fr);
      padding: 16px;
    }
    .content {
      background: #f9fcff;
      border: 1px solid #dbe7f3;
      border-radius: 16px;
      padding: 20px;
    }
    .navigation {
      background: #0e2f45;
      color: #fff;
      border-radius: 16px;
      padding: 16px;
      display: grid;
      gap: 14px;
      align-content: start;
    }
    .navigation h1 {
      margin: 0;
      font-size: 1.3rem;
    }
    nav {
      display: grid;
      gap: 6px;
    }
    nav a {
      color: #d2e6f6;
      text-decoration: none;
      padding: 10px;
      border-radius: 10px;
    }
    nav a.active,
    nav a:hover {
      background: #1e5f8a;
      color: #fff;
    }
    @media (max-width: 980px) {
      .app-layout {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class AdminLayoutComponent {
  links = [
    { path: '/dashboard', label: 'Overview' },
    { path: '/room-types', label: 'Room Types' },
    { path: '/rooms', label: 'Rooms' },
    { path: '/amenities', label: 'Amenities' },
    { path: '/ooo-schedules', label: 'OOO Schedules' },
    { path: '/allocations', label: 'Allocations' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/staff', label: 'Staff Management' },
    { path: '/staff/schedule', label: 'Shift Schedule' },
    { path: '/reports', label: 'Financial Reports' },
  ];
}
