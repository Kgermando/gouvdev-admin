import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export abstract class ApiService {
  abstract get endpoint(): string; 

  constructor(protected http: HttpClient) { }

  private _refreshDataList$ = new Subject<void>();

  private _refreshData$ = new Subject<void>();

  get refreshDataList$() {
    return this._refreshDataList$;
  }

  get refreshData$() {
    return this._refreshData$;
  }


  getPaginated(pageSize: number, pageNumber: number): Observable<any> {
    const params = { page_size: pageSize, page_number: pageNumber };
    return this.http.get<any>(this.endpoint, { params });
  }

  getPaginatedById(id: number, pageSize: number, pageNumber: number): Observable<any> {
    const params = { page_size: pageSize, page_number: pageNumber };
    return this.http.get<any>(`${this.endpoint}/paginate/${id}`, { params });
  }
 
  getAll(): Observable<any> {
    return this.http.get(`${this.endpoint}/all`);
  }

  getAllById(id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/all/${id}`);
  }
  
  all(page?: number): Observable<any> {
    let url = `${this.endpoint}`;
    if (page) { // page is optional
      url += `?page=${page}`;
    } 
    return this.http.get(url); 
  }

  get(id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get/${id}`);
  }
 

  create(data: any): Observable<any> {
    return this.http.post(this.endpoint, data).pipe(tap(() => {
      this._refreshDataList$.next();
      this._refreshData$.next();
    }));
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.endpoint}/${id}`, data).pipe(tap(() => {
      this._refreshDataList$.next();
      this._refreshData$.next();
    }));
  }

  updateRead(id: number, data: any): Observable<any> {
    return this.http.put(`${this.endpoint}/read/${id}`, data).pipe(tap(() => {
      this._refreshDataList$.next();
      this._refreshData$.next();
    }));
  }

  updateValid(id: number, data: any): Observable<any> {
    return this.http.put(`${this.endpoint}/valid/${id}`, data).pipe(tap(() => {
      this._refreshDataList$.next();
      this._refreshData$.next();
    }));
  }

  updateIsPublie(id: number, data: any): Observable<any> {
    return this.http.put(`${this.endpoint}/publie/${id}`, data).pipe(tap(() => {
      this._refreshDataList$.next();
      this._refreshData$.next();
    }));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`).pipe(tap(() => {
      this._refreshDataList$.next();
      this._refreshData$.next();
    }));
  }

  // Get file
  getFile(url: string): Observable<any> {
    return this.http.get(`${this.endpoint}/${url}`);
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); 
    return this.http.post(`${this.endpoint}/uploads`, formData);
  }
}
