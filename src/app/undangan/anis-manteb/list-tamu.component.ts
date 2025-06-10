import { Component, OnInit, OnDestroy, ApplicationRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { interval, Subscription, BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, catchError, tap, first, map } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';

interface Guest {
  nama: string;
  link: string;
}

@Component({
  selector: 'app-guest-management',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  template: `
  <div class="min-h-screen bg-[#58010F] container mx-auto px-4 p-8">
    <!-- Form Section -->
    <div class="bg-[#FEFBE8] bg-card-2 py-6 px-2 md:px-4 rounded-xl mb-8">
      <div class="max-w-lg mx-auto">
        <div class="text-center mb-2">
          <h2 class="text-3xl font-semibold text-amber-900 mb-2 font-serif mb-8">Buat List Tamu</h2>
        </div>
        <form (ngSubmit)="submitForm()" class="max-w-6xl mx-auto bg-[#58010F] shadow-xl rounded-lg p-8 text-white text-center">
          <div class="relative mb-6">
            <label for="nama" class="block mb-2 text-sm font-medium text-white">Nama</label>
            <input type="text" id="nama" name="nama" [(ngModel)]="guest.nama" (input)="generateLink()" required placeholder="Silahkan diisi nama tamu" class="w-full bg-white rounded border-gray-300 text-gray-700 py-2 px-3"/>
          </div>

          <div class="relative mb-6">
            <label class="flex mb-2 text-sm font-medium text-white">Preview Link</label>
            <textarea readonly class="w-full h-32 bg-white rounded border-gray-300 text-gray-700 py-2 px-3" 
              [value]="guest.link || 'Link akan muncul di sini...'"></textarea>
          </div>
    
          <button type="submit" [disabled]="isSubmitting" class="w-full font-semibold text-[#58010F] py-3 px-4 rounded-full bg-[#FEFBE8] hover:bg-[#FEFBE8]/40 transition duration-300 disabled:opacity-50">
            {{ isSubmitting ? 'Mengirim...' : 'Kirim' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Guest List Section -->
    <div class="bg-[#F7BE84] bg-card-2 rounded-xl p-6 shadow-inner mx-auto">
      <div class="text-center mb-2">
        <h2 class="text-3xl font-semibold text-amber-900 mb-2 font-serif mb-8">List Tamu</h2>
        <!-- Debug info - hapus setelah testing -->
        <p class="text-xs text-gray-600 mb-2">Last updated: {{ lastUpdateTime | date:'HH:mm:ss' }}</p>
        <!-- Tombol Refresh Manual -->
        <button 
          (click)="refreshGuests()" 
          [disabled]="isLoading"
          class="bg-[#58010F] hover:bg-[#6A4E35] text-white font-semibold py-1 px-3 rounded text-sm transition duration-300 mb-4">
          {{ isLoading ? 'Memuat...' : '🔄 Refresh' }}
        </button>
      </div>
      
      <!-- Loading Indicator -->
      <div *ngIf="isLoading" class="flex justify-center items-center mb-4">
        <div class="loader-dots flex space-x-1">
          <div class="h-2 w-2 bg-[#58010F] rounded-full animate-bounce"></div>
          <div class="h-2 w-2 bg-[#58010F] rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          <div class="h-2 w-2 bg-[#58010F] rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
        </div>
      </div>

      <div class="h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
        <ng-container *ngIf="guests$ | async as guestList">
          <div *ngIf="guestList.length === 0 && !error" class="bg-[#F7BE84]/50 rounded-full text-[#58010F] text-center p-2">
            Belum ada tamu
          </div>
          <div *ngIf="guestList.length > 0" class="grid grid-cols-1 gap-6">
            <div *ngFor="let guest of guestList; trackBy: trackByName" class="bg-white shadow-lg rounded-xl p-4 md:p-6" [@fadeIn]>
              <div class="flex items-center justify-start mb-2">
                <h3 class="text-md font-semibold text-gray-800 truncate">{{ guest.nama }}</h3>
              </div>
              <p class="text-gray-600 text-sm italic mb-2 text-wrap">{{ guest.link }}</p>
              <button 
                (click)="copyToClipboard(guest.nama, guest.link)"
                class="bg-gray-100 hover:bg-gray-300 font-bold text-blue-500 px-2 py-1 rounded text-xs sm:text-sm">
                Copy Link
              </button>
            </div>
          </div>
        </ng-container>
        
        <div *ngIf="error" class="text-red-500 text-center p-4">
          {{ error }}
          <button (click)="clearError()" class="ml-2 text-blue-500 underline">Coba Lagi</button>
        </div>
      </div>
    </div>
    
    <div *ngIf="showToast" class="fixed top-1/2 transform -translate-y-1/2 left-1/2 transform -translate-x-1/2 items-center bg-opacity-80 justify-center text-center p-3 text-white rounded shadow-lg text-sm sm:text-base" [ngClass]="toastBackground">
      {{ toastMessage}}
    </div>
    
    <!-- Modal -->
    <div *ngIf="isModalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 text-center">
      <div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 class="text-xl font-bold mb-4 text-[#58010F]">{{ modalTitle }}</h3>
        <p class="text-[#58010F] mb-6">{{ modalMessage }}</p>
        <button (click)="closeModal()" class="rounded font-bold py-3 px-4 bg-[#58010F] hover:bg-white text-white hover:text-[#58010F] transition">Tutup</button>
      </div>
    </div>
  </div>
  `,
  styles: [
    `.custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(247, 100, 120, 0.8);
        border-radius: 7px;
      }
      
      .bg-card-2 {
        position: relative;
        background-image: 
        linear-gradient(rgba(241,239,228, 0.95), rgba(241,239,228, 0.95)),
        url('https://res.cloudinary.com/dvqq3izfb/image/upload/v1728484658/bg2_a3hvpt.png'),
        url('https://res.cloudinary.com/dvqq3izfb/image/upload/v1728484659/bg1_bcuaos.png');
        background-position: center;
        image-rendering: optimizeQuality;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center, center;
        opacity: 1;
      }
      
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }

      .animate-pulse {
        animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      `
  ],
  animations: [
    trigger('fadeIn', [transition(':enter', [style({ opacity: 0, transform: 'translateY(-10px)' }), animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))])])
  ]
})
export class GuestManagementComponent2 implements OnInit, OnDestroy {
    guest: Guest = { nama: '', link: '' };
    private guestsSubject = new BehaviorSubject<Guest[]>([]);
    guests$: Observable<Guest[]> = this.guestsSubject.asObservable();
    error: string | null = null;
    isLoading = false;
    isSubmitting = false;
    lastUpdateTime = new Date();
    private updateSubscription?: Subscription;
    private readonly SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyAWLqtaCFWtAGSuZLFjkQsdFidLMd49mwH815xq5gn61NwdnCoAm5DNwEcNWCSgPHk/exec';
  
