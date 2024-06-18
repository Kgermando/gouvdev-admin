import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; 
import { ToastrService } from 'ngx-toastr';
import Quill from 'quill';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill'; 
import { UserModel } from '../../users/models/user.model';
import { TeamModel } from '../models/team.model';
import { AuthService } from '../../auth/auth.service';
import { TeamService } from '../team.service';
import { replaceSpecialChars } from '../../shared/tools/replaceSpecialChars';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-team-edit',
  templateUrl: './team-edit.component.html',
  styleUrl: './team-edit.component.scss'
})
export class TeamEditComponent implements OnInit {
  isLoading: boolean = false; 
  formGroup!: FormGroup;

  currentUser!: UserModel; 
  team!: TeamModel;

  isPubieList: boolean[] = [false, true];

  selectedFile!: File;
  imageUrl!: string
  progress = 0;
  progress2 = 0;


  selectedScanFile!: File;
  scanDocUrl!: string

  
  id: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private authService: AuthService, 
    private teamService: TeamService,  
    private toastr: ToastrService) {}


  ngOnInit(): void {
    this.id = this.route.snapshot.params['id']; 
    this.formGroup = this._formBuilder.group({
      fullname: [''],
      grade: [''],
      content: [''],
      facebook: [''],
      comptex: [''],
      linkedin: [''], 
      is_publie: [''],
    });

    this.authService.user().subscribe({
      next: (res) => {
        this.currentUser = res;
        this.teamService.get(this.id).subscribe(item => {
          this.team = item.data;  
            this.formGroup.patchValue({
              image: (this.imageUrl) ? this.imageUrl : this.team.image,  
              fullname: this.team.fullname, 
              fullname_url: replaceSpecialChars(this.team.fullname),
              grade: this.team.grade, 
              content: this.team.content, 
              scan_doc: this.team.scan_doc, 
              facebook: this.team.facebook, 
              comptex: this.team.comptex, 
              linkedin: this.team.linkedin, 
              is_publie: this.team.is_publie,
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
      this.isLoading = true;
      var body = { 
        image: (this.imageUrl) ? this.imageUrl : this.team.image,  
        fullname: this.formGroup.value.fullname,
        fullname_url: replaceSpecialChars(this.formGroup.value.fullname),
        grade: this.formGroup.value.grade,
        content: this.formGroup.value.content,
        scan_doc: (this.scanDocUrl) ? this.scanDocUrl : this.team.scan_doc,  
        facebook: this.formGroup.value.facebook,
        comptex: this.formGroup.value.comptex,
        linkedin: this.formGroup.value.linkedin,
        is_publie: this.formGroup.value.is_publie,
        signature: this.currentUser.fullname, 
      };
      this.teamService.update(this.id, body)
      .subscribe({
        next: () => {
          this.toastr.success('Modification enregistré!', 'Success!');
          this.router.navigate(['/web/teams/list']);
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
