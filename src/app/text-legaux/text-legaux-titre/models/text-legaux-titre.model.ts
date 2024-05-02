import { TextLegauxModel } from "../../text-legaux-content/models/text-legaux.model";

export interface TextLegauxTitreModel {
    ID: number;
    category: string; // Constitution, traites, ...
    titre: string;
    titre_url: string;
    text_legaux: TextLegauxModel[];
    counter: number;
    is_publie: boolean;
    signature: string;
    CreatedAt: Date;
    UpdatedAt: Date;
}