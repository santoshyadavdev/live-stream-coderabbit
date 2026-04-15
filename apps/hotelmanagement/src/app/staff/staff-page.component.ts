import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { DashboardService } from '@org/hotelmanagement-data';
import { StaffListComponent } from './staff-list.component';
import { StaffFormComponent } from './staff-form.component';
import { Employee } from '@org/models';

@Component({
  standalone: true,
  selector: 'hm-staff-page',
  imports: [StaffListComponent, StaffFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-800">Staff Management</h2>

      <hm-staff-list
        [staff]="staff()"
        (add)="openAdd()"
        (edit)="openEdit($event)"
        (remove)="onDelete($event)"
      />

      <hm-staff-form
        [visible]="formVisible()"
        [employee]="editingEmployee()"
        (save)="onSave($event)"
        (cancel)="closeForm()"
      />
    </div>
  `,
})
export class StaffPageComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  staff = signal<Employee[]>([]);
  formVisible = signal(false);
  editingEmployee = signal<Employee | null>(null);

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    this.dashboardService.getStaff().subscribe((res) => {
      if (res.success) this.staff.set(res.data);
    });
  }

  openAdd(): void {
    this.editingEmployee.set(null);
    this.formVisible.set(true);
  }

  openEdit(employee: Employee): void {
    this.editingEmployee.set(employee);
    this.formVisible.set(true);
  }

  closeForm(): void {
    this.formVisible.set(false);
    this.editingEmployee.set(null);
  }

  onSave(data: Partial<Employee>): void {
    const editing = this.editingEmployee();
    const obs$ = editing
      ? this.dashboardService.updateStaff(editing.id, data)
      : this.dashboardService.createStaff(data);

    obs$.subscribe((res) => {
      if (res.success) {
        this.closeForm();
        this.loadStaff();
      }
    });
  }

  onDelete(id: string): void {
    this.dashboardService.deleteStaff(id).subscribe((res) => {
      if (res.success) this.loadStaff();
    });
  }
}
