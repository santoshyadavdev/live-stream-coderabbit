import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { DashboardService } from '@org/hotelmanagement-data';
import { KpiSummaryCardsComponent, KpiSummary } from '../analytics/kpi-summary-cards.component';
import { OccupancyChartComponent } from '../analytics/occupancy-chart.component';
import { RevenueChartComponent } from '../analytics/revenue-chart.component';
import { OccupancyMetrics, RevenueMetrics } from '@org/models';

@Component({
  standalone: true,
  selector: 'hm-overview',
  imports: [KpiSummaryCardsComponent, OccupancyChartComponent, RevenueChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-800">Dashboard Overview</h2>

      <hm-kpi-summary-cards [summary]="kpiSummary()" />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <hm-occupancy-chart [data]="occupancyData()" />
        <hm-revenue-chart [data]="revenueData()" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-2">Today's Activity</h3>
          <div class="space-y-2">
            <p class="text-sm text-gray-600">Check-ins today: <span class="font-bold text-gray-900">{{ todayCheckIns() }}</span></p>
            <p class="text-sm text-gray-600">Check-outs today: <span class="font-bold text-gray-900">{{ todayCheckOuts() }}</span></p>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-2">Staff on Duty</h3>
          <p class="text-sm text-gray-600">Employees on shift today: <span class="font-bold text-gray-900">{{ staffOnDuty() }}</span></p>
        </div>
      </div>
    </div>
  `,
})
export class OverviewComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  kpiSummary = signal<KpiSummary | null>(null);
  occupancyData = signal<OccupancyMetrics[]>([]);
  revenueData = signal<RevenueMetrics[]>([]);
  todayCheckIns = signal(0);
  todayCheckOuts = signal(0);
  staffOnDuty = signal(0);

  ngOnInit(): void {
    const today = new Date();
    const endDate = today.toISOString().split('T')[0];
    const startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    this.dashboardService
      .getAnalyticsSummary(startDate, endDate)
      .subscribe((res) => {
        if (res.success && res.data) {
          const d = res.data as Record<string, number>;
          this.kpiSummary.set({
            totalRooms: d['totalRooms'] ?? 0,
            occupancyRate: d['occupancyRate'] ?? 0,
            totalRevenue: d['totalRevenue'] ?? 0,
            adr: d['adr'] ?? 0,
            revpar: d['revpar'] ?? 0,
            totalBookings: d['totalBookings'] ?? 0,
          });
          this.todayCheckIns.set(d['todayCheckIns'] ?? 0);
          this.todayCheckOuts.set(d['todayCheckOuts'] ?? 0);
          this.staffOnDuty.set(d['staffOnDutyToday'] ?? 0);
        }
      });

    this.dashboardService
      .getOccupancyMetrics(startDate, endDate)
      .subscribe((res) => {
        if (res.success) {
          this.occupancyData.set(res.data);
        }
      });

    this.dashboardService
      .getRevenueMetrics(startDate, endDate)
      .subscribe((res) => {
        if (res.success) {
          this.revenueData.set(res.data);
        }
      });
  }
}
