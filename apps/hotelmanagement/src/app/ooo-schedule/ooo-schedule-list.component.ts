import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OutOfOrderSchedule, Room } from '@org/models';
import { RoomService } from '../services/room.service';
import { OOOScheduleFormComponent } from './ooo-schedule-form.component';

@Component({
  standalone: true,
  selector: 'hm-ooo-schedule-list',
  imports: [FormsModule, OOOScheduleFormComponent],
  templateUrl: './ooo-schedule-list.component.html',
  styleUrl: './ooo-schedule-list.component.css',
})
export class OOOScheduleListComponent {
  private readonly roomService = inject(RoomService);
  private readonly route = inject(ActivatedRoute);

  roomId = signal<string | null>(null);
  rooms = signal<Room[]>([]);
  schedules = signal<OutOfOrderSchedule[]>([]);
  error = signal('');

  filters = signal({ startDate: '', endDate: '', reason: '' });

  constructor() {
    this.roomId.set(this.route.snapshot.queryParamMap.get('roomId'));

    this.roomService.getRooms().subscribe((rooms) => this.rooms.set(rooms));
    this.loadSchedules();
  }

  loadSchedules(): void {
    const value = this.filters();
    if (value.startDate && value.endDate) {
      this.roomService.getOOOSchedulesByDateRange(value.startDate, value.endDate).subscribe({
        next: (schedules) => this.schedules.set(this.applyReasonFilter(schedules)),
        error: (error) => this.error.set(error.message || 'Failed to load OOO schedules'),
      });
      return;
    }

    const roomId = this.roomId();
    if (!roomId) {
      this.schedules.set([]);
      return;
    }

    this.roomService.getOOOSchedulesByRoom(roomId).subscribe({
      next: (schedules) => this.schedules.set(this.applyReasonFilter(schedules)),
      error: (error) => this.error.set(error.message || 'Failed to load OOO schedules'),
    });
  }

  updateFilter(key: 'startDate' | 'endDate' | 'reason', value: string): void {
    this.filters.update((current) => ({ ...current, [key]: value }));
  }

  applyReasonFilter(list: OutOfOrderSchedule[]): OutOfOrderSchedule[] {
    const reason = this.filters().reason;
    if (!reason) {
      return list;
    }

    return list.filter((schedule) => schedule.reason === reason);
  }

  cancel(id: string): void {
    this.roomService.cancelOOO(id).subscribe(() => this.loadSchedules());
  }
}
