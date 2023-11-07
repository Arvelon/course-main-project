import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DataService } from './services/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title: string;
  loadedFeature = 'recipe';
  data: any;

  constructor(private titleService: Title, private dataService: DataService) {}

  ngOnInit() {
    setInterval(() => {
      const now = new Date();
      const started = new Date();

      const duration = 30600000; // 8.5h

      started.setHours(8);
      started.setMinutes(10);

      const nowUNIX = now.getTime();
      const startedUNIX = started.getTime();

      const diff = startedUNIX - nowUNIX;

      let format;

      if (diff > 0) {
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const minutes = Math.floor((diff / 1000 / 60) % 60);

        format =
          // (Math.floor(hours).toString().length === 1
          //   ? '0' + Math.floor(hours).toString()
          //   : Math.floor(hours).toString()) +
          // ':' +
          // (Math.floor(minutes).toString().length === 1
          //   ? '0' + Math.floor(minutes).toString()
          //   : Math.floor(minutes).toString()) +
          (100 - (diff / duration) * 100).toFixed(2) + '%';
      } else {
        format = 'Done!';
      }

      this.title = format;
      this.titleService.setTitle(format);
      console.log(format);
    }, 10000);
  }
}
