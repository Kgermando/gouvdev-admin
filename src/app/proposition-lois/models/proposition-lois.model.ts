import { UserModel } from "../../users/models/user.model";

 

export interface PropositionLoisModel {
    ID: number;
    sujet: string;
    contenu: string;
    userId: UserModel;
    signature: string;
    CreatedAt: Date;
    UpdatedAt: Date;
}