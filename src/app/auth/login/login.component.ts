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

  form: FormGroup | any

  constructor(
    public themeService: CustomizerSettingsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }


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
          this.authService.user().subscribe({
            next: (u) => {
              console.log("user", u)
              let user: UserModel = u;
              let permissions = JSON.stringify(user.permissions);
              localStorage.removeItem('permissions');
              localStorage.setItem('permissions', permissions);

              if (user.is_active) {
                if (user.permissions[0] === 'Dashboard') { 
                  this.router.navigate(['/web/dashboard']);
                } else if (user.permissions[0] === 'Actualites') {
                  this.router.navigate(['/web/actualites/list']);
                } else if (user.permissions[0] === 'Contact') {
                  this.router.navigate(['/web/contacts/list']);
                } else if (user.permissions[0] === 'Personnalites') {
                  this.router.navigate(['/web/personnalites/list']);
                } else if (user.permissions[0] === 'PropositionsLois') {
                  this.router.navigate(['/web/proposition-lois/list']);
                } else if (user.permissions[0] === 'Sondages') {
                  this.router.navigate(['/web/sondages/list']);
                } else if (user.permissions[0] === 'Teams') {
                  this.router.navigate(['/web/teams/list']);
                } else if (user.permissions[0] === 'Textes') {
                  this.router.navigate(['/web/textes/list']);
                } else if (user.permissions[0] === 'Users') { 
                  this.router.navigate(['/web/users/list']);
                } else {
                  console.log("else")
                  this.router.navigate(['/auth/login']);
                }
                this.toastr.success(`Bienvenue ${user.fullname}!`, 'Success!');
              } else {
                this.router.navigate(['/auth/login']);
              }
              
              this.isLoading = false;
            },
            error: (error) => {
              this.isLoading = false;
              this.router.navigate(['/auth/login']);
              console.log(error);
            }
          });
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
