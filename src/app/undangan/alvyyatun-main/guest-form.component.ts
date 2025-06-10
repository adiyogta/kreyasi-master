import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Guest {
  nama: string;
  ucapan: string;
  kehadiran: string;
}

@Component({
  selector: 'app-guest-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template:`
 <div class="bg-[#FEFBE8] bg-card-2 py-6 px-2 md:px-4 rounded-xl">
      <div class="max-w-md mx-auto">
        <!-- Header Decoration -->
        <div class="text-center mb-2">
          <div class="text-brown-600 mb-2">❈❈❈</div>
          <h2 class="text-3xl font-semibold bg-[#FEFBE8]/60 p-2 rounded-lg text-amber-900 mb-2 font-serif">Lenggah Atur RSVP</h2>
          <div class="text-brown-600">❈❈❈</div>
        </div>

        <div class="container mx-auto px-4 py-8">
          <form (ngSubmit)="submitForm()" class="max-w-6xl mx-auto bg-[#432818] shadow-xl rounded-lg p-8 text-white text-center">
            <!-- Nama -->
            <div class="relative mb-6">
              <label for="nama" class="block mb-2 text-sm font-medium text-white">
                Nama
              </label>
              <input
                type="text"
                id="nama"
                name="nama"
                [(ngModel)]="guest.nama"
                required
                placeholder="Silahkan Isi Nama Anda"
                class="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-2 px-3 leading-25 transition-colors duration-200 ease-in-out"
              />
            </div>

            <!-- Ucapan -->
            <div class="relative mb-6">
              <label for="ucapan" class="block mb-2 text-sm font-medium text-white">
                Ucapan & Do'a
              </label>
              <textarea
                id="ucapan"
                name="ucapan"
                [(ngModel)]="guest.ucapan"
                required
                rows="4"
                class="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-2 px-3 leading-6 transition-colors duration-200 ease-in-out"
                placeholder="Silahkan Isi Ucapan & Do'a Anda"
              ></textarea>
            </div>

            <!-- Kehadiran -->
            <div class="relative mb-6">
              <label for="kehadiran" class="block mb-2 text-sm font-medium text-white">
                Kehadiran
              </label>
              <select
                id="kehadiran"
                name="kehadiran"
                [(ngModel)]="guest.kehadiran"
                required
                class="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
              >
                <option value="" disabled selected>Silahkan Pilih Kehadiran</option>
                <option value="Hadir">Hadir</option>
                <option value="Tidak Hadir">Tidak Hadir</option>
              </select>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full font-semibold text-[#432818] py-3 px-4 rounded-full bg-[#FEFBE8] hover:bg-[#FEFBE8]/40 hover:text-[#FEFBE8] transition duration-300"
            >
              Kirim
            </button>
          </form>
        </div>

        <!-- Footer Decoration -->
        <div class="text-center mt-2">
          <div class="text-brown-600">❈❈❈</div>
          <p class="text-amber-900 mt-2 font-serif">Matur Nuwun</p>
        </div>
      </div>
    </div>

    <!-- Modal Component -->
    <div *ngIf="isModalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 text-center">
      <div class="bg-white bg-card-2 p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 class="text-xl font-bold mb-4 text-[#432818]">{{ modalTitle }}</h3>
        <p class="text-[#432818] mb-6">{{ modalMessage }}</p>
        <h3 class="text-lg font-bold mb-4 text-[#432818]">Jika data berhasil di kirim tetapi tidak muncul</h3>
        <h3 class="text-lg font-bold mb-4 text-[#432818]">COBA REFRESH HALAMAN</h3>
        <button 
          (click)="closeModal()" 
          class="rounded font-bold py-3 px-4 rounded-lg bg-[#432818] hover:bg-white text-white hover:text-[#432818] transition duration-300"
        >
          Tutup
        </button>
      </div>
    </div>
`,
  styles:`
 .bg-card-2 {
    position: relative;
    background-image: url('https://res.cloudinary.com/dxeyja0ob/image/upload/v1749561956/flower_169_2_bld4vt.png'),
    url('https://res.cloudinary.com/dxeyja0ob/image/upload/v1749559531/flower_2_oommzk.png');
    background-size: cover,cover;
    background-repeat: no-repeat;
    background-blend-mode: multiply;
    background-position: bottom , top ;
    opacity: 1;
  }
    `
})
export class GuestFormComponent {
  guest: Guest = {
    nama: '',
    ucapan: '',
    kehadiran: ''
  };

  isModalOpen = false;
  modalTitle = '';
  modalMessage = '';

  private readonly SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz3os2t3vE5Bdl8qmUt8j1FA8oK6pyYUXADfH5xp8ybyQxV6Ev3qJ5qQ3cBzBefCQBi/exec';
  @Output() formSubmitted = new EventEmitter<void>();
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
  }

  private isFormValid(): boolean {
    return !!this.guest.nama && !!this.guest.ucapan && !!this.guest.kehadiran;
  }

  private handleSuccess() {
    let message =`Terima kasih, ${this.guest.nama} Data kehadiran Anda telah terkirim.`;
  
  
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
    this.guest = {
      nama: '',
      ucapan: '',
      kehadiran: ''
    };
  }
}