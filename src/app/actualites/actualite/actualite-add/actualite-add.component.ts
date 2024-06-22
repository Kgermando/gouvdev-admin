import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Quill from 'quill';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { UserModel } from '../../../users/models/user.model';
import { AuthService } from '../../../auth/auth.service';
import { ActualiteService } from '../actualite.service';
import { truncateString } from '../../../shared/tools/truncate-string';
import { replaceSpecialChars } from '../../../shared/tools/replaceSpecialChars';
import { HttpClient, HttpEventType } from '@angular/common/http';


@Component({
  selector: 'app-actualite-add',
  templateUrl: './actualite-add.component.html',
  styleUrl: './actualite-add.component.scss'
})
export class ActualiteAddComponent implements OnInit {
  isLoading: boolean = false; 
  formGroup!: FormGroup;

  currentUser: UserModel | any;

  isPubieList: boolean[] = [false, true];

  selectedFile!: File;
  imageUrl!: string
  progress = 0;


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

  constructor( 
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private actualiteService: ActualiteService,  
    private httpClient: HttpClient,
    private toastr: ToastrService
  ) {}

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
      category: ['', Validators.required],
      sous_category: ['', Validators.required],
      sujet: ['', Validators.required],
      auteur: ['', Validators.required],
      resume: ['', Validators.required],
      content: ['', Validators.required],
      // is_publie: ['', Validators.required],
      // is_valid: ['', Validators.required], 
    });
  }


  // onFileSelected(event: any) {
  //   this.selectedFile = event.target.files[0];
  //   this.actualiteService.uploadFile(this.selectedFile).subscribe({
  //     next: (response) => {
  //       this.imageUrl = response.data;
  //       console.log('Upload successful!', response)
  //     },
  //     error: (error) => console.error('Upload failed:', error)
  //   });
  // }


  uploadFile(event: any) {
    this.selectedFile = event.target.files[0];
    this.actualiteService.uploadFile(this.selectedFile)
    .subscribe({
      next: (event) => { 
        this.imageUrl = event.body?.data; 
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
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body = {
          type: "Actualite",
          category: this.formGroup.value.category,
          sous_category: this.formGroup.value.sous_category,
          sujet_url: replaceSpecialChars(truncateString(this.formGroup.value.sujet)),
          sujet: this.formGroup.value.sujet,
          auteur: this.formGroup.value.auteur,
          resume: this.formGroup.value.resume,
          content: this.formGroup.value.content,
          image: this.imageUrl, 
          counter: 0,
          // is_publie: this.formGroup.value.is_publie,
          // is_valid: this.formGroup.value.is_valid,
          signature: this.currentUser.fullname, 
        };
        this.actualiteService.create(body).subscribe({
          next: (res) => {
            this.isLoading = false;
            this.formGroup.reset();
            this.toastr.success('Ajouter avec succès!', 'Success!');
            this.router.navigate(['/web/actualites/list']);
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

  transform(value: string): string {
    return value.replace(/ /g, "_");
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
