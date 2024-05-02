import { formatDate } from '@angular/common';
import { Component } from '@angular/core';  
import { CustomizerSettingsService } from '../customizer-settings/customizer-settings.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

    year : string;

    constructor(
      public themeService: CustomizerSettingsService
    ) {
        this.year = formatDate(new Date(), 'yyyy', 'en'); 
    }


    toggleCardBorderTheme() {
        this.themeService.toggleCardBorderTheme();
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    toggleCardBorderRadiusTheme() {
        this.themeService.toggleCardBorderRadiusTheme();
    }

}