import { Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { environment } from '../../environments/environment.development';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JonctionPersonCategoryService extends ApiService {
  endpoint: string = `${environment.apiURL}/join-person-categories`; 

  appendAssociate(idPersonn: number, data: any): Observable<any> {
    return this.http.post(`${this.endpoint}/${idPersonn}`, data).pipe(tap(() => {
      this.refreshDataList$.next();
      this.refreshData$.next();
    }));
  }
}
