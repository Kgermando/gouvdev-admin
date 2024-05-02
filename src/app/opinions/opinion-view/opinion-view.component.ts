import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router'; 
import { ToastrService } from 'ngx-toastr'; 
import { OpinionMoodel } from '../models/opinion.model'; 
import { OpinionService } from '../opinion.service';
import { UserModel } from '../../users/models/user.model';
import { CustomizerSettingsService } from '../../common/customizer-settings/customizer-settings.service';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'app-opinion-view',
  templateUrl: './opinion-view.component.html',
  styleUrls: ['./opinion-view.component.scss']
})
export class OpinionViewComponent implements OnInit {
  isLoading = false;

  opinion!: OpinionMoodel;

  currentUser: UserModel | any;

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private opinionService: OpinionService, 
    private toastr: ToastrService) {}

    ngOnInit(): void {
      this.isLoading = true;
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          let id = this.route.snapshot.paramMap.get('id');  // this.route.snapshot.params['id'];
          this.opinionService.get(Number(id)).subscribe(res => {
            this.opinion = res.data;
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
        this.opinionService
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
