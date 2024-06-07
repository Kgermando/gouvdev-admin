import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserModel } from '../../users/models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ChoiceService } from './choice.service';
import { SondageService } from '../sondage.service';
import { CustomizerSettingsService } from '../../common/customizer-settings/customizer-settings.service';
import { ChoixModel, SondageModel } from '../models/sondage.model';

@Component({
  selector: 'app-choice',
  templateUrl: './choice.component.html',
  styleUrl: './choice.component.scss'
})
export class ChoiceComponent implements OnInit {
  isLoading: boolean = false;
  isLoadingChoice = false;
  formGroup!: FormGroup;

  choixList: ChoixModel[] = [];
  sondage!: SondageModel;
  currentUser!: UserModel;

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private choiceService: ChoiceService, 
    private sondageService: SondageService, 
  ) { }
  

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');  // this.route.snapshot.params['id'];
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user; 
        this.sondageService.refreshData$.subscribe(() => {
          this.fetchProduct(id);
        });
        this.fetchProduct(id);
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });

    this.formGroup = this._formBuilder.group({
      number: ['', Validators.required],
      choice: ['', Validators.required], 
    });
  }

  fetchProduct(id: any) {
    this.isLoading = true;
    this.sondageService.get(Number(id)).subscribe(res => {
      this.sondage = res.data;
      this.choiceService.refreshDataList$.subscribe(() => {
        this.fetchProducts();
      });
      this.fetchProducts();
      this.isLoading = false;
    });
  } 
  fetchProducts() {  
    this.choiceService.getAllById(this.sondage.ID)
      .subscribe(response => {
        this.choixList = response.data;   
        console.log("choixList", this.choixList)
      }
    );
  }
 

  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoadingChoice = true;
        var body = { 
          sondage_id: this.sondage.ID,
          number: this.formGroup.value.number,
          choice: this.formGroup.value.choice, 
        };
        this.choiceService.create(body).subscribe({
          next: (res) => {
            this.isLoadingChoice = false;
            this.formGroup.reset(); 
          },
          error: (err) => {
            this.isLoadingChoice = false; 
            console.log(err);
          }
        });
      }
    } catch (error) {
      this.isLoadingChoice = false;
      console.log(error);
    }
  }

  removeChoix(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce choix ?')) {
      this.choiceService
        .delete(id) 
        .subscribe({
          next: () => { 
          },
          error: err => { 
            console.log(err);
          }
        }
      ); 
    }
  }

    
  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
