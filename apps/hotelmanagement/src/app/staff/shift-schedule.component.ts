import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Employee, Shift } from '@org/models';

@Component({
  selector: 'hm-shift-schedule',
  standalone: true,
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white rounded-lg shadow">
      <div class="p-6 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Shift Schedule</h3>
        <button
          type="button"
          class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          (click)="addShift.emit()"
        >
          Add Shift
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Employee</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Start Time</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">End Time</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Notes</th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            @for (shift of sortedShifts(); track shift.id) {
              <tr>
                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{{ employeeName(shift.employeeId) }}</td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ shift.date | date:'mediumDate' }}</td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ shift.startTime }}</td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ shift.endTime }}</td>
                <td class="max-w-xs truncate px-6 py-4 text-sm text-gray-500">{{ shift.notes }}</td>
                <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button
                    type="button"
                    class="text-indigo-600 hover:text-indigo-900 mr-3"
                    (click)="editShift.emit(shift)"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    class="text-red-600 hover:text-red-900"
                    (click)="removeShift.emit(shift.id)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="px-6 py-8 text-center text-sm text-gray-500">No shifts scheduled.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ShiftScheduleComponent {
  shifts = input<Shift[]>([]);
  employees = input<Employee[]>([]);

  editShift = output<Shift>();
  removeShift = output<string>();
  addShift = output<void>();

  private employeeMap = computed(() => {
    const map = new Map<string, string>();
    for (const emp of this.employees()) {
      map.set(emp.id, emp.name);
    }
    return map;
  });

  sortedShifts = computed(() =>
    [...this.shifts()].sort((a, b) => a.date.localeCompare(b.date))
  );

  employeeName(id: string): string {
    return this.employeeMap().get(id) ?? 'Unknown';
  }
}
