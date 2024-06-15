import { Component, Inject, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router'; 
import { ToastrService } from 'ngx-toastr';  
import { PersonnaliteModel } from '../models/personnalite.model';
import { PersonnaliteService } from '../personnalite.service'; 
import { PersonnaliteSectionModel } from '../../personnalite-sections/models/personnalite-section.model';
import { CustomizerSettingsService } from '../../common/customizer-settings/customizer-settings.service';
import { UserModel } from '../../users/models/user.model';
import { AuthService } from '../../auth/auth.service';
import { PersonnaliteSectionService } from '../../personnalite-sections/personnalite-section.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

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
    public dialog: MatDialog,
    private toastr: ToastrService) {}

    ngOnInit(): void {
      this.isLoading = true;
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          let id = this.route.snapshot.paramMap.get('id');  // this.route.snapshot.params['id'];
          this.personnaliteService.refreshData$.subscribe(() => {
            this.fetchProduct(id);
          });
          this.fetchProduct(id);
        },
        error: (error) => {
          this.isLoading = false;
          this.router.navigate(['/auth/login']);
          console.log(error);
        }
      });
    }

    fetchProduct(id: any) {
      this.personnaliteService.get(Number(id)).subscribe(res => {
        this.personnalite = res.data;
        this.personnaliteSectionService.refreshDataList$.subscribe(() => {
          this.fetchProducts(this.personnalite.ID);
        });
        this.fetchProducts(this.personnalite.ID);
        this.isLoading = false;
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
   
    openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
      this.dialog.open(IsPubliePersonnaliteDialogBox, {
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
  selector: 'edit-sondage-dialog',
  templateUrl: './personnalite-edit.html',
})
export class IsPubliePersonnaliteDialogBox implements OnInit {
  isLoading = false;

  formGroup!: FormGroup;
 

  currentUser: UserModel | any;  

  isPublieList: boolean[] = [false, true];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<IsPubliePersonnaliteDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService, 
      private personnaliteService: PersonnaliteService, 
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({ 
      is_publie: [''],
    });
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.personnaliteService.get(parseInt(this.data['id'])).subscribe(item => {
          var dataItem = item.data;
          this.formGroup.patchValue({
            is_publie: dataItem.is_publie,
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
      this.personnaliteService.updateIsPublie(parseInt(this.data['id']), this.formGroup.getRawValue())
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

  close(){
      this.dialogRef.close(true);
  } 

}