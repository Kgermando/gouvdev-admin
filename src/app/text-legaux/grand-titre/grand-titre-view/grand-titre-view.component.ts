import { Component, Inject, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router'; 
import { ToastrService } from 'ngx-toastr';  
 
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'; 
import { TextLegauxService } from '../../text-legaux-content/text-legaux.service';
import { TextLegauxModel } from '../../text-legaux-content/models/text-legaux.model';
import { UserModel } from '../../../users/models/user.model';
import { AuthService } from '../../../auth/auth.service';
import { CustomizerSettingsService } from '../../../common/customizer-settings/customizer-settings.service';
import { GrandTitreModel } from '../models/grand-titre.model';
import { GrandTitreService } from '../grand-titre.service';
import { TextLegauxTitreService } from '../../text-legaux-titre/text-legaux-titre.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { truncateString } from '../../../shared/tools/truncate-string';
import { replaceSpecialChars } from '../../../shared/tools/replaceSpecialChars';

@Component({
  selector: 'app-grand-titre-view',
  templateUrl: './grand-titre-view.component.html',
  styleUrl: './grand-titre-view.component.scss'
})
export class GrandTitreViewComponent implements OnInit {
  isLoading = false;

  grandTitre!: GrandTitreModel;

  textLegauxList: TextLegauxModel[] = [];

  currentUser: UserModel | any;

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private grandTitreService: GrandTitreService, 
    private textLegauxTitreService: TextLegauxTitreService, 
    public dialog: MatDialog,
    private toastr: ToastrService) {}

    ngOnInit(): void {
      this.isLoading = true;
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          let id = this.route.snapshot.paramMap.get('id');  // this.route.snapshot.params['id'];
          this.grandTitreService.get(Number(id)).subscribe(res => {
            this.grandTitre = res.data;
            this.textLegauxTitreService.refreshDataList$.subscribe(() => {
              this.fetchProducts(this.grandTitre.ID);
            });
            this.fetchProducts(this.grandTitre.ID);
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
      this.textLegauxTitreService.getAllById(text_legaux_titre_id).subscribe(response => {
          this.textLegauxList = response.data;  
          this.isLoading = false;
        }
      );
    }

    delete(id: number): void {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
        this.grandTitreService
          .delete(id) 
          .subscribe({
            next: () => {
              this.toastr.info('Supprimé avec succès!', 'Success!');
              this.router.navigate(['/web/grand-titre/list']);
            },
            error: err => {
              this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
              console.log(err);
            }
          }
        ); 
      }
    }

    deleteTitre(id: number): void {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
        this.textLegauxTitreService
          .delete(id) 
          .subscribe({
            next: () => {
              this.toastr.info('Supprimé avec succès!', 'Success!');
              this.router.navigate(['/web/text-legaux-titre', this.grandTitre.ID, 'view'])
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
    this.dialog.open(EditGrandTitreDialogBox, {
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



@Component({
  selector: 'edit-grand-titre-dialog',
  templateUrl: './edit-grand-titre.html',
})
export class EditGrandTitreDialogBox implements OnInit {
  isLoading = false;

  formGroup!: FormGroup;
 

  currentUser: UserModel | any;  

  isPubieList: boolean[] = [false, true];


  categoryList: string[] = [
    'Constitution',
    'Traités et accords internationaux',
    'Lois régissant les intitutions', 
    'Arreté',
    'Circulaire',
    'Décret',
    'Ordonance',
  ]


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<EditGrandTitreDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService, 
      private grandTitreService: GrandTitreService,
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({  
      category: [''],
      g_titre: [''],
      is_publie: [''],
    }); 
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user; 
        this.grandTitreService.get(parseInt(this.data['id'])).subscribe(item => {
          var dataItem = item.data;
          this.formGroup.patchValue({
            category: dataItem.category,
            g_titre: dataItem.g_titre,
            g_titre_url: replaceSpecialChars(truncateString(dataItem.g_titre)),
            is_publie: dataItem.is_publie,
            signature: this.currentUser.fullname,
          });
        });
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    }); 
  } 


  onSubmit() {
    try {
      this.isLoading = true;
      var body = {
        category: this.formGroup.value.category,
        g_titre: this.formGroup.value.g_titre, 
        g_titre_url: replaceSpecialChars(truncateString(this.formGroup.value.g_titre)), 
        is_publie: this.formGroup.value.is_publie,
        signature: this.currentUser.fullname,
      };
      this.grandTitreService.update(parseInt(this.data['id']), body)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.toastr.success('Modification enregistré!', 'Success!');
          this.close();
        },
        error: err => {
          this.isLoading = false;
          console.log(err);
          this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
        }
      });
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }

  transform(value: string): string {
    return value.replace(/ /g, "_");
  }

  close(){
      this.dialogRef.close(true);
  } 

}
