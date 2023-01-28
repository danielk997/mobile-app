import {AfterViewInit, Component, Optional, ViewChild} from '@angular/core';
import {IonModal, IonRouterOutlet} from "@ionic/angular";
import SwiperCore, {Autoplay, Keyboard, Pagination, Scrollbar, Zoom} from 'swiper';
import {Geolocation} from '@awesome-cordova-plugins/geolocation/ngx';
import {GoogleMap} from "@angular/google-maps";
import {CoordsService} from "./services/coords.service";
import {Coordinates} from "./models/coordinates";
import {AnsweredQuestion, Question} from "./models/question";

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
  @ViewChild('modal') modal!: IonModal;
  markers: google.maps.MarkerOptions[] = [];
  openedQuestion!: Question;
  coords: Coordinates[] = [];
  question?: Question;


  constructor(
    @Optional() private _routerOutlet: IonRouterOutlet,
    private _geo: Geolocation,
    private _coordsService: CoordsService
  ) {
  }

  ngAfterViewInit() {
    this.setUserLocation();
    this._coordsService.getAll().subscribe(it => {
      this.coords = it;
      this.saveQuestionsInStorage(it.map(x => x.question));
      it.forEach(coord => this.setMarkers(coord));
    })
  }

  onMarkerClick(title: any) {
    if (!title)
      return;

    const coord: Coordinates | undefined = this.coords.find(it => it.name === title);
    this.question = coord?.question as Question;
    this.question = {
      ...this.question,
      answers: Object.entries(JSON.parse(this.question?.answers as any)).map(it => ({
        id: it[0],
        content: it[1]
      })) as any[]
    }


    this.modal.present();
  }

  onAnswer(id: string) {
    if (this.question?.correct === id) {
      this.addCorrectAnswer(this.question.id);
    }
    this.modal.dismiss();
  }

  private setMarkers(coordinates: Coordinates) {
    const coords = new google.maps.LatLng({
      lat: coordinates.lat, lng: coordinates.lon
    });


    this.markers.push({
      position: coords,
      title: coordinates.name
    });
  }

  private saveQuestionsInStorage(question: Question[]) {
    const currentAnswers = localStorage.getItem('questions') ? JSON.parse(localStorage.getItem('questions') ?? '') : [];
    console.log(currentAnswers);
    const x = question.map(it => ({id: it.id, answered: false, correct: false}));
    const stringified = JSON.stringify(x);
    localStorage.setItem('questions', stringified);
  }

  getCurrentAnswers(): AnsweredQuestion[] {
    return localStorage.getItem('questions') ? JSON.parse(localStorage.getItem('questions') ?? '') : [];
  }

  getCorrectAnswers() {
    return this.getCurrentAnswers().filter(it => it.correct);
  }

  addCorrectAnswer(id: number) {
    const x = this.getCurrentAnswers().map(it => it.id === id ? ({...it, correct: true}) : it);
    const stringified = JSON.stringify(x);
    localStorage.setItem('questions', stringified);
  }

  private setUserLocation() {
    this._geo.getCurrentPosition().then(it => {
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
