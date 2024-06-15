import { PersonnaliteModel } from "../../personnalites/models/personnalite.model";

export interface PersonCategoryFiltreModel {
    ID: number;
    type: string; // Category
    name: string;
    name_url: string;
    personnalite: PersonnaliteModel[]
}