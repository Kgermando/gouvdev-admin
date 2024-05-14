import { Component, Inject, OnInit, ViewChild } from '@angular/core';  
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y'; 
import { Router } from '@angular/router'; 
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import { truncateString } from '../../shared/tools/truncate-string';
import { GrandTitreService } from './grand-titre.service';
import { AuthService } from '../../auth/auth.service';
import { UserModel } from '../../users/models/user.model';
import { CustomizerSettingsService } from '../../common/customizer-settings/customizer-settings.service';
import { GrandTitreModel } from './models/grand-titre.model';
import { replaceSpecialChars } from '../../shared/tools/replaceSpecialChars';


@Component({
  selector: 'app-grand-titre',
  templateUrl: './grand-titre.component.html',
  styleUrl: './grand-titre.component.scss'
})
export class GrandTitreComponent implements OnInit {
  displayedColumns: string[] = ['numero', 'category', 'g_titre', 'counter', 'is_publie'];
  
  ELEMENT_DATA: GrandTitreModel[] = [];
  pageSize = 15; // Default page size
  pageNumber = 1; // Default page number
  totalPages = 0; // Stores total pages from API response 
  
  dataSource = new MatTableDataSource<GrandTitreModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<GrandTitreModel>(true, []);

  @ViewChild(MatSort) sort: MatSort | any;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;


  isLoading = false;
  currentUser: UserModel | any; 
  
  constructor(
      private _liveAnnouncer: LiveAnnouncer,
      public themeService: CustomizerSettingsService,
      private router: Router,
      private authService: AuthService,
      private grandTitreService: GrandTitreService,
      public dialog: MatDialog,
      private toastr: ToastrService
  ) {}



  ngOnInit() {
    this.isLoading = true;
    this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          this.grandTitreService.refreshDataList$.subscribe(() => {
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
    this.grandTitreService.getPaginated(this.pageSize, this.pageNumber)
      .subscribe(response => {
        this.ELEMENT_DATA = response.data; 
        this.dataSource = new MatTableDataSource<GrandTitreModel>(this.ELEMENT_DATA);
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
    this.dialog.open(CreateGrandTitreDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration, 
    }); 
  } 
  

  toggleTheme() {
    this.themeService.toggleTheme();
  }


}



@Component({
  selector: 'create-grand-titre-dialog',
  templateUrl: './create-grand-titre.html',
})
export class CreateGrandTitreDialogBox {
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
    public dialogRef: MatDialogRef<CreateGrandTitreDialogBox>,
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private grandTitreService: GrandTitreService,
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
      g_titre: ['', Validators.required],
      is_publie: ['', Validators.required],
    });
  }


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body = {
          category: this.formGroup.value.category,
          g_titre: this.formGroup.value.g_titre, 
          g_titre_url: replaceSpecialChars(truncateString(this.formGroup.value.g_titre)),
          counter: 0,
          is_publie: this.formGroup.value.is_publie,
          signature: this.currentUser.fullname,
        };
        this.grandTitreService.create(body).subscribe({
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

  // transform(value: string): string {
  //   return value.replace(/ /g, "_");
  // }


  close(){
    this.dialogRef.close(true);
  }

}

