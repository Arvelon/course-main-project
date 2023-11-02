import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  loadedFeature = 'recipe';
  data: any;

  constructor(private titleService: Title, private dataService: DataService) {}

  ngOnInit() {
    setInterval(() => {
      const now = new Date();
      const target = new Date();

      const duration = 30600000;

      target.setHours(17);
      target.setMinutes(0);

      const nowUNIX = now.getTime();
      const targetUNIX = target.getTime();

      const diff = targetUNIX - nowUNIX;

      let format;

      if (diff > 0) {
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const minutes = Math.floor((diff / 1000 / 60) % 60);

        format =
          (Math.floor(hours).toString().length === 1
            ? '0' + Math.floor(hours).toString()
            : Math.floor(hours).toString()) +
          ':' +
          (Math.floor(minutes).toString().length === 1
            ? '0' + Math.floor(minutes).toString()
            : Math.floor(minutes).toString()) +
          ' (%€ ' +
          (100 - (diff / duration) * 100).toFixed(2) +
          ')';
      } else {
        format = 'Done!';
      }

      this.titleService.setTitle(format);
    }, 60000);
  }
}
