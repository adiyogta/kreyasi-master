import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wedding-gift',
  standalone: true,
  imports: [CommonModule],
  template:`
  <!-- Previous code remains the same until the address section -->
  <div class="flex items-center justify-center p-4">
    <div class="bg-card-2 bg-[#ede0d4] rounded-lg shadow-lg p-4 sm:p-6 mx-auto container">
      <!-- Previous header content remains the same -->
      <div class="bg-[#FEFBE8] bg-opacity-80 p-3 mb-2">
        <h1 class="text-center text-xl sm:text-2xl md:text-3xl font-bold text-[#432818] mb-4">Wedding Gift</h1>
        <p class="text-center text-[#432818] mb-6 text-sm sm:text-base px-2 sm:px-4 md:px-8">
          Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.
        </p>
      </div>

      <button 
        (click)="toggleBankCards()"
        class="bg-[#432818] text-[#fefae1] px-8 py-3 rounded-full hover:bg-opacity-90 transition duration-300 flex items-center justify-center mx-auto text-sm sm:text-base"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4 sm:h-5 sm:w-5 mr-2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
        </svg>
        Klik Disini
      </button>
      
      <div *ngIf="showBankCards" class="flex flex-col gap-4 mt-4 items-center justify-center">
        <!-- Bank Cards Section -->
     
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
  <!-- Kartu 1 -->
  <div class="atm-card relative shadow-lg bg-white text-black p-3 sm:p-4 rounded-lg">
    <img src="https://upload.wikimedia.org/wikipedia/commons/9/97/Logo_BRI.png" alt="BRI Logo" class="absolute top-2 right-2 h-6 sm:top-4 sm:right-4 sm:h-8">
    <div class="chip bg-amber-500 h-4 w-6 sm:h-6 sm:w-8 rounded-sm mb-2 sm:mb-4"></div>
    <p class="font-semibold text-sm sm:text-lg mt-2 mb-1 sm:mb-2">Mantep Supriyanto</p>
    <div class="flex justify-between items-center tracking-widest mb-2 sm:mb-4">
      <span class="font-mono text-xs sm:text-base">7265 0100 3739 500</span>
      <button 
        onclick="navigator.clipboard.writeText('726501003739500')"
        class="bg-white hover:bg-gray-300 font-bold text-blue-500 px-2 py-1 rounded text-xs sm:text-sm"
      >
        Copy
      </button>
    </div>
  </div>

  <!-- Kartu 2 -->
  <div class="atm-card relative shadow-lg bg-white text-black p-3 sm:p-4 rounded-lg">
    <img src="https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg" alt="BRI Logo" class="absolute top-2 right-2 h-6 sm:top-4 sm:right-4 sm:h-8">
    <div class="chip bg-amber-500 h-4 w-6 sm:h-6 sm:w-8 rounded-sm mb-2 sm:mb-4"></div>
    <p class="font-semibold text-sm sm:text-lg mt-2 mb-1 sm:mb-2">Anis Setia Ningsi</p>
    <div class="flex justify-between items-center tracking-widest mb-2 sm:mb-4">
      <span class="font-mono text-xs sm:text-base">0858 3841 1861</span>
      <button 
        onclick="navigator.clipboard.writeText('085838411861')"
        class="bg-white hover:bg-gray-300 font-bold text-blue-500 px-2 py-1 rounded text-xs sm:text-sm"
      >
        Copy
      </button>
    </div>
  </div>
</div>

 

        <!-- Address Section -->
        <div class="max-w-xl bg-white bg-card-2 rounded-lg shadow-lg p-4 sm:p-6">
          <div class="flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#432818" class="w-6 h-6 mr-2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            <h2 class="text-[#432818] font-semibold text-lg">Alamat Pengiriman Hadiah</h2>
          </div>
          <div class="text-center text-[#432818] text-sm sm:text-base relative">
            <p class="font-semibold mb-2">Anis & Mantep</p>
            <p class="leading-relaxed mb-4">
              Jl. RA Kartini Nlok, Dsn. Tanjung Mukti,<br>
              Rt/Rw 014/004, Desa Tanjung Jaya,<br>
              Kec. Palas, Kab. Lampung Selatan.
            </p>
            <button 
              (click)="copyToClipboard('Anis & Mantep\nJl. RA Kartini Nlok, Dsn. Tanjung Mukti,\nRt/Rw 014/004, Desa Tanjung Jaya,\nKec. Palas, Kab. Lampung Selatan', 'alamat')"
              class="bg-[#432818] text-white hover:bg-opacity-90 font-bold px-4 py-2 rounded-full text-sm sm:text-base flex items-center justify-center mx-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
              </svg>
              Salin Alamat
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div *ngIf="showToast" class="fixed top-1/2 transform -translate-y-1/2 left-1/2 transform -translate-x-1/2 items-center bg-opacity-80 justify-center text-center p-3 text-white rounded shadow-lg text-sm sm:text-base" [ngClass]="toastBackground">
      {{ toastMessage }}
    </div>
  </div>

  @if (showQRModal) {
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div class="bg-white rounded-lg p-6 max-w-sm w-full">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Kode QR</h2>
          <button (click)="closeQRModal()" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="w-full aspect-square qris-bg"></div>
        <p class="mt-4 text-center text-sm text-gray-600">Terima Kasih</p>
      </div>
    </div>
  }
  `,
  styles: [`
    /* Previous styles remain the same */
    .atm-card {
      aspect-ratio: 89 / 51;
      width: 100%;
      max-width: 280px;
      margin: 0 auto;
      background: linear-gradient(135deg, #f0f0f0 25%, #ffffff 75%);
      position: relative;
    }

    .atm-card .chip {
      background-color: #d4af37;
    }

    .atm-card button {
      white-space: nowrap;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .atm-card img {
      position: absolute;
      top: 1rem;
      right: 1rem;
    }
    
    @media (min-width: 640px) {
      .atm-card {
        max-width: 100%;
      }
    }
    
    @media (min-width: 768px) {
      .atm-card {
        max-width: 360px;
      }
    }

    .bg-card-2 {
      position: relative;
      background-image: 
      linear-gradient(rgba(241,239,228, 0.8), rgba(241,239,228, 0.8)),
      url('https://res.cloudinary.com/dvqq3izfb/image/upload/v1728484658/bg2_a3hvpt.png'),
      url('https://res.cloudinary.com/dvqq3izfb/image/upload/v1728484659/bg1_bcuaos.png');
      background-position: center;
      image-rendering: optimizeQuality;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center, center;
      opacity: 1;
    }
  `]
})
export class WeddingGiftComponent {
  showBankCards = false;
  showToast = false;
  toastMessage = '';
  toastBackground = '';
  showQRModal: boolean = false;

  openQRModal() {
    this.showQRModal = true;
  }

  closeQRModal() {
    this.showQRModal = false;
  }

  toggleBankCards() {
    this.showBankCards = !this.showBankCards;
  }

  copyToClipboard(text: string, type: 'rekening' | 'alamat') {
    navigator.clipboard.writeText(text).then(
      () => {
        const message = type === 'rekening' 
          ? 'Nomor rekening berhasil disalin, Terima Kasih'
          : 'Alamat berhasil disalin, Terima Kasih';
        this.showToastMessage(message, 'success');
      },
      (err) => {
        const message = type === 'rekening'
          ? 'Gagal menyalin nomor rekening'
          : 'Gagal menyalin alamat';
        this.showToastMessage(message, 'error');
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
}