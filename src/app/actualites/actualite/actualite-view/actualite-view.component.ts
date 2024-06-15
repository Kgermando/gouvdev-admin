import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserModel } from '../../../users/models/user.model';
import { ActualiteModel, ActualiteOpinionModel } from '../../models/actualite.model';
import { CustomizerSettingsService } from '../../../common/customizer-settings/customizer-settings.service';
import { AuthService } from '../../../auth/auth.service';
import { ActualiteService } from '../actualite.service';
import { ActualiteOpinionService } from '../actualite-opinion.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-actualite-view',
  templateUrl: './actualite-view.component.html',
  styleUrl: './actualite-view.component.scss'
})
export class ActualiteViewComponent implements OnInit {
  isLoading = false;

  actualite!: ActualiteModel;
  actualiteOpnionList: ActualiteOpinionModel[] = [];

  currentUser: UserModel | any;

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private actualiteService: ActualiteService,
    private actualiteOpinionService: ActualiteOpinionService,
    public dialog: MatDialog,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        let id = this.route.snapshot.paramMap.get('id');  // this.route.snapshot.params['id'];
        this.actualiteService.refreshData$.subscribe(() => {
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
    this.actualiteService.get(Number(id)).subscribe(res => {
      this.actualite = res.data;
      this.actualiteOpinionService.getAllById(this.actualite.ID).subscribe(response => {
        this.actualiteOpnionList = response.data;
        this.isLoading = false;
      });
    });
  }


  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      this.actualiteService
        .delete(id)
        .subscribe({
          next: () => {
            this.toastr.info('Supprimé avec succès!', 'Success!');
            this.router.navigate(['/web/actualites/list']);
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
    this.dialog.open(IsPublieActualiteDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        id: id
      }
    }); 
  } 

  openIsValidDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
    this.dialog.open(ActualiteIsValidDialogBox, {
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
  templateUrl: './actualite-publie.html',
})
export class IsPublieActualiteDialogBox implements OnInit {
  isLoading = false;

  formGroup!: FormGroup;
 

  currentUser: UserModel | any;  

  isPublieList: boolean[] = [false, true];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<IsPublieActualiteDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService, 
      private actualiteService: ActualiteService,
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({ 
      is_publie: [''],
    });
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.actualiteService.get(parseInt(this.data['id'])).subscribe(item => {
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
      this.actualiteService.updateIsPublie(parseInt(this.data['id']), this.formGroup.getRawValue())
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



@Component({
  selector: 'edit-actualite-dialog',
  templateUrl: './actualite-valid.html',
})
export class ActualiteIsValidDialogBox implements OnInit {
  isLoading = false;

  formGroup!: FormGroup;
 

  currentUser: UserModel | any;  

  isValidList: boolean[] = [false, true];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<ActualiteIsValidDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService, 
      private actualiteService: ActualiteService,
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({ 
      is_valid: [''],
    });
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.actualiteService.get(parseInt(this.data['id'])).subscribe(item => {
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
      this.actualiteService.updateValid(parseInt(this.data['id']), this.formGroup.getRawValue())
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
