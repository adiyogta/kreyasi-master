import { Component, OnInit, OnDestroy, PLATFORM_ID, inject, ViewChildren, QueryList, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { signal } from '@angular/core';
import { WeddingGiftComponent } from "./wedding-gift.component";
import { GuestFormComponent } from "./guest-form.component";
import { GuestListComponent } from "./guest-list.component";
import { BackgroundMusicComponent } from "./bgm.component";
import { FloatingNavComponent } from "./floating-nav.component";
import { ActivatedRoute } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';


interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-alvyyatun-main',
  standalone: true,
  imports: [CommonModule, WeddingGiftComponent, GuestFormComponent, GuestListComponent, BackgroundMusicComponent, FloatingNavComponent],
  templateUrl: './alvyyatun-main.component.html',
  styleUrl: './alvyyatun-main.component.css',
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate(300, style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate(300, style({ opacity: 0 })),
      ])
    ])
  ]
})
export class AlvyyatunMainComponent implements OnInit, OnDestroy{
  private platformId = inject(PLATFORM_ID);
  private intervalId: number | null = null;
  private readonly targetDate = new Date('2025-06-20T08:00:00+07:00'); // Sesuai dengan tanggal akad
  guestName: string | null = "Nama Tamu";
  isPlaying = true;
  isOlderIphone = false;
  // animasi
  // animasi
  animations = ['fadeInUp', 'fadeInLeft', 'fadeInRight', 'zoomIn', 'bounceIn'];

  @ViewChildren('animatedItem') animatedItems!: QueryList<ElementRef>;
  constructor(private renderer: Renderer2,private readonly route: ActivatedRoute) {}

  ngAfterViewInit() {
    this.calculateTimeLeft();
    this.initScrollAnimation();
    if (isPlatformBrowser(this.platformId)) {
      // Update timer every second
      this.intervalId = window.setInterval(() => {
        this.calculateTimeLeft();
      }, 1000);
    }
    // if (isPlatformBrowser(this.platformId)) {
    //   this.initScrollAnimation();
    // }
  }

  private initScrollAnimation() {
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, index) => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
              this.renderer.setStyle(entry.target, 'opacity', '1');
              this.renderer.addClass(entry.target, 'animate');
              this.renderer.addClass(entry.target, this.animations[index % this.animations.length]);
              this.renderer.addClass(entry.target, 'animated'); // Menandai bahwa elemen telah dianimasikan
              
