import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  effect,
} from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Employee, EmployeeRole } from '@org/models';

@Component({
  selector: 'hm-staff-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
          <h2 class="mb-4 text-lg font-semibold text-gray-900">
            {{ employee() ? 'Edit Employee' : 'Add Employee' }}
          </h2>

          <form [formGroup]="form" (ngSubmit)="onSave()" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
              <input
                id="name"
                formControlName="name"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                formControlName="email"
                type="email"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
              <input
                id="phone"
                formControlName="phone"
                type="tel"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
              <select
                id="role"
                formControlName="role"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                @for (role of roles; track role) {
                  <option [value]="role">{{ role }}</option>
                }
              </select>
            </div>

            <div>
              <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                formControlName="status"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                (click)="cancelForm.emit()"
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
export class StaffFormComponent {
  employee = input<Employee | null>(null);
  visible = input(false);

  save = output<Partial<Employee>>();
  cancelForm = output<void>();

  roles = Object.values(EmployeeRole);

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    role: new FormControl<EmployeeRole>(EmployeeRole.Receptionist, { nonNullable: true }),
    status: new FormControl<'active' | 'inactive'>('active', { nonNullable: true }),
  });

  constructor() {
    effect(() => {
      const emp = this.employee();
      if (emp) {
        this.form.patchValue({
          name: emp.name,
          email: emp.email,
          phone: emp.phone,
          role: emp.role,
          status: emp.status,
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
