import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { form, FormField, required } from '@angular/forms/signals';

interface Hotel {
  hotel_name: string;
  location: string;
  neighborhood: string;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  star_rating: number;
  amenities: string[];
  estimated_price_per_night_usd: number;
}

@Component({
  selector: 'hm-chat',
  imports: [AsyncPipe, FormsModule, FormField, JsonPipe],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
  private http = inject(HttpClient);

  message = signal('');
  loading = signal(false);
  hotels$: Observable<Hotel[]> | null = null;

  chatForm = form(this.message, (message) => {
    required(message);
  });

  search() {
    if (!this.message().trim()) return;
    this.loading.set(true);
    this.hotels$ = this.http
      .post<{ data: Hotel[]; success: boolean }>('/api/chat', {
        message: this.message(),
      })
      .pipe(
        map((res) => {
          this.loading.set(false);
          return res.data;
        }),
      );
  }
}
