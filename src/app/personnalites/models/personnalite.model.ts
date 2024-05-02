import { PersonnaliteSectionModel } from "../../personnalite-sections/models/personnalite-section.model";


export interface PersonnaliteModel {
    ID: number;

    // Liste de tous les elements dans personnalite
    category: string; // Category Personnalite ex: politiques, religieuses, ...
    category_gouv_aff_public: string;
    category_filtre: string; // Filtre sur les mandants, les premiers ministres,...
    top_header: string; // Pour ceux/celles qui ne le sont pas c'est none

    // Identite
    photo: string;
    nom: string;
    postnom: string;
    prenom: string;
    sexe: string;
    birthday: Date;
    lieu_naissance: string;
    nationalite: string;
    etat_civile: string;

    province: string;
    territoire_ville: string;
    secteur_chefferie: string;
    village: string;
    conjoint: string;
    pere: string;
    mere: string;
    
    about: string;

    compte_fb: string;
    compte_x: string;
    compte_linkedin: string;
    compte_instagram: string;
    compte_tiktok: string;

    counter: number; // Total de vote qui seront ensuite filtrer par les opinions
    is_publie: boolean; 
    signature: string;
    CreatedAt: Date;
    UpdatedAt: Date;

    personnalite_sections: PersonnaliteSectionModel[] 
}
