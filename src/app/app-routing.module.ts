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
import { JonctionPersonCategoryComponent } from './jonction-person-category/jonction-person-category.component';
import { TextListComponent } from './textes/text-list/text-list.component';
import { TextViewComponent } from './textes/text-view/text-view.component';
import { TextAddComponent } from './textes/text-add/text-add.component';
import { TextEditComponent } from './textes/text-edit/text-edit.component';
 
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
    
    // Flash
    { path: "flash/list", component: ActuListComponent },  
    { path: "flash/:id/view", component: ActuViewComponent },

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

    { path: "personnalites/person-category-filtre", component: PersonCategoryFiltreComponent },
    { path: "personnalites/jonction-person-category", component: JonctionPersonCategoryComponent },

    // Sondages
    { path: "sondages/list", component: SondageListComponent },
    { path: "sondages/add", component: SondageAddComponent },
    { path: "sondages/:id/edit", component: SondageEditComponent },
    { path: "sondages/:id/view", component: SondageViewComponent },
    { path: "sondages/:id/choices", component: ChoiceComponent },

    // Opinions
    { path: "opinions/list", component: OpinionListComponent }, 
    { path: "opinions/:id/view", component: OpinionViewComponent },
    

    // Propositions lois
    { path: "proposition-lois/list", component: PropositionLoisListComponent },
    { path: "proposition-lois/add", component: PropositionLoisAddComponent },
    { path: "proposition-lois/:id/edit", component: PropositionLoisEditComponent },
    { path: "proposition-lois/:id/view", component: PropositionLoisViewComponent }, 

    // Textes
    { path: "textes/list", component: TextListComponent }, 
    { path: "textes/add", component: TextAddComponent },
    { path: "textes/:id/edit", component: TextEditComponent },
    { path: "textes/:id/view", component: TextViewComponent },

    // Actualites
    { path: "actualites/list", component: ActualiteListComponent },
    { path: "actualites/add", component: ActualiteAddComponent },
    { path: "actualites/:id/edit", component: ActualiteEditComponent },
    { path: "actualites/:id/view", component: ActualiteViewComponent },


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
