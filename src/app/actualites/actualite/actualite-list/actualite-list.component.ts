import { Component, Inject, OnInit, ViewChild } from '@angular/core'; 
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator'; 
import { LiveAnnouncer } from '@angular/cdk/a11y'; 
import { Router } from '@angular/router'; 
import { ToastrService } from 'ngx-toastr'; 
import { UserModel } from '../../../users/models/user.model';
import { CustomizerSettingsService } from '../../../common/customizer-settings/customizer-settings.service';
import { AuthService } from '../../../auth/auth.service';
import { ActualiteService } from '../actualite.service';
import { ActualiteModel } from '../../models/actualite.model';


@Component({
  selector: 'app-actualite-list',
  templateUrl: './actualite-list.component.html',
  styleUrl: './actualite-list.component.scss'
})
export class ActualiteListComponent implements OnInit {
  displayedColumns: string[] = ['sujet', 'auteur', 'counter', 'is_publie', 'is_valid'];

  ELEMENT_DATA: ActualiteModel[] = [];
  pageSize = 15; // Default page size
  pageNumber = 1; // Default page number
  totalPages = 0; // Stores total pages from API response 
  
  dataSource = new MatTableDataSource<ActualiteModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<ActualiteModel>(true, []);

  @ViewChild(MatSort) sort: MatSort | any;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;


  isLoading = false;
  currentUser: UserModel | any; 
  
  constructor(
      private _liveAnnouncer: LiveAnnouncer,
      public themeService: CustomizerSettingsService,
      private router: Router,
      private authService: AuthService,
      private actualiteService: ActualiteService,  
      private toastr: ToastrService
  ) {}



  ngOnInit() {
    this.isLoading = true;
    this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user; 
          this.actualiteService.refreshDataList$.subscribe(() => {
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
    this.actualiteService.getPaginated(this.pageSize, this.pageNumber)
      .subscribe(response => {
        this.ELEMENT_DATA = response.data;  
        this.dataSource = new MatTableDataSource<ActualiteModel>(this.ELEMENT_DATA);
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
}
