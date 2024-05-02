import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActuModel } from '../models/actu.model';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator'; 
import { LiveAnnouncer } from '@angular/cdk/a11y'; 
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ActuService } from '../actu.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserModel } from '../../users/models/user.model';
import { CustomizerSettingsService } from '../../common/customizer-settings/customizer-settings.service';

@Component({
  selector: 'app-actu-list',
  templateUrl: './actu-list.component.html',
  styleUrls: ['./actu-list.component.scss']
})
export class ActuListComponent implements OnInit {
  displayedColumns: string[] = ['numero', 'is_publie', 'titre', 'createdat', 'updatedat', 'id']; 

  ELEMENT_DATA: ActuModel[] = [];
  pageSize = 15; // Default page size
  pageNumber = 1; // Default page number
  totalPages = 0; // Stores total pages from API response 
  
  dataSource = new MatTableDataSource<ActuModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<ActuModel>(true, []);

  @ViewChild(MatSort) sort: MatSort | any;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;


  isLoading = false;
  currentUser: UserModel | any; 
  
  constructor(
      private _liveAnnouncer: LiveAnnouncer,
      public themeService: CustomizerSettingsService,
      private router: Router,
      private authService: AuthService,
      private actuService: ActuService, 
      public dialog: MatDialog,
      private toastr: ToastrService
  ) {}



  ngOnInit() {
    this.isLoading = true;
    this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user; 
          this.actuService.refreshDataList$.subscribe(() => {
            this.fetchProducts();
          });
          this.fetchProducts();
        },
        error: (error) => {
          this.isLoading = false;
          this.router.navigate(['/auth/login']);
          console.log(error);
        }
      });  
  }

  fetchProducts() {
    this.actuService.getPaginated(this.pageSize, this.pageNumber)
      .subscribe(response => {
        this.ELEMENT_DATA = response.data; 
        console.log("this.ELEMENT_DATA", this.ELEMENT_DATA)
        this.dataSource = new MatTableDataSource<ActuModel>(this.ELEMENT_DATA);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator; 
        this.totalPages = response.pagination.total_pages;

        this.isLoading = false;
      }
    );
  }

  // changePage(pageNumber: number) {
  //   this.pageNumber = pageNumber;
  //   this.fetchProducts();
  // }

  handlePageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchProducts(); // Refetch data based on new page and size
  }


  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      this.actuService
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
      });
    }
  }
  

 
  applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Announce the change in sort state for assistive technology. */
    announceSortChange(sortState: Sort) { 
      if (sortState.direction) {
          this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      } else {
          this._liveAnnouncer.announce('Sorting cleared');
      }
  }
   

  openAddDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(CreateActuDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration, 
    }); 
  } 
 
  openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
    this.dialog.open(EditActuDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        id: id
      }
    }); 
  } 

}



@Component({
  selector: 'create-cohorte-dialog',
  templateUrl: './create-actu-dialog.html', 
})
export class CreateActuDialogBox {
  isLoading: boolean = false; 
  formGroup!: FormGroup;

  currentUser: UserModel | any; 

  isPubieList: boolean[] = [false, true];

  constructor(
    public dialogRef: MatDialogRef<CreateActuDialogBox>,
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private actuService: ActuService,  
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });

    this.formGroup = this._formBuilder.group({
      titre: ['', Validators.required],
      is_publie: ['', Validators.required],
    });
  }


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body = {
          titre: this.formGroup.value.titre, 
          is_publie: this.formGroup.value.is_publie, 
          signature: this.currentUser.fullname,
          // createdat: new Date(),
          // updatedat: new Date(),
        };
        this.actuService.create(body).subscribe({
          next: (res) => {
            this.isLoading = false;
            this.formGroup.reset();
            this.toastr.success('Ajouter avec succès!', 'Success!');
            this.close();
          },
          error: (err) => {
            this.isLoading = false;
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            console.log(err);
          }
        });
      }
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  } 


  capitalizeTest(text: string): string {
    return (text && text[0].toUpperCase() + text.slice(1).toLowerCase()) || text;
  }


  close(){
    this.dialogRef.close(true);
  }

}


@Component({
  selector: 'edit-actu-dialog',
  templateUrl: './actu-edit.html',
})
export class EditActuDialogBox implements OnInit {
  isLoading = false;

  formGroup!: FormGroup;
 

  currentUser: UserModel | any;  

  isPubieList: boolean[] = [false, true];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<EditActuDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService, 
      private actuService: ActuService,  
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      titre: [''],
      is_publie: [''],
    });
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.actuService.get(parseInt(this.data['id'])).subscribe(item => {
          var dataItem = item.data;
          this.formGroup.patchValue({
            titre: dataItem.titre,
            is_publie: dataItem.is_publie,
            signature: this.currentUser.fullname,
            // updatedat: new Date(),
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
      this.actuService.update(parseInt(this.data['id']), this.formGroup.getRawValue())
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
