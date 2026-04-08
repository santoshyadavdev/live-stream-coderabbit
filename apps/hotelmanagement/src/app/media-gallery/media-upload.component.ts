import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MediaType } from '@org/models';

@Component({
  standalone: true,
  selector: 'hm-media-upload',
  imports: [FormsModule],
  templateUrl: './media-upload.component.html',
  styleUrl: './media-upload.component.css',
})
export class MediaUploadComponent {
  roomTypeId = input.required<string>();
  upload = output<{ source: string; type: MediaType; caption: string }>();

  form = signal<{ source: string; type: MediaType; caption: string }>({
    source: '',
    type: 'photo',
    caption: '',
  });

  preview = signal<string | null>(null);

  update<K extends keyof ReturnType<typeof this.form>>(key: K, value: ReturnType<typeof this.form>[K]): void {
    this.form.update((current) => ({ ...current, [key]: value }));
    if (key === 'source') {
      this.preview.set(value as string);
    }
  }

  submit(): void {
    if (!this.form().source) {
      return;
    }

    this.upload.emit(this.form());
    this.form.set({ source: '', type: 'photo', caption: '' });
    this.preview.set(null);
  }
}
