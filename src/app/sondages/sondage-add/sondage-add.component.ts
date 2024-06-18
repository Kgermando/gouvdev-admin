
import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { SondageService } from '../sondage.service';
import { ToastrService } from 'ngx-toastr';
import Quill from 'quill';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { UserModel } from '../../users/models/user.model';
import { truncateString } from '../../shared/tools/truncate-string';
import { replaceSpecialChars } from '../../shared/tools/replaceSpecialChars';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-sondage-add',
  templateUrl: './sondage-add.component.html',
  styleUrls: ['./sondage-add.component.scss']
})
export class SondageAddComponent implements OnInit {
  isLoading: boolean = false;
  formGroup!: FormGroup;

  currentUser!: UserModel;

  isPubieList: boolean[] = [false, true];

  selectedFile!: File;
  imageUrl!: string
  progress = 0;

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private sondageService: SondageService,
    private toastr: ToastrService
  ) { }

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
      sujet: ['', Validators.required],
      auteur: ['', Validators.required],
      resume: ['', Validators.required], 
      content: ['', Validators.required],
      tags: this._formBuilder.array([]),
      thematique: ['', Validators.required],
      is_publie: ['', Validators.required],
    });
  }
 

  uploadFile(event: any) {
    this.selectedFile = event.target.files[0];
    this.sondageService.uploadFile(this.selectedFile)
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
 

  get tags() {
    return this.formGroup.get('tags') as FormArray;
  }
  addTags() {
    const tag = new FormControl('');
    this.tags.push(tag);
    console.log(this.tags.value);
  }
  removeTags(index: number) {
    this.tags.removeAt(index);
    console.log(this.tags.value);
  }


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body = {
          sujet_url: replaceSpecialChars(truncateString(this.formGroup.value.sujet)),
          sujet: this.formGroup.value.sujet,
          auteur: this.formGroup.value.auteur,
          resume: this.formGroup.value.resume,
          content: this.formGroup.value.content, 
          image: this.imageUrl,
          thematique: this.formGroup.value.thematique,
          tags: this.tags.value,
          counter: 0,
          is_publie: this.formGroup.value.is_publie,
          is_valid: false,
          signature: this.currentUser.fullname,
        };
        this.sondageService.create(body).subscribe({
          next: (res) => {
            this.isLoading = false;
            this.formGroup.reset();
            this.toastr.success('Ajouter avec succès!', 'Success!');
            this.router.navigate(['/web/sondages', res.data.ID, 'choices']);
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
