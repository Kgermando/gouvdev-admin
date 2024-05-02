import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router'; 
import { ToastrService } from 'ngx-toastr';  
import { PersonnaliteModel } from '../models/personnalite.model';
import { PersonnaliteService } from '../personnalite.service'; 
import { PersonnaliteSectionModel } from '../../personnalite-sections/models/personnalite-section.model';
import { CustomizerSettingsService } from '../../common/customizer-settings/customizer-settings.service';
import { UserModel } from '../../users/models/user.model';
import { AuthService } from '../../auth/auth.service';
import { PersonnaliteSectionService } from '../../personnalite-sections/personnalite-section.service';

@Component({
  selector: 'app-personnalite-view',
  templateUrl: './personnalite-view.component.html',
  styleUrls: ['./personnalite-view.component.scss']
})
export class PersonnaliteViewComponent implements OnInit {
  isLoading = false;

  personnalite!: PersonnaliteModel;

  personnaliteSectionList!: PersonnaliteSectionModel[];

  currentUser: UserModel | any;

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private personnaliteService: PersonnaliteService, 
    private personnaliteSectionService: PersonnaliteSectionService, 
    private toastr: ToastrService) {}

    ngOnInit(): void {
      this.isLoading = true;
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          let id = this.route.snapshot.paramMap.get('id');  // this.route.snapshot.params['id'];
          this.personnaliteService.get(Number(id)).subscribe(res => {
            this.personnalite = res.data;
            this.personnaliteSectionService.refreshDataList$.subscribe(() => {
              this.fetchProducts(this.personnalite.ID);
            });
            this.fetchProducts(this.personnalite.ID);
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.router.navigate(['/auth/login']);
          console.log(error);
        }
      });
    }

    fetchProducts(personnalite_id: number) {
      this.personnaliteSectionService.getAllById(personnalite_id).subscribe(response => {
          this.personnaliteSectionList = response.data; 
          console.log("personnaliteSectionList", this.personnaliteSectionList);  
          this.isLoading = false;
        }
      );
    }
  


    delete(id: number): void {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
        this.personnaliteService
          .delete(id) 
          .subscribe({
            next: () => {
              this.toastr.info('Supprimé avec succès!', 'Success!');
              this.router.navigate(['/web/personnalites/list']);
            },
            error: err => {
              this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
              console.log(err);
            }
          }
        ); 
      }
    }

    deleteSection(id: number): void {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
        this.personnaliteSectionService
          .delete(id) 
          .subscribe({
            next: () => {
              this.toastr.info('Supprimé avec succès!', 'Success!');
              this.router.navigate(['/web/personnalites', this.personnalite.ID, 'view']);
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
