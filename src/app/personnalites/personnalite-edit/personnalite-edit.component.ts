import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { PersonnaliteService } from '../personnalite.service';
import { ToastrService } from 'ngx-toastr';
import Quill from 'quill';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { PersonnaliteModel } from '../models/personnalite.model';
import { TerritoireEquateurList, TerritoireVilleBasUeleList, TerritoireVilleHautKatangaList, TerritoireVilleHautLomamiList, TerritoireVilleHautUeleList, TerritoireVilleIturiList, TerritoireVilleKasaïCentralList, TerritoireVilleKasaïList, TerritoireVilleKasaïOrientalList, TerritoireVilleKinshasaList, TerritoireVilleKongoCentralList, TerritoireVilleKwangoList, TerritoireVilleKwiluList, TerritoireVilleLomaniList, TerritoireVilleLualabaList, TerritoireVilleMaiNdombeList, TerritoireVilleManiemaList, TerritoireVilleMongalaList, TerritoireVilleNordKivuList, TerritoireVilleNordUbanguiList, TerritoireVilleSankuruList, TerritoireVilleSudKivuList, TerritoireVilleSudUbanguiList, TerritoireVilleTanganyikaList, TerritoireVilleTshopoList, TerritoireVilleTshuapaList } from '../../shared/tools/territoire_ville';
import { ProvinceList } from '../../shared/tools/province-list';
import { UserModel } from '../../users/models/user.model';
import { PersonCategoryFiltreModel } from '../../person-category-filtre/models/person-category-filter.model';
import { PersonCategoryFiltreService } from '../../person-category-filtre/person-category-filtre.service';
import { HttpEventType } from '@angular/common/http';


@Component({
  selector: 'app-personnalite-edit',
  templateUrl: './personnalite-edit.component.html',
  styleUrls: ['./personnalite-edit.component.scss']
})
export class PersonnaliteEditComponent implements OnInit {
  isLoading: boolean = false;

  formGroup!: FormGroup;

  currentUser: UserModel | any;

  personnalite!: PersonnaliteModel;

  selectedFile!: File;


  photo!: string;
  isUploaded: boolean = true;
  progress = 0;


  categoryList: string[] = [
    'Politique',
    'Judiciaire',
    'Religieuse et coutumière',
    'Societé civile',
    'Artistique et culturelle',
    'Sportive',
    'Entrepreneurial',
  ]

  categorFiltreLists: PersonCategoryFiltreModel[] = [];
  categoryGouvAffPublicList: string[] = []

  PolitiquesList: string[] = [
    'Président',
    'Gouvernement',
    'Sénateur',
    'Député national',
    'Député provincial',
    'Gourverneur',
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

  isPubieList: boolean[] = [false, true];

  id: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private personnaliteService: PersonnaliteService,
    private personCategoryFiltreService: PersonCategoryFiltreService,
    private toastr: ToastrService) { }


