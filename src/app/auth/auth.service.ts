import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; 
import { UserModel } from '../users/models/user.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient) { }

  login(data: any): Observable<any> {
    return this.http.post(`${environment.apiURL}/auth/login`, data, {
        withCredentials: true
    });
  }


  register(data: any): Observable<any> {
    return this.http.post<UserModel>(`${environment.apiURL}/auth/register`, data);
  }


  user(): Observable<UserModel> {
    return this.http.get<UserModel>(`${environment.apiURL}/auth/user`);
  }

  isLoggedIn() {
    return localStorage.getItem('jwt') != null;
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${environment.apiURL}/auth/logout`, {});
  } 


  updateInfo(data: any): Observable<UserModel> {
    return this.http.put<UserModel>(`${environment.apiURL}/users/info`, data);
  }

  updatePassword(data: any): Observable<UserModel> {
    return this.http.put<UserModel>(`${environment.apiURL}/users/password`, data);
  }

}
