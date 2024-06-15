import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LayoutsComponent } from './layouts/layouts.component';
import { UserListComponent } from './users/user-list/user-list.component'; 
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UserViewComponent } from './users/user-view/user-view.component';
import { ActuListComponent } from './actus/actu-list/actu-list.component';
import { ActuViewComponent } from './actus/actu-view/actu-view.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OpinionListComponent } from './opinions/opinion-list/opinion-list.component'; 
import { OpinionViewComponent } from './opinions/opinion-view/opinion-view.component';
import { PersonnaliteListComponent } from './personnalites/personnalite-list/personnalite-list.component';
import { PersonnaliteAddComponent } from './personnalites/personnalite-add/personnalite-add.component';
import { PersonnaliteEditComponent } from './personnalites/personnalite-edit/personnalite-edit.component';
import { PersonnaliteViewComponent } from './personnalites/personnalite-view/personnalite-view.component';
import { PropositionLoisListComponent } from './proposition-lois/proposition-lois-list/proposition-lois-list.component';
import { PropositionLoisAddComponent } from './proposition-lois/proposition-lois-add/proposition-lois-add.component';
import { PropositionLoisEditComponent } from './proposition-lois/proposition-lois-edit/proposition-lois-edit.component';
import { PropositionLoisViewComponent } from './proposition-lois/proposition-lois-view/proposition-lois-view.component';
import { SondageListComponent } from './sondages/sondage-list/sondage-list.component';
import { SondageAddComponent } from './sondages/sondage-add/sondage-add.component';
import { SondageEditComponent } from './sondages/sondage-edit/sondage-edit.component';
import { SondageViewComponent } from './sondages/sondage-view/sondage-view.component'; 
import { ProfileComponent } from './auth/profile/profile.component';
import { ContactListComponent } from './contact/contact-list/contact-list.component';
import { ContactAddComponent } from './contact/contact-add/contact-add.component';
import { ContactEditComponent } from './contact/contact-edit/contact-edit.component';
import { ContactViewComponent } from './contact/contact-view/contact-view.component'; 
import { PersonnaliteSectionAddComponent } from './personnalite-sections/personnalite-section-add/personnalite-section-add.component';
import { PersonnaliteSectionEditComponent } from './personnalite-sections/personnalite-section-edit/personnalite-section-edit.component';
import { ActualiteListComponent } from './actualites/actualite/actualite-list/actualite-list.component';
import { ActualiteAddComponent } from './actualites/actualite/actualite-add/actualite-add.component';
import { ActualiteEditComponent } from './actualites/actualite/actualite-edit/actualite-edit.component';
import { ActualiteViewComponent } from './actualites/actualite/actualite-view/actualite-view.component'; 
import { ChoiceComponent } from './sondages/choice/choice.component';
import { PersonCategoryFiltreComponent } from './person-category-filtre/person-category-filtre.component'; 
import { TextListComponent } from './textes/text-list/text-list.component';
import { TextViewComponent } from './textes/text-view/text-view.component';
import { TextAddComponent } from './textes/text-add/text-add.component';
import { TextEditComponent } from './textes/text-edit/text-edit.component';
import { TeamListComponent } from './teams/team-list/team-list.component';
import { TeamAddComponent } from './teams/team-add/team-add.component';
import { TeamEditComponent } from './teams/team-edit/team-edit.component';
import { TeamViewComponent } from './teams/team-view/team-view.component';
import { ActualitesGuard, ContactGuard, PersonnalitesGuard, PropositionsLoisGuard, SondagesGuard, TeamsGuard, TextesGuard, UsersGuard, dashboardGuard } from './shared/guard/role.guard';
 
