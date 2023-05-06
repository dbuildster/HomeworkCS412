import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService } from './backend.service';
import { SearchResultComponent} from 'src/app/search-result/search-result.component'
import { FormsModule } from '@angular/forms';
import { Injectable } from '@angular/core';

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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'untitled1';
  myData: MyData[] = [];
  searchTerm!: string;

  constructor(private http: HttpClient, private backendService: BackendService) {}

  search() {
    if (!this.searchTerm) {
      return;
    }
    this.backendService.searchStates(this.searchTerm).subscribe((response: any) => {
      this.myData = response.alerts.map((alert: any) => ({
        event: alert.properties.event,
        description: alert.properties.description,
        effective: alert.properties.effective,
        expires: alert.properties.expires,
        status: alert.properties.status,
        // ... any other properties your data has
      }));
    });
  }
}
