import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { AlvyyatunMainComponent } from "./undangan/alvyyatun-main/alvyyatun-main.component";
import { AlvyyatunJhoniComponent } from './undangan/alvyyatun-main/alvyyatun-jhoni.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, AlvyyatunJhoniComponent, AlvyyatunMainComponent,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'kreyasi';
}
