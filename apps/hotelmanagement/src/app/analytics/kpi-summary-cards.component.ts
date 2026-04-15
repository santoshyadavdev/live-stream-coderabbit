import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
export interface KpiSummary {
  totalRooms: number;
  occupancyRate: number;
  totalRevenue: number;
  adr: number;
  revpar: number;
  totalBookings: number;
}

@Component({
  selector: 'hm-kpi-summary-cards',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      @for (card of cards(); track card.label) {
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-sm text-gray-500">{{ card.label }}</p>
          <p class="text-2xl font-bold mt-1">{{ card.value }}</p>
        </div>
      }
    </div>
  `,
})
export class KpiSummaryCardsComponent {
  summary = input<KpiSummary | null>(null);

  cards = computed(() => {
    const s = this.summary();
    if (!s) return [];
    return [
      { label: 'Total Rooms', value: s.totalRooms.toString() },
      { label: 'Occupancy Rate', value: `${s.occupancyRate.toFixed(1)}%` },
      { label: 'Total Revenue', value: `$${s.totalRevenue.toLocaleString()}` },
      { label: 'ADR', value: `$${s.adr.toFixed(2)}` },
      { label: 'RevPAR', value: `$${s.revpar.toFixed(2)}` },
      { label: 'Total Bookings', value: s.totalBookings.toString() },
    ];
  });
}
