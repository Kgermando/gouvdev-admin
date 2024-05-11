import { Component } from '@angular/core';
import { CustomizerSettingsService } from '../../common/customizer-settings/customizer-settings.service';

@Component({
  selector: 'app-stats-number',
  templateUrl: './stats-number.component.html',
  styleUrl: './stats-number.component.scss'
})
export class StatsNumberComponent {
  constructor(
    public themeService: CustomizerSettingsService
  ) { }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
