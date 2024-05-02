import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexFill,
  ChartComponent
} from "ng-apexcharts";
import { AuthService } from '../auth.service';  
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';  
import { ToastrService } from 'ngx-toastr'; 
import { UserModel } from '../../users/models/user.model';
import { CustomizerSettingsService } from '../../common/customizer-settings/customizer-settings.service';
import { Auth } from '../../common/classes/auth';
import { UserService } from '../../users/user.service';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: any;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
};

 
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild("chart")
  chart!: ChartComponent;
    public chartOptions: Partial<ChartOptions>;


  isLoading = false; 

  infoForm: FormGroup | any;
 
 
  currentUser: UserModel | any;

  constructor( 
    public themeService: CustomizerSettingsService,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog
   ) {
    this.chartOptions = {
      series: [70],
      chart: {
          height: 110,
          width: 110,
          offsetX: 2.5,
          type: "radialBar",
          sparkline: {
              enabled: true,
          },
      },
      colors: ["#00B69B"],
      plotOptions: {
          radialBar: {
              startAngle: -120,
              endAngle: 120,
              dataLabels: {
                  name: {
                      show: false
                  },
                  value: {
                      offsetY: 3,
                      fontSize: "14px",
                      fontWeight: "700",
                  }
              }
          }
      }
  };
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
  } 

  panelOpenState = false;

  step = 0;

  setStep(index: number) {
      this.step = index;
  }

  nextStep() {
      this.step++;
  }

  prevStep() {
      this.step--;
  }

 
  openPasswordDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ChangePasswordDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
    }); 
  }

  openChangePhotoDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
    this.dialog.open(ChangePhotoDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        id: id
      }
    }); 
  } 

 
  openUpdateInfoDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
    this.dialog.open(UpdateInfoDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        id: id
      }
    }); 
  } 


  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleCardBorderTheme() {
      this.themeService.toggleCardBorderTheme();
  }

  toggleCardBorderRadiusTheme() {
      this.themeService.toggleCardBorderRadiusTheme();
  }
}


@Component({
  selector: 'add-change-password',
  templateUrl: './change-password.html',
})
export class ChangePasswordDialogBox implements OnInit{
  passwordForm: FormGroup | any;
  isLoading = false; 

  currentUser: UserModel | any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<ChangePasswordDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService,
      private toastr: ToastrService
  ) {}


  ngOnInit(): void { 
    this.passwordForm = this.formBuilder.group({ 
      password: ["", Validators.compose([Validators.required])],
      password_confirm: ''
    });
    Auth.userEmitter.subscribe(
      user => { 
        this.passwordForm.patchValue(user);
      }
    );
  } 


  passwordSubmit(): void {  
    this.authService.updatePassword(this.passwordForm.getRawValue()).subscribe({
      next: res => {
        console.log(res);
        this.toastr.success(`Mot de passe changé!`, 'Success!');
        this.isLoading = false;
        this.close();
        this.authService.logout().subscribe(
          user => this.router.navigate(['/auth/login'])
        );
        
      },
      error: (e) => {
        this.isLoading = false;
        console.error(e);
        // this.toastr.error('Votre matricule ou le mot de passe ou encore les deux ne sont pas correct !', 'Oupss!');
        this.toastr.error(`${e.error.message}`, 'Oupss!');
        this.close();
        this.router.navigate(['/auth/login']); 
      }, 
    });
  }

  close(){
      this.dialogRef.close(true);
  } 

}


@Component({
  selector: 'add-change-photo',
  templateUrl: './change-photo.html', 
})
export class ChangePhotoDialogBox implements OnInit{
  photoForm: FormGroup | any;

  currentUser: UserModel | any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<ChangePasswordDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService,
      private userService: UserService,
  ) {}


  ngOnInit(): void {
    this.photoForm = this.formBuilder.group({  
      photo: ''
    }); 

    // Auth.userEmitter.subscribe(
    //   user => { 
    //     this.currentUser = user;
    //     this.photoForm.patchValue(user);
    //   }
    // );  
    this.userService.get(parseInt(this.data['id'])).subscribe(item => {
      this.photoForm.patchValue({
        photo: item.photo,
        signature: item.matricule, 
        update_created: new Date(),
      });
    });
  }


  photoSubmit(): void {  
    this.authService.updateInfo(this.photoForm.getRawValue()).subscribe(
      res => {
        console.log(res);
        this.close();
        this.router.navigate(['/layouts/profile']);
      }
    );
  }

  close(){
      this.dialogRef.close(true);
  } 

}


@Component({
  selector: 'update-info',
  templateUrl: './update-info.html', 
})
export class UpdateInfoDialogBox implements OnInit{
  formGroup: FormGroup | any;

  currentUser: UserModel | any;

  isLoading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<UpdateInfoDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService,
      private userService: UserService,
  ) {}


  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({  
      email: '',
      telephone: ''
    }); 

    // Auth.userEmitter.subscribe(
    //   user => { 
    //     this.currentUser = user;
    //     // this.formGroup.patchValue(user);
    //     this.formGroup.patchValue({ 
    //       email: this.capitalizeTest(this.currentUser.email),
    //       telephone: this.currentUser.telephone,
    //       signature: this.currentUser.matricule, 
    //       update_created: new Date()
    //     });
    //   }
    // );  

    this.userService.get(parseInt(this.data['id'])).subscribe(item => {
      this.formGroup.patchValue({
        email: this.capitalizeTest(item.email),
        telephone: item.telephone,
        signature: item.matricule, 
        update_created: new Date(),
      });
    });
  }


  onSubmit(): void { 
    this.isLoading = true;
    this.authService.updateInfo(this.formGroup.getRawValue()).subscribe(
      res => {
        console.log(res);
        this.isLoading = false;
        this.close();
        this.router.navigate(['/layouts/profile']);
      }
    );
  }

  close(){
      this.dialogRef.close(true);
  } 


  capitalizeTest(text: string): string {
    return (text && text[0].toUpperCase() + text.slice(1).toLowerCase()) || text;
  }

}