              // Hapus kelas animasi setelah animasi selesai
              setTimeout(() => {
                this.renderer.removeClass(entry.target, 'animate');
                this.animations.forEach(anim => this.renderer.removeClass(entry.target, anim));
              }, 6000); // Sesuaikan dengan durasi animasi terlama
            }
          });
        },
        { threshold: 0.25 }
      );

      this.animatedItems.forEach(item => observer.observe(item.nativeElement));
    }
  }
  // animasi

  shouldLastImageSpan(): boolean {
    // For 4 columns grid
    // If the total number of images when divided by 4 leaves a remainder of 1,
    // the last image should span 2 columns to fill the empty space
    return this.photos.length % 4 === 1;
  }

  timeLeft = signal<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  ngOnInit() {
    this.guestName = this.route.snapshot.paramMap.get('guestName');
    // if (isPlatformBrowser(this.platformId)) {
    //   this.calculateTimeLeft();
    //   this.intervalId = window.setInterval(() => {
    //     this.calculateTimeLeft();
    //   }, 1000);
    // }
    this.calculateTimeLeft();
    this.showModalPage = true;
  }

  ngOnDestroy() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
  }

  private calculateTimeLeft(): void {
    const now = new Date().getTime();
    const distance = this.targetDate.getTime() - now;

    if (distance < 0) {
      this.timeLeft.set({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      });
      if (this.intervalId !== null) {
        clearInterval(this.intervalId);
      }
      return;
    }

    this.timeLeft.set({
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    });
  }
  // ----galeri----

  photos: Array<{url: string, thumbnail: string, title: string, alt: string}> = [
    { 
      "url": "https://res.cloudinary.com/dxeyja0ob/image/upload/v1749533809/IMG_8149_-_Anis_Setianingsih_uhbp3b.jpg", 
      "thumbnail": "https://res.cloudinary.com/dxeyja0ob/image/upload/w_450,c_scale/v1749533809/IMG_8149_-_Anis_Setianingsih_uhbp3b.jpg",
      "title": "Photo 1", 
      "alt": "kreyasi bikin undangan pernikahan template membuat video online digital murah cepat WA link"
    },
    { 
      "url": "https://res.cloudinary.com/dxeyja0ob/image/upload/v1749533809/IMG_8145_-_Anis_Setianingsih_zbbxvd.jpg", 
      "thumbnail": "https://res.cloudinary.com/dxeyja0ob/image/upload/w_450,c_scale/v1749533809/IMG_8145_-_Anis_Setianingsih_zbbxvd.jpg",
      "title": "Photo 2", 
      "alt": "kreyasi bikin undangan pernikahan template membuat video online digital murah cepat WA link"
    },
    { 
      "url": "https://res.cloudinary.com/dxeyja0ob/image/upload/v1749533809/IMG_8155_-_Anis_Setianingsih_rlqccq.jpg", 
      "thumbnail": "https://res.cloudinary.com/dxeyja0ob/image/upload/w_450,c_scale/v1749533809/IMG_8155_-_Anis_Setianingsih_rlqccq.jpg",
      "title": "Photo 3", 
      "alt": "kreyasi bikin undangan pernikahan template membuat video online digital murah cepat WA link"
    },
    { 
      "url": "https://res.cloudinary.com/dxeyja0ob/image/upload/v1749533809/IMG_8147_-_Anis_Setianingsih_nditgf.jpg", 
      "thumbnail": "https://res.cloudinary.com/dxeyja0ob/image/upload/w_450,c_scale/v1749533809/IMG_8147_-_Anis_Setianingsih_nditgf.jpg",
      "title": "Photo 4", 
      "alt": "kreyasi bikin undangan pernikahan template membuat video online digital murah cepat WA link"
    },
    { 
      "url": "https://res.cloudinary.com/dxeyja0ob/image/upload/v1749533809/IMG_8162_-_Anis_Setianingsih_axubej.jpg", 
      "thumbnail": "https://res.cloudinary.com/dxeyja0ob/image/upload/w_450,c_scale/v1749533809/IMG_8162_-_Anis_Setianingsih_axubej.jpg",
      "title": "Photo 5", 
      "alt": "kreyasi bikin undangan pernikahan template membuat video online digital murah cepat WA link"
    },
    { 
      "url": "https://res.cloudinary.com/dxeyja0ob/image/upload/v1749533809/IMG_8154_-_Anis_Setianingsih_wyaxut.jpg", 
      "thumbnail": "https://res.cloudinary.com/dxeyja0ob/image/upload/w_450,c_scale/v1749533809/IMG_8154_-_Anis_Setianingsih_wyaxut.jpg",
      "title": "Photo 6", 
      "alt": "kreyasi bikin undangan pernikahan template membuat video online digital murah cepat WA link"
    },
    { 
      "url": "https://res.cloudinary.com/dxeyja0ob/image/upload/v1749533810/IMG_8161_-_Anis_Setianingsih_bgatrl.jpg", 
      "thumbnail": "https://res.cloudinary.com/dxeyja0ob/image/upload/w_450,c_scale/v1749533810/IMG_8161_-_Anis_Setianingsih_bgatrl.jpg",
      "title": "Photo 7", 
      "alt": "kreyasi bikin undangan pernikahan template membuat video online digital murah cepat WA link"
    },
    { 
      "url": "https://res.cloudinary.com/dxeyja0ob/image/upload/v1749533811/IMG-20250427-WA0010_-_Anis_Setianingsih_u8ypki.jpg", 
      "thumbnail": "https://res.cloudinary.com/dxeyja0ob/image/upload/w_450,c_scale/v1749533811/IMG-20250427-WA0010_-_Anis_Setianingsih_u8ypki.jpg",
      "title": "Photo 8", 
      "alt": "kreyasi bikin undangan pernikahan template membuat video online digital murah cepat WA link"
    },
    { 
      "url": "https://res.cloudinary.com/dxeyja0ob/image/upload/v1749533810/IMG_8169_-_Anis_Setianingsih_jozy8h.jpg", 
      "thumbnail": "https://res.cloudinary.com/dxeyja0ob/image/upload/w_450,c_scale/v1749533810/IMG_8169_-_Anis_Setianingsih_jozy8h.jpg",
      "title": "Photo 9", 
      "alt": "kreyasi bikin undangan pernikahan template membuat video online digital murah cepat WA link"
    },
    { 
      "url": "https://res.cloudinary.com/dxeyja0ob/image/upload/v1749533811/IMG_9703_-_Anis_Setianingsih_ereffd.jpg", 
      "thumbnail": "https://res.cloudinary.com/dxeyja0ob/image/upload/w_450,c_scale/v1749533811/IMG_9703_-_Anis_Setianingsih_ereffd.jpg",
      "title": "Photo 10", 
      "alt": "kreyasi bikin undangan pernikahan template membuat video online digital murah cepat WA link"
    },
    { 
      "url": "https://res.cloudinary.com/dxeyja0ob/image/upload/v1749533810/IMG_9692_-_Anis_Setianingsih_n6lopr.jpg", 
      "thumbnail": "https://res.cloudinary.com/dxeyja0ob/image/upload/w_450,c_scale/v1749533810/IMG_9692_-_Anis_Setianingsih_n6lopr.jpg",
      "title": "Photo 11", 
      "alt": "kreyasi bikin undangan pernikahan template membuat video online digital murah cepat WA link"
    },
    { 
      "url": "https://res.cloudinary.com/dxeyja0ob/image/upload/v1749533810/IMG_9700_-_Anis_Setianingsih_pg9i0x.jpg", 
      "thumbnail": "https://res.cloudinary.com/dxeyja0ob/image/upload/w_450,c_scale/v1749533810/IMG_9700_-_Anis_Setianingsih_pg9i0x.jpg",
      "title": "Photo 12", 
      "alt": "kreyasi bikin undangan pernikahan template membuat video online digital murah cepat WA link"
    },
    { 
      "url": "https://res.cloudinary.com/dxeyja0ob/image/upload/v1749533810/IMG_9706_-_Anis_Setianingsih_g9kdwo.jpg", 
      "thumbnail": "https://res.cloudinary.com/dxeyja0ob/image/upload/w_450,c_scale/v1749533810/IMG_9706_-_Anis_Setianingsih_g9kdwo.jpg",
      "title": "Photo 13", 
      "alt": "kreyasi bikin undangan pernikahan template membuat video online digital murah cepat WA link"
    },
    { 
      "url": "https://res.cloudinary.com/dxeyja0ob/image/upload/v1749533811/IMG_9720_-_Anis_Setianingsih_uuufay.jpg", 
      "thumbnail": "https://res.cloudinary.com/dxeyja0ob/image/upload/w_450,c_scale/v1749533811/IMG_9720_-_Anis_Setianingsih_uuufay.jpg",
      "title": "Photo 14", 
      "alt": "kreyasi bikin undangan pernikahan template membuat video online digital murah cepat WA link"
    }
  ]
  ;

  showModalPage: boolean = false;

  closeModal2(): void {
    this.showModalPage = false;
  }

  showModal = false;
  currentIndex = 0;

  openModal(index: number) {
    this.currentIndex = index;
    this.showModal = true;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeModal() {
    this.showModal = false;
    document.body.style.overflow = ''; // Restore scrolling
  }

  prevPhoto() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  nextPhoto() {
    if (this.currentIndex < this.photos.length - 1) {
      this.currentIndex++;
    }
  }

  private handleKeydown(event: KeyboardEvent) {
    if (!this.showModal) return;
    
    switch (event.key) {
      case 'ArrowLeft':
        this.prevPhoto();
        break;
      case 'ArrowRight':
        this.nextPhoto();
        break;
      case 'Escape':
        this.closeModal();
        break;
    }
  }

  onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.classList.remove('img-loading');
    img.classList.add('img-loaded');
    
    // Cari elemen skeleton loader terdekat dan sembunyikan
    const parent = img.parentElement;
    if (parent) {
      const skeletonLoader = parent.querySelector('.skeleton-loader');
      if (skeletonLoader) {
        (skeletonLoader as HTMLElement).style.display = 'none';
      }
    }
  }
}
