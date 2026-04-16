import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { DashboardService } from '@org/hotelmanagement-data';
import { FinancialReportComponent } from './financial-report.component';
import { FinancialReport } from '@org/models';

@Component({
  standalone: true,
  selector: 'hm-reports-page',
  imports: [FinancialReportComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-800">Financial Reports</h2>

      <hm-financial-report
        [report]="report()"
        (periodChange)="onPeriodChange($event)"
        (exportRequested)="onExport()"
      />
    </div>
  `,
})
export class ReportsPageComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  report = signal<FinancialReport | null>(null);

  private currentParams = {
    period: 'monthly' as string,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    quarter: undefined as number | undefined,
  };

  ngOnInit(): void {
    this.loadReport();
  }

  onPeriodChange(params: { period: string; year: number; month?: number; quarter?: number }): void {
    this.currentParams = { ...this.currentParams, ...params };
    this.loadReport();
  }

  onExport(): void {
    // Export is handled by the FinancialReportComponent itself
    // This is a hook for any additional page-level logic
  }

  private loadReport(): void {
    this.dashboardService.getFinancialReport(this.currentParams).subscribe((res) => {
      if (res.success) this.report.set(res.data);
    });
  }
}
