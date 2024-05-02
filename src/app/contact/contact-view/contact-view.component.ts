import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr'; 
import { ContactModel } from '../models/contact.model';
import { ContactService } from '../contact.service'; 
import { UserModel } from '../../users/models/user.model';
import { CustomizerSettingsService } from '../../common/customizer-settings/customizer-settings.service';


@Component({
  selector: 'app-contact-view',
  templateUrl: './contact-view.component.html',
  styleUrls: ['./contact-view.component.scss']
})
export class ContactViewComponent implements OnInit {
  isLoading = false;

  contact!: ContactModel;

  currentUser: UserModel | any;

  id: any;

  isLoadingRead: boolean = false;

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private contactService: ContactService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.id = this.route.snapshot.paramMap.get('id');  // this.route.snapshot.params['id'];
        this.contactService.get(Number(this.id)).subscribe(res => {
          this.contact = res.data;
          this.isLoading = false;
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
  }


  onValChange(value: any) {
    if (confirm('Êtes-vous sûr de vouloir modifier ce message ?')) {
      console.log(value);
      this.isLoadingRead = true; 
      var body = {
        // fullname: "GK",
        // email: "Katakugermain@eventdrc.com",
        // subject: "Test 15",
        // message: "Voici le message test 15",
        is_read: value,
      };
      this.contactService.updateRead(this.id, body).subscribe({
        next: () => {
          if (value === 'true') {
            this.toastr.info('Message lu!', 'Success!');
          } else if (value === 'false') {
            this.toastr.info('Message non lu!', 'Success!');
          } else {}
          this.isLoadingRead = false;
        },
        error: err => {
          console.log("body", body)
          this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
          console.log(err);
          this.isLoadingRead = false;
        }
      });
    }
  }


  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      this.contactService
        .delete(id)
        .subscribe({
          next: () => {
            this.toastr.info('Supprimé avec succès!', 'Success!');
            this.router.navigate(['/web/contacts/list']);
          },
          error: err => {
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
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
