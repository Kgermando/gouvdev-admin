import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ChoiceService extends ApiService {
  endpoint: string = `${environment.apiURL}/choices`; 
}