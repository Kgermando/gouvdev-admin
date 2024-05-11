import { SondageModel } from "../../sondages/models/sondage.model";
import { UserModel } from "../../users/models/user.model";

 

export interface OpinionMoodel {
    ID: number;
    sondage_id: SondageModel;
    user_id: UserModel;
    choice: string;
    opinion_text: string;
    signature: string;
    CreatedAt: Date;
    UpdatedAt: Date;
}