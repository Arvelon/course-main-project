import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { HttpClient } from '@angular/common/http'; // Import HttpClient for making HTTP requests
import 'chartjs-adapter-date-fns';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit {
  @Input() resolution: number = 34;
  @Input() dataType: string;
  @Input() color: string;

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: '',
        fill: false,
        tension: 0.5,
        borderWidth: 1,
      },
    ],
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          tooltipFormat: 'MMMM yyyy',
        },
      },
      y: {
        beginAtZero: false,
      },
    },
  };
  public lineChartLegend = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Make an HTTP request to fetch your data
    this.http.get('https://next-home-control.vercel.app/api/' + this.dataType).subscribe((data: any) => {
      // Assuming your data is an array of objects with date and value properties
      const chartData = data.map((item: any) => +item[this.dataType]).slice(-this.resolution);

      // Update the chart data with the fetched data
      this.lineChartData.datasets[0].data = chartData;
      this.lineChartData.labels = data.map((item: any) => new Date(item.timestamp)).slice(-this.resolution);
      this.lineChartData.datasets[0].label = this.dataType;
      this.lineChartData.datasets[0].backgroundColor = 'rgba(' + this.color + ',0.3)';
      this.lineChartData.datasets[0].borderColor = 'rgba(' + this.color + ',0.4)';

      console.log(Math.max(...chartData));
      this.lineChartOptions.scales.y.min = Math.min(...chartData) * 0.99;
      this.lineChartOptions.scales.y.max = Math.max(...chartData) * 1.01;

      // Trigger chart update
      this.updateChart();
    });
  }

  updateChart() {
    // This method is used to trigger a chart update when the data changes
    // It's a good practice to call this method after modifying chart data
    this.lineChartData = { ...this.lineChartData };
  }
}
