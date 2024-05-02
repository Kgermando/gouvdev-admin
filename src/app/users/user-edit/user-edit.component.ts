import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../user.service';
import { AuthService } from '../../auth/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from '../models/user.model';
import { RoleDataList } from '../../shared/tools/role-list';
import { permissionDataList } from '../../shared/tools/permission-list';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent  implements OnInit {
  isLoading: boolean = false; 
  formGroup!: FormGroup;

  currentUser: UserModel | any; 
  user: UserModel | any;

 
  sexeList: string[] = [
    'Femme', 'Homme'
  ]; 
  trancheAgeList: string[] = [
    "-18",
    "18-25",
    "25-35",
    "35-45",
    "45-55",
    "55-65",
    "55+",
  ]
  roleList: string[] = RoleDataList;
  permissionList = permissionDataList;

  id: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private authService: AuthService, 
    private userService: UserService, 
    private toastr: ToastrService) {}


  ngOnInit(): void {
    this.id = this.route.snapshot.params['id']; 
    this.formGroup = this._formBuilder.group({
      fullname: [''], 
      sexe: [''],
      role: [''],  
      accreditation: [''], 
      trancheage: [''],
      is_active: [''], 
    });

    this.authService.user().subscribe({
      next: (res) => {
        this.currentUser = res;
        this.userService.get(this.id).subscribe(item => { 
          this.user = item.data;  
            this.formGroup.patchValue({
              fullname: this.capitalizeTest(this.user.fullname),
              sexe: this.user.sexe,
              role: this.user.role,
              accreditation: this.user.accreditation,
              trancheage: this.user.trancheage,
              is_active: this.user.is_active, 
              UpdatedAt: new Date()
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
      this.userService.update(this.id, this.formGroup.getRawValue())
      .subscribe({
        next: () => {
          this.toastr.success('Modification enregistré!', 'Success!');
          this.router.navigate(['/web/users/list']);
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


  capitalizeTest(text: string): string {
    return (text && text[0].toUpperCase() + text.slice(1).toLowerCase()) || text;
  }

}

