import { Component, Inject, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router'; 
import { ToastrService } from 'ngx-toastr'; 
import { ChoixModel, SondageModel } from '../models/sondage.model'; 
import { SondageService } from '../sondage.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'; 
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserModel } from '../../users/models/user.model';
import { CustomizerSettingsService } from '../../common/customizer-settings/customizer-settings.service';
import { AuthService } from '../../auth/auth.service';
import { ChoiceService } from '../choice/choice.service';

@Component({
  selector: 'app-sondage-view',
  templateUrl: './sondage-view.component.html',
  styleUrls: ['./sondage-view.component.scss']
})
export class SondageViewComponent implements OnInit {
  isLoading = false;

  sondage!: SondageModel;
  choixList: ChoixModel[] = [];

  currentUser: UserModel | any;

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private sondageService: SondageService,
    private choiceService: ChoiceService, 
    public dialog: MatDialog,
    private toastr: ToastrService) {}

    ngOnInit(): void {
      this.isLoading = true;
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          let id = this.route.snapshot.paramMap.get('id');  // this.route.snapshot.params['id'];
          this.sondageService.refreshData$.subscribe(() => {
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
      this.sondageService.get(Number(id)).subscribe(res => {
        this.sondage = res.data;
        this.choiceService.refreshDataList$.subscribe(() => {
          this.fetchProducts();
        });
        this.fetchProducts();
        this.isLoading = false;
      });
    }

    fetchProducts() {  
      this.choiceService.getAllById(this.sondage.ID)
        .subscribe(response => {
          this.choixList = response.data;
        }
      );
    }


    delete(id: number): void {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
        this.sondageService
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


    openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
      this.dialog.open(EditSondageDialogBox, {
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
  templateUrl: './sondage-edit.html',
})
export class EditSondageDialogBox implements OnInit {
  isLoading = false;

  formGroup!: FormGroup;
 

  currentUser: UserModel | any;  

  isValidList: boolean[] = [false, true];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<EditSondageDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService, 
      private sondageService: SondageService,
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({ 
      is_valid: [''],
    });
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.sondageService.get(parseInt(this.data['id'])).subscribe(item => {
          var dataItem = item.data;
          this.formGroup.patchValue({
            is_valid: dataItem.is_valid,
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
      this.sondageService.updateValid(parseInt(this.data['id']), this.formGroup.getRawValue())
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
