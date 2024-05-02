import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router'; 
import { ToastrService } from 'ngx-toastr'; 
import { PropositionLoisModel } from '../models/proposition-lois.model';
import { PropositionLoisService } from '../proposition-lois.service';
import { UserModel } from '../../users/models/user.model';
import { CustomizerSettingsService } from '../../common/customizer-settings/customizer-settings.service';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'app-proposition-lois-view',
  templateUrl: './proposition-lois-view.component.html',
  styleUrls: ['./proposition-lois-view.component.scss']
})
export class PropositionLoisViewComponent implements OnInit {
  isLoading = false;

  propositionLoisModel!: PropositionLoisModel;

  currentUser: UserModel | any;

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private propositionLoisService: PropositionLoisService, 
    private toastr: ToastrService) {}

    ngOnInit(): void {
      this.isLoading = true;
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          let id = this.route.snapshot.paramMap.get('id');  // this.route.snapshot.params['id'];
          this.propositionLoisService.get(Number(id)).subscribe(res => {
            this.propositionLoisModel = res.data;
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
        this.propositionLoisService
          .delete(id) 
          .subscribe({
            next: () => {
              this.toastr.info('Supprimé avec succès!', 'Success!');
              this.router.navigate(['/web/sondages/list']);
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
