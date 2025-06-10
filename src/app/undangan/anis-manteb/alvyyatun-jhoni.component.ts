import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-alvyyatun-jhoni',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template:`<div *ngIf="showModalPage" class="fixed min-w-screen inset-0 z-50 items-center justify-center bg-black/50">
<div  class="min-h-screen bg-img bg-[#58010F] flex items-center justify-center p-6 md:p-8">
      <!-- Mobile Design -->
      <div class="md:hidden max-w-md w-full bg-[#FEFBE8] outline outline-offset-4 outline-1 outline-[#F7BE84] rounded-t-full shadow-xl overflow-hidden">
        <div class="relative">
          <!-- Konten utama -->
          <div class="relative text-center pt-14 px-4 pb-28"> <!-- Increased bottom padding -->
            <div class="flex justify-center">
              <div 
                class="w-40 h-40 bg-no-repeat bg-cover bg-center rounded-t-full border-4 border-[#58010F]/20"
                style="background-image: url('https://res.cloudinary.com/dxeyja0ob/image/upload/v1728308217/1727480481052_-_Alvyyatun_Fauziah_pq9mwu.jpg')"
              ></div>
            </div>

            <h1 class="text-xl font-serif text-Amber-800 mt-2 mb-2">THE WEDDING OF</h1>
            <h2 class="text-3xl font-script text-Amber-800 mb-0">Anis</h2>
            <h2 class="text-2xl font-script text-Amber-800 mb-0">&</h2>
            <h2 class="text-3xl font-script text-Amber-800 mb-2">Mantep</h2>

            <div class="text-gray-700 mb-4">
              <p class="mb-2">Kepada Yth.</p>
              <p class="mb-2">Bapak/Ibu/Saudara/i</p>
              <p>{{guestName}}</p>
            </div>

            <!-- Button wrapper for better positioning -->
            <div class="relative z-20 mt-2">
            <button (click)="closeModal2()" 
                    class="bg-Amber-800 text-white px-4 py-2 rounded-full hover:bg-Amber-900 transition-colors duration-300 
                           shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0">
              Open Invitation
            </button>
         
        </div>
          </div>

          <!-- Frame bawah -->
          <div class="absolute bottom-0 left-0 right-0 flex justify-between pointer-events-none z-10">
            <div class="w-20 h-20 bg-contain bg-no-repeat rotate-[270deg]" style="background-image: url('https://res.cloudinary.com/dvqq3izfb/image/upload/v1728056730/frame_1_id5zr5.png')"></div>
            <div class="w-20 h-20 bg-contain bg-no-repeat rotate-180" style="background-image: url('https://res.cloudinary.com/dvqq3izfb/image/upload/v1728056730/frame_1_id5zr5.png')"></div>
          </div>
        </div>
      </div>

      <!-- Desktop Design -->
      <div class="hidden md:block max-w-6xl w-full">
        <div class="grid grid-cols-12 gap-4 bg-[#FEFBE8] rounded-xl shadow-2xl overflow-hidden outline outline-offset-8 outline-2 outline-[#F7BE84]">
          <!-- Left Section -->
          <div class="col-span-7 p-12 relative flex items-center">
            <!-- Frame Ornaments -->
            <div class="absolute top-0 left-0 w-32 h-32 bg-contain bg-no-repeat pointer-events-none" 
                 style="background-image: url('https://res.cloudinary.com/dvqq3izfb/image/upload/v1728056730/frame_1_id5zr5.png')">
            </div>
            <div class="absolute bottom-0 left-0 w-32 h-32 bg-contain bg-no-repeat rotate-[270deg] pointer-events-none" 
                 style="background-image: url('https://res.cloudinary.com/dvqq3izfb/image/upload/v1728056730/frame_1_id5zr5.png')">
            </div>
            
            <!-- Profile Image -->
            <div class="w-full flex justify-center items-center">
              <div 
                class="w-80 h-80 bg-no-repeat bg-cover bg-center rounded-full"
                style="background-image: url('https://res.cloudinary.com/dxeyja0ob/image/upload/v1728308217/1727480481052_-_Alvyyatun_Fauziah_pq9mwu.jpg')"
              ></div>
            </div>
          </div>

          <!-- Right Content Section -->
          <div class="col-span-5 p-12 flex flex-col justify-center relative">
            <!-- Frame Ornaments -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-contain bg-no-repeat rotate-90 pointer-events-none" 
                 style="background-image: url('https://res.cloudinary.com/dvqq3izfb/image/upload/v1728056730/frame_1_id5zr5.png')">
            </div>
            <div class="absolute bottom-0 right-0 w-32 h-32 bg-contain bg-no-repeat rotate-180 pointer-events-none" 
                 style="background-image: url('https://res.cloudinary.com/dvqq3izfb/image/upload/v1728056730/frame_1_id5zr5.png')">
            </div>

            <!-- Content -->
            <div class="max-w-xl mx-auto text-center relative z-20"> <!-- Added z-index -->
              <h1 class="text-3xl font-serif text-Amber-800 mb-4">THE WEDDING OF</h1>
              
              <h2 class="text-6xl font-script text-Amber-800 mb-0">Anis</h2>
              <h2 class="text-4xl font-script text-Amber-800 mb-0">&</h2>
              <h2 class="text-6xl font-script text-Amber-800 mb-4">Mantep</h2>
              
              <div class="my-8 p-8 border-t border-b border-[#F7BE84]">
                <p class="text-2xl text-gray-700 mb-4">Kepada Yth.</p>
                <p class="text-xl text-gray-700 mb-4">Bapak/Ibu/Saudara/i</p>
                <p class="text-3xl font-script text-Amber-800">{{guestName}}</p>
              </div>

              <div class="relative z-30"> <!-- Button wrapper with higher z-index -->
                <button (click)="closeModal2()"
                        class="bg-Amber-800 text-white px-12 py-4 text-xl rounded-full hover:bg-Amber-900 transition-colors duration-300 
                               shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0">
                  Open Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
