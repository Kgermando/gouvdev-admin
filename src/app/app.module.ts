import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CredentialInterceptor } from './common/interceptors/credential.interceptor';
import localeFr from '@angular/common/locales/fr';
import { DatePipe, registerLocaleData } from '@angular/common';
import { ErrorStateMatcher, MAT_DATE_LOCALE, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

import { ToastrModule, provideToastr } from 'ngx-toastr';
import { NgxEchartsModule } from 'ngx-echarts';
import { QuillModule } from 'ngx-quill';

import { CustomizerSettingsComponent } from './common/customizer-settings/customizer-settings.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { FooterComponent } from './common/footer/footer.component';
import { HeaderComponent } from './common/header/header.component';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { InternalErrorComponent } from './common/internal-error/internal-error.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NumberFormatPipe } from './pipes/number-format.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { SharedModule } from './shared/shared.module';
import { LayoutsComponent } from './layouts/layouts.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserViewComponent } from './users/user-view/user-view.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { ContactListComponent } from './contact/contact-list/contact-list.component';
import { ContactAddComponent } from './contact/contact-add/contact-add.component';
import { ContactEditComponent } from './contact/contact-edit/contact-edit.component';
import { ContactViewComponent } from './contact/contact-view/contact-view.component';
import { ActuListComponent, CreateActuDialogBox, EditActuDialogBox } from './actus/actu-list/actu-list.component';
import { ActuViewComponent } from './actus/actu-view/actu-view.component';
import { PersonnaliteListComponent } from './personnalites/personnalite-list/personnalite-list.component';
import { PersonnaliteViewComponent } from './personnalites/personnalite-view/personnalite-view.component';
import { PersonnaliteAddComponent } from './personnalites/personnalite-add/personnalite-add.component';
import { PersonnaliteEditComponent } from './personnalites/personnalite-edit/personnalite-edit.component';
import { PropositionLoisListComponent } from './proposition-lois/proposition-lois-list/proposition-lois-list.component';
import { PropositionLoisAddComponent } from './proposition-lois/proposition-lois-add/proposition-lois-add.component';
import { PropositionLoisViewComponent } from './proposition-lois/proposition-lois-view/proposition-lois-view.component';
import { PropositionLoisEditComponent } from './proposition-lois/proposition-lois-edit/proposition-lois-edit.component';
import { SondageListComponent } from './sondages/sondage-list/sondage-list.component';
import { SondageAddComponent } from './sondages/sondage-add/sondage-add.component';
import { SondageEditComponent } from './sondages/sondage-edit/sondage-edit.component';
import { EditSondageDialogBox, SondageViewComponent } from './sondages/sondage-view/sondage-view.component';
import { OpinionListComponent } from './opinions/opinion-list/opinion-list.component'; 
import { OpinionViewComponent } from './opinions/opinion-view/opinion-view.component';
import { TextLegauxAddComponent } from './text-legaux/text-legaux-content/text-legaux-add/text-legaux-add.component';
import { TextLegauxEditComponent } from './text-legaux/text-legaux-content/text-legaux-edit/text-legaux-edit.component';
import { CreateTextLegauxTitreDialogBox, EditTextLegauxTitreDialogBox, TextLegauxTitreListComponent } from './text-legaux/text-legaux-titre/text-legaux-titre-list/text-legaux-titre-list.component';
import { TextLegauxTitreViewComponent } from './text-legaux/text-legaux-titre/text-legaux-titre-view/text-legaux-titre-view.component';
import { AuthComponent } from './auth/auth.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChangePasswordDialogBox, ChangePhotoDialogBox, ProfileComponent, UpdateInfoDialogBox } from './auth/profile/profile.component';
import { LimiterTextPipe } from './pipes/limiter-text.pipe';
import { PersonnaliteSectionAddComponent } from './personnalite-sections/personnalite-section-add/personnalite-section-add.component';
import { PersonnaliteSectionEditComponent } from './personnalite-sections/personnalite-section-edit/personnalite-section-edit.component';
import { OpinionUserComponent } from './opinions/opinion-user/opinion-user.component';
import { OpinionSondageComponent } from './opinions/opinion-sondage/opinion-sondage.component';
import { StatsNumberComponent } from './dashboard/stats-number/stats-number.component';
import { StatsPieSexeComponent } from './dashboard/stats-pie-sexe/stats-pie-sexe.component';
import { ActualiteListComponent } from './actualites/actualite/actualite-list/actualite-list.component';
import { ActualiteAddComponent } from './actualites/actualite/actualite-add/actualite-add.component';
import { ActualiteEditComponent } from './actualites/actualite/actualite-edit/actualite-edit.component';
import { ActualiteViewComponent } from './actualites/actualite/actualite-view/actualite-view.component';
import { CreateGrandTitreDialogBox, GrandTitreComponent } from './text-legaux/grand-titre/grand-titre.component';
import { EditGrandTitreDialogBox, GrandTitreViewComponent } from './text-legaux/grand-titre/grand-titre-view/grand-titre-view.component';
import { GtitreViewComponent } from './text-legaux/text-legaux-titre/text-legaux-titre-view/gtitre-view/gtitre-view.component';
import { ReplaceSpecialCharsPipe } from './pipes/replace-special-chars.pipe';


registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    FooterComponent,
    HeaderComponent,
    NotFoundComponent,
    InternalErrorComponent,
    CustomizerSettingsComponent,

    NumberFormatPipe,
    FilterPipe,
    DateAgoPipe,
    LimiterTextPipe,
    LayoutsComponent,
    LoginComponent,
    RegisterComponent,
    UserListComponent,
    UserViewComponent,
    UserEditComponent,
    ContactListComponent,
    ContactAddComponent,
    ContactEditComponent,
    ContactViewComponent,
    ActuListComponent,
    ActuViewComponent,
    PersonnaliteListComponent,
    PersonnaliteViewComponent,
    PersonnaliteAddComponent,
    PersonnaliteEditComponent,
    PropositionLoisListComponent,
    PropositionLoisAddComponent,
    PropositionLoisViewComponent,
    PropositionLoisEditComponent,
    SondageListComponent,
    SondageAddComponent,
    SondageEditComponent,
    SondageViewComponent,
    OpinionListComponent, 
    OpinionViewComponent,
    TextLegauxAddComponent,
    TextLegauxEditComponent,
    TextLegauxTitreListComponent,
    TextLegauxTitreViewComponent,
    AuthComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    DashboardComponent,
    ProfileComponent,
    UpdateInfoDialogBox,
    ChangePhotoDialogBox,
    ChangePasswordDialogBox,

    CreateActuDialogBox,
    LimiterTextPipe,
    EditActuDialogBox,
    CreateTextLegauxTitreDialogBox,
    EditTextLegauxTitreDialogBox,
    PersonnaliteSectionAddComponent,
    PersonnaliteSectionEditComponent,
    EditSondageDialogBox,
    OpinionUserComponent,
    OpinionSondageComponent,
    StatsNumberComponent, StatsPieSexeComponent,
    ActualiteListComponent,
    ActualiteAddComponent,
    ActualiteEditComponent,
    ActualiteViewComponent,
    GrandTitreComponent,
    CreateGrandTitreDialogBox,
    EditGrandTitreDialogBox,
    GrandTitreViewComponent,
    GtitreViewComponent,
    ReplaceSpecialCharsPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    SharedModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    QuillModule.forRoot(),
    ToastrModule.forRoot(),

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CredentialInterceptor,
      multi: true
    },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: LOCALE_ID, useValue: "fr-FR" },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    provideAnimations(), // required animations providers
    provideToastr(),
    NumberFormatPipe,
    DateAgoPipe,
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
