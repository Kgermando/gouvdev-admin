export interface ContactModel {
    ID: number;
    fullname: string;
    email: string;
    subject: string;
    message: string;
    is_read: boolean;
    CreatedAt: Date;
    UpdatedAt: Date;
}