const routes: Routes = [
  { path: "auth", component: AuthComponent, children: [
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "", redirectTo: "login", pathMatch: "full" }
  ]},
  { path: "web", component: LayoutsComponent, children: [
    { path: 'profil', component: ProfileComponent },
    { path: "dashboard", component: DashboardComponent, canActivate: [dashboardGuard] },

    // User
    { path: "users/list", component: UserListComponent, canActivate: [UsersGuard] }, 
    { path: "users/:id/edit", component: UserEditComponent, canActivate: [UsersGuard] },
    { path: "users/:id/view", component: UserViewComponent, canActivate: [UsersGuard] },
    
    // Flash
    { path: "flash/list", component: ActuListComponent },  
    { path: "flash/:id/view", component: ActuViewComponent },

    // Contact
    { path: "contacts/list", component: ContactListComponent, canActivate: [ContactGuard] },
    { path: "contacts/add", component: ContactAddComponent, canActivate: [ContactGuard] },
    { path: "contacts/:id/edit", component: ContactEditComponent, canActivate: [ContactGuard] },
    { path: "contacts/:id/view", component: ContactViewComponent, canActivate: [ContactGuard] }, 

    // Personnalites
    { path: "personnalites/list", component: PersonnaliteListComponent, canActivate: [PersonnalitesGuard] },
    { path: "personnalites/add", component: PersonnaliteAddComponent, canActivate: [PersonnalitesGuard] },
    { path: "personnalites/:id/edit", component: PersonnaliteEditComponent, canActivate: [PersonnalitesGuard] },
    { path: "personnalites/:id/view", component: PersonnaliteViewComponent, canActivate: [PersonnalitesGuard] },

    { path: "personnalites/personnalite-section/:id/add", component: PersonnaliteSectionAddComponent, canActivate: [PersonnalitesGuard] },
    { path: "personnalites/personnalite-section/:id/edit", component: PersonnaliteSectionEditComponent, canActivate: [PersonnalitesGuard] }, 

    { path: "personnalites/person-category-filtre", component: PersonCategoryFiltreComponent, canActivate: [PersonnalitesGuard] }, 

    // Sondages
    { path: "sondages/list", component: SondageListComponent, canActivate: [SondagesGuard] },
    { path: "sondages/add", component: SondageAddComponent, canActivate: [SondagesGuard] },
    { path: "sondages/:id/edit", component: SondageEditComponent, canActivate: [SondagesGuard] },
    { path: "sondages/:id/view", component: SondageViewComponent, canActivate: [SondagesGuard] },
    { path: "sondages/:id/choices", component: ChoiceComponent, canActivate: [SondagesGuard] },

    // Opinions
    { path: "opinions/list", component: OpinionListComponent, canActivate: [SondagesGuard] }, 
    { path: "opinions/:id/view", component: OpinionViewComponent, canActivate: [SondagesGuard] },
    
    // Propositions lois
    { path: "proposition-lois/list", component: PropositionLoisListComponent, canActivate: [PropositionsLoisGuard] },
    { path: "proposition-lois/add", component: PropositionLoisAddComponent, canActivate: [PropositionsLoisGuard]},
    { path: "proposition-lois/:id/edit", component: PropositionLoisEditComponent, canActivate: [PropositionsLoisGuard] },
    { path: "proposition-lois/:id/view", component: PropositionLoisViewComponent, canActivate: [PropositionsLoisGuard] }, 

    // Textes
    { path: "textes/list", component: TextListComponent , canActivate: [TextesGuard]}, 
    { path: "textes/add", component: TextAddComponent , canActivate: [TextesGuard]},
    { path: "textes/:id/edit", component: TextEditComponent , canActivate: [TextesGuard]},
    { path: "textes/:id/view", component: TextViewComponent , canActivate: [TextesGuard]},

    // Actualites
    { path: "actualites/list", component: ActualiteListComponent , canActivate: [ActualitesGuard]},
    { path: "actualites/add", component: ActualiteAddComponent, canActivate: [ActualitesGuard] },
    { path: "actualites/:id/edit", component: ActualiteEditComponent, canActivate: [ActualitesGuard] },
    { path: "actualites/:id/view", component: ActualiteViewComponent, canActivate: [ActualitesGuard] },

    // Teams
    { path: "teams/list", component: TeamListComponent, canActivate: [TeamsGuard] },
    { path: "teams/add", component: TeamAddComponent , canActivate: [TeamsGuard]},
    { path: "teams/:id/edit", component: TeamEditComponent , canActivate: [TeamsGuard]},
    { path: "teams/:id/view", component: TeamViewComponent, canActivate: [TeamsGuard] },


    { path: "", redirectTo: "dashboard", pathMatch: "full"},
  ]},
  { path: "", redirectTo: "auth", pathMatch: "full"},
  { path: "**", redirectTo: "auth"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
