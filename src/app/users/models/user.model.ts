import { OpinionMoodel } from "../../opinions/models/opinion.model";
import { PropositionLoisModel } from "../../proposition-lois/models/proposition-lois.model";


export interface UserModel {
    ID: number;
    email: string;
    // password: string;
    fullname: string;
    sexe: string;
    // emailVerified: boolean;
    role: string; // User, Admin, Support, Abonner, ... 
    accreditation: string[]; // Permission
    is_active: boolean;
    trancheage: string;
    propositionLois: PropositionLoisModel[];
    opinions: OpinionMoodel[];
    CreatedAt: Date;
    UpdatedAt: Date;
}