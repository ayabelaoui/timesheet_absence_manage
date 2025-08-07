import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeuilleDeTemps } from '../models/feuille-de-temps.model';

@Injectable({
    providedIn: 'root'
})
export class FeuilleDeTempsService {
    private apiUrl = 'http://localhost:8090/api/feuille-de-temps';

    constructor(private http: HttpClient) { }

    // Method to get all timesheets
    getFeuillesDeTemps(): Observable<FeuilleDeTemps[]> {
        return this.http.get<FeuilleDeTemps[]>(this.apiUrl);
    }

    // Method to update a timesheet
    updateFeuilleDeTemps(feuille: FeuilleDeTemps): Observable<FeuilleDeTemps> {
        return this.http.put<FeuilleDeTemps>(`${this.apiUrl}/${feuille.id}`, feuille);
    }

    // Method to create a new timesheet
    createFeuilleDeTemps(feuille: FeuilleDeTemps): Observable<FeuilleDeTemps> {
        return this.http.post<FeuilleDeTemps>(this.apiUrl, feuille);
    }
}