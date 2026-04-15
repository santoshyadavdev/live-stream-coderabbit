import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, tap, finalize } from 'rxjs';
import {
  Employee,
  Shift,
  OccupancyMetrics,
  RevenueMetrics,
  FinancialReport,
  ApiResponse,
} from '@org/models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  loading = signal(false);
  error = signal<string | null>(null);

  private readonly apiUrl = '/api';

  constructor(private readonly http: HttpClient) {}

  private request<T>(obs$: Observable<T>, fallback: T): Observable<T> {
    this.loading.set(true);
    this.error.set(null);
    return obs$.pipe(
      catchError((err) => {
        this.error.set(err?.error?.message ?? err?.message ?? 'An error occurred');
        return of(fallback);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  // --- Staff ---

  getStaff(role?: string): Observable<ApiResponse<Employee[]>> {
    let params = new HttpParams();
    if (role) {
      params = params.set('role', role);
    }
    return this.request(
      this.http.get<ApiResponse<Employee[]>>(`${this.apiUrl}/staff`, { params }),
      { data: [], success: false, message: 'Failed to load staff' }
    );
  }

  getStaffById(id: string): Observable<ApiResponse<Employee>> {
    return this.request(
      this.http.get<ApiResponse<Employee>>(`${this.apiUrl}/staff/${id}`),
      { data: {} as Employee, success: false, message: 'Failed to load employee' }
    );
  }

  createStaff(employee: Partial<Employee>): Observable<ApiResponse<Employee>> {
    return this.request(
      this.http.post<ApiResponse<Employee>>(`${this.apiUrl}/staff`, employee),
      { data: {} as Employee, success: false, message: 'Failed to create employee' }
    );
  }

  updateStaff(id: string, employee: Partial<Employee>): Observable<ApiResponse<Employee>> {
    return this.request(
      this.http.put<ApiResponse<Employee>>(`${this.apiUrl}/staff/${id}`, employee),
      { data: {} as Employee, success: false, message: 'Failed to update employee' }
    );
  }

  deleteStaff(id: string): Observable<ApiResponse<void>> {
    return this.request(
      this.http.delete<ApiResponse<void>>(`${this.apiUrl}/staff/${id}`),
      { data: undefined as unknown as void, success: false, message: 'Failed to delete employee' }
    );
  }

  // --- Shifts ---

  getShifts(startDate?: string, endDate?: string): Observable<ApiResponse<Shift[]>> {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }
    return this.request(
      this.http.get<ApiResponse<Shift[]>>(`${this.apiUrl}/shifts`, { params }),
      { data: [], success: false, message: 'Failed to load shifts' }
    );
  }

  createShift(shift: Partial<Shift>): Observable<ApiResponse<Shift>> {
    return this.request(
      this.http.post<ApiResponse<Shift>>(`${this.apiUrl}/shifts`, shift),
      { data: {} as Shift, success: false, message: 'Failed to create shift' }
    );
  }

  updateShift(id: string, shift: Partial<Shift>): Observable<ApiResponse<Shift>> {
    return this.request(
      this.http.put<ApiResponse<Shift>>(`${this.apiUrl}/shifts/${id}`, shift),
      { data: {} as Shift, success: false, message: 'Failed to update shift' }
    );
  }

  deleteShift(id: string): Observable<ApiResponse<void>> {
    return this.request(
      this.http.delete<ApiResponse<void>>(`${this.apiUrl}/shifts/${id}`),
      { data: undefined as unknown as void, success: false, message: 'Failed to delete shift' }
    );
  }

  // --- Analytics ---

  getOccupancyMetrics(
    startDate: string,
    endDate: string,
    hotelId?: string
  ): Observable<ApiResponse<OccupancyMetrics[]>> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    if (hotelId) {
      params = params.set('hotelId', hotelId);
    }
    return this.request(
      this.http.get<ApiResponse<OccupancyMetrics[]>>(`${this.apiUrl}/analytics/occupancy`, { params }),
      { data: [], success: false, message: 'Failed to load occupancy metrics' }
    );
  }

  getRevenueMetrics(
    startDate: string,
    endDate: string,
    hotelId?: string
  ): Observable<ApiResponse<RevenueMetrics[]>> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    if (hotelId) {
      params = params.set('hotelId', hotelId);
    }
    return this.request(
      this.http.get<ApiResponse<RevenueMetrics[]>>(`${this.apiUrl}/analytics/revenue`, { params }),
      { data: [], success: false, message: 'Failed to load revenue metrics' }
    );
  }

  getAnalyticsSummary(
    startDate?: string,
    endDate?: string,
    hotelId?: string
  ): Observable<ApiResponse<Record<string, unknown>>> {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }
    if (hotelId) {
      params = params.set('hotelId', hotelId);
    }
    return this.request(
      this.http.get<ApiResponse<Record<string, unknown>>>(`${this.apiUrl}/analytics/summary`, { params }),
      { data: {}, success: false, message: 'Failed to load analytics summary' }
    );
  }

  // --- Reports ---

  getFinancialReport(params: {
    period: string;
    year: number;
    month?: number;
    quarter?: number;
  }): Observable<ApiResponse<FinancialReport>> {
    let httpParams = new HttpParams()
      .set('period', params.period)
      .set('year', params.year.toString());
    if (params.month != null) {
      httpParams = httpParams.set('month', params.month.toString());
    }
    if (params.quarter != null) {
      httpParams = httpParams.set('quarter', params.quarter.toString());
    }
    return this.request(
      this.http.get<ApiResponse<FinancialReport>>(`${this.apiUrl}/reports/financial`, { params: httpParams }),
      { data: {} as FinancialReport, success: false, message: 'Failed to load financial report' }
    );
  }
}
