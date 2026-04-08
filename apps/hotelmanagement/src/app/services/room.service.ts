import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Amenity,
  AmenityCategory,
  ApiResponse,
  MediaItem,
  MediaType,
  OutOfOrderSchedule,
  OOOReason,
  Room,
  RoomAllocation,
  RoomFilter,
  RoomType,
  RoomTypeFilter,
} from '@org/models';
import { catchError, map, Observable, throwError } from 'rxjs';

export interface Reservation {
  id: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  roomTypeId: string;
  isVIP: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3333/api';

  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  getRoomTypes(filter?: RoomTypeFilter): Observable<RoomType[]> {
    let params = new HttpParams();
    if (filter?.name) {
      params = params.set('name', filter.name);
    }
    if (filter?.minAdults !== undefined) {
      params = params.set('minAdults', filter.minAdults);
    }
    if (filter?.minChildren !== undefined) {
      params = params.set('minChildren', filter.minChildren);
    }
    if (filter?.minPrice !== undefined) {
      params = params.set('minPrice', filter.minPrice);
    }
    if (filter?.maxPrice !== undefined) {
      params = params.set('maxPrice', filter.maxPrice);
    }
    if (filter?.amenityIds?.length) {
      params = params.set('amenities', filter.amenityIds.join(','));
    }

    return this.request<RoomType[]>(this.http.get<ApiResponse<RoomType[]>>(`${this.apiUrl}/room-types`, { params }));
  }

  getRoomTypeById(id: string): Observable<RoomType> {
    return this.request<RoomType>(this.http.get<ApiResponse<RoomType>>(`${this.apiUrl}/room-types/${id}`));
  }

  createRoomType(payload: Omit<RoomType, 'id'>): Observable<RoomType> {
    return this.request<RoomType>(this.http.post<ApiResponse<RoomType>>(`${this.apiUrl}/room-types`, payload));
  }

  updateRoomType(id: string, payload: Partial<Omit<RoomType, 'id'>>): Observable<RoomType> {
    return this.request<RoomType>(this.http.put<ApiResponse<RoomType>>(`${this.apiUrl}/room-types/${id}`, payload));
  }

  deleteRoomType(id: string): Observable<{ id: string }> {
    return this.request<{ id: string }>(this.http.delete<ApiResponse<{ id: string }>>(`${this.apiUrl}/room-types/${id}`));
  }

  getRooms(filter?: RoomFilter): Observable<Room[]> {
    let params = new HttpParams();
    if (filter?.roomTypeId) {
      params = params.set('roomTypeId', filter.roomTypeId);
    }
    if (filter?.floor !== undefined) {
      params = params.set('floor', filter.floor);
    }
    if (filter?.wing) {
      params = params.set('wing', filter.wing);
    }
    if (filter?.status) {
      params = params.set('status', filter.status);
    }
    if (filter?.amenityIds?.length) {
      params = params.set('amenities', filter.amenityIds.join(','));
    }

    return this.request<Room[]>(this.http.get<ApiResponse<Room[]>>(`${this.apiUrl}/rooms`, { params }));
  }

  getRoomById(id: string): Observable<Room> {
    return this.request<Room>(this.http.get<ApiResponse<Room>>(`${this.apiUrl}/rooms/${id}`));
  }

  createRoom(payload: Omit<Room, 'id'>): Observable<Room> {
    return this.request<Room>(this.http.post<ApiResponse<Room>>(`${this.apiUrl}/rooms`, payload));
  }

  updateRoom(id: string, payload: Partial<Omit<Room, 'id'>>): Observable<Room> {
    return this.request<Room>(this.http.put<ApiResponse<Room>>(`${this.apiUrl}/rooms/${id}`, payload));
  }

  deleteRoom(id: string): Observable<{ id: string }> {
    return this.request<{ id: string }>(this.http.delete<ApiResponse<{ id: string }>>(`${this.apiUrl}/rooms/${id}`));
  }

  getAmenities(): Observable<Amenity[]> {
    return this.request<Amenity[]>(this.http.get<ApiResponse<Amenity[]>>(`${this.apiUrl}/amenities`));
  }

  getAmenitiesByCategory(category: AmenityCategory): Observable<Amenity[]> {
    return this.request<Amenity[]>(
      this.http.get<ApiResponse<Amenity[]>>(`${this.apiUrl}/amenities/categories/${category}`)
    );
  }

  attachAmenitiesToRoom(roomId: string, amenityIds: string[]): Observable<Room> {
    return this.request<Room>(
      this.http.post<ApiResponse<Room>>(`${this.apiUrl}/rooms/${roomId}/amenities`, {
        amenityIds,
      })
    );
  }

