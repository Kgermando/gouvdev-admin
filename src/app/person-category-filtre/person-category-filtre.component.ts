import { Component, Inject, OnInit, ViewChild } from '@angular/core'; 
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y'; 
import { Router } from '@angular/router'; 
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PersonCategoryFiltreModel } from './models/person-category-filter.model';
import { CustomizerSettingsService } from '../common/customizer-settings/customizer-settings.service';
import { AuthService } from '../auth/auth.service';
import { PersonCategoryFiltreService } from './person-category-filtre.service';
import { UserModel } from '../users/models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { replaceSpecialChars } from '../shared/tools/replaceSpecialChars';



@Component({
  selector: 'app-person-category-filtre',
  templateUrl: './person-category-filtre.component.html',
  styleUrl: './person-category-filtre.component.scss'
})
export class PersonCategoryFiltreComponent implements OnInit {
  displayedColumns: string[] = ['type', 'name', 'name_url', 'id'];
  
  ELEMENT_DATA: PersonCategoryFiltreModel[] = [];
  
  dataSource = new MatTableDataSource<PersonCategoryFiltreModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<PersonCategoryFiltreModel>(true, []);

  @ViewChild(MatSort) sort: MatSort | any;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;


  isLoading = false;
  currentUser!: UserModel; 
  
  constructor(
      private _liveAnnouncer: LiveAnnouncer,
      public themeService: CustomizerSettingsService,
      private router: Router,
      private authService: AuthService,
      private personCategoryFiltreService: PersonCategoryFiltreService, 
      public dialog: MatDialog, 
      private toastr: ToastrService
  ) {}



  ngOnInit() {
    this.isLoading = true;
    this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          this.personCategoryFiltreService.refreshDataList$.subscribe(() => {
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
    this.personCategoryFiltreService.getAll()
      .subscribe(response => {
        this.ELEMENT_DATA = response.data; 
        this.dataSource = new MatTableDataSource<PersonCategoryFiltreModel>(this.ELEMENT_DATA);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        // this.totalPages = response.pagination.total_pages;

        this.isLoading = false;
      }
    );
  }

  handlePageChange(event: PageEvent) { 
    this.fetchProducts(); // Refetch data based on new page and size
  }

  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      this.personCategoryFiltreService
      .delete(id)
      .subscribe({
        next: () => {
          this.toastr.info('Supprimé avec succès!', 'Success!');
          this.router.navigate(['/web/personnalites/person-category-filtre']);
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


  openAddDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(CreateCategoryPersonDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration, 
    }); 
  } 
 
  openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
    this.dialog.open(EditCategoryPersonDialogBox, {
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
  templateUrl: './create-category-dialog.html', 
})
export class CreateCategoryPersonDialogBox {
  isLoading: boolean = false; 
  formGroup!: FormGroup;

  currentUser: UserModel | any; 

  politiquesList: string[] = [
    'Président',
    'Gouvernement',
    'Sénateur',
    'Député national',
    'Député provincial',
    'Gourverneur',
    'Mandataire',
    '-',
  ]

  title = 'Nom';

  constructor(
    public dialogRef: MatDialogRef<CreateCategoryPersonDialogBox>,
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private personCategoryFiltreService: PersonCategoryFiltreService, 
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
      type: ['', Validators.required],
      name: ['', Validators.required],
    });
  }

  onChange(event: any) {
    if (event.value == "Président") {
      this.title = 'Nom du president';
    } else if (event.value == "Gouvernement") {
      this.title = 'Nom du premier ministre';
    } else if (event.value == "Sénateur") {
      this.title = 'Début et fin de la legislature';
    } else if (event.value == "Député national") {
      this.title = 'Début et fin de la legislature';
    } else if (event.value == "Député provincial") {
      this.title = 'Début et fin de la legislature';
    } else if (event.value == "Gourverneur") {
      this.title = 'Mandat début et fin';
    } else if (event.value == "Gourverneur") {
      this.title = 'Contrat en année';
    }  
  }


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body = {
          type: this.formGroup.value.type, 
          name: this.formGroup.value.name,
          name_url: replaceSpecialChars(this.formGroup.value.name), 
        };
        this.personCategoryFiltreService.create(body).subscribe({
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
  templateUrl: './update-category.html',
})
export class EditCategoryPersonDialogBox implements OnInit {
  isLoading = false;

  formGroup!: FormGroup;
 

  currentUser: UserModel | any;  

  politiquesList: string[] = [
    'Président',
    'Gouvernement',
    'Sénateur',
    'Député national',
    'Député provincial',
    'Gourverneur',
    'Mandataire',
    '-',
  ]

  title = 'Nom';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<EditCategoryPersonDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService, 
      private personCategoryFiltreService: PersonCategoryFiltreService, 
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      type: [''],
      name: [''],
      name_url: [''],
    });
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.personCategoryFiltreService.get(parseInt(this.data['id'])).subscribe(item => {
          var dataItem = item.data;
          this.formGroup.patchValue({ 
            type: dataItem.type,
            name: dataItem.name,
            name_url: dataItem.name_url,
          });
        });
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    }); 
  } 

  onChange(event: any) {
    if (event.value == "Président") {
      this.title = 'Nom du president';
    } else if (event.value == "Gouvernement") {
      this.title = 'Nom du premier ministre';
    } else if (event.value == "Sénateur") {
      this.title = 'Début et fin de la legislature';
    } else if (event.value == "Député national") {
      this.title = 'Début et fin de la legislature';
    } else if (event.value == "Député provincial") {
      this.title = 'Début et fin de la legislature';
    } else if (event.value == "Gourverneur") {
      this.title = 'Mandat début et fin';
    } else if (event.value == "Gourverneur") {
      this.title = 'Contrat en année';
    }
  }

  onSubmit() {
    try {
      this.isLoading = true;
      var body = {
        type: this.formGroup.value.type,
        name: this.formGroup.value.name,
        name_url: replaceSpecialChars(this.formGroup.value.name),
      }
      this.personCategoryFiltreService.update(parseInt(this.data['id']), body)
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
