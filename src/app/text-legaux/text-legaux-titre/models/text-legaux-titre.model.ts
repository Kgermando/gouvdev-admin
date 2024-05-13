import { TextLegauxModel } from "../../text-legaux-content/models/text-legaux.model";

export interface TextLegauxTitreModel {
    ID: number; 
    grand_titre_id: number; 
    titre: string;
    titre_url: string;
    text_legaux: TextLegauxModel[]; 
    is_publie: boolean;
    signature: string;
    CreatedAt: Date;
    UpdatedAt: Date;
}