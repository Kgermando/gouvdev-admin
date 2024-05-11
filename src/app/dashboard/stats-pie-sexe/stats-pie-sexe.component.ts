import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CustomizerSettingsService } from '../../common/customizer-settings/customizer-settings.service';


@Component({
  selector: 'app-stats-pie-sexe',
  templateUrl: './stats-pie-sexe.component.html',
  styleUrl: './stats-pie-sexe.component.scss'
})
export class StatsPieSexeComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  constructor(
    public themeService: CustomizerSettingsService
) {}

toggleTheme() {
    this.themeService.toggleTheme();
}


  // Pie
  public pieChartOptions: ChartConfiguration['options'] = {
      responsive: true,
      plugins: {
          legend: {
              display: true,
              position: 'top',
          }
      }
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
      labels: [[ 'Femmes' ], 'Hommes' ],
      datasets: [{
          data: [ 300, 500 ]
      }]
  };
  public pieChartType: ChartType = 'pie';
}
