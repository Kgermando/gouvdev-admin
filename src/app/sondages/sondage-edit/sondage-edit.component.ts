import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { SondageService } from '../sondage.service';
import { ToastrService } from 'ngx-toastr';
import Quill from 'quill';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { SondageModel } from '../models/sondage.model'; 
import { UserModel } from '../../users/models/user.model';

@Component({
  selector: 'app-sondage-edit',
  templateUrl: './sondage-edit.component.html',
  styleUrls: ['./sondage-edit.component.scss']
})
export class SondageEditComponent implements OnInit {
  isLoading: boolean = false; 
  formGroup!: FormGroup;

  currentUser: UserModel | any; 
  sondage!: SondageModel;

  isPubieList: boolean[] = [false, true];

  selectedFile!: File;
  imageUrl!: string

  id: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private authService: AuthService, 
    private sondageService: SondageService, 
    private toastr: ToastrService) {}




  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.sondageService.uploadFile(this.selectedFile).subscribe(
      (response) => {
        this.imageUrl = response.data;
        console.log('Upload successful!', response.data)
      },
      (error) => console.error('Upload failed:', error)
    );
  }


  ngOnInit(): void {
    this.id = this.route.snapshot.params['id']; 
    this.formGroup = this._formBuilder.group({
      sujet: [''],
      auteur: [''],
      resume: [''],
      content: [''],
      thematique: [''],
      is_publie: [''],
    });

    this.authService.user().subscribe({
      next: (res) => {
        this.currentUser = res;
        this.sondageService.get(this.id).subscribe(item => { 
          this.sondage = item.data;  
            this.formGroup.patchValue({
              sujet: this.sondage.sujet, 
              auteur: this.sondage.auteur, 
              resume: this.sondage.resume, 
              content: this.sondage.content, 
              image: (this.imageUrl) ? this.imageUrl : this.sondage.image, 
              thematique: this.sondage.thematique, 
              is_publie: this.sondage.is_publie, 
              // updatedat: new Date()
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



  onSubmit() {
    try {
      this.isLoading = true;
      this.sondageService.update(this.id, this.formGroup.getRawValue())
      .subscribe({
        next: () => {
          this.toastr.success('Modification enregistré!', 'Success!');
          this.router.navigate(['/web/sondages/list']);
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



