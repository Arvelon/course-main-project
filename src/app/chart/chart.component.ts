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
          tooltipFormat: 'MMMM yyyy',
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

    // Make an HTTP request to fetch your data
    this.http.get('https://next-home-control.vercel.app/api/' + this.dataType).subscribe((data: any) => {
      // Assuming your data is an array of objects with date and value properties

      this.fullDataStore = data.slice(-this.resolution);
      this.fullDataStore = this.fullDataStore.map((data) => {
        const d = { ...data };
        d.dateTime = format(new Date(d.timestamp), 'dd-MM HH:mm');
        return d;
      });

      this.dataStore = data.map((item: any) => +item[this.dataType]);
      this.labelStore = data.map((item: any) => new Date(item.timestamp));
      const chartData = this.dataStore.slice(-this.resolution);

      // Update the chart data with the fetched data
      this.lineChartData.datasets[0].data = chartData;
      this.lineChartData.labels = data.map((item: any) => new Date(item.timestamp)).slice(-this.resolution);
      this.lineChartData.datasets[0].label = this.dataType.toUpperCase();
      this.lineChartData.datasets[0].backgroundColor = 'rgba(' + this.color + ', 0.4)';
      this.lineChartData.datasets[0].borderColor = 'rgba(' + this.color + ', 0.5)';

      this.lineChartOptions.scales.y.min = Math.min(...chartData) * 0.99;
      this.lineChartOptions.scales.y.max = Math.max(...chartData) * 1.01;

      // Trigger chart update
      this.updateChart();
    });
  }

  updateChart() {
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
  }

  onChanges(): void {
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
