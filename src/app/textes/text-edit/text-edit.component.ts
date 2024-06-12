import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; 
import { ToastrService } from 'ngx-toastr';
import Quill from 'quill';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { UserModel } from '../../users/models/user.model';
import { TexteModel } from '../models/texte.model';
import { AuthService } from '../../auth/auth.service';
import { TexteService } from '../texte.service';
import { replaceSpecialChars } from '../../shared/tools/replaceSpecialChars';

@Component({
  selector: 'app-text-edit',
  templateUrl: './text-edit.component.html',
  styleUrl: './text-edit.component.scss'
})
export class TextEditComponent implements OnInit {
  isLoading: boolean = false; 
  formGroup!: FormGroup;

  currentUser!: UserModel; 
  texte!: TexteModel;

  isPubieList: boolean[] = [false, true];
  categoryList: string[] = [
    'Constitution',
    'Traités et accords internationaux',
    'Lois régissant les intitutions', 
    'Arreté',
    'Circulaire',
    'Décret',
    'Ordonance',
    "Programme d'actions du gouvernennement 2024-2028",
  ]

  id: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private authService: AuthService, 
    private texteService: TexteService,
    private toastr: ToastrService) {}
 


  ngOnInit(): void {
    this.id = this.route.snapshot.params['id']; 
    this.formGroup = this._formBuilder.group({
      category: [''],
      g_titre: [''],
      titre: [''],
      titre_url: [''],
      body: [''],
      counter: [''], 
      is_publie: [''],
      signature: [''], 
    });

    this.authService.user().subscribe({
      next: (res) => {
        this.currentUser = res;
        this.texteService.get(this.id).subscribe(item => { 
          this.texte = item.data;  
            this.formGroup.patchValue({
              category: this.texte.category, 
              g_titre: this.texte.g_titre,  
              titre: this.texte.titre, 
              titre_url: this.texte.titre_url, 
              body: this.texte.body, 
              counter: this.texte.counter,  
              is_publie: this.texte.is_publie,
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
      var body = {
        category: this.formGroup.value.category,
        g_titre: this.formGroup.value.g_titre,
        titre: this.formGroup.value.titre,
        titre_url: replaceSpecialChars(this.formGroup.value.titre),
        body: this.formGroup.value.body,
        counter: 0,
        is_publie: this.formGroup.value.is_publie, 
        signature: this.currentUser.fullname, 
      };
      this.texteService.update(this.id, body)
      .subscribe({
        next: () => {
          this.toastr.success('Modification enregistré!', 'Success!');
          this.router.navigate(['/web/textes/list']);
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
