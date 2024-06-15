import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserModel } from '../../users/models/user.model';
import { CustomizerSettingsService } from '../../common/customizer-settings/customizer-settings.service';
import { AuthService } from '../../auth/auth.service'; 
import { TeamModel } from '../models/team.model';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-team-view',
  templateUrl: './team-view.component.html',
  styleUrl: './team-view.component.scss'
})
export class TeamViewComponent implements OnInit {
  isLoading = false;

  team!: TeamModel;

  currentUser!: UserModel; 

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private teamService: TeamService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        let id = this.route.snapshot.paramMap.get('id');  // this.route.snapshot.params['id'];
        this.teamService.refreshData$.subscribe(() => {
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
    this.teamService.get(Number(id)).subscribe(res => {
      this.team = res.data;
      this.isLoading = false;
    });
  }


  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      this.teamService
        .delete(id)
        .subscribe({
          next: () => {
            this.toastr.info('Supprimé avec succès!', 'Success!');
            this.router.navigate(['/web/teams/list']);
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

