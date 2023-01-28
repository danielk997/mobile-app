import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Coordinates} from "../models/coordinates";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CoordsService {

  constructor(
    private _http: HttpClient
  ) {
  }

  getAll(): Observable<Coordinates[]> {
    return this._http.get<Coordinates[]>(`${environment.apiUrl}/coords`);
  }
}
