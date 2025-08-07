import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-horaire',
    templateUrl: './horaire.component.html',
    styleUrls: ['./horaire.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class HoraireComponent implements OnInit {
    joursSemaine: string[] = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    joursMois: any[] = [];

    totalHeures: number = 0;

    currentDate: Date = new Date();
    year = this.currentDate.getFullYear();
    month = this.currentDate.getMonth(); // 0 = janvier

    feuilleSoumise = false;
    isEmployee = true; // à connecter au service auth
    isAdmin = false;

    ngOnInit(): void {
        this.genererCalendrier(this.year, this.month);
        const role = localStorage.getItem('userRole');
    }

    genererCalendrier(annee: number, mois: number) {
        this.joursMois = [];
        const date = new Date(annee, mois, 1);
        const premierJour = date.getDay();
        const nbJours = new Date(annee, mois + 1, 0).getDate();

        let semaine: any[] = Array(premierJour).fill(null); // jours vides au début

        for (let jour = 1; jour <= nbJours; jour++) {
            const dateCourante = new Date(annee, mois, jour);
            const caseJour = {
                jour,
                jourSemaine: this.joursSemaine[dateCourante.getDay()],
                date: dateCourante.toISOString().split('T')[0],
                heures: 0
            };
            semaine.push(caseJour);

            if (semaine.length === 7 || jour === nbJours) {
                this.joursMois.push(semaine);
                semaine = [];
            }
        }

        this.calculerTotal();
    }

    calculerTotal() {
        this.totalHeures = this.joursMois
            .flat()
            .filter(j => j)
            .reduce((acc, jour) => acc + (jour.heures || 0), 0);
    }

    saveDraft() {
        alert('Brouillon sauvegardé');
        // Appel backend à ajouter ici
    }

    submitFeuille() {
        if (confirm('Soumettre la feuille ?')) {
            this.feuilleSoumise = true;
        }
    }

    exportPDF() {
        window.print(); // Simple preview imprimable
    }
}
