import { TextLegauxTitreModel } from "../../text-legaux-titre/models/text-legaux-titre.model";

export interface GrandTitreModel {
    ID: number;
    category: string; // Constitution, traites, ...
    g_titre: string;
    g_titre_url: string; 
    text_legaux_titre: TextLegauxTitreModel[];
    counter: number;
    is_publie: boolean;
    signature: string;
    CreatedAt: Date;
    UpdatedAt: Date;
}