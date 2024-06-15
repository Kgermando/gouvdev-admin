import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Quill from 'quill';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { AuthService } from '../../auth/auth.service';
import { UserModel } from '../../users/models/user.model';
import { TexteService } from '../texte.service';
import { replaceSpecialChars } from '../../shared/tools/replaceSpecialChars';
import { Observable } from 'rxjs/internal/Observable'; 
import { TexteModel } from '../models/texte.model';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-text-add',
  templateUrl: './text-add.component.html',
  styleUrl: './text-add.component.scss'
})
export class TextAddComponent implements OnInit {
  isLoading: boolean = false;
  formGroup!: FormGroup;
 
  myControl = new FormControl<string | TexteModel>('');
  options: TexteModel[] = [];
  filteredOptions!: Observable<TexteModel[]>;

  currentUser!: UserModel;

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

 

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private texteService: TexteService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void { 
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.texteService.getAll().subscribe(res => {
          this.options = res.data;
        })
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });

    
    this.formGroup = this._formBuilder.group({
      category: ['', Validators.required],
      g_titre: ['', Validators.required],
      titre: ['', Validators.required],
      titre_url: [''],
      body: ['', Validators.required],
      counter: [''],
      is_publie: ['', Validators.required],
      signature: [''],
    });
 
    this.filteredOptions = this.formGroup.valueChanges.pipe(
      startWith(''),
      map(value => {
        const g_titre = typeof value === 'string' ? value : value?.g_titre;
       
        return g_titre ? this._filter(g_titre as string) : this.options.slice();
      }),
    );
  }

  displayFn(texte: TexteModel): string {
    return texte && texte.g_titre ? texte.g_titre : '';
  }
 
  private _filter(name: string): TexteModel[] {
    const filterValue = name.toLowerCase();
    console.log("filterValue", filterValue)
    return this.options.filter(option => option.g_titre.toLowerCase().includes(filterValue));
  }

  onSubmit() {
    try {
      if (this.formGroup.valid) {
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
        this.texteService.create(body).subscribe({
          next: (res) => {
            this.isLoading = false;
            this.formGroup.reset();
            this.toastr.success('Ajouter avec succès!', 'Success!');
            this.router.navigate(['/web/textes/list']);
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
