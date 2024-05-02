import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router'; 
import { ToastrService } from 'ngx-toastr'; 
import { ActuModel } from '../models/actu.model'; 
import { ActuService } from '../actu.service';
import { CustomizerSettingsService } from '../../common/customizer-settings/customizer-settings.service';
import { UserModel } from '../../users/models/user.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-actu-view',
  templateUrl: './actu-view.component.html',
  styleUrls: ['./actu-view.component.scss']
})
export class ActuViewComponent implements OnInit {
  isLoading = false;

  actu!: ActuModel;

  currentUser: UserModel | any;

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private actuService: ActuService, 
    private toastr: ToastrService) {}

    ngOnInit(): void {
      this.isLoading = true;
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          let id = this.route.snapshot.paramMap.get('id');  // this.route.snapshot.params['id'];
          this.actuService.get(Number(id)).subscribe(res => {
            this.actu = res.data;
            this.isLoading = false;
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.router.navigate(['/auth/login']);
          console.log(error);
        }
      });
    }


    delete(id: number): void {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
        this.actuService
          .delete(id) 
          .subscribe({
            next: () => {
              this.toastr.info('Supprimé avec succès!', 'Success!');
              this.router.navigate(['/web/users/list']);
            },
            error: err => {
              this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
              console.log(err);
            }
          }
        ); 
      }
    }
   
  
    toggleTheme() {
      this.themeService.toggleTheme();
    }
  
}
