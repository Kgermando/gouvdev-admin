import { Component, OnInit, ViewChild } from '@angular/core'; 
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y'; 
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PersonnaliteModel } from '../models/personnalite.model'; 
import { PersonnaliteService } from '../personnalite.service';
import { UserModel } from '../../users/models/user.model';
import { CustomizerSettingsService } from '../../common/customizer-settings/customizer-settings.service';


@Component({
  selector: 'app-personnalite-list',
  templateUrl: './personnalite-list.component.html',
  styleUrls: ['./personnalite-list.component.scss']
})
export class PersonnaliteListComponent implements OnInit {
  displayedColumns: string[] = ['is_publie', 'Nom', 'sexe', 'category', 'category_gouv_aff_public', 'category_filtre', 'top_header', 'Counter'];
  
  ELEMENT_DATA: PersonnaliteModel[] = [];
  pageSize = 15; // Default page size
  pageNumber = 1; // Default page number
  totalPages = 0; // Stores total pages from API response 
  
  dataSource = new MatTableDataSource<PersonnaliteModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<PersonnaliteModel>(true, []);

  @ViewChild(MatSort) sort: MatSort | any;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;


  isLoading = false;
  currentUser: UserModel | any; 
  
  constructor(
      private _liveAnnouncer: LiveAnnouncer,
      public themeService: CustomizerSettingsService,
      private router: Router,
      private authService: AuthService,
      private personnaliteService: PersonnaliteService, 
      public dialog: MatDialog,
      private toastr: ToastrService
  ) {}



  ngOnInit() {
    this.isLoading = true;
    this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          this.personnaliteService.refreshDataList$.subscribe(() => {
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
    this.personnaliteService.getPaginated(this.pageSize, this.pageNumber)
      .subscribe(response => {
        this.ELEMENT_DATA = response.data; 
        this.dataSource = new MatTableDataSource<PersonnaliteModel>(this.ELEMENT_DATA);
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
      this.personnaliteService
      .delete(id)
      .subscribe({
        next: () => {
          this.toastr.info('Supprimé avec succès!', 'Success!');
          this.router.navigate(['/web/users/list']);
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




}
