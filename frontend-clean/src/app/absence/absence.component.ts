import { Component } from '@angular/core';

@Component({
  selector: 'app-absence',
  templateUrl: './absence.component.html',
  styleUrls: ['./absence.component.css']
})
export class AbsenceComponent {
  absences: any[] = [];

  absence = {
    type: '',
    startDate: '',
    endDate: ''
  };

  submitAbsence() {
    if (this.absence.type && this.absence.startDate && this.absence.endDate) {
      this.absences.push({ ...this.absence });
      this.absence = { type: '', startDate: '', endDate: '' };
    } else {
      alert('Merci de remplir tous les champs.');
    }
  }
}
