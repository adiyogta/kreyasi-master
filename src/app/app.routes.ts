import { Routes } from '@angular/router';
import { AlvyyatunMainComponent } from './undangan/alvyyatun-main/alvyyatun-main.component';
import { GuestManagementComponent } from './undangan/alvyyatun-main/list-tamu.component';
import { GuestManagementComponent2 } from './undangan/anis-manteb/list-tamu.component';
import { AlvyyatunMainComponent2 } from './undangan/anis-manteb/alvyyatun-main.component';

export const routes: Routes = [
    // // Route untuk halaman utama (HomeComponent)
    // { path: '', component: HomeComponent },

    // // Route untuk undangan Jhoni & Alvyyatun
    // { path: 'jhoni-alvyyatun',
    //     children: [
    //         // Route default tanpa guestName
    //         { path: '', title: 'Jhoni & Alvyyatun', component: HomeComponent },

    //         // Route dengan guestName
    //         { path: ':guestName',
    //             children: [
    //                 // Route untuk guestName, tetap menampilkan AlvyyatunJhoniComponent
    //                 { path: '', title: 'Jhoni & Alvyyatun', component: AlvyyatunJhoniComponent },

    //                 // Route untuk halaman utama undangan (AlvyyatunMainComponent) ketika URL adalah /jhoni-alvyyatun/:guestName/main
    //                 { path: 'main', title: 'Jhoni & Alvyyatun', component: AlvyyatunMainComponent },
    //             ]
    //         }
    //     ]
    // }

      {
        path: ':guestName',
        children: [
          { path: '', title: 'Anis & Mantep', component: AlvyyatunMainComponent },
        ]
      },
      
      { path: 'list/bikin-link', title: 'Anis & Mantep', component: GuestManagementComponent, }, // Redirect empty path to 404
      
      { path: 'unduh-mantu/bikinlink', title: 'Anis & Mantep', component: GuestManagementComponent2, },
       // Catch all invalid routes and redirect to 404
       {
        path: 'unduh-mantu/:guestName',
        children: [
          { path: '', title: 'Anis & Mantep', component: AlvyyatunMainComponent2 },
        ]
      },

      { path: '', component: AlvyyatunMainComponent, pathMatch: 'full' },
      { path: '**', component: AlvyyatunMainComponent },
];
