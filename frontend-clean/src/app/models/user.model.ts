



export interface User {
    id?: number;
    nom: string;
    prenom: string;
    email: string;
    password?: string;
    adresse: string;
    telephone: string;
    role: 'EMPLOYE' | 'RH' | 'ADMIN';
    hireDate?: string;
}
