import { Component, Input } from '@angular/core';
import { UserService } from '../../users/user.service';
import { UserModel } from '../../users/models/user.model';

@Component({
  selector: 'app-opinion-user',
  templateUrl: './opinion-user.component.html',
  styleUrl: './opinion-user.component.scss'
})
export class OpinionUserComponent { 
  @Input() id!: number;
  
  user!: UserModel; 

  constructor( 
    private userService: UserService, ) {}

    ngOnInit(): void { 
      this.userService.get(Number(this.id)).subscribe(res => {
        this.user = res.data; 
      });
    }

 
}
