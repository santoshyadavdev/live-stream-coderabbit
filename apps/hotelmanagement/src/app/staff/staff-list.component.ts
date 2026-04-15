import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee, EmployeeRole } from '@org/models';

@Component({
  selector: 'hm-staff-list',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white rounded-lg shadow">
      <div class="p-6 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <label for="roleFilter" class="text-sm font-medium text-gray-700">Filter by Role:</label>
          <select
            id="roleFilter"
            class="rounded-md border-gray-300 shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500"
            [ngModel]="roleFilter()"
            (ngModelChange)="roleFilter.set($event)"
          >
            <option value="">All Roles</option>
            @for (role of roles; track role) {
              <option [value]="role">{{ role }}</option>
            }
          </select>
        </div>
        <button
          type="button"
          class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          (click)="add.emit()"
        >
          Add Employee
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Phone</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            @for (emp of filteredStaff(); track emp.id) {
              <tr>
                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{{ emp.name }}</td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ emp.email }}</td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ emp.phone }}</td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ emp.role }}</td>
                <td class="whitespace-nowrap px-6 py-4 text-sm">
                  <span
                    class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                    [class.bg-green-100]="emp.status === 'active'"
                    [class.text-green-800]="emp.status === 'active'"
                    [class.bg-red-100]="emp.status === 'inactive'"
                    [class.text-red-800]="emp.status === 'inactive'"
                  >
                    {{ emp.status }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button
                    type="button"
                    class="text-indigo-600 hover:text-indigo-900 mr-3"
                    (click)="edit.emit(emp)"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    class="text-red-600 hover:text-red-900"
                    (click)="remove.emit(emp.id)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="px-6 py-8 text-center text-sm text-gray-500">No employees found.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class StaffListComponent {
  staff = input<Employee[]>([]);
  roleFilter = signal<string>('');

  roles = Object.values(EmployeeRole);

  filteredStaff = computed(() => {
    const role = this.roleFilter();
    const list = this.staff();
    if (!role) return list;
    return list.filter((e) => e.role === role);
  });

  edit = output<Employee>();
  remove = output<string>();
  add = output<void>();
}