    isModalOpen = false;
    modalTitle = '';
    modalMessage = '';
  
    @Output() formSubmitted = new EventEmitter<void>();

    showToast = false;
    toastMessage = '';
    toastBackground = '';
  
    constructor(
      private http: HttpClient, 
      private applicationRef: ApplicationRef,
      private cdr: ChangeDetectorRef
    ) {}

    copyToClipboard(nama: string, link: string) {
      const message = `
Assalamu'alaikum Warahmatullahi Wabarakatuh.
Bismillahirrahmanirrahim.
Kepada Yth.
Bapak/Ibu/Saudara/i
${nama}

Dengan penuh hormat, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara unduh mantu kami:
Anis & Mantep
  
Informasi lengkap mengenai acara dapat dilihat melalui tautan berikut:
${link}
  
Kami sangat berbahagia apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
Mohon maaf undangan ini hanya disampaikan melalui pesan ini. Terima kasih banyak atas perhatian dan kesediaannya.
  
Wassalamu'alaikum Warahmatullahi Wabarakatuh.
Terima kasih.`;
  
      navigator.clipboard.writeText(message).then(
        () => {
          console.log('Teks undangan berhasil disalin ke clipboard!');
          this.showToastMessage('Link undangan berhasil disalin!', 'success');
        },
        (err) => {
          console.error('Gagal menyalin teks ke clipboard: ', err);
          this.showToastMessage('Gagal menyalin link', 'error');
        }
      );
    }

    showToastMessage(message: string, type: string) {
      this.toastMessage = message;
      this.showToast = true;
  
      if (type === 'success') {
        this.toastBackground = 'bg-green-500';
      } else if (type === 'error') {
        this.toastBackground = 'bg-red-500';
      }
  
      setTimeout(() => {
        this.showToast = false;
      }, 2000);
    }

