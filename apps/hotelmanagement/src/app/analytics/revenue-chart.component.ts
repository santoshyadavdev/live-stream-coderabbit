import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { RevenueMetrics } from '@org/models';
import { BarChartComponent } from 'angular-chrts';

@Component({
  selector: 'hm-revenue-chart',
  standalone: true,
  imports: [BarChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold mb-4">Revenue Metrics</h3>
      <ngx-bar-chart [data]="chartData()" [categories]="categories" [height]="300" [yAxis]="yAxisKeys" />
    </div>
  `,
})
export class RevenueChartComponent {
  data = input<RevenueMetrics[]>([]);

  categories: Record<string, { name: string; color: string }> = {
    adr: { name: 'ADR', color: '#10B981' },
    revpar: { name: 'RevPAR', color: '#F59E0B' },
  };

  yAxisKeys: ('adr' | 'revpar')[] = ['adr', 'revpar'];

  chartData = computed(() =>
    this.data().map((m) => ({
      name: m.date,
      adr: m.adr,
      revpar: m.revpar,
    }))
  );
}
