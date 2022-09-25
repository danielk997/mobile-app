import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {IonicModule} from "@ionic/angular";
import {SwiperModule} from "swiper/angular";
import {GoogleMapsModule} from "@angular/google-maps";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule,
    IonicModule.forRoot(),
    SwiperModule,
    GoogleMapsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
