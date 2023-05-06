import { HttpClient } from '@angular/common/http';
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

interface MyData {
  event: string;
  description: string;
  effective: string;
  expires: string;
  status: string;
  // ... any other properties your data has
}
@Injectable({
  providedIn: 'root'
})
export class BackendService {
  constructor(private http: HttpClient) { }

  searchStates(state: string): Observable<any> {
    const url = `http://localhost:4000/ps4/weather3?state=${state}`; // change URL here
    return this.http.get(url);
  }
}
