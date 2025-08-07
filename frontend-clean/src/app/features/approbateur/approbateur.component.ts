import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface FeuilleTemps {
  id: number;
  employe: string;
  periode: string;
  heures: number;
  statut: 'En création' | 'Soumis' | 'Approuvé' | 'Rejeté';
  dateSoumission?: Date;
  commentaireRejet?: string;
}

@Component({
  selector: 'app-approbateur',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './approbateur.component.html',
  styleUrls: ['./approbateur.component.css']
})
export class ApprobateurComponent {
  nouvelleFeuille: FeuilleTemps = {
    id: 0,
    employe: '',
    periode: '',
    heures: 0,
    statut: 'En création'
  };

  showCalendar = false;
  selectedDateRange: { start?: Date, end?: Date } = {};
  feuillesEnAttente: FeuilleTemps[] = [];
  feuillesApprouvees: FeuilleTemps[] = [];
  feuillesRejetees: FeuilleTemps[] = [];
  feuilleSelectionnee: FeuilleTemps | null = null;
  rejetMode = false;
  commentaireRejet = '';
  currentView: 'creation' | 'en-attente' | 'approuvees' | 'rejetees' = 'creation';
  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();

  // Méthodes pour le calendrier
  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
  }

  isSelectedStart(day: Date): boolean {
    return this.selectedDateRange.start?.toDateString() === day.toDateString();
  }

  isSelectedEnd(day: Date): boolean {
    return this.selectedDateRange.end?.toDateString() === day.toDateString();
  }

  isInRange(day: Date): boolean {
    if (!this.selectedDateRange.start || !this.selectedDateRange.end) return false;
    return day > this.selectedDateRange.start && day < this.selectedDateRange.end;
  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  selectDate(date: Date) {
    if (!this.selectedDateRange.start) {
      this.selectedDateRange.start = date;
    } else if (!this.selectedDateRange.end && date >= this.selectedDateRange.start) {
      this.selectedDateRange.end = date;
      this.updatePeriode();
      this.showCalendar = false;
    } else {
      this.selectedDateRange = { start: date };
    }
  }

  updatePeriode() {
    if (this.selectedDateRange.start && this.selectedDateRange.end) {
      const start = this.selectedDateRange.start;
      const end = this.selectedDateRange.end;
      this.nouvelleFeuille.periode = `${start.getDate()}-${end.getDate()} ${this.getMonthName(start.getMonth())} ${start.getFullYear()}`;
    }
  }

  getMonthName(monthIndex: number): string {
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    return months[monthIndex];
  }

  generateCalendarDays(): Date[] {
    const days: Date[] = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);

    // Ajouter les jours du mois précédent pour compléter la première semaine
    const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    if (startingDay > 0) {
      const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();
      for (let i = startingDay - 1; i >= 0; i--) {
        days.push(new Date(this.currentYear, this.currentMonth - 1, prevMonthLastDay - i));
      }
    }

    // Ajouter les jours du mois courant
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(this.currentYear, this.currentMonth, day));
    }

    // Ajouter les jours du mois suivant pour compléter la dernière semaine
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let day = 1; day <= remainingDays; day++) {
        days.push(new Date(this.currentYear, this.currentMonth + 1, day));
      }
    }

    return days;
  }

  // Reste des méthodes inchangées
  ajouterFeuille() {
    if (!this.nouvelleFeuille.employe || !this.nouvelleFeuille.periode || this.nouvelleFeuille.heures <= 0) {
      alert('Veuillez remplir tous les champs correctement');
      return;
    }

    const feuille: FeuilleTemps = {
      ...this.nouvelleFeuille,
      id: this.feuillesEnAttente.length + 1,
      statut: 'Soumis',
      dateSoumission: new Date()
    };

    this.feuillesEnAttente.push(feuille);
    this.resetNouvelleFeuille();
  }

  resetNouvelleFeuille() {
    this.nouvelleFeuille = {
      id: 0,
      employe: '',
      periode: '',
      heures: 0,
      statut: 'En création'
    };
    this.selectedDateRange = {};
  }

  voirFeuille(feuille: FeuilleTemps) {
    this.feuilleSelectionnee = feuille;
    this.rejetMode = false;
    this.commentaireRejet = '';
  }

  approuver(feuille: FeuilleTemps) {
    feuille.statut = 'Approuvé';
    this.feuillesApprouvees.push(feuille);
    this.feuillesEnAttente = this.feuillesEnAttente.filter(f => f.id !== feuille.id);
    alert(`Feuille de ${feuille.employe} approuvée !`);
    this.fermerModal();
  }

  ouvrirRejet(feuille: FeuilleTemps) {
    this.feuilleSelectionnee = feuille;
    this.rejetMode = true;
    this.commentaireRejet = '';
  }

  confirmerRejet() {
    if (!this.commentaireRejet.trim()) {
      alert('Veuillez saisir un commentaire pour le rejet.');
      return;
    }

    if (this.feuilleSelectionnee) {
      this.feuilleSelectionnee.statut = 'Rejeté';
      this.feuilleSelectionnee.commentaireRejet = this.commentaireRejet;
      this.feuillesRejetees.push(this.feuilleSelectionnee);
      this.feuillesEnAttente = this.feuillesEnAttente.filter(f => f.id !== this.feuilleSelectionnee?.id);
      alert(`Feuille rejetée avec commentaire: ${this.commentaireRejet}`);
      this.fermerModal();
    }
  }

  annulerRejet() {
    this.rejetMode = false;
    this.commentaireRejet = '';
  }

  fermerModal() {
    this.feuilleSelectionnee = null;
    this.rejetMode = false;
    this.commentaireRejet = '';
  }

  changerVue(vue: 'creation' | 'en-attente' | 'approuvees' | 'rejetees') {
    this.currentView = vue;
  }
}