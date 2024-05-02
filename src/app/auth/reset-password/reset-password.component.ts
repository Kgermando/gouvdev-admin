import { Component } from '@angular/core'; 
import { CustomizerSettingsService } from '../../common/customizer-settings/customizer-settings.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  hide = true;

  constructor(
      public themeService: CustomizerSettingsService
  ) {}

  toggleTheme() {
      this.themeService.toggleTheme();
  }

  toggleCardBorderTheme() {
      this.themeService.toggleCardBorderTheme();
  }

  toggleCardBorderRadiusTheme() {
      this.themeService.toggleCardBorderRadiusTheme();
  }
 
}
