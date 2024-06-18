import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import Quill from 'quill';
import { EditorChangeContent, EditorChangeSelection, QuillEditorComponent } from 'ngx-quill';
import { PersonnaliteSectionService } from '../personnalite-section.service';
import { PersonnaliteSectionModel } from '../models/personnalite-section.model';
import { UserModel } from '../../users/models/user.model';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-personnalite-section-edit',
  templateUrl: './personnalite-section-edit.component.html',
  styleUrls: ['./personnalite-section-edit.component.scss']
})
export class PersonnaliteSectionEditComponent implements OnInit {
  isLoading: boolean = false;

  formGroup!: FormGroup;

  currentUser: UserModel | any;
  personnaliteSection!: PersonnaliteSectionModel;

  isValidList: boolean[] = [false, true];

  id: any;

  selectedFile!: File;
  image!: string;
  progress = 0;

  @ViewChild('quillEditor') quillEditor!: QuillEditorComponent;
  @ViewChild('quillFile', { static: false }) quillFile!: ElementRef;



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private authService: AuthService,  
    private personnaliteSectionService: PersonnaliteSectionService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.formGroup = this._formBuilder.group({
      title: [''], 
      content: [''],
      is_valid: [''], 
    });

    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.personnaliteSectionService.get(Number(this.id)).subscribe(res => {
          this.personnaliteSection = res.data;
          this.formGroup.patchValue({
            personnalite_id: this.personnaliteSection.personnalite_id,
            title: this.personnaliteSection.title,
            content: this.personnaliteSection.content,
            image: (this.image) ? this.image : this.personnaliteSection.image, 
            is_valid: this.personnaliteSection.is_valid, 
            signature: this.currentUser.fullname, 
          });
          this.isLoading = false;
        });
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
  }
 
  uploadFile(event: any) {
    this.selectedFile = event.target.files[0];
    this.personnaliteSectionService.uploadFile(this.selectedFile)
      .subscribe({
        next: (event) => {
          this.image = event.body?.data;
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


  onSubmit() {
    try {
      this.isLoading = true;
      var body = { 
        title: this.formGroup.value.title,
        image: (this.image) ? this.image : this.personnaliteSection.image,
        content: this.formGroup.value.content,
        is_valid: this.formGroup.value.is_valid, 
        signature: this.currentUser.fullname,
      };
      this.personnaliteSectionService.update(this.id, body)
        .subscribe({
          next: (res) => {
            this.toastr.success('Modification enregistré!', 'Success!');
            this.router.navigate(['/web/personnalites', this.personnaliteSection.personnalite_id, 'view']);
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



}