`,
  styles:`
  .bg-cream-50 { 
      background-color: #FDFBF7;
      background-image: radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0);
      background-size: 40px 40px;
    }
    .font-script { font-family: 'Great Vibes', cursive; }
    .text-brown-800 { color: #5D4037; }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    :host {
      display: block;
      animation: fadeIn 1s ease-out;
    }

    /* Custom scroll reveal animations */
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-50px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(50px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .grid > div:first-child {
      animation: slideInLeft 1s ease-out;
    }

    .grid > div:last-child {
      animation: slideInRight 1s ease-out;
    }

    .bg-img {
      background-image: url('https://res.cloudinary.com/dvqq3izfb/image/upload/v1728310350/batik_h7ewt3.png');
      background-size: cover;
      background-blend-mode: soft-light;
      background-position: center;
    }

    /* Ensure button is always clickable */
    button {
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }
  `
})
export class AlvyyatunJhoniComponent implements OnInit {
  guestName: string | null = "Nama Tamu";
  isPlaying = true;
  isOlderIphone = false;

  

  constructor(private readonly route: ActivatedRoute,private readonly router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  showModalPage: boolean = false;
  musicStatus() {
    localStorage.setItem('shouldPlayMusic', this.isPlaying ? 'true' : 'false');
  }
  closeModal2(): void {
    this.musicStatus();
    this.isPlaying = true;
    this.showModalPage = false;
    
  }
  ngOnInit() {
    this.guestName = this.route.snapshot.paramMap.get('guestName');
    if (isPlatformBrowser(this.platformId)) {
      this.detectDevice();
    }
    this.showModalPage = true;
  }

  detectDevice() {
    const userAgent = navigator.userAgent;
    const olderIphoneRegEx = /iPhone OS (7|8|9|10|11|12|13)_/i;
    this.isOlderIphone = olderIphoneRegEx.test(userAgent);
  }

  openInvitation() {
    this.musicStatus();
    if (this.isOlderIphone) {
      // For older iPhones, use window.location.href
      window.location.href = `https://jhonialvyyatun.kreyasi.my.id/${this.guestName}/main`;
    } else {
      // For newer devices, use Angular routing
      if (this.guestName) {
        this.router.navigate([`/${this.guestName}/main`]);
      } else {
        // Handle the case where guestName is null
        console.error('Guest name is null');
        // You might want to navigate to a default page or show an error message
        this.router.navigate(['/Nama Tamu']);
      }
    }
  }
}

