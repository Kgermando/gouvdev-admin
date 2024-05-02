import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from '../../../users/models/user.model';
import { ToastrService } from 'ngx-toastr';
import Quill from 'quill';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';  
import { TextLegauxService } from '../text-legaux.service'; 
import { TextLegauxModel } from '../models/text-legaux.model';
import { AuthService } from '../../../auth/auth.service';


@Component({
  selector: 'app-text-legaux-edit',
  templateUrl: './text-legaux-edit.component.html',
  styleUrls: ['./text-legaux-edit.component.scss']
})
export class TextLegauxEditComponent implements OnInit {
  isLoading: boolean = false;

  formGroup!: FormGroup;

  currentUser: UserModel | any;
  textLegauxModel!: TextLegauxModel;

  isValidList: boolean[] = [false, true];

  id: any;

  selectedFile!: File;
  image!: string;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private authService: AuthService,  
    private textLegauxService: TextLegauxService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.formGroup = this._formBuilder.group({
      chapitre: [''], 
      // section: [''],
      contenu: [''],
      is_valid: [''],
    });

    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user; 
        this.textLegauxService.get(Number(this.id)).subscribe(res => {
          this.textLegauxModel = res.data;
          this.formGroup.patchValue({
            text_legaux_titre_id: this.textLegauxModel.text_legaux_titre_id,
            chapitre: this.textLegauxModel.chapitre,
            // section: this.textLegauxModel.section,
            contenu: this.textLegauxModel.contenu,
            is_valid: this.textLegauxModel.is_valid, 
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

 
  onSubmit() {
    try {
      this.isLoading = true;
      console.log("id", this.id)
      this.textLegauxService.update(this.id, this.formGroup.getRawValue())
        .subscribe({
          next: (res) => {
            this.toastr.success('Modification enregistré!', 'Success!');
            this.router.navigate(['/web/text-legaux-titre', this.textLegauxModel.text_legaux_titre_id, 'view'])
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
