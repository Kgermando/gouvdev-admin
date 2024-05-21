import { TextLegauxTitreModel } from "../../text-legaux-titre/models/text-legaux-titre.model";

export interface TextLegauxModel {
    ID: number;
    text_legaux_titre_id: TextLegauxTitreModel;
    chapitre: string;
    // section: string;
    contenu: string;
    counter: number; 
    is_valid: boolean;
    signature: string;
    CreatedAt: Date;
    UpdatedAt: Date;
}