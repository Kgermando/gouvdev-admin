import { Component, OnInit } from '@angular/core';
import { UserModel } from '../users/models/user.model';
import { Router } from '@angular/router';
import { ToggleService } from '../common/header/toggle.service';
import { CustomizerSettingsService } from '../common/customizer-settings/customizer-settings.service';
import { AuthService } from '../auth/auth.service';
import { Auth } from '../common/classes/auth';

@Component({
  selector: 'app-layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.scss']
})
export class LayoutsComponent implements OnInit {
  isToggled = false;

  currentUser: UserModel | any;

  constructor(
      public router: Router,
      private toggleService: ToggleService,
      public themeService: CustomizerSettingsService, 
      private authService: AuthService,
  ) {
      this.toggleService.isToggled$.subscribe(isToggled => {
          this.isToggled = isToggled;
      });
  }

  ngOnInit(): void {
    this.authService.user().subscribe({
      next: (user) => Auth.userEmitter.emit(user),
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
  }

  toggleRightSidebarTheme() {
      this.themeService.toggleRightSidebarTheme();
  }

  toggleHideSidebarTheme() {
      this.themeService.toggleHideSidebarTheme();
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
