import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FinancialReport } from '@org/models';

@Component({
  selector: 'hm-financial-report',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Period Selector -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Financial Report</h3>
        <div class="flex flex-wrap items-end gap-4">
          <div>
            <label for="period" class="block text-sm font-medium text-gray-700">Period</label>
            <select
              id="period"
              class="mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              [ngModel]="selectedPeriod()"
              (ngModelChange)="selectedPeriod.set($event)"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>

          <div>
            <label for="year" class="block text-sm font-medium text-gray-700">Year</label>
            <input
              id="year"
              type="number"
              class="mt-1 w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              [ngModel]="selectedYear()"
              (ngModelChange)="selectedYear.set($event)"
            />
          </div>

          @if (selectedPeriod() === 'monthly') {
            <div>
              <label for="month" class="block text-sm font-medium text-gray-700">Month</label>
              <select
                id="month"
                class="mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                [ngModel]="selectedMonth()"
                (ngModelChange)="selectedMonth.set($event)"
              >
                @for (m of months; track m.value) {
                  <option [value]="m.value">{{ m.label }}</option>
                }
              </select>
            </div>
          }

          @if (selectedPeriod() === 'quarterly') {
            <div>
              <label for="quarter" class="block text-sm font-medium text-gray-700">Quarter</label>
              <select
                id="quarter"
                class="mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                [ngModel]="selectedQuarter()"
                (ngModelChange)="selectedQuarter.set($event)"
              >
                <option [value]="1">Q1</option>
                <option [value]="2">Q2</option>
                <option [value]="3">Q3</option>
                <option [value]="4">Q4</option>
              </select>
            </div>
          }

          <button
            type="button"
            class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            (click)="onPeriodChange()"
          >
            Generate
          </button>
        </div>
      </div>

      @if (report()) {
        <!-- Summary Totals -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          @for (card of summaryCards(); track card.label) {
            <div class="bg-white rounded-lg shadow p-4">
              <p class="text-sm text-gray-500">{{ card.label }}</p>
              <p class="text-xl font-bold mt-1">{{ card.value }}</p>
            </div>
          }
        </div>

        <!-- Metrics Table -->
        <div class="bg-white rounded-lg shadow overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Revenue</th>
                <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">ADR</th>
                <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">RevPAR</th>
                <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Bookings</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              @for (metric of report()!.metrics; track metric.date) {
                <tr>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{{ metric.date | date:'mediumDate' }}</td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-right text-gray-700">{{ metric.totalRevenue | currency }}</td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-right text-gray-700">{{ metric.adr | currency }}</td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-right text-gray-700">{{ metric.revpar | currency }}</td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-right text-gray-700">{{ metric.bookingsCount }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Export Button -->
        <div class="flex justify-end">
          <button
            type="button"
            class="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
            (click)="exportToExcel()"
          >
            Export to Excel
          </button>
        </div>
      }
    </div>
  `,
})
export class FinancialReportComponent {
  report = input<FinancialReport | null>(null);
  periodChange = output<{ period: string; year: number; month?: number; quarter?: number }>();
  exportRequested = output<void>();

  selectedPeriod = signal('monthly');
  selectedYear = signal(new Date().getFullYear());
  selectedMonth = signal(new Date().getMonth() + 1);
  selectedQuarter = signal(1);

  months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  summaryCards = computed(() => {
    const r = this.report();
    if (!r?.totals) return [];
    return [
      { label: 'Total Revenue', value: `$${r.totals.totalRevenue.toLocaleString()}` },
      { label: 'Total Bookings', value: r.totals.totalBookings.toString() },
      { label: 'Avg Occupancy', value: `${r.totals.averageOccupancyRate.toFixed(1)}%` },
      { label: 'Avg ADR', value: `$${r.totals.averageAdr.toFixed(2)}` },
      { label: 'Avg RevPAR', value: `$${r.totals.averageRevpar.toFixed(2)}` },
    ];
  });

  onPeriodChange(): void {
    const params: { period: string; year: number; month?: number; quarter?: number } = {
      period: this.selectedPeriod(),
      year: this.selectedYear(),
    };
    if (this.selectedPeriod() === 'monthly') {
      params.month = this.selectedMonth();
    } else {
      params.quarter = this.selectedQuarter();
    }
    this.periodChange.emit(params);
  }

  async exportToExcel(): Promise<void> {
    const r = this.report();
    if (!r) return;

    const XLSX = await import('xlsx');
    const { saveAs } = await import('file-saver');

    const worksheetData = r.metrics.map((m) => ({
      Date: m.date,
      Revenue: m.totalRevenue,
      ADR: m.adr,
      RevPAR: m.revpar,
      Bookings: m.bookingsCount,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Financial Report');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `financial-report-${r.period}-${r.startDate}.xlsx`);

    this.exportRequested.emit();
  }
}