  attachAmenitiesToRoomType(roomTypeId: string, amenityIds: string[]): Observable<RoomType> {
    return this.request<RoomType>(
      this.http.post<ApiResponse<RoomType>>(`${this.apiUrl}/room-types/${roomTypeId}/amenities`, {
        amenityIds,
      })
    );
  }

  getOOOSchedulesByRoom(roomId: string): Observable<OutOfOrderSchedule[]> {
    return this.request<OutOfOrderSchedule[]>(
      this.http.get<ApiResponse<OutOfOrderSchedule[]>>(`${this.apiUrl}/rooms/${roomId}/ooo-schedules`)
    );
  }

  getOOOSchedulesByDateRange(startDate: string, endDate: string): Observable<OutOfOrderSchedule[]> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);

    return this.request<OutOfOrderSchedule[]>(
      this.http.get<ApiResponse<OutOfOrderSchedule[]>>(`${this.apiUrl}/ooo-schedules`, {
        params,
      })
    );
  }

  scheduleOOO(
    roomId: string,
    payload: Omit<OutOfOrderSchedule, 'id' | 'roomId'> & { reason: OOOReason }
  ): Observable<OutOfOrderSchedule> {
    return this.request<OutOfOrderSchedule>(
      this.http.post<ApiResponse<OutOfOrderSchedule>>(`${this.apiUrl}/rooms/${roomId}/ooo-schedules`, payload)
    );
  }

  cancelOOO(scheduleId: string): Observable<{ id: string }> {
    return this.request<{ id: string }>(
      this.http.delete<ApiResponse<{ id: string }>>(`${this.apiUrl}/ooo-schedules/${scheduleId}`)
    );
  }

  autoAllocate(reservation: Reservation): Observable<RoomAllocation> {
    return this.request<RoomAllocation>(
      this.http.post<ApiResponse<RoomAllocation>>(`${this.apiUrl}/allocations/auto`, reservation)
    );
  }

  manualAllocate(reservationId: string, roomId: string, reservation?: Reservation): Observable<RoomAllocation> {
    return this.request<RoomAllocation>(
      this.http.post<ApiResponse<RoomAllocation>>(`${this.apiUrl}/allocations/manual`, {
        reservationId,
        roomId,
        reservation,
      })
    );
  }

  lockAllocation(allocationId: string, isLocked = true): Observable<RoomAllocation> {
    return this.request<RoomAllocation>(
      this.http.put<ApiResponse<RoomAllocation>>(`${this.apiUrl}/allocations/${allocationId}/lock`, {
        isLocked,
      })
    );
  }

  deallocate(allocationId: string): Observable<{ id: string }> {
    return this.request<{ id: string }>(
      this.http.delete<ApiResponse<{ id: string }>>(`${this.apiUrl}/allocations/${allocationId}`)
    );
  }

  getMediaByRoomType(roomTypeId: string): Observable<MediaItem[]> {
    return this.request<MediaItem[]>(
      this.http.get<ApiResponse<MediaItem[]>>(`${this.apiUrl}/room-types/${roomTypeId}/media`)
    );
  }

  uploadMedia(roomTypeId: string, source: string, type: MediaType, caption: string): Observable<MediaItem> {
    return this.request<MediaItem>(
      this.http.post<ApiResponse<MediaItem>>(`${this.apiUrl}/room-types/${roomTypeId}/media`, {
        source,
        type,
        caption,
      })
    );
  }

  reorderMedia(mediaId: string, sortOrder: number): Observable<MediaItem> {
    return this.request<MediaItem>(
      this.http.put<ApiResponse<MediaItem>>(`${this.apiUrl}/media/${mediaId}/reorder`, {
        sortOrder,
      })
    );
  }

  deleteMedia(mediaId: string): Observable<{ id: string }> {
    return this.request<{ id: string }>(
      this.http.delete<ApiResponse<{ id: string }>>(`${this.apiUrl}/media/${mediaId}`)
    );
  }

  private request<T>(source$: Observable<ApiResponse<T>>): Observable<T> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return source$.pipe(
      map((response) => {
        this.loadingSignal.set(false);
        if (!response.success) {
          throw new Error(response.error || 'Request failed');
        }

        return response.data;
      }),
      catchError((error) => {
        this.loadingSignal.set(false);
        this.errorSignal.set(error.message || 'Unexpected request error');
        return throwError(() => error);
      })
    );
  }
}
