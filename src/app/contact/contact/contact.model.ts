export interface Contact {
    ID: number;
    fullname: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean;
    CreatedAt: Date;
    UpdatedAt: Date;
}