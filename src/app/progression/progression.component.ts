import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-progression',
  templateUrl: './progression.component.html',
  styleUrls: ['./progression.component.css'],
})
export class ProgressionComponent implements OnInit {
  title: string;
  loadedFeature = 'recipe';
  data: any;
  started: number;

  constructor(private titleService: Title, private dataService: DataService) {}

  registerStart() {
    localStorage.setItem('started', JSON.stringify(new Date().getTime()));
  }

  ngOnInit() {
    // const t = new Date();
    // t.setHours(8);
    // t.setMinutes(10);
    // localStorage.setItem('started', JSON.stringify(t.getTime()));

    if (localStorage.getItem('started')) {
      this.started = JSON.parse(localStorage.getItem('started'));

      setInterval(() => {
        const now = new Date();
        const duration = 30600000; // 8.5h
        const nowUNIX = now.getTime();
        const end = this.started + duration;
        const diff = end - nowUNIX;

        // console.log(diff);
        // console.log(nowUNIX);
        // console.log(this.started);

        let format;

        if (diff > 0) {
          format = (100 - (diff / duration) * 100).toFixed(2) + '%';
        } else {
          console.log('DIFF', diff);
          format = 'Done!';
        }

        this.title = format;
        this.titleService.setTitle(format);
        console.log(format);
      }, 10000);
    } else {
      this.titleService.setTitle('No start time registered!');
    }
  }
}
