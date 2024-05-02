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
import { OpinionAddComponent } from './opinions/opinion-add/opinion-add.component';
import { OpinionEditComponent } from './opinions/opinion-edit/opinion-edit.component';
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
import { TextLegauxAddComponent } from './text-legaux/text-legaux-content/text-legaux-add/text-legaux-add.component';
import { TextLegauxEditComponent } from './text-legaux/text-legaux-content/text-legaux-edit/text-legaux-edit.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { ContactListComponent } from './contact/contact-list/contact-list.component';
import { ContactAddComponent } from './contact/contact-add/contact-add.component';
import { ContactEditComponent } from './contact/contact-edit/contact-edit.component';
import { ContactViewComponent } from './contact/contact-view/contact-view.component';
import { TextLegauxTitreListComponent } from './text-legaux/text-legaux-titre/text-legaux-titre-list/text-legaux-titre-list.component';
import { TextLegauxTitreViewComponent } from './text-legaux/text-legaux-titre/text-legaux-titre-view/text-legaux-titre-view.component';
import { PersonnaliteSectionAddComponent } from './personnalite-sections/personnalite-section-add/personnalite-section-add.component';
import { PersonnaliteSectionEditComponent } from './personnalite-sections/personnalite-section-edit/personnalite-section-edit.component';
 
const routes: Routes = [
  { path: "auth", component: AuthComponent, children: [
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "", redirectTo: "login", pathMatch: "full" }
  ]},
  { path: "web", component: LayoutsComponent, children: [
    { path: 'profil', component: ProfileComponent },
    { path: "dashboard", component: DashboardComponent },

    // User
    { path: "users/list", component: UserListComponent }, 
    { path: "users/:id/edit", component: UserEditComponent },
    { path: "users/:id/view", component: UserViewComponent },
    
    // Actu
    { path: "actualites/list", component: ActuListComponent },  
    { path: "actualites/:id/view", component: ActuViewComponent },

    // Contact
    { path: "contacts/list", component: ContactListComponent },
    { path: "contacts/add", component: ContactAddComponent },
    { path: "contacts/:id/edit", component: ContactEditComponent },
    { path: "contacts/:id/view", component: ContactViewComponent }, 

    // Personnalites
    { path: "personnalites/list", component: PersonnaliteListComponent },
    { path: "personnalites/add", component: PersonnaliteAddComponent },
    { path: "personnalites/:id/edit", component: PersonnaliteEditComponent },
    { path: "personnalites/:id/view", component: PersonnaliteViewComponent },

    { path: "personnalites/personnalite-section/:id/add", component: PersonnaliteSectionAddComponent },
    { path: "personnalites/personnalite-section/:id/edit", component: PersonnaliteSectionEditComponent }, 

    // Sondages
    { path: "sondages/list", component: SondageListComponent },
    { path: "sondages/add", component: SondageAddComponent },
    { path: "sondages/:id/edit", component: SondageEditComponent },
    { path: "sondages/:id/view", component: SondageViewComponent },

    // Opinions
    { path: "opinions/list", component: OpinionListComponent },
    { path: "opinions/add", component: OpinionAddComponent },
    { path: "opinions/:id/edit", component: OpinionEditComponent },
    { path: "opinions/:id/view", component: OpinionViewComponent },
    

    // Propositions lois
    { path: "proposition-lois/list", component: PropositionLoisListComponent },
    { path: "proposition-lois/add", component: PropositionLoisAddComponent },
    { path: "proposition-lois/:id/edit", component: PropositionLoisEditComponent },
    { path: "proposition-lois/:id/view", component: PropositionLoisViewComponent }, 


    // Text-legaux-titre
    { path: "text-legaux-titre/list", component: TextLegauxTitreListComponent }, 
    { path: "text-legaux-titre/:id/view", component: TextLegauxTitreViewComponent },

    // Text-legaux
    { path: "text-legaux/:id/add", component: TextLegauxAddComponent },
    { path: "text-legaux/:id/edit", component: TextLegauxEditComponent },
    



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
