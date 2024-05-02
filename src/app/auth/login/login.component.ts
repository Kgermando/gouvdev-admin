import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { CustomizerSettingsService } from '../../common/customizer-settings/customizer-settings.service';
import { UserModel } from '../../users/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isLoading = false;

  hide = true;

  form : FormGroup | any

  constructor(
    public themeService: CustomizerSettingsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService, 
    private toastr: ToastrService
  ) {}


  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
}


onSubmit(): void {
  if (this.form.valid) {
    this.isLoading = true;
    var body = {
      email: this.form.value.email.toLowerCase(),
      password: this.form.value.password
    };
    this.authService.login(body).subscribe({
        next: (res) => {
          let user: UserModel = res;
            let role = JSON.stringify(user.role);
            localStorage.removeItem('roles');
            localStorage.setItem('role', role);
            this.router.navigate(['/web/dashboard']);
            // if (user.isActive) {
            //   if (user.role === 'Dashboard') { 
            //     this.router.navigate(['/web/dashboard']);  
            //   } else if (user.role === 'Cohortes') { 
            //     this.router.navigate(['/web/cohortes/cohorte-list']);
            //   } else if (user.role === 'web') { 
            //     this.router.navigate(['/web/banques/banque-list']);
            //   } else if (user.role === 'Beneficiaires') { 
            //     this.router.navigate(['/web/beneficiaires/beneficiaire-list']);
            //   } else if (user.role === 'users') { 
            //     this.router.navigate(['/web/users/user-list']);
            //   } else {
            //     this.router.navigate(['/auth/login']);
            //   }
            // } else {
            //   this.router.navigate(['/auth/login']);
            // }
            this.toastr.success(`Bienvenue ${user.fullname}!`, 'Success!');
            this.isLoading = false;
        },
        error: (e) => {
          this.isLoading = false;
          console.error(e); 
          // this.toastr.error('Votre matricule ou le mot de passe ou encore les deux ne sont pas correct !', 'Oupss!');
          this.toastr.error(`${e.error.message}`, 'Oupss!');
          this.router.navigate(['/auth/login']); 
        }, 
      }
    ); 
  }  
} 


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
