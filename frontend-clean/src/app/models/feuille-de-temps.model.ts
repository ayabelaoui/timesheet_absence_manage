export interface FeuilleDeTemps {
    id: number;
    employe: string;
    periode: string;
    heures: number;
    statut: 'En attente' | 'Approuvé' | 'Rejeté';
    approbateur?: string;
    dateSoumission?: Date | string;
    commentaire?: string;
    editable?: boolean; // Nouveau champ pour gérer l'état d'édition

}