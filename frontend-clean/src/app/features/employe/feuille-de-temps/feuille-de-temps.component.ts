import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-feuille-de-temps',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule],
  templateUrl: './feuille-de-temps.component.html',
  styleUrls: ['./feuille-de-temps.component.css']
})
export class FeuilleDeTempsComponent {
  joursSemaine = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
  semaines: any[] = [];
  moisActuel = '';
  anneeActuelle = 0;
  currentDate = new Date();
  joursFeries: number[] = [14, 15, 21]; // Exemple de jours fériés
  id!: number;
  employe!: string;
  periode!: string;
  heures!: number;
  statut!: 'En attente' | 'Approuvé' | 'Rejeté';
  approbateur?: string;
  dateSoumission?: Date;  // Ajoutez cette propriété
  commentaire?: string;
  constructor() {
    this.genererMois(this.currentDate.getFullYear(), this.currentDate.getMonth());
  }

  genererMois(annee: number, mois: number) {
    this.currentDate = new Date(annee, mois, 1);
    this.moisActuel = this.currentDate.toLocaleString('fr-FR', { month: 'long' });
    this.anneeActuelle = annee;

    const premierJour = new Date(annee, mois, 1);
    const dernierJour = new Date(annee, mois + 1, 0);
    const joursDansMois = dernierJour.getDate();

    this.semaines = [];
    let semaine: any[] = Array(premierJour.getDay() === 0 ? 6 : premierJour.getDay() - 1).fill(null);

    for (let jour = 1; jour <= joursDansMois; jour++) {
      const estFerie = this.joursFeries.includes(jour);
      semaine.push({
        jour: jour,
        heures: 0,
        estFerie: estFerie,
        estAujourdhui: jour === new Date().getDate() && mois === new Date().getMonth() && annee === new Date().getFullYear()
      });

      if (new Date(annee, mois, jour).getDay() === 0 || jour === joursDansMois) {
        this.semaines.push(semaine);
        semaine = [];
      }
    }
  }

  moisPrecedent() {
    const newDate = new Date(this.anneeActuelle, this.currentDate.getMonth() - 1, 1);
    this.genererMois(newDate.getFullYear(), newDate.getMonth());
  }

  moisSuivant() {
    const newDate = new Date(this.anneeActuelle, this.currentDate.getMonth() + 1, 1);
    this.genererMois(newDate.getFullYear(), newDate.getMonth());
  }

  sauvegarder() {
    console.log('Feuille sauvegardée:', this.semaines);
    alert('Vos heures ont été sauvegardées !');
  }
  // ...existing code...

  enregistrerBrouillon() {
    console.log('Brouillon enregistré:', this.semaines);
    alert('Votre brouillon a été enregistré !');
  }

  soumettreFeuille() {
    console.log('Feuille soumise:', this.semaines);
    alert('Votre feuille de temps a été soumise !');
  }

  // ...existing code...
}