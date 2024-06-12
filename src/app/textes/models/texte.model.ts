export interface TexteModel {
    ID: number;
    category: string; // Constitution, traites, ...
    g_titre: string;
    titre: string;
    titre_url: string;
    body: string;
    counter: number;
    is_publie: boolean;
    signature: string;
    CreatedAt: Date;
    UpdatedAt: Date;
}