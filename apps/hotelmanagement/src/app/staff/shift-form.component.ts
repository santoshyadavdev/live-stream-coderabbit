import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  effect,
} from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Employee, Shift } from '@org/models';

@Component({
  selector: 'hm-shift-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
          <h2 class="mb-4 text-lg font-semibold text-gray-900">
            {{ shift() ? 'Edit Shift' : 'Add Shift' }}
          </h2>

          <form [formGroup]="form" (ngSubmit)="onSave()" class="space-y-4">
            <div>
              <label for="employeeId" class="block text-sm font-medium text-gray-700">Employee</label>
              <select
                id="employeeId"
                formControlName="employeeId"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select Employee</option>
                @for (emp of employees(); track emp.id) {
                  <option [value]="emp.id">{{ emp.name }}</option>
                }
              </select>
            </div>

            <div>
              <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
              <input
                id="date"
                formControlName="date"
                type="date"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="startTime" class="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  id="startTime"
                  formControlName="startTime"
                  type="time"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label for="endTime" class="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  id="endTime"
                  formControlName="endTime"
                  type="time"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                id="notes"
                formControlName="notes"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              ></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                (click)="cancel.emit()"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                [disabled]="form.invalid"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class ShiftFormComponent {
  shift = input<Shift | null>(null);
  employees = input<Employee[]>([]);
  visible = input(false);

  save = output<Partial<Shift>>();
  cancel = output<void>();

  form = new FormGroup({
    employeeId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    date: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    startTime: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    endTime: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    notes: new FormControl('', { nonNullable: true }),
  });

  constructor() {
    effect(() => {
      const s = this.shift();
      if (s) {
        this.form.patchValue({
          employeeId: s.employeeId,
          date: s.date,
          startTime: s.startTime,
          endTime: s.endTime,
          notes: s.notes,
        });
      } else {
        this.form.reset();
      }
    });
  }

  onSave(): void {
    if (this.form.valid) {
      this.save.emit(this.form.getRawValue());
    }
  }
}
