import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '@org/hotelmanagement-data';
import { OccupancyChartComponent } from '../analytics/occupancy-chart.component';
import { RevenueChartComponent } from '../analytics/revenue-chart.component';
import { OccupancyMetrics, RevenueMetrics } from '@org/models';

@Component({
  standalone: true,
  selector: 'hm-analytics-page',
  imports: [FormsModule, OccupancyChartComponent, RevenueChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-800">Analytics</h2>

      <div class="bg-white rounded-lg shadow p-4 flex flex-wrap items-end gap-4">
        <div>
          <label for="startDate" class="block text-sm font-medium text-gray-700">Start Date</label>
          <input id="startDate" type="date" class="mt-1 rounded-md border-gray-300 shadow-sm text-sm" [ngModel]="startDate()" (ngModelChange)="startDate.set($event)" />
        </div>
        <div>
          <label for="endDate" class="block text-sm font-medium text-gray-700">End Date</label>
          <input id="endDate" type="date" class="mt-1 rounded-md border-gray-300 shadow-sm text-sm" [ngModel]="endDate()" (ngModelChange)="endDate.set($event)" />
        </div>
        <button
          class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          (click)="loadData()"
        >
          Apply
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <hm-occupancy-chart [data]="occupancyData()" />
        <hm-revenue-chart [data]="revenueData()" />
      </div>
    </div>
  `,
})
export class AnalyticsPageComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  startDate = signal(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  endDate = signal(new Date().toISOString().split('T')[0]);
  occupancyData = signal<OccupancyMetrics[]>([]);
  revenueData = signal<RevenueMetrics[]>([]);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.dashboardService
      .getOccupancyMetrics(this.startDate(), this.endDate())
      .subscribe((res) => {
        if (res.success) this.occupancyData.set(res.data);
      });

    this.dashboardService
      .getRevenueMetrics(this.startDate(), this.endDate())
      .subscribe((res) => {
        if (res.success) this.revenueData.set(res.data);
      });
  }
}
