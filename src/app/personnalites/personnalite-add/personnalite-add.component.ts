import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service'; 
import { PersonnaliteService } from '../personnalite.service';
import { ToastrService } from 'ngx-toastr';
import Quill from 'quill';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill'; 
import { TerritoireEquateurList, TerritoireVilleBasUeleList, TerritoireVilleHautKatangaList, TerritoireVilleHautLomamiList, TerritoireVilleHautUeleList, TerritoireVilleIturiList, TerritoireVilleKasaïCentralList, TerritoireVilleKasaïList, TerritoireVilleKasaïOrientalList, TerritoireVilleKinshasaList, TerritoireVilleKongoCentralList, TerritoireVilleKwangoList, TerritoireVilleKwiluList, TerritoireVilleLomaniList, TerritoireVilleLualabaList, TerritoireVilleMaiNdombeList, TerritoireVilleManiemaList, TerritoireVilleMongalaList, TerritoireVilleNordKivuList, TerritoireVilleNordUbanguiList, TerritoireVilleSankuruList, TerritoireVilleSudKivuList, TerritoireVilleSudUbanguiList, TerritoireVilleTanganyikaList, TerritoireVilleTshopoList, TerritoireVilleTshuapaList } from '../../shared/tools/territoire_ville';
import { UserModel } from '../../users/models/user.model';
import { ProvinceList } from '../../shared/tools/province-list';

@Component({
  selector: 'app-personnalite-add',
  templateUrl: './personnalite-add.component.html',
  styleUrls: ['./personnalite-add.component.scss']
})
export class PersonnaliteAddComponent implements OnInit {
  isLoading: boolean = false;

  formGroup!: FormGroup;

  currentUser: UserModel | any;

  selectedFile!: File;
  photo!: string;


  categoryList: string[] = [
    'Politique',
    'Judiciaire',
    'Religieuse et coutumière',
    'Societé civile',
    'Artistique et culturelle',
    'Sportive',
    'Entrepreneurial',
  ]


  categoryGouvAffPublicList: string[] = []

  PolitiquesList: string[] = [
    'Président',
    'Gouvernement',
    'Sénateur',
    'Député national',
    'Député provincial',
    'Gourverneur',
    'Mandataire',
    '-',
  ]

  categorFiltreList: string[] = []

  gouvernementsList: string[] = [
    'Premier ministre', // Pour les ministres centres
    'Vice Premier ministre',
    'Ministre d\'Etat',
    'Ministre',
    'Vice ministre',
    '-',
  ]
  deputeProvinciauxList: string[] = [
    '2023-2028', // Filtre des legislateurs 
    '-',
  ]
  gourverneursList: string[] = ProvinceList;

  top_header: string[] = []

  deputeNationalSenatList: string[] = [
    'Président',
    '1er vice-président',
    '2em vice-président',  // Deuxième vice-président
    'Rapporteur',
    'Rapporteur adjoint',
    'Questeur',
    'Questeur adjoint',
    '-',
  ]


  sexeList: string[] = [
    'Femme',
    'Homme',
  ]


  etatCivileList: string[] = [
    'Celibataire',
    'Marié',
    'Veuf',
  ]

