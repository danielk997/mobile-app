import {AfterViewInit, Component, Optional, ViewChild} from '@angular/core';
import {IonRouterOutlet} from "@ionic/angular";
import SwiperCore, {Autoplay, Keyboard, Pagination, Scrollbar, Zoom} from 'swiper';
import {Geolocation} from '@awesome-cordova-plugins/geolocation/ngx';
import {GoogleMap} from "@angular/google-maps";

SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom]);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {
      provide: Geolocation,
      useClass: Geolocation
    }
  ]
})
export class AppComponent implements AfterViewInit {

  @ViewChild('map') map!: GoogleMap;
  markers: google.maps.MarkerOptions[] = [];

  constructor(
    @Optional() private routerOutlet: IonRouterOutlet,
    private geo: Geolocation
  ) {
  }

  ngAfterViewInit() {
    this.setUserLocation();
  }

  private setUserLocation() {
    this.geo.getCurrentPosition().then(it => {
      const coords = new google.maps.LatLng({
        lat: it.coords.latitude, lng: it.coords.longitude
      });

      this.map.googleMap?.setCenter(coords);
      this.markers.push({
        position: coords
      })
    })
  }
}
