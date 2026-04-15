import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { OccupancyMetrics } from '@org/models';
import { LineChartComponent } from 'angular-chrts';

@Component({
  selector: 'hm-occupancy-chart',
  standalone: true,
  imports: [LineChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold mb-4">Occupancy Rate</h3>
      <ngx-line-chart [data]="chartData()" [categories]="categories" [height]="300" />
    </div>
  `,
})
export class OccupancyChartComponent {
  data = input<OccupancyMetrics[]>([]);

  categories: Record<string, { name: string; color: string }> = {
    occupancyRate: { name: 'Occupancy Rate', color: '#3B82F6' },
  };

  chartData = computed(() =>
    this.data().map((m) => ({
      name: m.date,
      occupancyRate: m.occupancyRate,
    }))
  );
}
