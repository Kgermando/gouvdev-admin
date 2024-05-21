import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from '../../../users/models/user.model';
import { ToastrService } from 'ngx-toastr';
import Quill from 'quill';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { TextLegauxTitreModel } from '../../text-legaux-titre/models/text-legaux-titre.model';
import { TextLegauxService } from '../text-legaux.service';
import { TextLegauxTitreService } from '../../text-legaux-titre/text-legaux-titre.service';
import { AuthService } from '../../../auth/auth.service';


@Component({
  selector: 'app-text-legaux-add',
  templateUrl: './text-legaux-add.component.html',
  styleUrls: ['./text-legaux-add.component.scss']
})
export class TextLegauxAddComponent implements OnInit {
  isLoading: boolean = false;
  formGroup!: FormGroup;

  currentUser: UserModel | any;

  textLegauxTitre!: TextLegauxTitreModel;

  isValidList: boolean[] = [false, true];

  id: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private textLegauxService: TextLegauxService,
    private textLegauxTitreService: TextLegauxTitreService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.textLegauxTitreService.get(Number(this.id)).subscribe(res => {
          this.textLegauxTitre = res.data;
          this.isLoading = false;
        });
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });

    this.formGroup = this._formBuilder.group({
      chapitre: ['', Validators.required],
      // section: ['', Validators.required],
      contenu: ['', Validators.required],
      is_valid: ['', Validators.required],
    });
  }


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body = {
          text_legaux_titre_id: Number(this.id),
          chapitre: this.formGroup.value.chapitre,
          // section: this.formGroup.value.section,
          contenu: this.formGroup.value.contenu,
          is_valid: this.formGroup.value.is_valid,
          counter: 0,
          signature: this.currentUser.fullname,
        };
        this.textLegauxService.create(body).subscribe({
          next: (res) => {
            this.isLoading = false;
            this.formGroup.reset();
            this.toastr.success('Ajouter avec succès!', 'Success!');
            this.router.navigate(['/web/text-legaux-titre', res.data.text_legaux_titre_id, 'view'])
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


  capitalizeTest(text: string): string {
    return (text && text[0].toUpperCase() + text.slice(1).toLowerCase()) || text;
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
