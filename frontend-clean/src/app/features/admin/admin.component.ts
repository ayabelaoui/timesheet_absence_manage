import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FeuilleDeTempsService } from '../../services/feuille-de-temps.service';
import { FeuilleDeTemps } from '../../models/feuille-de-temps.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  feuillesDeTemps: FeuilleDeTemps[] = [];
  feuilleSelectionnee: FeuilleDeTemps | null = null;
  feuilleEdit: Partial<FeuilleDeTemps> = {};
  stats = {
    employesActifs: 0,
    heuresSemaine: 0,
    enAttente: 0,
    tauxApprobation: '0%'
  };
  isEditing = false;

  constructor(private feuillesService: FeuilleDeTempsService) { }

  ngOnInit() {
    this.chargerFeuilles();
  }

  chargerFeuilles() {
    this.feuillesService.getFeuillesDeTemps().subscribe({
      next: (data: FeuilleDeTemps[]) => {
        this.feuillesDeTemps = data.map(f => ({
          ...f,
          dateSoumission: f.dateSoumission ? new Date(f.dateSoumission) : undefined,
          editable: false
        }));
        this.calculerStatistiques();
      },
      error: (err: any) => console.error('Erreur:', err)
    });
  }

  calculerStatistiques() {
    const employesUniques = new Set(this.feuillesDeTemps.map(f => f.employe));
    const approuvees = this.feuillesDeTemps.filter(f => f.statut === 'Approuvé').length;
    const total = this.feuillesDeTemps.length;

    this.stats = {
      employesActifs: employesUniques.size,
      heuresSemaine: this.feuillesDeTemps.reduce((sum, f) => sum + (f.heures || 0), 0),
      enAttente: this.feuillesDeTemps.filter(f => f.statut === 'En attente').length,
      tauxApprobation: total > 0 ? Math.round((approuvees / total) * 100) + '%' : '0%'
    };
  }

  activerEdition(feuille: FeuilleDeTemps) {
    this.feuilleEdit = { ...feuille };
    feuille.editable = true;
    this.isEditing = true;
  }

  sauvegarderModification(feuille: FeuilleDeTemps) {
    Object.assign(feuille, this.feuilleEdit);

    this.feuillesService.updateFeuilleDeTemps(feuille).subscribe({
      next: (feuilleMaj: FeuilleDeTemps) => {
        feuille.editable = false;
        this.isEditing = false;
        console.log('Sauvegarde réussie', feuilleMaj);
      },
      error: (err: any) => {
        console.error('Erreur de sauvegarde', err);
      }
    });
  }

  annulerModification(feuille: FeuilleDeTemps) {
    feuille.editable = false;
    this.isEditing = false;
    this.feuilleEdit = {};
  }

  voirFeuille(feuille: FeuilleDeTemps) {
    this.feuilleSelectionnee = feuille;
  }

  fermerModal() {
    this.feuilleSelectionnee = null;
  }

  ajouterFeuille() {
    const nouvelleFeuille: FeuilleDeTemps = {
      id: Math.max(...this.feuillesDeTemps.map(f => f.id), 0) + 1,
      employe: '',
      periode: '',
      heures: 0,
      statut: 'En attente',
      approbateur: '',
      dateSoumission: new Date(),
      commentaire: '',
      editable: true
    };
    this.feuillesDeTemps.unshift(nouvelleFeuille);
    this.activerEdition(nouvelleFeuille);
  }
}