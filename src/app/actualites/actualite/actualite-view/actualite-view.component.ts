import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserModel } from '../../../users/models/user.model';
import { ActualiteModel, ActualiteOpinionModel } from '../../models/actualite.model';
import { CustomizerSettingsService } from '../../../common/customizer-settings/customizer-settings.service';
import { AuthService } from '../../../auth/auth.service';
import { ActualiteService } from '../actualite.service';
import { ActualiteOpinionService } from '../actualite-opinion.service';

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


  toggleTheme() {
    this.themeService.toggleTheme();
  }

}

