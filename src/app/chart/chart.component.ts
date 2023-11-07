import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { HttpClient } from '@angular/common/http'; // Import HttpClient for making HTTP requests
import 'chartjs-adapter-date-fns';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit {
  @Input() resolution: number = 20;
  @Input() dataType: string = '';
  @Input() color: string = '';
  chartType: ChartType = 'line';
  config: FormGroup;
  dataStore: any[];
  labelStore: any[];
  fullDataStore: any[];
  cacheOrLive: string;

  public lineChartData: ChartConfiguration<ChartType>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: '',
        fill: false,
        tension: 0.5,
        borderWidth: 2,
      },
    ],
  };

  public lineChartOptions: ChartOptions<ChartType> = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#212121',
          font: {
            size: 12,
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          tooltipFormat: 'HH:mm:ss',
        },
        ticks: { color: '#424242' },
      },
      y: {
        beginAtZero: false,
        ticks: { color: '#424242' },
      },
    },
  };
  public lineChartLegend = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.config = new FormGroup({
      type: new FormControl('line'),
      resolution: new FormControl(20),
    });
    this.onChanges();

    // Analyzing cache
    console.log('Looking for cache...');
    const jsonString: string = localStorage.getItem(this.dataType + '_ldp');
    let ldp: any;
    if (jsonString != null) ldp = JSON.parse(jsonString);
    console.log(ldp);

    const timeSinceLastDataPoint = (new Date().getTime() - ldp) / 300000;
    console.log(timeSinceLastDataPoint);

    if (timeSinceLastDataPoint >= 1 || ldp === undefined) {
      this.cacheOrLive = 'realtime';
      console.log('Cache is outdated, requesting new data...');
      // In case the last datapoint is older than 5 min ago, do the request

      // Make an HTTP request to fetch your data
      this.http.get('https://next-home-control.vercel.app/api/' + this.dataType).subscribe((data: any) => {
        console.log('I RAN');
        this.fullDataStore = data;
        this.fullDataStore = this.fullDataStore.map((data) => {
          const d = { ...data };
          d.dateTime = format(new Date(d.timestamp), 'dd-MM HH:mm');
          return d;
        });

        this.dataStore = data.map((item: any) => +item[this.dataType]);
        this.labelStore = data.map((item: any) => new Date(item.timestamp));
        const chartData = this.dataStore;

        // Update the chart data with the fetched data
        this.lineChartData.datasets[0].data = chartData;
        this.lineChartData.labels = data.map((item: any) => new Date(item.timestamp));
        this.lineChartData.datasets[0].label = this.dataType.toUpperCase();
        this.lineChartData.datasets[0].backgroundColor = 'rgba(' + this.color + ', 0.4)';
        this.lineChartData.datasets[0].borderColor = 'rgba(' + this.color + ', 0.5)';

        this.lineChartOptions.scales.y.min = Math.min(...chartData) * 0.99;
        this.lineChartOptions.scales.y.max = Math.max(...chartData) * 1.01;

        // Saving cache to localStorage
        localStorage.setItem(this.dataType + '_cache', JSON.stringify(this.fullDataStore));
        localStorage.setItem(this.dataType + '_ldp', this.fullDataStore[this.fullDataStore.length - 1].timestamp);
        // console.log('Last datapoint: ', this.fullDataStore[this.fullDataStore.length - 1]);

        // Trigger chart update
        this.updateChart();
      });
    } else {
      this.cacheOrLive = 'cached';
      // If not, do not request (save data)
      const jsonString: string = localStorage.getItem(this.dataType + '_cache');
      console.log('Cache found, validating cache...');
      if (jsonString) {
        this.fullDataStore = JSON.parse(jsonString);
        console.log('Cache validated!');
        this.updateChart();
      }
    }
  }

  updateChart() {
    console.log('Updating chart...');
    console.log('Configuration: ', this.chartType, this.resolution);
    this.dataStore = this.fullDataStore.map((item: any) => +item[this.dataType]);
    this.labelStore = this.fullDataStore.map((item: any) => new Date(item.timestamp));
    const chartData = this.dataStore.slice(-this.resolution);

    // Update the chart data with the fetched data
    this.lineChartData.datasets[0].data = chartData;
    this.lineChartData.labels = this.labelStore.slice(-this.resolution);
    this.lineChartData.datasets[0].label = this.dataType.toUpperCase();
    this.lineChartData.datasets[0].backgroundColor = 'rgba(' + this.color + ',0.3)';
    this.lineChartData.datasets[0].borderColor = 'rgba(' + this.color + ',0.4)';

    this.lineChartOptions.scales.y.min = Math.min(...chartData) * 0.99;
    this.lineChartOptions.scales.y.max = Math.max(...chartData) * 1.01;

    // Trigger chart update
    this.lineChartData = { ...this.lineChartData };
    console.log('Chart updated!');
  }

  onChanges(): void {
    console.log('onChanges');
    this.config.valueChanges.subscribe((val) => {
      this.resolution = this.config.controls.resolution.value;
      this.chartType = this.config.controls.type.value;
      this.updateChart();
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.fullDataStore, event.previousIndex, event.currentIndex);
    this.updateChart();
  }
}
