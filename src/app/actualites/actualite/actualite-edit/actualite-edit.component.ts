import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; 
import { ToastrService } from 'ngx-toastr';
import Quill from 'quill';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { UserModel } from '../../../users/models/user.model';
import { ActualiteModel } from '../../models/actualite.model';
import { AuthService } from '../../../auth/auth.service';
import { ActualiteService } from '../actualite.service';
import { replaceSpecialChars } from '../../../shared/tools/replaceSpecialChars';
import { truncateString } from '../../../shared/tools/truncate-string';

@Component({
  selector: 'app-actualite-edit',
  templateUrl: './actualite-edit.component.html',
  styleUrl: './actualite-edit.component.scss'
})
export class ActualiteEditComponent implements OnInit {
  isLoading: boolean = false; 
  formGroup!: FormGroup;

  currentUser: UserModel | any; 
  actualite!: ActualiteModel;

  isPubieList: boolean[] = [false, true];

  selectedFile!: File;
  imageUrl!: string

  categoryList: string[] = [
    'Politiques et sécurités',
    'Economies et développements',
    'Societés',
    'Environnements',
    'Recherches et innovations', 
  ];
  sousCategoryList: string[] = [];

  politiquesSecuritesList: string[] = [
    'Politique',
    'Sécurité', 
  ];
  economieDeveloppementList: string[] = [
    'Economie',
    'Développement',
  ];
  societeList: string[] = [ 
    'Societé',
  ];
  environnementsList: string[] = [ 
    'Environnement', 
  ];
  recherchesInnovationList: string[] = [ 
    'Recherche et innovation', 
  ];

  id: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private authService: AuthService, 
    private actualiteService: ActualiteService, 
    private toastr: ToastrService) {}


 
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.actualiteService.uploadFile(this.selectedFile).subscribe({
      next: (response) => {
        this.imageUrl = response.data;
        console.log('Upload successful!', response.data)
      },
      error: (error) => console.error('Upload failed:', error)
    });
  } 


  ngOnInit(): void {
    this.id = this.route.snapshot.params['id']; 
    this.formGroup = this._formBuilder.group({
      category: [''],
      sous_category: [''],
      sujet: [''],
      auteur: [''],
      resume: [''],
      content: [''],
      is_publie: [''],
      is_valid: [''], 
    });

    this.authService.user().subscribe({
      next: (res) => {
        this.currentUser = res;
        this.actualiteService.get(this.id).subscribe(item => { 
          this.actualite = item.data;  
            this.formGroup.patchValue({
              category: this.actualite.category, 
              sous_category: this.actualite.sous_category, 
              sujet: this.actualite.sujet, 
              sujet_url: this.actualite.sujet, 
              auteur: this.actualite.auteur, 
              resume: this.actualite.resume, 
              content: this.actualite.content, 
              image: (this.imageUrl) ? this.imageUrl : this.actualite.image,  
              is_publie: this.actualite.is_publie,  
              is_valid: this.actualite.is_valid,  
            });
          }
        );
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
  }


  onChangeCategory(event: any) {
    if (event.value == "Politiques et sécurités") {
      this.sousCategoryList = this.politiquesSecuritesList;
    } else if (event.value == "Economies et développements") {
      this.sousCategoryList = this.economieDeveloppementList;
    } else if (event.value == "Societés") {
      this.sousCategoryList = this.societeList;
    } else if (event.value == "Environnements") {
      this.sousCategoryList = this.environnementsList;
    } else if (event.value == "Recherches et innovations") {
      this.sousCategoryList = this.recherchesInnovationList;
    }
  }


  onSubmit() {
    try {
      this.isLoading = true;
      var body = { 
        category: this.formGroup.value.category,
        sous_category: this.formGroup.value.sous_category,
        sujet_url: replaceSpecialChars(truncateString(this.formGroup.value.sujet)),
        sujet: this.formGroup.value.sujet,
        auteur: this.formGroup.value.auteur,
        resume: this.formGroup.value.resume,
        content: this.formGroup.value.content,
        image: (this.imageUrl) ? this.imageUrl : this.actualite.image,  
        is_publie: this.formGroup.value.is_publie,
        is_valid: this.formGroup.value.is_valid,
        signature: this.currentUser.fullname, 
      };
      this.actualiteService.update(this.id, body)
      .subscribe({
        next: () => {
          this.toastr.success('Modification enregistré!', 'Success!');
          this.router.navigate(['/web/actualites/list']);
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

  created(event: Quill) {}

  changedEditor(event: EditorChangeContent | EditorChangeSelection) {}

  focus($event:any) {
      this.focused = true
      this.blurred = false
  }

  blur($event:any) {
      this.focused = false
      this.blurred = true
  }


  capitalizeTest(text: string): string {
    return (text && text[0].toUpperCase() + text.slice(1).toLowerCase()) || text;
  }
 
}
