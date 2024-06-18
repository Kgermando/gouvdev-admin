import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { SondageService } from '../sondage.service';
import { ToastrService } from 'ngx-toastr';
import Quill from 'quill';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { SondageModel } from '../models/sondage.model';
import { UserModel } from '../../users/models/user.model';
import { replaceSpecialChars } from '../../shared/tools/replaceSpecialChars';
import { truncateString } from '../../shared/tools/truncate-string';
import { HttpEventType } from '@angular/common/http';

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
  progress = 0;

  id: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private sondageService: SondageService,
    private toastr: ToastrService) { }


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


  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.formGroup = this._formBuilder.group({
      sujet: [''],
      auteur: [''],
      resume: [''],
      choix: this._formBuilder.array([]),
      content: [''],
      thematique: [''],
      tags: this._formBuilder.array([]),
      is_publie: [''],
    });

    this.authService.user().subscribe({
      next: (res) => {
        this.currentUser = res;
        this.sondageService.get(this.id).subscribe(item => {
          this.sondage = item.data;
          this.formGroup.patchValue({
            sujet: this.sondage.sujet,
            sujet_url: this.sondage.sujet,
            auteur: this.sondage.auteur,
            choix: this.sondage.choix,
            resume: this.sondage.resume,
            content: this.sondage.content,
            tags: this.sondage.tags,
            image: (this.imageUrl) ? this.imageUrl : this.sondage.image,
            thematique: this.sondage.thematique,
            is_publie: this.sondage.is_publie, 
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
      this.isLoading = true;
      var body = {
        sujet_url: replaceSpecialChars(truncateString(this.formGroup.value.sujet)),
        sujet: this.formGroup.value.sujet,
        auteur: this.formGroup.value.auteur,
        resume: this.formGroup.value.resume,
        content: this.formGroup.value.content,
        image: (this.imageUrl) ? this.imageUrl : this.sondage.image,
        thematique: this.formGroup.value.thematique,
        tags: this.tags.value,
        is_publie: this.formGroup.value.is_publie,
        signature: this.currentUser.fullname,
      };
      this.sondageService.update(this.id, body)
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



