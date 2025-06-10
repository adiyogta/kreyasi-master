import { Component, HostListener, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { signal } from '@angular/core';

@Component({
  selector: 'app-floating-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Toggle Button -->
    <button 
      (click)="toggleNav()"
      class="fixed bottom-3 left-0 z-50 p-1 pr-2 rounded-r-full shadow-lg transition-all duration-300 text-white items-center justify-center"
      [class.bg-[#58010F]]="!isNavVisible()"
      [class.bg-[#F7BE84]]="isNavVisible()"
    >
      <i [class]="isNavVisible() ? 'fas fa-times' : 'fas fa-bars'"></i>
    </button>

    <!-- Navigation Container -->
    <div 
      [class]="getContainerClass()"
      [class.translate-y-24]="!isNavVisible()"
      [class.translate-y-0]="isNavVisible()"
    >
      <div class="container mx-auto">
        <div class="flex justify-center items-center gap-2">
          <button 
            *ngFor="let section of sections" 
            (click)="scrollToSection(section.id)"
            [class]="getButtonClass(section.id)"
            [title]="section.title">
            <i [class]="section.icon"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .nav-container {
      @apply fixed z-40 transition-all duration-300 left-0 right-0;
    }

    .nav-container.at-footer {
      @apply bottom-12;
    }

    .nav-container.normal {
      @apply bottom-2;
    }

    .floating-btn {
      @apply p-3 rounded-xl shadow-lg transition-all duration-300 text-white;
      background-color: rgba(88, 1, 15, 0.7);
      min-width: 32px;
      aspect-ratio: 1/1;
    }
    
    .floating-btn:hover {
      @apply transform scale-75;
      background-color: #F7BE84;
    }
    
    .floating-btn.active {
      background-color: #F7BE84;
      @apply transform scale-75;
    }

    .floating-btn i {
      @apply text-lg;
    }
  `]
})
export class FloatingNavComponent implements OnInit {
  sections = [
    { id: 'home', icon: 'fas fa-home', title: 'Beranda' },
    { id: 'couple', icon: 'fas fa-heart', title: 'Mempelai' },
    { id: 'date', icon: 'fas fa-calendar-alt', title: 'Tanggal' },
    { id: 'gallery', icon: 'fas fa-images', title: 'Galeri' },
    { id: 'story', icon: 'fas fa-book-open', title: 'Story' },
    { id: 'gift', icon: 'fas fa-gift', title: 'Gift' }
  ];
  
  activeSection: string = 'home';
  private sectionElements: { id: string, element: Element }[] = [];
  isAtFooter: boolean = false;
  isNavVisible = signal<boolean>(true);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      // Load visibility state from localStorage
      const savedVisibility = localStorage.getItem('floatingNavVisible');
      this.isNavVisible.set(savedVisibility === null ? true : savedVisibility === 'true');

      setTimeout(() => {
        this.initializeSectionElements();
        this.checkActiveSection();
      }, 1000);
    }
  }

  toggleNav() {
    if (!this.isBrowser) return;
    
    const newValue = !this.isNavVisible();
    this.isNavVisible.set(newValue);
    localStorage.setItem('floatingNavVisible', newValue.toString());
  }

  private initializeSectionElements() {
    if (!this.isBrowser) return;

    const sections = document.getElementsByTagName('section');
    this.sectionElements = [];
    
    const sectionMapping = [
      { index: 0, id: 'home' },
      { index: 2, id: 'couple' },
      { index: 3, id: 'date' },
      { index: 4, id: 'gallery' },
      { index: 5, id: 'story' },
      { index: 7, id: 'gift' }
    ];

    sectionMapping.forEach(({ index, id }) => {
      if (sections[index]) {
        this.sectionElements.push({
          id,
          element: sections[index]
        });
      }
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (!this.isBrowser) return;

    this.checkActiveSection();
    this.checkFooterPosition();
  }

  getContainerClass(): string {
    return `nav-container ${this.isAtFooter ? 'at-footer' : 'normal'}`;
  }

  getButtonClass(sectionId: string): string {
    return `floating-btn ${this.activeSection === sectionId ? 'active' : ''}`;
  }

  private checkFooterPosition() {
    if (!this.isBrowser) return;

    const footer = document.querySelector('section:last-of-type');
    if (footer) {
      const footerRect = footer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      this.isAtFooter = footerRect.top < viewportHeight;
    }
  }

  scrollToSection(id: string) {
    if (!this.isBrowser) return;

    const sectionElement = this.sectionElements.find(s => s.id === id)?.element;
    if (sectionElement) {
      const yOffset = -80;
      const y = sectionElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  private checkActiveSection() {
    if (!this.isBrowser) return;

    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    
    for (const { id, element } of this.sectionElements) {
      const sectionTop = element.getBoundingClientRect().top + window.pageYOffset;
      const sectionHeight = element.getBoundingClientRect().height;
      
      if (
        scrollPosition >= sectionTop - windowHeight / 3 &&
        scrollPosition < sectionTop + sectionHeight - windowHeight / 3
      ) {
        this.activeSection = id;
        break;
      }
    }
  }
}