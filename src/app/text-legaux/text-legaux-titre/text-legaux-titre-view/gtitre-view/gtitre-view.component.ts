import { Component, Input, OnInit } from '@angular/core';
import { GrandTitreModel } from '../../../grand-titre/models/grand-titre.model';
import { GrandTitreService } from '../../../grand-titre/grand-titre.service';

@Component({
  selector: 'app-gtitre-view',
  templateUrl: './gtitre-view.component.html',
  styleUrl: './gtitre-view.component.scss'
})
export class GtitreViewComponent implements OnInit {
  @Input() id!: number;
  grandTitre!: GrandTitreModel;

  constructor(
    private grandTitreService: GrandTitreService,) { }

  ngOnInit(): void {
    this.grandTitreService.get(Number(this.id)).subscribe(res => {
      this.grandTitre = res.data;
    });
  }


}
