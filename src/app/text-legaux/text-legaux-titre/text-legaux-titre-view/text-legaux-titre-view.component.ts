import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router'; 
import { ToastrService } from 'ngx-toastr'; 
import { TextLegauxTitreModel } from '../models/text-legaux-titre.model';
import { TextLegauxTitreService } from '../text-legaux-titre.service';
 
import { MatDialog } from '@angular/material/dialog';
import { EditTextLegauxTitreDialogBox } from '../text-legaux-titre-list/text-legaux-titre-list.component';
import { TextLegauxService } from '../../text-legaux-content/text-legaux.service';
import { TextLegauxModel } from '../../text-legaux-content/models/text-legaux.model';
import { UserModel } from '../../../users/models/user.model';
import { AuthService } from '../../../auth/auth.service';
import { CustomizerSettingsService } from '../../../common/customizer-settings/customizer-settings.service';

@Component({
  selector: 'app-text-legaux-titre-view',
  templateUrl: './text-legaux-titre-view.component.html',
  styleUrls: ['./text-legaux-titre-view.component.scss']
})
export class TextLegauxTitreViewComponent implements OnInit {
  isLoading = false;

  textLegauxTitre!: TextLegauxTitreModel;

  textLegauxList: TextLegauxModel[] = [];

  currentUser: UserModel | any;

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private textLegauxTitreService: TextLegauxTitreService, 
    private textLegauxService: TextLegauxService,
    public dialog: MatDialog,
    private toastr: ToastrService) {}

    ngOnInit(): void {
      this.isLoading = true;
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          let id = this.route.snapshot.paramMap.get('id');  // this.route.snapshot.params['id'];
          this.textLegauxTitreService.get(Number(id)).subscribe(res => {
            this.textLegauxTitre = res.data;
            this.textLegauxService.refreshDataList$.subscribe(() => {
              this.fetchProducts(this.textLegauxTitre.ID);
            });
            this.fetchProducts(this.textLegauxTitre.ID);
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.router.navigate(['/auth/login']);
          console.log(error);
        }
      });
    }


    fetchProducts(text_legaux_titre_id: number) {
      this.textLegauxService.getAllById(text_legaux_titre_id).subscribe(response => {
          this.textLegauxList = response.data;  
          this.isLoading = false;
        }
      );
    }

    delete(id: number): void {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
        this.textLegauxTitreService
          .delete(id) 
          .subscribe({
            next: () => {
              this.toastr.info('Supprimé avec succès!', 'Success!');
              this.router.navigate(['/web/text-legaux-titre/list']);
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
        this.textLegauxService
          .delete(id) 
          .subscribe({
            next: () => {
              this.toastr.info('Supprimé avec succès!', 'Success!');
              this.router.navigate(['/web/text-legaux-titre', this.textLegauxTitre.ID, 'view'])
            },
            error: err => {
              this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
              console.log(err);
            }
          }
        ); 
      }
    }
   

     
  openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
    this.dialog.open(EditTextLegauxTitreDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        id: id
      }
    }); 
  } 
  
    toggleTheme() {
      this.themeService.toggleTheme();
    }
  
}
