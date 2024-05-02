import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core'; 
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  @Output() uploadedUrl = new EventEmitter<string>();

  constructor(private http: HttpClient) {
  }

  upload(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    console.log({files});

    const file = files.item(0);
    const data = new FormData();
    // @ts-ignore
    data.append('document', file);
    // console.log(data.get('image')); // File

    this.http.post(`${environment.apiURL}/upload`, data)
      .subscribe((res: any) => {
        this.uploadedUrl.emit(res.url);
        console.log("URL", res.url);
      });
  }

}
