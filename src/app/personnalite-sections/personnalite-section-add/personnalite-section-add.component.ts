import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service'; 
import { ToastrService } from 'ngx-toastr';
import Quill from 'quill';
import { EditorChangeContent, EditorChangeSelection, QuillEditorComponent } from 'ngx-quill';
import { PersonnaliteSectionService } from '../personnalite-section.service'; 
import { Validators } from 'ngx-editor';
import { PersonnaliteModel } from '../../personnalites/models/personnalite.model';
import { UserModel } from '../../users/models/user.model';
import { PersonnaliteService } from '../../personnalites/personnalite.service';

@Component({
  selector: 'app-personnalite-section-add',
  templateUrl: './personnalite-section-add.component.html',
  styleUrls: ['./personnalite-section-add.component.scss']
})
export class PersonnaliteSectionAddComponent implements OnInit {
  isLoading: boolean = false;

  formGroup!: FormGroup;

  currentUser: UserModel | any;
  personnalite!: PersonnaliteModel;

  isValidList: boolean[] = [false, true];

  id: any;

  selectedFile!: File;
  image!: string;

  @ViewChild('quillEditor') quillEditor!: QuillEditorComponent;
@ViewChild('quillFile', { static: false }) quillFile!: ElementRef;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private authService: AuthService, 
    private personnaliteService: PersonnaliteService, 
    private personnaliteSectionService: PersonnaliteSectionService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.formGroup = this._formBuilder.group({
      title: ['', Validators.required], 
      content: ['', Validators.required],
      is_valid: ['', Validators.required],
    });

    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.personnaliteService.get(Number(this.id)).subscribe(res => {
          this.personnalite = res.data;
          this.isLoading = false;
        });
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.personnaliteSectionService.uploadFile(this.selectedFile).subscribe(
      (response) => {
        this.image = response.data;
        console.log('Upload successful!', response.data)
      },
      (error) => console.error('Upload failed:', error)
    );
  }

  onSubmit() {
    try {
      if (this.formGroup.valid) { 
        this.isLoading = true;
        var body = {
          personnalite_id: Number(this.id), 
          title: this.formGroup.value.title,
          image: (this.image) ? this.image : '',
          content: this.formGroup.value.content,
          is_valid: this.formGroup.value.is_valid, 
          signature: this.currentUser.fullname,
        };
        // const range = this.quillEditor.quillEditor.getSelection();
        // this.quillEditor.quillEditor.insertEmbed(range!.index, 'image', this.image);
        this.personnaliteSectionService.create(body).subscribe({
          next: (res) => {
            this.isLoading = false;
            this.formGroup.reset();
            this.toastr.success('Ajouter avec succès!', 'Success!');
            this.router.navigate(['/web/personnalites', res.data.personnalite_id, 'view']);
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

  // insertImage(imageUrl: string) {
  //   const range = this.quillEditor.quillEditor.getSelection();
  //   this.quillEditor.quillEditor.insertEmbed(range!.index, 'image', imageUrl);
  // }
}
