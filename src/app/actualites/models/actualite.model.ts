export interface ActualiteModel {
    ID: number;
    category: string;
	sous_category: string;
	sujet_url: string;
	sujet: string;
	auteur: string; // Autheur de celui qui a propose cette lois
	resume: string;
	content: string;
	image: string;  
    counter: number;
    is_publie: boolean;
    is_valid: boolean;
    signature: string;
    CreatedAt: Date;
    UpdatedAt: Date;
    actualite_opinions: ActualiteOpinionModel[]
}

export interface ActualiteOpinionModel {
    ID: number;
    actualite_id: number;
	user_id: number;
	fullname: string;
	opinion_text: string;
	sujet_url: string;
    CreatedAt: Date;
    UpdatedAt: Date;
}
  