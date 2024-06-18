import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Quill from 'quill';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill'; 
import { UserModel } from '../../users/models/user.model';
import { AuthService } from '../../auth/auth.service';
import { TeamService } from '../team.service';
import { replaceSpecialChars } from '../../shared/tools/replaceSpecialChars';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-team-add',
  templateUrl: './team-add.component.html',
  styleUrl: './team-add.component.scss'
})
export class TeamAddComponent implements OnInit {
  isLoading: boolean = false; 
  formGroup!: FormGroup;

  currentUser!: UserModel;

  isPubieList: boolean[] = [false, true];

  selectedFile!: File;
  imageUrl!: string


  selectedScanFile!: File;
  scanDocUrl!: string
  progress = 0;
  progress2 = 0;
 

  constructor( 
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private teamService: TeamService,  
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
      fullname: ['', Validators.required],
      grade: ['', Validators.required],
      content: ['', Validators.required],
      facebook: ['', Validators.required],
      comptex: ['', Validators.required],
      linkedin: ['', Validators.required], 
      is_publie: ['', Validators.required],
    });
  }

  uploadFile(event: any) {
    this.selectedFile = event.target.files[0];
    this.teamService.uploadFile(this.selectedFile)
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

  onFileScanSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.teamService.uploadFile(this.selectedFile)
    .subscribe({
      next: (event) => { 
        this.scanDocUrl = event.body?.data; 
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round((event.loaded / (event.total ?? 1)) * 100); // Use optional chaining
          this.progress2 = progress;
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body = { 
          image: this.imageUrl,
          fullname: this.formGroup.value.fullname,
          fullname_url: replaceSpecialChars(this.formGroup.value.fullname),
          grade: this.formGroup.value.grade,
          content: this.formGroup.value.content,
          scan_doc: this.scanDocUrl,
          facebook: this.formGroup.value.facebook,
          comptex: this.formGroup.value.comptex,
          linkedin: this.formGroup.value.linkedin,
          counter: 0,
          is_publie: this.formGroup.value.is_publie,
          signature: this.currentUser.fullname, 
        };
        this.teamService.create(body).subscribe({
          next: (res) => {
            this.isLoading = false;
            this.formGroup.reset();
            this.toastr.success('Ajouter avec succès!', 'Success!');
            this.router.navigate(['/web/teams/list']);
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
