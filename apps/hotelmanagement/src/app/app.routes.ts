import { Route } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { RoomTypeListComponent } from './room-types/room-type-list.component';
import { RoomTypeDetailComponent } from './room-types/room-type-detail.component';
import { RoomListComponent } from './rooms/room-list.component';
import { RoomDetailComponent } from './rooms/room-detail.component';
import { OOOScheduleListComponent } from './ooo-schedule/ooo-schedule-list.component';
import { AllocationDashboardComponent } from './allocation/allocation-dashboard.component';
import { AmenityListComponent } from './amenities/amenity-list.component';

export const appRoutes: Route[] = [
	{ path: '', component: Dashboard },
	{ path: 'room-types', component: RoomTypeListComponent },
	{ path: 'room-types/:id', component: RoomTypeDetailComponent },
	{ path: 'rooms', component: RoomListComponent },
	{ path: 'rooms/:id', component: RoomDetailComponent },
	{ path: 'amenities', component: AmenityListComponent },
	{ path: 'ooo-schedules', component: OOOScheduleListComponent },
	{ path: 'allocations', component: AllocationDashboardComponent },
	{ path: '**', redirectTo: '' },
];
