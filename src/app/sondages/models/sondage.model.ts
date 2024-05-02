import { OpinionMoodel } from "../../opinions/models/opinion.model";

 

export interface SondageModel {
    ID: number; 
    sujet_url: string;
    sujet: string;
    auteur: string;
    resume: string; // Autheur de celui qui a propose cette lois
    content: string;
    image: string;
    thematique: string;
    counter: number; // Total de vues
    is_publie: boolean;
    is_valid: boolean; // Verrouiller le vote et l'opinion
    opinions: OpinionMoodel[];
    signature: string;
    CreatedAt: Date;
    UpdatedAt: Date;
}