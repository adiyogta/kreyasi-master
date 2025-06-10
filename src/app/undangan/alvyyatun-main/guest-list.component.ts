import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ApplicationRef,
  ChangeDetectorRef,
  Signal,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { interval, Subscription, BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { switchMap, catchError, tap, take, distinctUntilChanged, map, first, debounceTime, retry } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';
import { toSignal } from '@angular/core/rxjs-interop';

interface Guest {
  nama: string;
  ucapan: string;
  kehadiran: string;
  timestamp: number;
}

@Component({
  selector: 'app-guest-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="container mx-auto px-4 p-8">
      <div class="bg-[#F7BE84] bg-card-2 rounded-xl p-6 shadow-inner relative">
        
        <div class="bg-[#432818] bg-opacity-70 mx-auto rounded-xl p-2 mb-2 items-center">
          <h2 class="text-3xl font-medium font-serif mb-2 text-center text-white">Wishes</h2>
          <p class="text-white text-sm md:text-md mb-4 text-center">Ucapan, harapan, dan do'a kepada kedua mempelai</p>
        </div>

        <!-- Tombol Refresh dengan Animasi -->
        <div class="text-center mb-4">
          <button 
            (click)="refreshGuests()" 
            [disabled]="isLoading"
            class="bg-[#432818] hover:bg-[#6A4E35] text-white font-semibold py-2 px-4 rounded transition duration-300 flex items-center justify-center mx-auto">
            <span *ngIf="!isLoading">🔄</span>
            <span class="ml-1">{{ isLoading ? 'Memuat...' : 'Refresh Ucapan' }}</span>
          </button>
          <!-- Debug info - hapus setelah testing -->
          <p class="text-xs text-gray-500 mt-1">Last updated: {{ lastUpdateTime | date:'HH:mm:ss' }}</p>
        </div>

        <!-- Pull to Refresh Indicator -->
        <div *ngIf="isPulling" class="text-center text-sm text-gray-600 italic mb-2 animate-pulse">
          ↓ Tarik ke bawah untuk refresh ↓
        </div>

        <!-- Indikator Loading -->
        <div *ngIf="isLoading && !isPulling" class="flex justify-center items-center mb-2">
          <div class="loader-dots flex space-x-1">
            <div class="h-2 w-2 bg-[#432818] rounded-full animate-bounce"></div>
            <div class="h-2 w-2 bg-[#432818] rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            <div class="h-2 w-2 bg-[#432818] rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
          </div>
        </div>

        <div #guestContainer class="h-[70vh] overflow-y-auto pr-2 custom-scrollbar" (touchstart)="onTouchStart($event)" (touchmove)="onTouchMove($event)" (touchend)="onTouchEnd($event)">
          <ng-container *ngIf="guests()">
            <!-- No Guests Message -->
            <div *ngIf="guests().length === 0 && !error" class="bg-[#F7BE84]/50 rounded-full text-[#432818] text-center p-2">
              Belum ada tamu
            </div>

            <!-- Guest List -->
            <div *ngIf="guests().length > 0" class="grid grid-cols-1 gap-6">
              @for (guest of guests(); track guest.nama + guest.timestamp) {
                <div class="bg-white shadow-lg rounded-xl p-4 md:p-6" @fadeIn>
                  <div class="flex items-center justify-start mb-2">
                    <h3 class="text-md font-semibold text-gray-800 truncate">{{ guest.nama }}</h3>
                    <span class="ml-2">
                      <svg *ngIf="guest.kehadiran === 'Hadir'" class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <svg *ngIf="guest.kehadiran !== 'Hadir'" class="w-4 h-4 text-red-500" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </span>
                  </div>
                  <p class="text-gray-600 text-sm italic transition duration-300 ease-in-out transform hover:scale-105 hover:translate-x-2 text-wrap">"{{ guest.ucapan }}"</p>
                </div>
              }
            </div>
          </ng-container>

          <!-- Error Message -->
          <div *ngIf="error" class="text-red-500 text-center p-4">
            {{ error }}
            <button (click)="clearError()" class="ml-2 text-blue-500 underline">Coba Lagi</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(247, 100, 120, 0.8);
      border-radius: 7px;
    }

    .bg-card-2 {
      position: relative;
      background-image: 
      linear-gradient(rgba(241,239,228, 0.8), rgba(241,239,228, 0.8)),
      url('https://res.cloudinary.com/dxeyja0ob/image/upload/v1749561956/flower_169_2_bld4vt.png'),
      url('https://res.cloudinary.com/dxeyja0ob/image/upload/v1749559531/flower_2_oommzk.png');
      background-size: cover,cover;
      background-repeat: no-repeat;
      background-position: bottom , top ;
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
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class GuestListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('guestContainer') guestContainer!: ElementRef;
  
  private guestsSubject = new BehaviorSubject<Guest[]>([]);
  guests: Signal<Guest[]>;
  error: string | null = null;
  isLoading = false;
  isPulling = false;
  lastUpdateTime = new Date();
  private updateSubscription?: Subscription;
  private refreshSubject = new Subject<void>();
  private refreshSubscription?: Subscription;
  
  // Pull to refresh variables
  private touchStartY = 0;
  private readonly pullThreshold = 80; // pixels

  private readonly apiUrl = 'https://script.google.com/macros/s/AKfycbz3os2t3vE5Bdl8qmUt8j1FA8oK6pyYUXADfH5xp8ybyQxV6Ev3qJ5qQ3cBzBefCQBi/exec';

  constructor(
    private http: HttpClient,
    private applicationRef: ApplicationRef,
    private cdr: ChangeDetectorRef
  ) {
    this.guests = toSignal(this.guestsSubject.asObservable(), { initialValue: [] });
  }

  ngOnInit(): void {
    this.loadGuests();

    // Setup debounced refresh
    this.refreshSubscription = this.refreshSubject.pipe(
      debounceTime(300), // Prevent multiple rapid refreshes
    ).subscribe(() => this.loadGuests());

    this.applicationRef.isStable.pipe(first(isStable => isStable)).subscribe(() => {
      this.startAutoRefresh();
    });
  }

  ngAfterViewInit(): void {
    // Pastikan load ulang setelah view siap
    setTimeout(() => this.loadGuests(), 0);
  }

  ngOnDestroy(): void {
    this.updateSubscription?.unsubscribe();
    this.refreshSubscription?.unsubscribe();
  }

  refreshGuests(): void {
    if (this.isLoading) return; // Prevent multiple refreshes
    this.refreshSubject.next();
  }

  clearError(): void {
    this.error = null;
    this.loadGuests();
  }

  // Pull to refresh implementation
  onTouchStart(event: TouchEvent): void {
    this.touchStartY = event.touches[0].clientY;
  }

  onTouchMove(event: TouchEvent): void {
    if (this.isLoading) return;
    
    const container = this.guestContainer.nativeElement;
    if (container.scrollTop === 0) {
      const touchY = event.touches[0].clientY;
      const pullDistance = touchY - this.touchStartY;
      
      if (pullDistance > 0) {
        this.isPulling = pullDistance > 20;
        event.preventDefault();
      }
    }
  }

  onTouchEnd(event: TouchEvent): void {
    if (this.isPulling && !this.isLoading) {
      const touchY = event.changedTouches[0].clientY;
      const pullDistance = touchY - this.touchStartY;
      
      if (pullDistance > this.pullThreshold) {
        this.refreshGuests();
      }
      
      this.isPulling = false;
    }
  }

  private loadGuests(): void {
    if (this.isLoading) return; // Prevent concurrent requests
    
    this.isLoading = true;
    this.error = null;
    
    this.fetchGuests().pipe(
      retry(2), // Retry 2 times on failure
      tap(guests => {
        this.updateGuestList(guests);
        this.error = null;
        this.isLoading = false;
        this.lastUpdateTime = new Date();
        this.cdr.detectChanges();
      }),
      catchError(err => {
        console.error('Load guests error:', err);
        this.error = 'Gagal memuat data. Periksa koneksi internet Anda.';
        this.isLoading = false;
        this.cdr.detectChanges();
        return of([]);
      })
    ).subscribe();
  }

  private startAutoRefresh(): void {
    // Reduced interval to 15 seconds for more frequent updates
    this.updateSubscription = interval(15000).pipe(
      switchMap(() => {
        if (this.isLoading) return of([]); // Skip if already loading
        return this.fetchGuests().pipe(
          retry(1), // Retry once for auto refresh
          catchError(error => {
            console.error('Auto refresh error:', error);
            return of([]);
          })
        );
      })
    ).subscribe(guests => {
      if (guests.length >= 0) { // Allow empty arrays to update
        this.updateGuestList(guests);
        this.error = null;
        this.lastUpdateTime = new Date();
        this.cdr.detectChanges();
      }
    });
  }

  private fetchGuests(): Observable<Guest[]> {
    // Multiple cache-busting strategies
    const timestamp = Date.now();
    const randomParam = Math.random().toString(36).substring(7);
    const url = `${this.apiUrl}?t=${timestamp}&r=${randomParam}&_cb=${timestamp}`;
    
    // Headers to prevent caching
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    console.log('Fetching from URL:', url); // Debug log
    
    return this.http.get<{ data: Guest[] }>(url, { headers }).pipe(
      map(response => {
        console.log('API Response:', response); // Debug log
        return response.data || [];
      }),
      catchError(error => {
        console.error('API Error Details:', error);
        throw error;
      })
    );
  }

  private updateGuestList(newGuests: Guest[]): void {
    // Add unique timestamp to each guest for better tracking
    const guestsWithTimestamp = newGuests.map((guest, index) => ({ 
      ...guest, 
      timestamp: Date.now() + index // Ensure unique timestamps
    }));
    
    // Reverse to show newest first
    const reversedGuests = guestsWithTimestamp.reverse();
    
    console.log('Updating guest list with:', reversedGuests.length, 'guests'); // Debug log
    this.guestsSubject.next(reversedGuests);
  }
}