  provinceList: string[] = ProvinceList;
  territoireVilleList: string[] = [];

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private personnaliteService: PersonnaliteService,
    private toastr: ToastrService) { }

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
      category: [''],
      category_gouv_aff_public: ['', Validators.required],
      category_filtre: ['', Validators.required],
      top_header: ['', Validators.required],
      // photo: [''],
      nom: ['', Validators.required],
      postnom: ['', Validators.required],
      prenom: ['', Validators.required],
      sexe: ['', Validators.required],
      birthday: ['', Validators.required],
      lieu_naissance: ['', Validators.required],
      nationalite: ['', Validators.required],
      etat_civile: ['', Validators.required],

      province: ['', Validators.required],
      territoire_ville: ['', Validators.required],
      secteur_chefferie: ['', Validators.required],
      village: ['', Validators.required],
      conjoint: [''],
      pere: ['', Validators.required],
      mere: ['', Validators.required],

      about: ['', Validators.required],

      compte_fb: [''],
      compte_x: [''],
      compte_linkedIn: [''],
      compte_instagram: [''],
      compte_tiktok: [''],

    });
  }


  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.personnaliteService.uploadFile(this.selectedFile).subscribe({
      next: (response) => {
        this.photo = response.data;
        console.log('Upload successful!', response.data)
      },
      error: (error) => console.error('Upload failed:', error)
    });
  }

  onChangeCategory(event: any) {
    if (event.value === "Politique") {
      this.categoryGouvAffPublicList = this.PolitiquesList
    } else {
      this.categoryGouvAffPublicList = ['-']
    }
  }

  onChangeCategoryGouvAffpublic(event: any) {
    if (event.value === "Gouvernement") {
      this.categorFiltreList = this.gouvernementsList;
      this.top_header = ['-']
    } else if (event.value === "Député provincial") {
      this.categorFiltreList = this.deputeProvinciauxList;
      this.top_header = ['-']
    } else if (event.value === "Gourverneur") {
      this.categorFiltreList = this.gourverneursList;
      this.top_header = ['-']
    } else if (event.value === "Sénateur" || event.value === "Député national") {
      this.categorFiltreList = this.deputeProvinciauxList;
      this.top_header = this.deputeNationalSenatList;
    } else {
      this.categorFiltreList = ['-']
      this.top_header = ['-']
    }
  }


  onChangeProvince(event: any) {
    if (event.value === "Bas-Uele") {
      this.territoireVilleList = TerritoireVilleBasUeleList;
    } else if (event.value === "Equateur") {
      this.territoireVilleList = TerritoireEquateurList;
    } else if (event.value === "Haut-Lomami") {
      this.territoireVilleList = TerritoireVilleHautLomamiList;
    } else if (event.value === "Haut-Katanga") {
      this.territoireVilleList = TerritoireVilleHautKatangaList;
    } else if (event.value === "Haut-Uele") {
      this.territoireVilleList = TerritoireVilleHautUeleList;
    } else if (event.value === "Ituri") {
      this.territoireVilleList = TerritoireVilleIturiList;
    } else if (event.value === "Kasaï") {
      this.territoireVilleList = TerritoireVilleKasaïList;
    } else if (event.value === "Kasaï Central") {
      this.territoireVilleList = TerritoireVilleKasaïCentralList;
    } else if (event.value === "Kasaï Oriental") {
      this.territoireVilleList = TerritoireVilleKasaïOrientalList;
    } else if (event.value === "Kinshasa") {
      this.territoireVilleList = TerritoireVilleKinshasaList;
    } else if (event.value === "Kongo Central") {
      this.territoireVilleList = TerritoireVilleKongoCentralList;
    } else if (event.value === "Kwango") {
      this.territoireVilleList = TerritoireVilleKwangoList;
    } else if (event.value === "Kwilu") {
      this.territoireVilleList = TerritoireVilleKwiluList;
    } else if (event.value === "Lualaba") {
      this.territoireVilleList = TerritoireVilleLualabaList;
    } else if (event.value === "Lomani") {
      this.territoireVilleList = TerritoireVilleLomaniList;
    } else if (event.value === "Maniema") {
      this.territoireVilleList = TerritoireVilleManiemaList;
    } else if (event.value === "Mai-Ndombe") {
      this.territoireVilleList = TerritoireVilleMaiNdombeList;
    } else if (event.value === "Mongala") {
      this.territoireVilleList = TerritoireVilleMongalaList;
    } else if (event.value === "Nord Kivu") {
      this.territoireVilleList = TerritoireVilleNordKivuList;
    } else if (event.value === "Nord-Ubangui") {
      this.territoireVilleList = TerritoireVilleNordUbanguiList;
    } else if (event.value === "Sankuru") {
      this.territoireVilleList = TerritoireVilleSankuruList;
    } else if (event.value === "Sud Kivu") {
      this.territoireVilleList = TerritoireVilleSudKivuList;
    } else if (event.value === "Sud-Ubangui") {
      this.territoireVilleList = TerritoireVilleSudUbanguiList;
    } else if (event.value === "Tanganyika") {
      this.territoireVilleList = TerritoireVilleTanganyikaList;
    } else if (event.value === "Tshopo") {
      this.territoireVilleList = TerritoireVilleTshopoList;
    } else if (event.value === "Tshuapa") {
      this.territoireVilleList = TerritoireVilleTshuapaList;
    } else {
      this.territoireVilleList = []
    }
  }


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body = {
          category: this.formGroup.value.category,
          category_gouv_aff_public: this.formGroup.value.category_gouv_aff_public,
          category_filtre: this.formGroup.value.category_filtre,
          top_header: this.formGroup.value.top_header,

          photo: this.photo,
          nom: this.capitalizeTest(this.formGroup.value.nom),
          postnom: this.capitalizeTest(this.formGroup.value.postnom),
          prenom: this.capitalizeTest(this.formGroup.value.prenom),
          sexe: this.formGroup.value.sexe,
          birthday: this.formGroup.value.birthday,
          lieu_naissance: this.formGroup.value.lieu_naissance,
          nationalite: this.formGroup.value.nationalite,
          etat_civile: this.formGroup.value.etat_civile,

          province: this.formGroup.value.province,
          territoire_ville: this.formGroup.value.territoire_ville,
          secteur_chefferie: this.formGroup.value.secteur_chefferie,
          village: this.formGroup.value.village,
          conjoint: this.formGroup.value.conjoint,
          pere: this.formGroup.value.pere,
          mere: this.formGroup.value.mere,


          about: this.formGroup.value.about,

          compte_fb: this.formGroup.value.compte_fb,
          compte_x: this.formGroup.value.compte_x,
          compte_linkedIn: this.formGroup.value.compte_linkedIn,
          compte_instagram: this.formGroup.value.compte_instagram,
          compte_tiktok: this.formGroup.value.compte_tiktok,

          counter: 0,
          is_publie: false,
          signature: this.currentUser.fullname,
          personnalite_url: `${this.formGroup.value.prenom}_${this.formGroup.value.nom}_${this.formGroup.value.postnom}`.toLocaleLowerCase(),
        };
        this.personnaliteService.create(body).subscribe({
          next: (res) => {
            this.isLoading = false;
            this.formGroup.reset();
            this.toastr.success('Ajouter avec succès!', 'Success!');
            this.router.navigate(['/web/personnalites/list']);
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


  blurred = false
  focused = false

  created(event: Quill) { }

  changedEditor(event: EditorChangeContent | EditorChangeSelection) { }

  focus($event: any) {
    this.focused = true
    this.blurred = false
  }

  blur($event: any) {
    this.focused = false
    this.blurred = true
  }


  capitalizeTest(text: string): string {
    return (text && text[0].toUpperCase() + text.slice(1).toLowerCase()) || text;
  }


}
