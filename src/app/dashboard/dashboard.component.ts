import { Component, OnInit } from '@angular/core';
import { UserModel } from '../users/models/user.model';
import { CustomizerSettingsService } from '../common/customizer-settings/customizer-settings.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isLoading = false;
  currentUser: UserModel | any; 

  constructor(
    public themeService: CustomizerSettingsService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user; 
        },
        error: (error) => {
          this.isLoading = false;
          this.router.navigate(['/auth/login']);
          console.log(error);
        }
      }
    ); 
  }
}
