import { Component, OnInit, OnDestroy, ApplicationRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { interval, Subscription, BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, catchError, tap, first } from 'rxjs/operators';
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
          <h2 class="text-3xl font-semibold text-amber-900 mb-2 font-serif mb-8">Buat List Tamu Unduh Mantu</h2>
        </div>
        <form (ngSubmit)="submitForm()" class="max-w-6xl mx-auto bg-[#58010F] shadow-xl rounded-lg p-8 text-white text-center">
          <div class="relative mb-6">
            <label for="nama" class="block mb-2 text-sm font-medium text-white">Nama</label>
            <input type="text" id="nama" name="nama" [(ngModel)]="guest.nama" (input)="generateLink()" required placeholder="Monggo dipun isi..." class="w-full bg-white rounded border-gray-300 text-gray-700 py-2 px-3"/>
          </div>

          <div class="relative mb-6">
  <label class="flex mb-2 text-sm font-medium text-white">Preview Link</label>
  <textarea readonly class="w-full h-32 bg-white rounded border-gray-300 text-gray-700 py-2 px-3" 
    [value]="guest.link || 'Link akan muncul di sini...'"></textarea>
</div>
    
          <button type="submit" class="w-full font-semibold text-[#58010F] py-3 px-4 rounded-full bg-[#FEFBE8] hover:bg-[#FEFBE8]/40 transition duration-300">Kirim</button>
        </form>
      </div>
    </div>

    <!-- Guest List Section -->
    <div class="bg-[#F7BE84] bg-card-2 rounded-xl p-6 shadow-inner mx-auto">
    <div class="text-center mb-2">
          <h2 class="text-3xl font-semibold text-amber-900 mb-2 font-serif mb-8">List Tamu</h2>
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
        <div *ngIf="error" class="text-red-500 text-center p-4">{{ error }}</div>
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
      
      `
  ],
  animations: [
    trigger('fadeIn', [transition(':enter', [style({ opacity: 0, transform: 'translateY(-10px)' }), animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))])])
  ]
})
export class GuestManagementComponent2 implements OnInit, OnDestroy {
    guest: Guest = { nama: '', link: '' }; // hanya ada nama dan link
    private guestsSubject = new BehaviorSubject<Guest[]>([]);
    guests$: Observable<Guest[]> = this.guestsSubject.asObservable();
    error: string | null = null;
    private updateSubscription!: Subscription;
    private readonly SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzmX6wWFcHdbs__7JEPqt1Fr1kYPxMc2_QxBlmnwxGmvGjTKCv5UJNAy2BdJWXF_JS65A/exec';
  
    isModalOpen = false;
    modalTitle = '';
    modalMessage = '';
  
    @Output() formSubmitted = new EventEmitter<void>();
  
    constructor(private http: HttpClient, private applicationRef: ApplicationRef) {}
// asdsd

copyToClipboard(nama: string, link: string) {
    const message = `
Assalamu'alaikum Warahmatullahi Wabarakatuh.
Bismillahirrahmanirrahim.
Kepada Yth.
Bapak/Ibu/Saudara/i
${nama}

Dengan penuh hormat, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:
Anis & Mantep
  
Informasi lengkap mengenai acara dapat dilihat melalui tautan berikut:
${link}
  
Kami sangat berbahagia apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
Mohon maaf undangan ini hanya disampaikan melalui pesan ini. Terima kasih banyak atas perhatian dan kesediaannya.
  
Wassalamu'alaikum Warahmatullahi Wabarakatuh.
Terima kasih.`;
  
    // Gunakan clipboard API untuk menyalin teks ke clipboard
    navigator.clipboard.writeText(message).then(
      () => {
        console.log('Teks undangan berhasil disalin ke clipboard!');
        alert('Link undangan berhasil disalin ke clipboard!');
      },
      (err) => {
        console.error('Gagal menyalin teks ke clipboard: ', err);
      }
    );
  }

      showToast = false;
      toastMessage = '';
      toastBackground = '';
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
      // Check for application stability before starting the interval
      this.applicationRef.isStable.pipe(first(isStable => isStable)).subscribe(() => {
        this.startAutoRefresh();
      });
    }
  
    ngOnDestroy() {
      if (this.updateSubscription) {
        this.updateSubscription.unsubscribe();
      }
    }
  
    private loadGuests() {
      this.http.get<{ data: Guest[] }>(this.SCRIPT_URL).pipe(
        tap(response => this.updateGuestList(response.data)),
        catchError(this.handleError.bind(this))
      ).subscribe();
    }
  
    private startAutoRefresh() {
      this.updateSubscription = interval(1000).pipe(
        switchMap(() => this.http.get<{ data: Guest[] }>(this.SCRIPT_URL).pipe(
          catchError(error => {
            console.error('Error refreshing guests:', error);
            return of(null);
          })
        ))
      ).subscribe(response => {
        if (response) {
          this.updateGuestList(response.data);
          this.error = null;
        }
      });
    }
  
    private updateGuestList(newGuests: Guest[]) {
      const currentGuests = this.guestsSubject.getValue();
      const updatedGuests = this.mergeGuestLists(currentGuests, newGuests);
      this.guestsSubject.next(updatedGuests);
    }
  
    private mergeGuestLists(currentGuests: Guest[], newGuests: Guest[]): Guest[] {
      const mergedGuests = [...currentGuests];
      
      newGuests.forEach(newGuest => {
        const existingIndex = mergedGuests.findIndex(g => g.nama === newGuest.nama);
        if (existingIndex === -1) {
          mergedGuests.unshift({ ...newGuest });
        } else {
          mergedGuests[existingIndex] = { ...newGuest };
        }
      });
  
      return mergedGuests;
    }
  
    submitForm() {
        if (!this.isFormValid()) {
          this.showModal('Error', 'Data tamu tidak lengkap. Pastikan untuk mengisi semua kolom.');
          return;
        }
    
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
        });
        this.loadGuests();
      }
  
    private isFormValid(): boolean {
      return !!this.guest.nama; // hanya memeriksa nama
    }
  
    private handleSuccess() {
      const message = `Terima kasih, ${this.guest.nama}. Data Anda telah terkirim.`;
      this.showModal('Sukses', message);
      this.resetForm();
      this.formSubmitted.emit();
    }
  
    private handleError(error: HttpErrorResponse) {
      this.error = 'Data tidak dapat diambil. Cek koneksi Anda kembali.';
      return of(null);
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
      this.guest = { nama: '', link: '' }; // reset hanya untuk nama dan link
    }
  
    trackByName(index: number, guest: Guest): string {
      return guest.nama;
    }
}
