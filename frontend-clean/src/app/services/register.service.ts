import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserRegistration {
    lastName: string;
    firstName: string;
    email: string;
    password: string;
    address: string;
    phone: string;
    role: string;
}

@Injectable({
    providedIn: 'root'
})
export class RegisterService {
    private apiUrl = 'http://localhost:8090/api/register'; // <-- adapte selon ton backend

    constructor(private http: HttpClient) { }

    register(userData: UserRegistration): Observable<any> {
        return this.http.post(this.apiUrl, userData);
    }
}
