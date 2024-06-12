import { Component, Inject, OnInit, ViewChild } from '@angular/core'; 
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y'; 
import { Router } from '@angular/router'; 
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import { CustomizerSettingsService } from '../common/customizer-settings/customizer-settings.service';
import { AuthService } from '../auth/auth.service'; 
import { JoinPersoCategoryModel } from './model/join-person-category.model';
import { UserModel } from '../users/models/user.model';
import { JonctionPersonCategoryService } from './jonction-person-category.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonnaliteModel } from '../personnalites/models/personnalite.model';
import { PersonnaliteService } from '../personnalites/personnalite.service';
import { PersonCategoryFiltreService } from '../person-category-filtre/person-category-filtre.service';
import { PersonCategoryFiltreModel } from '../person-category-filtre/models/person-category-filter.model';

@Component({
  selector: 'app-jonction-person-category',
  templateUrl: './jonction-person-category.component.html', 
  styleUrl: './jonction-person-category.component.scss'
})
export class JonctionPersonCategoryComponent implements OnInit {
  displayedColumns: string[] = ['personnalite_id', 'personCategoryFiltre_id'];
  
  ELEMENT_DATA: JoinPersoCategoryModel[] = []; 
  
  dataSource = new MatTableDataSource<JoinPersoCategoryModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<JoinPersoCategoryModel>(true, []);

  @ViewChild(MatSort) sort: MatSort | any;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;


  isLoading = false;
  currentUser!: UserModel; 

  
  constructor(
      private _liveAnnouncer: LiveAnnouncer,
      public themeService: CustomizerSettingsService,
      private router: Router,
      private authService: AuthService,
      private jonctionPersonCategoryService: JonctionPersonCategoryService,  
      public dialog: MatDialog, 
      private toastr: ToastrService
  ) {}



  ngOnInit() {
    this.isLoading = true;
    this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          this.jonctionPersonCategoryService.refreshDataList$.subscribe(() => {
            this.fetchProducts();
          });
          this.fetchProducts();
        },
        error: (error) => {
          this.isLoading = false;
          this.router.navigate(['/auth/login']);
          console.log(error);
        }
      }
    ); 
  }
 
  fetchProducts() {
    this.jonctionPersonCategoryService.getAll()
      .subscribe(response => {
        this.ELEMENT_DATA = response.data; 
        this.dataSource = new MatTableDataSource<JoinPersoCategoryModel>(this.ELEMENT_DATA);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      }
    );
  }

  handlePageChange(event: PageEvent) { 
    this.fetchProducts(); // Refetch data based on new page and size
  }

  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      this.jonctionPersonCategoryService
      .delete(id)
      .subscribe({
        next: () => {
          this.toastr.info('Supprimé avec succès!', 'Success!');
          this.router.navigate(['/web/personnalites/jonction-person-category']);
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
 

  toggleTheme() {
    this.themeService.toggleTheme();
  }


 
 
  associateDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(AssociateJoinPersonCategoryDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration, 
    }); 
  } 

}

 
@Component({
  selector: 'join-person-dialog',
  templateUrl: './join-person-category-dialog.html',
})
export class AssociateJoinPersonCategoryDialogBox implements OnInit {
  isLoading = false;

  formGroup!: FormGroup;
 

  currentUser!: UserModel;   

  personnaliteList: PersonnaliteModel[] = [];
  personCategoryFiltreList: PersonCategoryFiltreModel[] = []; 

  constructor(
      public dialogRef: MatDialogRef<AssociateJoinPersonCategoryDialogBox>,
      private formBuilder: FormBuilder, 
      private toastr: ToastrService, 
      private jonctionPersonCategoryService: JonctionPersonCategoryService,
      private personnaliteService: PersonnaliteService, 
      private personCategoryFiltreService: PersonCategoryFiltreService, 
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      personnalite_id: ['', Validators.required],
      personCategoryFiltre_id: ['', Validators.required],
    });
    this.personnaliteService.getAll().subscribe(res => { 
      this.personnaliteList = res.data
    });
    this.personCategoryFiltreService.getAll().subscribe(res => { 
      this.personCategoryFiltreList = res.data
    });
  }

  onSubmit() {
    try {
      this.isLoading = true;
      var body = {
        personnalite_id: this.formGroup.value.personnalite_id, 
        personCategoryFiltre_id: this.formGroup.value.personCategoryFiltre_id,
      }
      console.log("body", body)
      // this.jonctionPersonCategoryService.create(body)
      // .subscribe({
      //   next: (res) => {
      //     this.isLoading = false;
      //     this.toastr.success('Modification enregistré!', 'Success!');
      //     this.close();
      //   },
      //   error: err => {
      //     this.isLoading = false;
      //     console.log(err);
      //     this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
      //   }
      // });
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }

  close(){
      this.dialogRef.close(true);
  } 

}