    generateLink() {
      const formattedName = this.guest.nama.trim().replace(/\s+/g, '%20');
      this.guest.link = `https://anismantep.kreyasi.my.id/unduh-mantu/${formattedName}`;
    }

    ngOnInit() {
      this.loadGuests();
      this.applicationRef.isStable.pipe(first(isStable => isStable)).subscribe(() => {
        this.startAutoRefresh();
      });
    }
  
    ngOnDestroy() {
      this.updateSubscription?.unsubscribe();
    }

    refreshGuests(): void {
      this.loadGuests();
    }

    clearError(): void {
      this.error = null;
      this.loadGuests();
    }
  
    private loadGuests() {
      if (this.isLoading) return;
      
      this.isLoading = true;
      this.error = null;
      
      this.fetchGuests().pipe(
        tap(guests => {
          this.updateGuestList(guests);
          this.error = null;
          this.isLoading = false;
          this.lastUpdateTime = new Date();
          this.cdr.detectChanges();
        }),
        catchError(err => {
          console.error('Load guests error:', err);
          this.error = `Gagal memuat data: ${err.message || 'Periksa koneksi internet'}`;
          this.isLoading = false;
          this.cdr.detectChanges();
          return of([]);
        })
      ).subscribe();
    }

    private fetchGuests(): Observable<Guest[]> {
      // Simple cache-busting dengan timestamp
      const timestamp = Date.now();
      const url = `${this.SCRIPT_URL}?t=${timestamp}`;
      
      console.log('Fetching guests from URL:', url);
      
      return this.http.get<any>(url).pipe(
        map(response => {
          console.log('Guest API Response:', response);
          
          // Handle berbagai format response dari Google Apps Script
          if (response && response.data && Array.isArray(response.data)) {
            return response.data;
          } else if (Array.isArray(response)) {
            return response;
          } else if (response && Array.isArray(response.result)) {
            return response.result;
          } else {
            console.warn('Unexpected guest API response format:', response);
            return [];
          }
        }),
        catchError(error => {
          console.error('Guest API Error Details:', error);
          throw error;
        })
      );
    }
  
    private startAutoRefresh() {
      // Interval 30 detik untuk stabilitas
      this.updateSubscription = interval(30000).pipe(
        switchMap(() => {
          if (this.isLoading) return of([]);
          return this.fetchGuests().pipe(
            catchError(error => {
              console.error('Auto refresh error:', error);
              return of([]);
            })
          );
        })
      ).subscribe(guests => {
        if (guests.length > 0) {
          this.updateGuestList(guests);
          this.error = null;
          this.lastUpdateTime = new Date();
          this.cdr.detectChanges();
        }
      });
    }
  
    private updateGuestList(newGuests: Guest[]) {
      // Reverse untuk menampilkan yang terbaru di atas
      const reversedGuests = [...newGuests].reverse();
      this.guestsSubject.next(reversedGuests);
    }
  
    submitForm() {
      if (!this.isFormValid()) {
        this.showModal('Error', 'Data tamu tidak lengkap. Pastikan untuk mengisi semua kolom.');
        return;
      }

      if (this.isSubmitting) return;

      this.isSubmitting = true;
  
      fetch(this.SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.guest)
      })
      .then(response => {
        if (response.type === 'opaque') {
          this.handleSuccess();
          return null;
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          console.log('Respon dari server:', data);
          this.handleSuccess();
        }
      })
      .catch(error => {
        console.error('Gagal mengirim data:', error);
        this.showModal('Error', `Gagal mengirim data: ${error.message}. Silakan coba lagi nanti.`);
      })
      .finally(() => {
        this.isSubmitting = false;
        // Refresh data setelah submit
        setTimeout(() => this.loadGuests(), 1000);
      });
    }
  
    private isFormValid(): boolean {
      return !!this.guest.nama;
    }
  
    private handleSuccess() {
      const message = `Terima kasih, ${this.guest.nama}. Data Anda telah terkirim.`;
      this.showModal('Sukses', message);
      this.resetForm();
      this.formSubmitted.emit();
    }
  
    private showModal(title: string, message: string) {
      this.modalTitle = title;
      this.modalMessage = message;
      this.isModalOpen = true;
    }
  
    closeModal() {
      this.isModalOpen = false;
    }
  
    private resetForm() {
      this.guest = { nama: '', link: '' };
    }
  
    trackByName(index: number, guest: Guest): string {
      return guest.nama;
    }
}