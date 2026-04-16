import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { DashboardService } from '@org/hotelmanagement-data';
import { ShiftScheduleComponent } from './shift-schedule.component';
import { ShiftFormComponent } from './shift-form.component';
import { Employee, Shift } from '@org/models';

@Component({
  standalone: true,
  selector: 'hm-schedule-page',
  imports: [ShiftScheduleComponent, ShiftFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-800">Shift Schedule</h2>

      <hm-shift-schedule
        [shifts]="shifts()"
        [employees]="employees()"
        (addShift)="openAdd()"
        (editShift)="openEdit($event)"
        (removeShift)="onDeleteShift($event)"
      />

      <hm-shift-form
        [visible]="formVisible()"
        [shift]="editingShift()"
        [employees]="employees()"
        (save)="onSave($event)"
        (cancelForm)="closeForm()"
      />
    </div>
  `,
})
export class SchedulePageComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  shifts = signal<Shift[]>([]);
  employees = signal<Employee[]>([]);
  formVisible = signal(false);
  editingShift = signal<Shift | null>(null);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.dashboardService.getShifts().subscribe((res) => {
      if (res.success) this.shifts.set(res.data);
    });
    this.dashboardService.getStaff().subscribe((res) => {
      if (res.success) this.employees.set(res.data);
    });
  }

  openAdd(): void {
    this.editingShift.set(null);
    this.formVisible.set(true);
  }

  openEdit(shift: Shift): void {
    this.editingShift.set(shift);
    this.formVisible.set(true);
  }

  closeForm(): void {
    this.formVisible.set(false);
    this.editingShift.set(null);
  }

  onSave(data: Partial<Shift>): void {
    const editing = this.editingShift();
    const obs$ = editing
      ? this.dashboardService.updateShift(editing.id, data)
      : this.dashboardService.createShift(data);

    obs$.subscribe((res) => {
      if (res.success) {
        this.closeForm();
        this.loadData();
      }
    });
  }

  onDeleteShift(id: string): void {
    this.dashboardService.deleteShift(id).subscribe(() => {
      this.loadData();
    });
  }
}
