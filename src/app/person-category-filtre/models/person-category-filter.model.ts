import { PersonnaliteModel } from "../../personnalites/models/personnalite.model";

export interface PersonCategoryFiltreModel {
    ID: number;
    type: string;
    name: string;
    name_url: string;
    personnalite: PersonnaliteModel[]
} 