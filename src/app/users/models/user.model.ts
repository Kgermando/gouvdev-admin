import { OpinionMoodel } from "../../opinions/models/opinion.model";
import { PropositionLoisModel } from "../../proposition-lois/models/proposition-lois.model";


export interface UserModel {
    ID: number;
    email: string; 
    fullname: string;
    sexe: string;
    emailVerified: boolean;
    role: string; // User, Admin, Support, Abonner, ... 
    accreditation: string; // CRUD, CDU
    permissions: string[]; // Acces au dossier ex: Actualite, user, 
    is_active: boolean;
    trancheage: string;
    proposition_lois: PropositionLoisModel[];
    opinions: OpinionMoodel[];
    CreatedAt: Date;
    UpdatedAt: Date;
}