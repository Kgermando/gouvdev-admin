import { PersonCategoryFiltreModel } from "../../person-category-filtre/models/person-category-filter.model";
import { PersonnaliteModel } from "../../personnalites/models/personnalite.model";

 
export interface JoinPersoCategoryModel { 
    personnalite_id: PersonnaliteModel;
    personCategoryFiltre_id: PersonCategoryFiltreModel;
}
