import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OOOReason, Room } from '@org/models';
import { RoomService } from '../services/room.service';

@Component({
  standalone: true,
  selector: 'hm-ooo-schedule-form',
  imports: [FormsModule],
  templateUrl: './ooo-schedule-form.component.html',
  styleUrl: './ooo-schedule-form.component.css',
})
export class OOOScheduleFormComponent {
  private readonly roomService = inject(RoomService);

  rooms = input<Room[]>([]);
  roomId = input<string | null>(null);
  saved = output<void>();

  form = signal<{ roomId: string; startDate: string; endDate: string; reason: OOOReason; notes: string }>({
    roomId: '',
    startDate: '',
    endDate: '',
    reason: 'maintenance',
    notes: '',
  });

  conflict = signal('');

  update<K extends keyof ReturnType<typeof this.form>>(key: K, value: ReturnType<typeof this.form>[K]): void {
    this.form.update((current) => ({ ...current, [key]: value }));
  }

  submit(): void {
    const value = this.form();
    const roomId = this.roomId() || value.roomId;
    if (!roomId) {
      this.conflict.set('Select a room first.');
      return;
    }

    this.roomService
      .scheduleOOO(roomId, {
        startDate: value.startDate,
        endDate: value.endDate,
        reason: value.reason,
        notes: value.notes,
      })
      .subscribe({
        next: () => {
          this.conflict.set('');
          this.saved.emit();
        },
        error: (error) => this.conflict.set(error.message || 'Schedule conflict detected'),
      });
  }
}
