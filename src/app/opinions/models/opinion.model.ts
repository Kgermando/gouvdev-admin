import { SondageModel } from "../../sondages/models/sondage.model";
import { UserModel } from "../../users/models/user.model";

 

export interface OpinionMoodel {
    ID: number;
    sondage_id: SondageModel;
    user_id: UserModel;
    choice: string;
    opinionText: string;
    signature: string;
    CreatedAt: Date;
    UpdatedAt: Date;
}