import { Component, Input } from '@angular/core';
import { SondageModel } from '../../sondages/models/sondage.model';
import { SondageService } from '../../sondages/sondage.service';

@Component({
  selector: 'app-opinion-sondage',
  templateUrl: './opinion-sondage.component.html',
  styleUrl: './opinion-sondage.component.scss'
})
export class OpinionSondageComponent {
  @Input() id!: number;

  sondage!: SondageModel; 

  constructor( 
    private sondageService: SondageService, ) {}

    ngOnInit(): void {
      this.sondageService.refreshData$.subscribe(() => {
        this.fetchProduct();
      });
      this.fetchProduct();
    }

    fetchProduct() {
      this.sondageService.get(Number(this.id)).subscribe(res => {
        this.sondage = res.data;
      });
    }

}
