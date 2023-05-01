import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface MyData {
  event: string;
  description: string;
  effective: string;
  expires: string;
  status: string;
  // ... any other properties your data has
}



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'untitled1';
  myData: MyData[] = [];
  constructor(private http: HttpClient) {}


  fetchData() {
    this.http.get('/assets/mock-data.json').subscribe((data: any) => {
      this.myData = data.map((feature: any) => ({
        event: feature.properties.event,
        description: feature.properties.description,
        effective: feature.properties.effective,
        expires: feature.properties.expires,
        status: feature.properties.status,
        // ... any other properties your data has
      }));
    });
  }
}