  uploadFile(event: any) {
    this.selectedFile = event.target.files[0];
    this.personnaliteService.uploadFile(this.selectedFile)
      .subscribe({
        next: (event) => {
          this.photo = event.body?.data;
          if (event.type === HttpEventType.UploadProgress) {
            const progress = Math.round((event.loaded / (event.total ?? 1)) * 100); // Use optional chaining
            this.progress = progress;
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.formGroup = this._formBuilder.group({
      category: [''],
      category_gouv_aff_public: [''],
      category_filtre_name_url: [''],
      top_header: [''],
      // photo: [''],
      nom: [''],
      postnom: [''],
      prenom: [''],
      sexe: [''],
      birthday: [''],
      lieu_naissance: [''],
      nationalite: [''],
      etat_civile: [''],

      province: [''],
      territoire_ville: [''],
      secteur_chefferie: [''],
      village: [''],
      conjoint: [''],
      pere: [''],
      mere: [''],

      about: [''],
      // is_publie: [''],

      compte_fb: [''],
      compte_x: [''],
      compte_linkedIn: [''],
      compte_instagram: [''],
      compte_tiktok: [''],
      signature: [''],
    });

    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.personCategoryFiltreService.refreshDataList$.subscribe(() => {
          this.fetchProducts();
        });
        this.fetchProducts();
        this.personnaliteService.get(this.id).subscribe(item => {
          this.personnalite = item.data;
          this.formGroup.patchValue({
            category: this.personnalite.category,
            category_gouv_aff_public: this.personnalite.category_gouv_aff_public,
            category_filtre_name_url: this.personnalite.category_filtre_name_url,
            top_header: this.personnalite.top_header,
            photo: (this.photo) ? this.photo : this.personnalite.photo,
            nom: this.personnalite.nom,
            postnom: this.personnalite.postnom,
            prenom: this.personnalite.prenom,
            sexe: this.personnalite.sexe,
            birthday: this.personnalite.birthday,
            lieu_naissance: this.personnalite.lieu_naissance,
            nationalite: this.personnalite.nationalite,
            etat_civile: this.personnalite.etat_civile,

            province: this.personnalite.province,
            territoire_ville: this.personnalite.territoire_ville,
            secteur_chefferie: this.personnalite.secteur_chefferie,
            village: this.personnalite.village,
            conjoint: this.personnalite.conjoint,
            pere: this.personnalite.pere,
            mere: this.personnalite.mere,

            about: this.personnalite.about,
            // is_publie: this.personnalite.is_publie,

            compte_fb: this.personnalite.compte_fb,
            compte_x: this.personnalite.compte_x,
            compte_linkedIn: this.personnalite.compte_linkedin,
            compte_instagram: this.personnalite.compte_instagram,
            compte_tiktok: this.personnalite.compte_tiktok,
            signature: this.currentUser.fullname,
            personnalite_url: `${this.personnalite.prenom}_${this.personnalite.nom}_${this.personnalite.postnom}`.toLocaleLowerCase(),
          });
        });
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
  }

  fetchProducts() {
    this.personCategoryFiltreService.getAll()
      .subscribe(response => {
        this.categorFiltreLists = response.data;
        console.log("categorFiltreLists", this.categorFiltreLists)
      }
      );
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
      this.categorFiltreList = this.categorFiltreLists.filter(v => v.type == 'Gouvernement').map(value => value.name_url); // this.gouvernementsList;
      this.top_header = ['-']
    } else if (event.value === "Député provincial") {
      this.categorFiltreList = this.categorFiltreLists.filter(v => v.type == 'Député provincial').map(value => value.name_url); // this.deputeProvinciauxList;
      this.top_header = ['-']
    } else if (event.value === "Gourverneur") {
      this.categorFiltreList = this.categorFiltreLists.filter(v => v.type == 'Gourverneur').map(value => value.name_url); // this.gourverneursList;
      this.top_header = ['-']
    } else if (event.value === "Sénateur" || event.value === "Député national") {
      this.categorFiltreList = this.categorFiltreLists.filter(v => v.type == 'Député national').map(value => value.name_url); // this.deputeProvinciauxList;
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
      this.isLoading = true;
      var body = {
        category: this.formGroup.value.category,
        category_gouv_aff_public: this.formGroup.value.category_gouv_aff_public,
        category_filtre_name_url: this.formGroup.value.category_filtre_name_url,
        top_header: this.formGroup.value.top_header,
        photo: (this.photo) ? this.photo : this.personnalite.photo,
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

        // is_publie: this.formGroup.value.is_publie,
        signature: this.currentUser.fullname,
        personnalite_url: `${this.formGroup.value.prenom}_${this.formGroup.value.nom}_${this.formGroup.value.postnom}`.toLocaleLowerCase(),
      };
      this.personnaliteService.update(this.id, body)
        .subscribe({
          next: () => {
            this.toastr.success('Modification enregistré!', 'Success!');
            this.router.navigate(['/web/personnalites/list']);
            this.isLoading = false;
          },
          error: err => {
            console.log(err);
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            this.isLoading = false;
          }
        });
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
