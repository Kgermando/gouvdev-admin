import { Component, Input, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CustomizerSettingsService } from '../../../common/customizer-settings/customizer-settings.service'; 
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { UserModel } from '../../../users/models/user.model';

@Component({
  selector: 'app-info-profile',
  templateUrl: './info-profile.component.html',
  styleUrls: ['./info-profile.component.scss']
})
export class InfoProfileComponent implements OnInit {
  @Input() currentUser: UserModel | any;

  isLoading = false; 

  constructor(
    public themeService: CustomizerSettingsService,
    private router: Router,
    private authService: AuthService,
) {}

  ngOnInit(): void {
    this.isLoading = true;
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;  
            this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.router.navigate(['/auth/login']);
          console.log(error);
        }
      });
  }



  imageSlides2: OwlOptions = {
    items: 1,
    nav: true,
    loop: true,
    margin: 25,
    dots: true,
    autoplay: false,
    smartSpeed: 1000,
    autoplayHoverPause: true,
      navText: [
    "<i class='flaticon-chevron-1'></i>",
    "<i class='flaticon-chevron'></i>",
    "<i class='flaticon-chevron'></i>",
    "<i class='flaticon-chevron'></i>"
    ]
  }

  toggleTheme() {
      this.themeService.toggleTheme();
  }
}
