import { Component, Inject, OnInit, ViewChild } from '@angular/core';  
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CustomizerSettingsService } from '../../../common/customizer-settings/customizer-settings.service';
import { Router } from '@angular/router'; 
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TextLegauxTitreModel } from '../models/text-legaux-titre.model';
import { UserModel } from '../../../users/models/user.model';
import { TextLegauxTitreService } from '../text-legaux-titre.service';    
import { AuthService } from '../../../auth/auth.service';
import { truncateString } from '../../../shared/tools/truncate-string';


@Component({
  selector: 'app-text-legaux-titre-list',
  templateUrl: './text-legaux-titre-list.component.html',
  styleUrls: ['./text-legaux-titre-list.component.scss']
})
export class TextLegauxTitreListComponent implements OnInit {
  displayedColumns: string[] = ['numero', 'category', 'titre', 'counter', 'is_publie', 'id'];
  
  ELEMENT_DATA: TextLegauxTitreModel[] = [];
  pageSize = 15; // Default page size
  pageNumber = 1; // Default page number
  totalPages = 0; // Stores total pages from API response 
  
  dataSource = new MatTableDataSource<TextLegauxTitreModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<TextLegauxTitreModel>(true, []);

  @ViewChild(MatSort) sort: MatSort | any;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;


  isLoading = false;
  currentUser: UserModel | any; 
  
  constructor(
      private _liveAnnouncer: LiveAnnouncer,
      public themeService: CustomizerSettingsService,
      private router: Router,
      private authService: AuthService,
      private textLegauxTitreService: TextLegauxTitreService, 
      public dialog: MatDialog,
      private toastr: ToastrService
  ) {}



  ngOnInit() {
    this.isLoading = true;
    this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          this.textLegauxTitreService.refreshDataList$.subscribe(() => {
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
    this.textLegauxTitreService.getPaginated(this.pageSize, this.pageNumber)
      .subscribe(response => {
        this.ELEMENT_DATA = response.data; 
        this.dataSource = new MatTableDataSource<TextLegauxTitreModel>(this.ELEMENT_DATA);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.totalPages = response.pagination.total_pages;

        this.isLoading = false;
      }
    );
  }

  handlePageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchProducts(); // Refetch data based on new page and size
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
    this.dialog.open(CreateTextLegauxTitreDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration, 
    }); 
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



@Component({
  selector: 'create-text-legaux-titre-dialog',
  templateUrl: './create-text-legaux-titre.html',
})
export class CreateTextLegauxTitreDialogBox {
  isLoading: boolean = false; 
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
    public dialogRef: MatDialogRef<CreateTextLegauxTitreDialogBox>,
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private textLegauxTitreService: TextLegauxTitreService,
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
      category: ['', Validators.required],
      titre: ['', Validators.required],
      is_publie: ['', Validators.required],
    });
  }


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body = {
          category: this.formGroup.value.category,
          titre: this.formGroup.value.titre, 
          titre_url: this.transform(truncateString(this.formGroup.value.titre)),
          counter: 0,
          is_publie: this.formGroup.value.is_publie,
          signature: this.currentUser.fullname,
          createdat: new Date(),
          updatedat: new Date(),
        };
        this.textLegauxTitreService.create(body).subscribe({
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

  transform(value: string): string {
    return value.replace(/ /g, "_");
  }


  close(){
    this.dialogRef.close(true);
  }

}


@Component({
  selector: 'edit-text-legaux-titre-dialog',
  templateUrl: './edit-text-legaux-titre.html',
})
export class EditTextLegauxTitreDialogBox implements OnInit {
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
      public dialogRef: MatDialogRef<EditTextLegauxTitreDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService, 
      private textLegauxTitreService: TextLegauxTitreService,
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({  
      category: [''],
      titre: [''],
      is_publie: [''],
    }); 
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user; 
        this.textLegauxTitreService.get(parseInt(this.data['id'])).subscribe(item => {
          var dataItem = item.data;
          this.formGroup.patchValue({
            category: dataItem.category,
            titre: dataItem.titre,
            titre_url: this.transform(truncateString(dataItem.titre)),
            is_publie: dataItem.is_publie,
            signature: this.currentUser.fullname, 
            updatedat: new Date(),
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
      this.textLegauxTitreService.update(parseInt(this.data['id']), this.formGroup.getRawValue())
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
